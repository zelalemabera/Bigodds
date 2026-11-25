// Big Odds Prediction App - server
// Asks Claude (with web search) for today's soccer + NBA picks, and asks Claude
// again to grade yesterday's picks. The API key never leaves this server.
import express from "express";
import Anthropic from "@anthropic-ai/sdk";
import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { samplePredictions, sampleResults } from "./sample-data.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = process.env.DATA_DIR || path.join(__dirname, "data");
const PORT = Number(process.env.PORT || 3000);
const TIMEZONE = process.env.APP_TIMEZONE || "Europe/London"; // UK time
const MODEL = process.env.CLAUDE_MODEL || "claude-opus-5-5";
const SOCCER_MIN = Number(process.env.SOCCER_MIN || 10);
const SOCCER_MAX = Number(process.env.SOCCER_MAX || 15);
const NBA_MIN = Number(process.env.NBA_MIN || 5);
const NBA_MAX = Number(process.env.NBA_MAX || 8);
const VIP_LEGS = Number(process.env.VIP_LEGS || 5);
const VIP_TARGET_ODDS = Number(process.env.VIP_TARGET_ODDS || 5);
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || "";
const DEMO = process.env.DEMO_MODE === "1" || !process.env.ANTHROPIC_API_KEY;

const client = DEMO ? null : new Anthropic(); // reads ANTHROPIC_API_KEY

// ---------- dates ----------
function dateInTz(offsetDays = 0) {
  const d = new Date(Date.now() + offsetDays * 86400000);
  // en-CA formats as YYYY-MM-DD
  return new Intl.DateTimeFormat("en-CA", { timeZone: TIMEZONE }).format(d);
}

// ---------- storage (one JSON file per day) ----------
const fileFor = (kind, date) => path.join(DATA_DIR, `${kind}-${date}.json`);
async function load(kind, date) {
  try { return JSON.parse(await fs.readFile(fileFor(kind, date), "utf8")); }
  catch { return null; }
}
async function save(kind, date, obj) {
  await fs.mkdir(DATA_DIR, { recursive: true });
  await fs.writeFile(fileFor(kind, date), JSON.stringify(obj, null, 2));
}

// ---------- Claude helpers ----------
const PICK_ITEM = {
        type: "object",
        additionalProperties: false,
        required: ["sport", "league", "home_team", "away_team", "kickoff_local", "market", "pick", "odds", "confidence", "analysis"],
        properties: {
          sport: { type: "string", enum: ["soccer", "nba"] },
          league: { type: "string" },
          home_team: { type: "string" },
          away_team: { type: "string" },
          kickoff_local: { type: "string", description: "Start time as HH:MM in the app timezone" },
          market: { type: "string" },
          pick: { type: "string" },
          odds: { type: "string", description: "Typical decimal odds, e.g. 1.85, or empty if unknown" },
          confidence: { type: "integer", description: "0-100" },
          analysis: { type: "string" },
        },
};
const PICKS_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["picks", "vip"],
  properties: {
    picks: { type: "array", items: PICK_ITEM },
    vip: { type: "array", items: PICK_ITEM },
  },
};

const RESULTS_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: ["results"],
  properties: {
    results: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["id", "status", "final_score", "note"],
        properties: {
          id: { type: "string" },
          status: { type: "string", enum: ["won", "lost", "void", "pending"] },
          final_score: { type: "string" },
          note: { type: "string" },
        },
      },
    },
  },
};

// Runs one research request with web search, resuming paused server-tool turns.
async function askWithSearch(system, prompt) {
  const messages = [{ role: "user", content: prompt }];
  let response;
  for (let i = 0; i < 6; i++) {
    response = await client.beta.messages
      .stream({
        model: MODEL,
        max_tokens: 32000,
        betas: ["server-side-fallback-2026-07-01"],
        fallbacks: "default", // re-run on a fallback model if the request is declined
        output_config: { effort: "medium" },
        system,
        tools: [{ type: "web_search_20260209", name: "web_search", max_uses: 15 }],
        messages,
      })
      .finalMessage();
    if (response.stop_reason !== "pause_turn") break;
    messages.push({ role: "assistant", content: response.content });
  }
  if (response.stop_reason === "refusal") throw new Error("Claude declined the request");
  return response.content.filter((b) => b.type === "text").map((b) => b.text).join("\n");
}

function extractJson(text) {
  const fences = [...text.matchAll(/```(?:json)?\s*([\s\S]*?)```/g)];
  const candidates = fences.length ? [fences.at(-1)[1]] : [];
  const a = text.indexOf("{"), b = text.lastIndexOf("}");
  if (a !== -1 && b > a) candidates.push(text.slice(a, b + 1));
  for (const c of candidates) { try { return JSON.parse(c); } catch {} }
  return null;
}

