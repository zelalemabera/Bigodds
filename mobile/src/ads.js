// Native (Android/iOS) ads via Google AdMob. Uses TEST unit IDs from config.js.
import React from "react";
import { View } from "react-native";
import mobileAds, {
  AdEventType, BannerAd, BannerAdSize, InterstitialAd, RewardedAd, RewardedAdEventType,
} from "react-native-google-mobile-ads";
import { AD_UNITS } from "./config";

let interstitial = null;
let interstitialReady = false;
let lastInterstitial = 0;
const INTERSTITIAL_GAP_MS = 90 * 1000; // at most one interstitial every 90 seconds

function loadInterstitial() {
  interstitial = InterstitialAd.createForAdRequest(AD_UNITS.interstitial);
  interstitialReady = false;
  interstitial.addAdEventListener(AdEventType.LOADED, () => { interstitialReady = true; });
  interstitial.addAdEventListener(AdEventType.CLOSED, () => loadInterstitial());
  interstitial.addAdEventListener(AdEventType.ERROR, () => { interstitialReady = false; setTimeout(loadInterstitial, 30000); });
  interstitial.load();
}

export async function initAds() {
  try {
    await mobileAds().initialize();
    loadInterstitial();
  } catch (e) {
    console.warn("Ads failed to start", e);
  }
}

// Shown when the user opens Yesterday's results (capped so it never feels spammy).
export function maybeShowInterstitial() {
  if (!interstitial || !interstitialReady) return;
  if (Date.now() - lastInterstitial < INTERSTITIAL_GAP_MS) return;
  lastInterstitial = Date.now();
  interstitial.show().catch(() => {});
}

// Loads and shows a rewarded video. Resolves true only if the user watched to the end.
export function showRewarded() {
  return new Promise((resolve) => {
    const ad = RewardedAd.createForAdRequest(AD_UNITS.rewarded);
    let earned = false;
    const done = (v) => { unsubs.forEach((u) => u()); resolve(v); };
    const unsubs = [
      ad.addAdEventListener(RewardedAdEventType.LOADED, () => ad.show().catch(() => done(false))),
      ad.addAdEventListener(RewardedAdEventType.EARNED_REWARD, () => { earned = true; }),
      ad.addAdEventListener(AdEventType.CLOSED, () => done(earned)),
      ad.addAdEventListener(AdEventType.ERROR, () => done(false)),
    ];
    ad.load();
  });
}

export function AdBanner() {
  return (
    <View style={{ alignItems: "center" }}>
      <BannerAd unitId={AD_UNITS.banner} size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER} />
    </View>
  );
}

export function AdOverlayHost() { return null; }
