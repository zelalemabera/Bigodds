# Big Odds Prediction App

An Android app (Expo / React Native) with daily soccer and NBA tips written by Claude, a VIP accumulator unlocked by a
rewarded video ad, and yesterday's results. All dates and times are UK time.

```
data/today.json       today's tips + VIP accumulator (read by the app)
data/yesterday.json   yesterday's tips with won/lost results (read by the app)
scripts/daily.mjs     helper used by the daily Claude run
DAILY_RUN.md          the instructions Claude follows each morning
mobile/               the Android app
sample-data.js        demo data
```

## How the tips get updated

Once a day (5:47 AM UK time) a scheduled Claude run in your Claude account:
1. looks up the final scores of yesterday's tips and the VIP slip, and marks each won / lost / void,
2. researches today's games with web search: 10-15 soccer tips across many leagues, 5-8 NBA tips (every game if
   fewer than 5), plus a VIP accumulator of 5-6 legs with total odds of about 5,
3. writes `data/today.json` and `data/yesterday.json`, deletes everything older, and pushes to `main`.

The app downloads those two files from GitHub, so there is no server and no API key. The repo must be public.

## Build the Android app

```bash
cd mobile
npm install
npx expo prebuild -p android
cd android && ./gradlew assembleRelease     # APK in android/app/build/outputs/apk/release/
```

Or build in the cloud with a free Expo account: `npx eas-cli@latest build -p android --profile preview` (APK) or
`--profile production` (.aab for the Play Store).

## Before publishing to the Play Store

1. **AdMob:** create an app and 3 ad units (Banner, Interstitial, Rewarded) at admob.google.com. Replace the test IDs in
   `mobile/src/config.js` and the `androidAppId` in `mobile/app.json`. Never tap your own live ads.
2. **Package name:** `com.bigodds.predictions` in `mobile/app.json`. Change it before the first upload if you want.
3. **Signing:** the test APK is signed with a debug key. For the Play Store use the `.aab` from EAS (it manages the
   upload key), or create your own release keystore.
4. **Play Console** (one-time $25): content rating, target audience 18+, Data safety form (AdMob SDK collects the
   advertising ID), "contains ads", and a privacy policy URL. Read Google Play's gambling policy; this app gives tips
   only and takes no bets. Keep the 18+ and responsible gambling notices.

## Responsible gambling

Tips are AI opinions, not guarantees. The app shows an 18+ / gamble responsibly notice on every screen.