// If the research answer isn't clean JSON, have Claude convert it with a strict schema.
async function toSchema(text, schema) {
  const parsed = extractJson(text);
  if (parsed) return parsed;
  const res = await client.messages.create({
    model: MODEL,
    max_tokens: 16000,
    output_config: { effort: "low", format: { type: "json_schema", schema } },
    messages: [{ role: "user", content: `Convert this into the required JSON. Do not invent anything.\n\n${text}` }],
  });
  const out = res.content.find((b) => b.type === "text");
  return JSON.parse(out.text);
}

const SYSTEM = `You are the senior football (soccer) and NBA analyst for "Big Odds Prediction App".
You research with web search before every answer and never invent fixtures, teams, times or results.
You are honest: predictions are opinions, not guarantees.`;

const LEAGUES = "Premier League, EFL Championship, La Liga, Serie A, Bundesliga, Ligue 1, Eredivisie, Primeira Liga, Scottish Premiership, Belgian Pro League, Turkish Super Lig, Greek Super League, MLS, Brazilian Serie A, Argentine Primera, Saudi Pro League, UEFA Champions League / Europa League / Conference League, and domestic cups";

function totalOdds(legs) {
  const t = legs.reduce((acc, l) => acc * (parseFloat(l.odds) || 1), 1);
  return Math.round(t * 100) / 100;
}

async function generatePredictions(date) {
  const prompt = `Today is ${date}. All times are UK time (${TIMEZONE}).
Use web search to find real soccer matches and NBA games being played on ${date} (UK date).

1) "picks": between ${SOCCER_MIN} and ${SOCCER_MAX} soccer tips and between ${NBA_MIN} and ${NBA_MAX} NBA tips.
   - Soccer: spread the tips across many leagues, not just the Premier League. Look at: ${LEAGUES}.
     Use at least 4 different leagues when that many are playing.
   - NBA: if fewer than ${NBA_MIN} NBA games are played that day, give a tip for every game played. If none, give no NBA tips.
   - If fewer than ${SOCCER_MIN} soccer matches are played worldwide in those competitions, give a tip for every one you find.
   - Use varied markets where sensible: soccer 1X2, Double Chance, Over/Under goals, BTTS, Draw No Bet; NBA Moneyline, Spread, Total points.
2) "vip": a VIP accumulator of ${VIP_LEGS} (or ${VIP_LEGS + 1}) of your safest selections mixing soccer and NBA when NBA games exist.
   The legs' decimal odds multiplied together must come to about ${VIP_TARGET_ODDS} (between ${VIP_TARGET_ODDS - 0.5} and ${VIP_TARGET_ODDS + 1.5}).
   VIP legs may be from different games than "picks", and every leg must be a different game.

Base each tip on current form, injuries, head-to-head and available bookmaker odds. Kickoff/tip-off times as HH:MM UK time.
"confidence" is 0-100. "analysis" is one or two sentences explaining the reason for the tip.

Reply with only a JSON object in a \`\`\`json block, shaped exactly like:
{"picks":[{"sport":"soccer"|"nba","league":"","home_team":"","away_team":"","kickoff_local":"HH:MM","market":"","pick":"","odds":"1.85","confidence":72,"analysis":""}],"vip":[same shape]}`;
  const text = await askWithSearch(SYSTEM, prompt);
  const data = await toSchema(text, PICKS_SCHEMA);
  let s = 0, n = 0, v = 0;
  const clean = (p) => ({ ...p, confidence: Math.max(0, Math.min(100, Number(p.confidence) || 0)) });
  const picks = (data.picks || []).map((p) => ({ ...clean(p), id: p.sport === "nba" ? `n${++n}` : `s${++s}` }));
  const vipLegs = (data.vip || []).map((p) => ({ ...clean(p), id: `v${++v}` }));
  return {
    date, timezone: TIMEZONE, generated_at: new Date().toISOString(), model: MODEL, picks,
    vip: { legs: vipLegs, total_odds: totalOdds(vipLegs) },
  };
}

async function gradePredictions(pred) {
  const all = [...pred.picks, ...(pred.vip?.legs || [])];
  const list = all
    .map((p) => `${p.id} | ${p.sport.toUpperCase()} | ${p.league} | ${p.home_team} vs ${p.away_team} | ${p.market}: ${p.pick}`)
    .join("\n");
  const prompt = `These tips were published for games on ${pred.date} (UK date, ${TIMEZONE}).
Use web search to find each game's final result and decide whether each tip won or lost.
Use "void" if the game was postponed/cancelled, and "pending" only if it has not finished or you cannot confirm the score.

${list}

Reply with only a JSON object in a \`\`\`json block:
{"results":[{"id":"s1","status":"won"|"lost"|"void"|"pending","final_score":"2-1","note":"short reason"}]}`;
  const text = await askWithSearch(SYSTEM, prompt);
  const data = await toSchema(text, RESULTS_SCHEMA);
  const byId = Object.fromEntries((data.results || []).map((r) => [r.id, r]));
  const withResult = (p) => ({ ...p, result: byId[p.id] || { status: "pending", final_score: "", note: "" } });
  const picks = pred.picks.map(withResult);
  const legs = (pred.vip?.legs || []).map(withResult);
  return {
    date: pred.date, timezone: TIMEZONE, graded_at: new Date().toISOString(), picks, summary: summarize(picks),
    vip: legs.length ? { legs, total_odds: pred.vip.total_odds, status: accaStatus(legs) } : null,
  };
}

