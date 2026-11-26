# Big Odds daily run (instructions for Claude)

You update the Big Odds Prediction App's tips once a day. The app reads `data/today.json` and `data/yesterday.json`
from the `main` branch of this repo. All dates and times are UK time (Europe/London).

1. Run `node scripts/daily.mjs start`. It prints today's UK date and, if there are any, yesterday's tips to grade.

2. **Grade yesterday** (only if `start` listed tips). Use web search to find each game's final score and decide each
   tip: `won`, `lost`, `void` (postponed/cancelled, or a whole-number total line landed exactly) or `pending`
   (only if you truly cannot confirm the result). Settle combined selections like "1X And TO (1.5)" as won only
   if both parts are true. "At least one team will score Over (1.5) - Yes" wins if either team scored 2 or more.
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
   - Soccer markets: use ONLY these four kinds of selection (no plain 1X2, BTTS, handicap or Draw No Bet):
     1. **At least one team will score** - "At least one team scores Over (1.5) - Yes/No" (lines 1.5, 2.5, 3.5,
        4.5). Yes = at least one of the two teams scores more than the line on its own (1.5 means one team scores 2+).
     2. **Total goals** - "Over (X)" or "Under (X)" with X = 0.5, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5.
        On a whole-number line (2, 3, 4, 5) a total exactly equal to the line is "void" (stake returned).
     3. **Home result + total** - "W1 And TO (X)", "W1 And TU (X)", "1X And TO (X)" or "1X And TU (X)"
        (W1 = home win, 1X = home win or draw, TO = total over, TU = total under, X = 1.5, 2.5 or 3.5).
        Both parts must be true to win.
     4. **Away result + total** - "W2 And TO (X)", "W2 And TU (X)", "2X And TO (X)" or "2X And TU (X)"
        (W2 = away win, 2X = away win or draw). Both parts must be true to win.
     Put the market name in "market" ("At least one team will score", "Total", "Home result + total",
     "Away result + total") and the exact selection in "pick", e.g. "Over (2.5) - Yes", "Over (1.5)",
     "1X And TO (1.5)". Favour the safer lines: most soccer tips should have odds between about 1.15 and 1.70.
     Use the bookmaker odds you find for that exact selection.
   - NBA markets: Moneyline, Spread, Total points (unchanged).
   - Base tips on form, injuries, head-to-head and bookmaker odds.
   - VIP: 5 or 6 of your safest selections (soccer legs use the same four selection types), mixing soccer and NBA when NBA games exist, every leg a different game.
     The legs' decimal odds multiplied together must be about 5 (between 4.5 and 6.5).
   Write `data/today-raw.json`:
   ```json
   {"picks":[{"sport":"soccer","league":"Serie A","home_team":"","away_team":"","kickoff_local":"19:45",
     "market":"Home result + total","pick":"1X And TO (1.5)","odds":"1.45","confidence":72,
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
