// Big Odds daily update helper. Used by the daily scheduled Claude run.
//
//   node scripts/daily.mjs start    -> prints today's UK date and the tips that need grading
//   (Claude writes data/results-raw.json and data/today-raw.json)
//   node scripts/daily.mjs finish   -> builds data/yesterday.json and data/today.json, deletes everything else
//
// Only two files are ever kept: data/today.json (today's tips + VIP) and data/yesterday.json (graded results).
import fs from "node:fs";
import path from "node:path";

const DIR = path.join(path.dirname(new URL(import.meta.url).pathname), "..", "data");
const TZ = "Europe/London";
const ukDate = (offsetDays = 0) =>
  new Intl.DateTimeFormat("en-CA", { timeZone: TZ }).format(new Date(Date.now() + offsetDays * 864e5));
const read = (f) => { try { return JSON.parse(fs.readFileSync(path.join(DIR, f), "utf8")); } catch { return null; } };
const write = (f, o) => fs.writeFileSync(path.join(DIR, f), JSON.stringify(o, null, 2) + "\n");
const STATUSES = ["won", "lost", "void", "pending"];

function start() {
  fs.mkdirSync(DIR, { recursive: true });
  const today = ukDate(0), yesterday = ukDate(-1);
  const prev = read("today.json");
  console.log(`TODAY (UK): ${today}`);
  console.log(`YESTERDAY (UK): ${yesterday}`);
  if (prev && prev.date === yesterday) {
    const all = [...(prev.picks || []), ...(prev.vip?.legs || [])];
    console.log(`\nGRADE THESE ${all.length} TIPS from ${yesterday} -> write data/results-raw.json:`);
    for (const p of all) console.log(`${p.id} | ${p.sport} | ${p.league} | ${p.home_team} vs ${p.away_team} | ${p.market}: ${p.pick}`);
  } else if (prev && prev.date === today) {
    console.log("\ndata/today.json is already for today. Nothing to grade. You may still regenerate today's tips.");
  } else {
    console.log("\nNo tips from yesterday to grade. Skip grading (do not write data/results-raw.json).");
  }
}

function cleanPick(p) {
  const req = ["sport", "league", "home_team", "away_team", "kickoff_local", "market", "pick", "odds", "confidence", "analysis"];
  for (const k of req) if (p[k] === undefined || p[k] === null) throw new Error(`tip missing "${k}": ${JSON.stringify(p)}`);
  const sport = String(p.sport).toLowerCase() === "nba" ? "nba" : "soccer";
  return {
    sport, league: String(p.league), home_team: String(p.home_team), away_team: String(p.away_team),
    kickoff_local: String(p.kickoff_local), market: String(p.market), pick: String(p.pick),
    odds: String(p.odds), confidence: Math.max(0, Math.min(100, Math.round(Number(p.confidence) || 0))),
    analysis: String(p.analysis),
  };
}
const totalOdds = (legs) => Math.round(legs.reduce((a, l) => a * (parseFloat(l.odds) || 1), 1) * 100) / 100;

function finish() {
  const today = ukDate(0), yesterday = ukDate(-1);
  const prev = read("today.json");
  const raw = read("today-raw.json");
  if (!raw) throw new Error("data/today-raw.json is missing or not valid JSON");

  // 1) yesterday.json
  let y = { date: yesterday, none: true, picks: [], summary: { won: 0, lost: 0, void: 0, pending: 0, total: 0, win_rate: null }, vip: null };
  const keptYesterday = prev && prev.date === today ? read("yesterday.json") : null; // regenerating today: keep results
  if (keptYesterday) {
    y = keptYesterday;
  } else if (prev && prev.date === yesterday) {
    const res = read("results-raw.json");
    const list = Array.isArray(res) ? res : res?.results || [];
    const byId = Object.fromEntries(list.map((r) => [r.id, r]));
    const withResult = (p) => {
      const r = byId[p.id] || {};
      const status = STATUSES.includes(r.status) ? r.status : "pending";
      return { ...p, result: { status, final_score: String(r.final_score || ""), note: String(r.note || "") } };
    };
    const picks = prev.picks.map(withResult);
    const c = { won: 0, lost: 0, void: 0, pending: 0 };
    for (const p of picks) c[p.result.status]++;
    const legs = (prev.vip?.legs || []).map(withResult);
    const st = legs.map((l) => l.result.status);
    const accaStatus = st.includes("lost") ? "lost" : st.includes("pending") ? "pending" : st.length && st.every((s) => s === "void") ? "void" : "won";
    y = {
      date: yesterday, graded_at: new Date().toISOString(), picks,
      summary: { ...c, total: picks.length, win_rate: c.won + c.lost ? Math.round((c.won / (c.won + c.lost)) * 100) : null },
      vip: legs.length ? { legs, total_odds: prev.vip.total_odds, status: accaStatus } : null,
    };
  }

  // 2) today.json
  let s = 0, n = 0, v = 0;
  const picks = (raw.picks || []).map(cleanPick).map((p) => ({ ...p, id: p.sport === "nba" ? `n${++n}` : `s${++s}` }));
  const legs = (raw.vip || raw.vip_legs || []).map(cleanPick).map((p) => ({ ...p, id: `v${++v}` }));
  const t = { date: today, timezone: TZ, generated_at: new Date().toISOString(), picks, vip: { legs, total_odds: totalOdds(legs) } };

  // 3) keep only the two files
  for (const f of fs.readdirSync(DIR)) fs.rmSync(path.join(DIR, f), { recursive: true, force: true });
  write("today.json", t);
  write("yesterday.json", y);

  const leagues = new Set(picks.filter((p) => p.sport === "soccer").map((p) => p.league));
  console.log(`today.json: ${s} soccer tips (${leagues.size} leagues), ${n} NBA tips, VIP ${legs.length} legs @ ${t.vip.total_odds}`);
  console.log(`yesterday.json: ${y.none ? "no tips to grade" : `${y.summary.won} won, ${y.summary.lost} lost, ${y.summary.pending} pending, VIP ${y.vip?.status ?? "-"}`}`);
  if (s < 10) console.log("WARNING: fewer than 10 soccer tips.");
  if (legs.length < 5) console.log("WARNING: VIP has fewer than 5 legs.");
  if (legs.length && (t.vip.total_odds < 4 || t.vip.total_odds > 7)) console.log("WARNING: VIP total odds are far from 5.");
}

const cmd = process.argv[2];
if (cmd === "start") start();
else if (cmd === "finish") finish();
else { console.error("usage: node scripts/daily.mjs start|finish"); process.exit(1); }
