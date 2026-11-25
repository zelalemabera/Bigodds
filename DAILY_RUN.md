# Big Odds daily run (instructions for Claude)

You update the Big Odds Prediction App's tips once a day. The app reads `data/today.json` and `data/yesterday.json`
from the `main` branch of this repo. All dates and times are UK time (Europe/London).

1. Run `node scripts/daily.mjs start`. It prints today's UK date and, if there are any, yesterday's tips to grade.

2. **Grade yesterday** (only if `start` listed tips). Use web search to find each game's final score and decide each
   tip: `won`, `lost`, `void` (postponed/cancelled) or `pending` (only if you truly cannot confirm the result).
   Write `data/results-raw.json`:
   `[{"id":"s1","status":"won","final_score":"2-1","note":"short reason"}, ...]` with one entry per listed id
   (including the VIP ids `v1`, `v2`, ...).

3. **Today's tips.** Use web search to find real soccer matches and NBA games played on today's UK date.
   Never invent a fixture; only use games you found in your searches.
   - Soccer: between 10 and 15 tips, spread across many leagues, not only the Premier League. Look at the Premier
     League, Championship, La Liga, Serie A, Bundesliga, Ligue 1, Eredivisie, Primeira Liga, Scottish Premiership,
     Belgian Pro League, Turkish Super Lig, MLS, Brazil, Argentina, Saudi Pro League, UEFA Champions League /
     Europa League / Conference League and cups. Use at least 4 different leagues when that many are playing.
     If fewer than 10 matches are played, give a tip for every one you find.
   - NBA: between 5 and 8 tips. If fewer than 5 NBA games are played, give a tip for every game. If none, none.
   - Markets: vary them (1X2, Double Chance, Over/Under goals, BTTS, Draw No Bet, handicap; NBA Moneyline,
     Spread, Total points). Base tips on form, injuries, head-to-head and bookmaker odds.
   - VIP: 5 or 6 of your safest selections, mixing soccer and NBA when NBA games exist, every leg a different game.
     The legs' decimal odds multiplied together must be about 5 (between 4.5 and 6.5).
   Write `data/today-raw.json`:
   ```json
   {"picks":[{"sport":"soccer","league":"Serie A","home_team":"","away_team":"","kickoff_local":"19:45",
     "market":"1X2","pick":"Inter to win","odds":"1.55","confidence":72,
     "analysis":"One or two sentences explaining the tip."}],
    "vip":[same shape as picks]}
   ```
   `sport` is `soccer` or `nba`; `kickoff_local` is HH:MM UK time; `odds` is decimal odds as a string;
   `confidence` is 0-100.

4. Run `node scripts/daily.mjs finish`. It builds the two app files and deletes everything else in `data/`.
   Fix any error it prints and run it again. Check its summary line for warnings.

5. Commit only the `data/` folder and push to `main`:
   `git add -A data && git commit -m "Daily tips <date>" && git push origin main`.
   Do not change any other file. Do not open a pull request.