// An accumulator wins only if every non-void leg wins.
function accaStatus(legs) {
  const st = legs.map((l) => l.result.status);
  if (st.includes("lost")) return "lost";
  if (st.includes("pending")) return "pending";
  if (st.every((x) => x === "void")) return "void";
  return "won";
}

function summarize(picks) {
  const c = { won: 0, lost: 0, void: 0, pending: 0 };
  for (const p of picks) c[p.result?.status || "pending"]++;
  const decided = c.won + c.lost;
  return { ...c, total: picks.length, win_rate: decided ? Math.round((c.won / decided) * 100) : null };
}

// ---------- jobs (one in flight per kind+date) ----------
const jobs = new Map();
const errors = new Map();
function runJob(key, fn) {
  if (!jobs.has(key)) {
    errors.delete(key);
    const p = fn()
      .catch((e) => { console.error(`[${key}]`, e); errors.set(key, String(e.message || e)); })
      .finally(() => jobs.delete(key));
    jobs.set(key, p);
  }
  return jobs.get(key);
}

async function ensurePredictions(date) {
  const existing = await load("predictions", date);
  if (existing) return existing;
  runJob(`predictions-${date}`, async () => save("predictions", date, await generatePredictions(date)));
  return null;
}

const REGRADE_MS = 60 * 60 * 1000;
async function ensureResults(date) {
  const pred = await load("predictions", date);
  if (!pred) return { none: true };
  const existing = await load("results", date);
  const vipPending = existing?.vip?.status === "pending";
  const stale = existing && (existing.summary.pending > 0 || vipPending) && Date.now() - Date.parse(existing.graded_at) > REGRADE_MS;
  if (!existing || stale) {
    runJob(`results-${date}`, async () => save("results", date, await gradePredictions(pred)));
  }
  return existing; // may be null while the first grading runs
}

// ---------- HTTP ----------
const app = express();
app.get("/", (req, res) => res.type("text").send("Big Odds Prediction App API. The Android app reads /api/predictions, /api/vip and /api/results."));

app.get("/api/predictions", async (req, res) => {
  const date = dateInTz(0);
  const data = DEMO ? { demo: true, ...samplePredictions(date) } : await ensurePredictions(date);
  if (data) {
    // VIP legs are only sent by /api/vip, after the app has shown the rewarded ad.
    const { vip, ...rest } = data;
    return res.json({ ...rest, vip_available: !!vip?.legs?.length, vip_legs: vip?.legs?.length || 0 });
  }
  const key = `predictions-${date}`;
  res.status(202).json({ status: errors.has(key) ? "error" : "generating", error: errors.get(key), date });
});

app.get("/api/vip", async (req, res) => {
  const date = dateInTz(0);
  const data = DEMO ? samplePredictions(date) : await load("predictions", date);
  if (!data) return res.status(202).json({ status: "generating", date });
  res.json({ date, demo: DEMO || undefined, ...data.vip });
});

app.get("/api/results", async (req, res) => {
  const date = dateInTz(-1);
  if (DEMO) return res.json({ demo: true, ...sampleResults(date) });
  const data = await ensureResults(date);
  if (data?.none) return res.json({ date, picks: [], summary: summarize([]), none: true });
  if (data) return res.json({ ...data, regrading: jobs.has(`results-${date}`) });
  const key = `results-${date}`;
  res.status(202).json({ status: errors.has(key) ? "error" : "grading", error: errors.get(key), date });
});

// Force a fresh run: POST /api/refresh?kind=predictions|results  (header x-admin-token)
app.post("/api/refresh", async (req, res) => {
  if (!ADMIN_TOKEN || req.get("x-admin-token") !== ADMIN_TOKEN) return res.status(403).json({ error: "forbidden" });
  const kind = req.query.kind === "results" ? "results" : "predictions";
  const date = dateInTz(kind === "results" ? -1 : 0);
  await fs.rm(fileFor(kind, date), { force: true });
  kind === "results" ? ensureResults(date) : ensurePredictions(date);
  res.status(202).json({ status: "started", kind, date });
});

app.get("/api/health", (req, res) => res.json({ ok: true, demo: DEMO, model: MODEL, timezone: TIMEZONE, today: dateInTz(0) }));

// Prepare today's tips and grade yesterday's ahead of the first visitor.
async function warmUp() {
  if (DEMO) return;
  await ensurePredictions(dateInTz(0));
  await ensureResults(dateInTz(-1));
}
setInterval(warmUp, 15 * 60 * 1000);

app.listen(PORT, () => {
  console.log(`Big Odds running on http://localhost:${PORT} (${DEMO ? "DEMO mode, sample data" : `model ${MODEL}`}, tz ${TIMEZONE})`);
  warmUp();
});
