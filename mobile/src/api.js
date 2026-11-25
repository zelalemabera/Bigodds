import { API_URL, DEMO } from "./config";
import { samplePredictions, sampleResults } from "./sampleData";

const today = () => new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/London" }).format(new Date());
const yesterday = () => new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/London" }).format(new Date(Date.now() - 864e5));

// Each call returns { status, data }. status 202 means the server is still asking Claude.
async function get(path) {
  const r = await fetch(`${API_URL}${path}`, { headers: { "cache-control": "no-cache" } });
  return { status: r.status, data: await r.json() };
}

export async function fetchPredictions() {
  if (DEMO) {
    const { vip, ...rest } = samplePredictions(today());
    return { status: 200, data: { demo: true, ...rest, vip_available: true, vip_legs: vip.legs.length } };
  }
  return get("/api/predictions");
}

export async function fetchVip() {
  if (DEMO) return { status: 200, data: { demo: true, date: today(), ...samplePredictions(today()).vip } };
  return get("/api/vip");
}

export async function fetchResults() {
  if (DEMO) return { status: 200, data: { demo: true, ...sampleResults(yesterday()) } };
  return get("/api/results");
}
