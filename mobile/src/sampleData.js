// Sample data used in DEMO mode (no API key) so the app can be previewed.
// It is clearly labelled as demo data in the app. Not real predictions.
const P = (id, sport, league, home_team, away_team, kickoff_local, market, pick, odds, confidence, analysis) =>
  ({ id, sport, league, home_team, away_team, kickoff_local, market, pick, odds, confidence, analysis });

const PICKS = [
  P("s1", "soccer", "Premier League", "Arsenal", "Brentford", "20:00", "1X2", "Arsenal to win", "1.45", 78, "Unbeaten at home this season and facing a side with a weak away defence."),
  P("s2", "soccer", "La Liga", "Real Betis", "Getafe", "20:00", "Under 2.5 goals", "Under 2.5", "1.70", 66, "Getafe games average fewer than two goals; Betis are missing their top scorer."),
  P("s3", "soccer", "Serie A", "Atalanta", "Torino", "17:30", "Both teams to score", "Yes", "1.80", 61, "Both sides scored in four of their last five meetings."),
  P("s4", "soccer", "Bundesliga", "Bayer Leverkusen", "Mainz", "19:30", "Over 2.5 goals", "Over 2.5", "1.62", 70, "Leverkusen's home games have gone over 2.5 goals in most matches this season."),
  P("s5", "soccer", "Ligue 1", "Lille", "Nantes", "20:00", "Double Chance", "Lille or Draw", "1.25", 82, "Nantes have one away win all season; Lille are strong at home."),
  P("s6", "soccer", "Eredivisie", "PSV", "Heerenveen", "19:00", "Handicap", "PSV -1.5", "1.65", 72, "PSV have won their last six home games by two goals or more."),
  P("s7", "soccer", "Primeira Liga", "Sporting CP", "Estoril", "20:15", "1X2", "Sporting to win", "1.30", 80, "Sporting lead the table and Estoril have lost four straight away games."),
  P("s8", "soccer", "Scottish Premiership", "Celtic", "St Mirren", "19:45", "Over 2.5 goals", "Over 2.5", "1.55", 68, "Celtic average over three goals a game at home."),
  P("s9", "soccer", "Championship", "Leeds United", "Hull City", "19:45", "1X2", "Leeds to win", "1.60", 67, "Leeds are top of the home form table; Hull have injuries in defence."),
  P("s10", "soccer", "Super Lig", "Galatasaray", "Kasimpasa", "17:00", "Both teams to score", "Yes", "1.75", 60, "Kasimpasa score often but concede plenty against top sides."),
  P("s11", "soccer", "Belgian Pro League", "Club Brugge", "Westerlo", "19:45", "Double Chance", "Brugge or Draw", "1.20", 84, "Brugge are unbeaten at home in the league this season."),
  P("n1", "nba", "NBA", "Boston Celtics", "Charlotte Hornets", "00:30", "Spread", "Celtics -9.5", "1.91", 64, "Boston's defence has held weak offences well below their average."),
  P("n2", "nba", "NBA", "Denver Nuggets", "Phoenix Suns", "02:00", "Total points", "Over 228.5", "1.90", 58, "Both teams play at a high pace and recent meetings have gone over."),
  P("n3", "nba", "NBA", "Oklahoma City Thunder", "Utah Jazz", "01:00", "Moneyline", "Thunder", "1.18", 85, "OKC are rested and in top form at home against a rebuilding Utah."),
  P("n4", "nba", "NBA", "New York Knicks", "Washington Wizards", "00:30", "Moneyline", "Knicks", "1.22", 81, "The Knicks have won eight of their last ten; Washington are bottom of the East."),
  P("n5", "nba", "NBA", "Golden State Warriors", "Sacramento Kings", "03:00", "Spread", "Warriors -4.5", "1.88", 57, "Golden State are strong at home and Sacramento are on a back-to-back."),
];

const VIP = [
  P("v1", "soccer", "Ligue 1", "Paris Saint-Germain", "Angers", "20:00", "1X2", "PSG to win", "1.20", 88, "PSG have won every home league game this season."),
  P("v2", "soccer", "Bundesliga", "Bayern Munich", "Heidenheim", "14:30", "Over 1.5 goals", "Over 1.5", "1.18", 90, "Bayern average over three goals a game at home."),
  P("v3", "soccer", "Serie A", "Inter", "Lecce", "19:45", "1X2", "Inter to win", "1.30", 84, "Inter have the best home record in Italy; Lecce struggle away."),
  P("v4", "nba", "NBA", "Cleveland Cavaliers", "Brooklyn Nets", "00:30", "Moneyline", "Cavaliers", "1.40", 79, "Cleveland are much stronger and Brooklyn are missing two starters."),
  P("v5", "soccer", "Eredivisie", "Ajax", "RKC Waalwijk", "15:30", "Double Chance", "Ajax or Draw", "1.12", 92, "Ajax rarely lose at home to bottom-half sides."),
  P("v6", "nba", "NBA", "Milwaukee Bucks", "Detroit Pistons", "01:00", "Spread", "Bucks -5.5", "1.75", 70, "Milwaukee have won the last five meetings by an average of 9 points."),
];

const RESULTS = {
  s1: ["won", "3-0", "Arsenal controlled the game."],
  s2: ["won", "1-0", "Only one goal scored."],
  s3: ["lost", "2-0", "Torino failed to score."],
  s4: ["won", "3-1", "Four goals in total."],
  s5: ["won", "1-1", "A draw covers the double chance."],
  s6: ["won", "3-0", "PSV won by three."],
  s7: ["won", "2-0", "Comfortable home win."],
  s8: ["lost", "1-0", "Only one goal."],
  s9: ["won", "2-1", "Late winner for Leeds."],
  s10: ["won", "2-1", "Both teams scored."],
  s11: ["won", "2-0", "Brugge won."],
  n1: ["lost", "112-106", "Boston won by 6, short of the spread."],
  n2: ["won", "121-115", "236 points scored."],
  n3: ["won", "124-101", "Comfortable Thunder win."],
  n4: ["won", "118-99", "Knicks won easily."],
  n5: ["won", "117-108", "Warriors covered."],
  v1: ["won", "4-0", "PSG won."], v2: ["won", "3-1", "Four goals."], v3: ["won", "2-0", "Inter won."],
  v4: ["won", "115-102", "Cavaliers won."], v5: ["won", "1-1", "Draw covers it."], v6: ["won", "120-111", "Bucks won by 9."],
};

const total = (legs) => Math.round(legs.reduce((a, l) => a * parseFloat(l.odds), 1) * 100) / 100;
const withResult = (p) => ({ ...p, result: { status: RESULTS[p.id][0], final_score: RESULTS[p.id][1], note: RESULTS[p.id][2] } });

export function samplePredictions(date) {
  return { date, timezone: "Europe/London", generated_at: new Date().toISOString(), model: "demo", picks: PICKS, vip: { legs: VIP, total_odds: total(VIP) } };
}

export function sampleResults(date) {
  const picks = PICKS.map(withResult);
  const c = { won: 0, lost: 0, void: 0, pending: 0 };
  for (const p of picks) c[p.result.status]++;
  return {
    date, timezone: "Europe/London", graded_at: new Date().toISOString(), picks,
    summary: { ...c, total: picks.length, win_rate: Math.round((c.won / (c.won + c.lost)) * 100) },
    vip: { legs: VIP.map(withResult), total_odds: total(VIP), status: "won" },
  };
}
