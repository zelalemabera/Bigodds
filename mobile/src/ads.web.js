// Web preview only: shows labelled placeholders where the real AdMob ads appear on Android.
import React, { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { C, F } from "./theme";

let openOverlay = null;
export async function initAds() {}
export function maybeShowInterstitial() { openOverlay?.("interstitial"); }
export function showRewarded() {
  return new Promise((resolve) => (openOverlay ? openOverlay("rewarded", resolve) : resolve(true)));
}

const box = { borderWidth: 1, borderStyle: "dashed", borderColor: C.line, backgroundColor: C.surface2, alignItems: "center", justifyContent: "center" };
export function AdBanner() {
  return (
    <View style={[box, { height: 56 }]}>
      <Text style={{ color: C.muted, fontFamily: F.bodyBold, fontSize: 11, letterSpacing: 1 }}>TEST AD · ADMOB BANNER</Text>
    </View>
  );
}

export function AdOverlayHost() {
  const [ad, setAd] = useState(null);
  const [left, setLeft] = useState(0);
  useEffect(() => { openOverlay = (kind, resolve) => { setAd({ kind, resolve }); setLeft(kind === "rewarded" ? 5 : 2); }; return () => { openOverlay = null; }; }, []);
  useEffect(() => { if (ad && left > 0) { const t = setTimeout(() => setLeft(left - 1), 1000); return () => clearTimeout(t); } }, [ad, left]);
  if (!ad) return null;
  const close = () => { ad.resolve?.(left === 0); setAd(null); };
  return (
    <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.88)", alignItems: "center", justifyContent: "center", padding: 24, zIndex: 50 }}>
      <Text style={{ color: "#fff", fontFamily: F.displayX, fontSize: 28, letterSpacing: 1 }}>TEST {ad.kind === "rewarded" ? "REWARDED VIDEO" : "INTERSTITIAL"} AD</Text>
      <Text style={{ color: "#c9d1e0", fontFamily: F.body, marginTop: 8, textAlign: "center" }}>On Android, a real AdMob test ad plays here.</Text>
      <Pressable onPress={close} disabled={ad.kind === "rewarded" && left > 0} style={{ marginTop: 22, paddingVertical: 12, paddingHorizontal: 22, borderRadius: 8, backgroundColor: left > 0 && ad.kind === "rewarded" ? "#333" : C.accent }}>
        <Text style={{ color: left > 0 && ad.kind === "rewarded" ? "#aaa" : C.accentInk, fontFamily: F.bodyBold }}>
          {ad.kind === "rewarded" && left > 0 ? `Reward in ${left}s` : "Close ad"}
        </Text>
      </Pressable>
    </View>
  );
}
