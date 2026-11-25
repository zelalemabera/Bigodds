// Where the Big Odds server lives (it holds the Claude API key, the app never does).
// Set EXPO_PUBLIC_API_URL in eas.json (build) or .env (local). With no URL, the app shows demo data.
export const API_URL = (process.env.EXPO_PUBLIC_API_URL || "").replace(/\/$/, "");
export const DEMO = !API_URL || API_URL.includes("YOUR-SERVER") || process.env.EXPO_PUBLIC_DEMO === "1";

// AdMob unit IDs. These are Google's official TEST IDs. Before publishing, replace them with your own
// IDs from admob.google.com (and the app IDs in app.json). Never click your own live ads.
export const AD_UNITS = {
  banner: "ca-app-pub-3940256099942544/9214589741", // adaptive banner (test)
  interstitial: "ca-app-pub-3940256099942544/1033173712", // interstitial (test)
  rewarded: "ca-app-pub-3940256099942544/5224354917", // rewarded video (test)
};
