// The app reads the daily tips from these two files, updated once a day by a scheduled Claude run.
// (No API key or server is needed; the repo must be public for the app to read them.)
export const DATA_URL = (process.env.EXPO_PUBLIC_DATA_URL || "https://raw.githubusercontent.com/zelalemabera/Bigodds/main/data").replace(/\/$/, "");
// EXPO_PUBLIC_DEMO=1 shows built-in sample data instead (used for the web preview).
export const DEMO = process.env.EXPO_PUBLIC_DEMO === "1";

// AdMob unit IDs. Development builds use Google's official TEST IDs; release builds use the real Big Odds units
// (AdMob app ca-app-pub-9972600793447746~6955247898, set in app.json). Never click your own live ads.
const TEST_UNITS = {
  banner: "ca-app-pub-3940256099942544/9214589741",
  interstitial: "ca-app-pub-3940256099942544/1033173712",
  rewarded: "ca-app-pub-3940256099942544/5224354917",
};
const LIVE_UNITS = {
  banner: "ca-app-pub-9972600793447746/3095893938", // BigOdds Banner
  interstitial: "ca-app-pub-9972600793447746/7823983141", // BigOdds Interstitial
  rewarded: "ca-app-pub-9972600793447746/3702398597", // BigOdds VIP Rewarded
};
export const AD_UNITS = typeof __DEV__ !== "undefined" && __DEV__ ? TEST_UNITS : LIVE_UNITS;
