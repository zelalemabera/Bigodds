// The app reads the daily tips from these two files, updated once a day by a scheduled Claude run.
// (No API key or server is needed; the repo must be public for the app to read them.)
export const DATA_URL = (process.env.EXPO_PUBLIC_DATA_URL || "https://raw.githubusercontent.com/zelalemabera/Bigodds/main/data").replace(/\/$/, "");
// EXPO_PUBLIC_DEMO=1 shows built-in sample data instead (used for the web preview).
export const DEMO = process.env.EXPO_PUBLIC_DEMO === "1";

// AdMob unit IDs. These are Google's official TEST IDs. Before publishing, replace them with your own
// IDs from admob.google.com (and the app IDs in app.json). Never click your own live ads.
export const AD_UNITS = {
  banner: "ca-app-pub-3940256099942544/9214589741", // adaptive banner (test)
  interstitial: "ca-app-pub-3940256099942544/1033173712", // interstitial (test)
  rewarded: "ca-app-pub-3940256099942544/5224354917", // rewarded video (test)
};
