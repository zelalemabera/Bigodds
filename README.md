# Big Odds Prediction App

An Android app (built with Expo / React Native) with daily soccer and NBA tips written by Claude, a VIP accumulator
unlocked by a rewarded video ad, and yesterday's results graded by Claude. All dates and times are UK time.

```
big-odds-app/
  server.js         small server that holds the Claude API key and talks to Claude
  sample-data.js    demo data (used when no API key is set)
  mobile/           the Android app (Expo)
```

## How it works

- **Today:** once a day the server asks Claude (with live web search) for 10 to 15 soccer tips across many leagues
  (Premier League, La Liga, Serie A, Bundesliga, Ligue 1, Eredivisie, Primeira Liga and more) and 5 to 8 NBA tips
  (every NBA game if fewer than 5 are played). Each tip has a market, pick, odds, confidence score and a short reason.
- **VIP:** in the same call Claude builds an accumulator of 5 or 6 of its safest soccer and NBA picks with total odds
  of about 5. The app only downloads it after the user watches a rewarded video ad.
- **Results:** the next day the server sends yesterday's tips and VIP legs back to Claude, which searches the final
  scores and marks each one won / lost / void. Re-checked hourly while any game is still pending.
- **Ads (AdMob, test IDs):** banner at the bottom of every screen, one banner inside the tips list, an interstitial
  when opening Results (at most once every 90 seconds), and a rewarded video for VIP.
- The Claude API key stays on the server. The app never contains it.

## 1. Run the server

Needs Node 18+.

```bash
npm install
cp .env.example .env            # put your Claude API key in .env
export $(grep -v '^#' .env | xargs)
npm start                       # http://localhost:3000/api/predictions
```

Without a key, `npm run demo` serves sample data.

Host it on any Node host with a persistent disk (Render, Railway, Fly.io, a VPS) and set the variables from
`.env.example` in the host's dashboard. The server prepares tips in the background every 15 minutes, so users rarely wait.

| Variable | Default | Meaning |
|---|---|---|
| `ANTHROPIC_API_KEY` | (required) | Claude API key from console.anthropic.com |
| `CLAUDE_MODEL` | `claude-opus-5-5` | Model used for research |
| `APP_TIMEZONE` | `Europe/London` | What "today" and "yesterday" mean |
| `SOCCER_MIN` / `SOCCER_MAX` | `10` / `15` | Soccer tips per day |
| `NBA_MIN` / `NBA_MAX` | `5` / `8` | NBA tips per day (all games if fewer are played) |
| `VIP_LEGS` / `VIP_TARGET_ODDS` | `5` / `5` | VIP accumulator size and total odds |
| `ADMIN_TOKEN` | (off) | Enables `POST /api/refresh?kind=predictions\|results` with header `x-admin-token` |
| `DATA_DIR` | `./data` | Where daily JSON files are stored |

## 2. Build the Android app

```bash
cd mobile
npm install
```

1. Put your server's address in `mobile/eas.json` (replace `https://YOUR-SERVER.onrender.com` in both profiles).
   While it says `YOUR-SERVER`, the app shows demo data.
2. Create a free Expo account at expo.dev, then:
   ```bash
   npx eas-cli@latest login
   npx eas-cli@latest build -p android --profile preview      # APK to install on your phone and test
   npx eas-cli@latest build -p android --profile production   # .aab file for the Play Store
   ```
   EAS builds in the cloud, so you don't need Android Studio. The ads don't work in Expo Go; use the APK.

## 3. Before publishing to the Play Store

1. **AdMob:** create an app and 3 ad units (Banner, Interstitial, Rewarded) at admob.google.com. Replace the test IDs in
   `mobile/src/config.js` and the `androidAppId` in `mobile/app.json`. Keep the test IDs while testing, and never tap
   your own live ads.
2. **Package name:** `com.bigodds.predictions` in `mobile/app.json`. Change it now if you want a different one; it
   can't change after the first upload.
3. **Play Console** (play.google.com/console, one-time $25 fee): create the app and upload the `.aab`. Then:
   - Content rating questionnaire, target audience 18+.
   - Data safety form: the app uses the AdMob SDK (advertising ID, diagnostics).
   - Declare that the app contains ads.
   - A privacy policy URL is required (AdMob collects device data).
   - Read Google Play's "Real-money gambling, games and contests" policy. This app gives tips only and takes no bets,
     which is generally allowed, but describe it honestly as tips/predictions and keep the 18+ and responsible
     gambling notices.
4. Upload with `npx eas-cli@latest submit -p android` or by hand in the Play Console.

## Cost

Two Claude research calls per day (tips + VIP, then grading), whatever the number of users. Typically a few cents to
well under a dollar a day.

## Note on VIP security

The VIP unlock is checked in the app. A determined user could read `/api/vip` directly. If that matters later, add
AdMob server-side verification (SSV) for rewarded ads.
