import { DATA_URL, DEMO } from "./config";
import { samplePredictions, sampleResults } from "./sampleData";

const ukDate = (offset = 0) => new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/London" }).format(new Date(Date.now() + offset * 864e5));

let todayCache = null;
async function getJson(name) {
  // Cache-buster so phones always get the latest daily file.
  const r = await fetch(`${DATA_URL}/${name}?t=${Math.floor(Date.now() / 300000)}`);
  if (r.status === 404) return null;
  if (!r.ok) throw new Error(`HTTP ${r.status}`);
  return r.json();
}

async function loadToday() {
  if (DEMO) return { demo: true, ...samplePredictions(ukDate(0)) };
  todayCache = await getJson("today.json");
  return todayCache;
}

// Each call returns { status, data } like before. status 202 means "not ready yet, try again later".
export async function fetchPredictions() {
  const d = await loadToday();
  if (!d) return { status: 202, data: { status: "generating" } };
  const { vip, ...rest } = d;
  return { status: 200, data: { ...rest, stale: d.date !== ukDate(0), vip_available: !!vip?.legs?.length, vip_legs: vip?.legs?.length || 0 } };
}

export async function fetchVip() {
  const d = todayCache || (await loadToday());
  if (!d?.vip?.legs?.length) return { status: 202, data: { status: "generating" } };
  return { status: 200, data: { date: d.date, demo: d.demo, ...d.vip } };
}

export async function fetchResults() {
  if (DEMO) return { status: 200, data: { demo: true, ...sampleResults(ukDate(-1)) } };
  const d = await getJson("yesterday.json");
  if (!d) return { status: 200, data: { none: true } };
  return { status: 200, data: d };
}
