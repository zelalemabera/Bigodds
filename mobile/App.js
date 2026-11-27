import React, { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, Pressable, RefreshControl, ScrollView, StyleSheet, Text, View } from "react-native";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { StatusBar } from "expo-status-bar";
import { useFonts } from "expo-font";
import { BarlowCondensed_700Bold } from "@expo-google-fonts/barlow-condensed/700Bold";
import { BarlowCondensed_800ExtraBold } from "@expo-google-fonts/barlow-condensed/800ExtraBold";
import { Inter_400Regular } from "@expo-google-fonts/inter/400Regular";
import { Inter_500Medium } from "@expo-google-fonts/inter/500Medium";
import { Inter_600SemiBold } from "@expo-google-fonts/inter/600SemiBold";
import { JetBrainsMono_700Bold } from "@expo-google-fonts/jetbrains-mono/700Bold";
import { C, F } from "./src/theme";
import { fetchPredictions, fetchResults, fetchVip } from "./src/api";
import { AdBanner, AdOverlayHost, initAds, maybeShowInterstitial, showRewarded } from "./src/ads";
import { DEMO } from "./src/config";

const fmtDate = (iso) =>
  new Date(iso + "T12:00:00Z").toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "short", timeZone: "UTC" });

// Loads one endpoint and keeps polling while the server is still asking Claude (HTTP 202).
function useFeed(loader) {
  const [state, setState] = useState({ loading: true, data: null, error: null });
  const timer = useRef(null);
  const load = useCallback(async () => {
    clearTimeout(timer.current);
    try {
      const { status, data } = await loader();
      setState({ loading: false, data, error: data.status === "error" ? data.error || "Something went wrong." : null });
      if (status === 202 && data.status !== "error") timer.current = setTimeout(load, 60000);
    } catch {
      setState((s) => ({ ...s, loading: false, error: "Can't reach the Big Odds server. Check your internet connection." }));
      timer.current = setTimeout(load, 15000);
    }
  }, [loader]);
  useEffect(() => { load(); return () => clearTimeout(timer.current); }, [load]);
  return [state, load];
}

export default function App() {
  const [fontsLoaded] = useFonts({
    BarlowCondensed_700Bold, BarlowCondensed_800ExtraBold, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, JetBrainsMono_700Bold,
  });
  const [tab, setTab] = useState("today");
  const [filter, setFilter] = useState("all");
  const [today, reloadToday] = useFeed(fetchPredictions);
  const [results, reloadResults] = useFeed(fetchResults);
  const [vip, setVip] = useState({ unlockedFor: null, data: null, busy: false, msg: null });

  useEffect(() => { initAds(); }, []);

  const openTab = (t) => {
    if (t === "results" && tab !== "results") maybeShowInterstitial();
    setTab(t);
  };

  const unlockVip = async () => {
    setVip((v) => ({ ...v, busy: true, msg: null }));
    const earned = await showRewarded();
    if (!earned) return setVip((v) => ({ ...v, busy: false, msg: "Watch the whole video to unlock the VIP tips." }));
    try {
      const { status, data } = await fetchVip();
      if (status !== 200) return setVip((v) => ({ ...v, busy: false, msg: "Today's VIP tips are still being prepared. Try again in a few minutes." }));
      setVip({ unlockedFor: data.date, data, busy: false, msg: null });
    } catch {
      setVip((v) => ({ ...v, busy: false, msg: "Can't reach the server. Try again." }));
    }
  };

  if (!fontsLoaded) return <View style={{ flex: 1, backgroundColor: C.bg }} />;

  const feed = tab === "results" ? results : today;
  const refresh = tab === "results" ? reloadResults : reloadToday;
  const vipUnlocked = vip.data && vip.unlockedFor === today.data?.date;

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <SafeAreaView style={s.root} edges={["top", "left", "right", "bottom"]}>
        <Header demo={DEMO || feed.data?.demo} />
        <View style={s.tabs}>
          {[["today", "Today"], ["vip", "VIP"], ["results", "Results"]].map(([k, label]) => (
            <Pressable key={k} onPress={() => openTab(k)} style={[s.tab, tab === k && s.tabOn]}>
              <Text style={[s.tabText, tab === k && s.tabTextOn, k === "vip" && { color: C.gold }]}>{k === "vip" ? "★ " : ""}{label}</Text>
            </Pressable>
          ))}
        </View>
        {tab !== "vip" && (
          <View style={s.chips}>
            {[["all", "All"], ["soccer", "⚽ Soccer"], ["nba", "🏀 NBA"]].map(([k, label]) => (
              <Pressable key={k} onPress={() => setFilter(k)} style={[s.chip, filter === k && s.chipOn]}>
                <Text style={[s.chipText, filter === k && s.chipTextOn]}>{label}</Text>
              </Pressable>
            ))}
          </View>
        )}
        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={s.content}
          refreshControl={<RefreshControl refreshing={false} onRefresh={refresh} tintColor={C.accent} colors={[C.accent]} />}
        >
          {tab === "today" && <TodayView feed={today} filter={filter} />}
          {tab === "vip" && <VipView vip={vip} unlocked={vipUnlocked} today={today.data} onUnlock={unlockVip} />}
          {tab === "results" && <ResultsView feed={results} filter={filter} />}
          <Footer />
        </ScrollView>
        <AdBanner />
        <AdOverlayHost />
      </SafeAreaView>
    </SafeAreaProvider>
  );
}

function Header({ demo }) {
  return (
    <View style={s.header}>
      <View style={s.logo}><Text style={s.logoB}>B</Text><View style={[s.notch, { left: -5 }]} /><View style={[s.notch, { right: -5 }]} /></View>
      <View style={{ flex: 1 }}>
        <Text style={s.brand}>BIG <Text style={{ color: C.accent }}>ODDS</Text></Text>
        <Text style={s.brandSub}>PREDICTION APP · SOCCER & NBA</Text>
      </View>
      {demo ? <Text style={s.demo}>DEMO DATA</Text> : null}
    </View>
  );
}

function StateBox({ title, text, spin }) {
  return (
    <View style={s.state}>
      {spin ? <ActivityIndicator color={C.accent} size="large" /> : null}
      <Text style={s.stateTitle}>{title}</Text>
      <Text style={s.stateText}>{text}</Text>
    </View>
  );
}

function Notice() {
  return (
    <View style={s.notice}>
      <View style={s.age}><Text style={s.ageText}>18+</Text></View>
      <Text style={s.noticeText}><Text style={{ color: C.ink, fontFamily: F.bodyBold }}>Predictions are not guarantees.</Text> Use these tips for entertainment and gamble responsibly.</Text>
    </View>
  );
}

function Ticket({ p, showResult }) {
  const r = showResult ? p.result : null;
  const st = r?.status;
  return (
    <View style={[s.ticket, st === "won" && { borderColor: "#2e6e55" }, st === "lost" && { borderColor: "#7a3540" }]}>
      <View style={s.tTop}>
        <View style={s.meta}>
          <Text style={s.metaText} numberOfLines={1}><Text style={{ color: C.court }}>{p.sport === "nba" ? "NBA" : "SOCCER"}</Text> · {String(p.league).toUpperCase()}</Text>
          <Text style={s.metaText}>{p.kickoff_local} UK</Text>
        </View>
        <Text style={s.team}>{p.home_team}</Text>
        <Text style={s.vs}>vs</Text>
        <Text style={s.team}>{p.away_team}</Text>
      </View>
      <View style={s.perf}><View style={[s.hole, { left: -22 }]} /><View style={[s.hole, { right: -22 }]} /></View>
      <View style={s.stub}>
        <View style={{ flex: 1, gap: 2 }}>
          <Text style={s.market}>{String(p.market).toUpperCase()}</Text>
          <Text style={s.pick}>{p.pick}{r && p.odds ? <Text style={s.at}>  @ {p.odds}</Text> : null}</Text>
        </View>
        {r ? (
          <Text style={[s.badge, badgeStyle(st)]}>{String(st).toUpperCase()}</Text>
        ) : (
          <View style={{ alignItems: "flex-end" }}>
            <Text style={s.odds}>{p.odds || "–"}</Text>
            <Text style={s.oddsLabel}>ODDS</Text>
          </View>
        )}
      </View>
      {r ? (
        <View style={s.resultRow}>
          <Text style={s.score}>{r.final_score || "–"}</Text>
          <Text style={s.resultNote}>{r.note}</Text>
        </View>
      ) : (
        <View style={{ paddingHorizontal: 14, paddingBottom: 14, gap: 8 }}>
          <View style={s.confRow}>
            <View style={s.bar}><View style={[s.barFill, { width: `${p.confidence}%` }]} /></View>
            <Text style={s.confText}>{p.confidence}% confidence</Text>
          </View>
          {p.analysis ? <Text style={s.why}>{p.analysis}</Text> : null}
        </View>
      )}
    </View>
  );
}

const badgeStyle = (st) =>
  st === "won" ? { color: C.won, backgroundColor: C.wonBg } : st === "lost" ? { color: C.lost, backgroundColor: C.lostBg } : { color: C.pend, backgroundColor: C.pendBg };

function PickList({ picks, filter, showResult }) {
  const groups = [["soccer", "SOCCER"], ["nba", "NBA"]].filter(([k]) => filter === "all" || filter === k);
  const out = [];
  let count = 0;
  for (const [k, label] of groups) {
    const items = picks.filter((p) => p.sport === k);
    if (!items.length) continue;
    out.push(<SectionHead key={k} label={`${label} · ${items.length}`} />);
    for (const p of items) {
      out.push(<Ticket key={p.id} p={p} showResult={showResult} />);
      if (++count === 6) out.push(<View key="inline-ad" style={{ marginVertical: 2 }}><AdBanner /></View>);
    }
  }
  return out.length ? out : <StateBox title="No tips for this sport today" text="Try the other filter." />;
}

function SectionHead({ label }) {
  return (
    <View style={s.sectionHead}>
      <Text style={s.sectionText}>{label}</Text>
      <View style={{ flex: 1, height: 1, backgroundColor: C.line }} />
    </View>
  );
}

function TodayView({ feed, filter }) {
  const d = feed.data;
  if (feed.error) return <StateBox title="Something went wrong" text={feed.error} />;
  if (!d) return <StateBox title="Loading" text="Fetching today's tips." spin />;
  if (d.status === "generating") return <><Notice /><StateBox title="Today's tips are on their way" text="New tips are published every morning at about 6 AM UK time. Pull down to refresh." /></>;
  return (
    <>
      <View style={s.dayline}><Text style={s.dayTitle}>{fmtDate(d.date).toUpperCase()}</Text><Text style={s.dayMeta}>{d.picks.length} tips</Text></View>
      {d.stale ? <StateBox title="Today's tips are on their way" text="New tips are published every morning at about 6 AM UK time. Below are the latest ones." /> : null}
      <Notice />
      {d.picks.length ? <PickList picks={d.picks} filter={filter} /> : <StateBox title="No games found today" text="Check back tomorrow." />}
    </>
  );
}

function ResultsView({ feed, filter }) {
  const d = feed.data;
  if (feed.error) return <StateBox title="Something went wrong" text={feed.error} />;
  if (!d) return <StateBox title="Loading" text="Fetching yesterday's results." spin />;
  if (d.status === "grading") return <StateBox title="Checking yesterday's scores" text="Final scores are being checked to mark each tip won or lost." spin />;
  if (d.none) return <StateBox title="No tips from yesterday" text="Results appear here the day after tips are published." />;
  const sm = d.summary;
  return (
    <>
      <View style={s.dayline}><Text style={s.dayTitle}>{fmtDate(d.date).toUpperCase()}</Text><Text style={s.dayMeta}>{sm.pending ? `${sm.pending} awaiting result` : "All settled"}</Text></View>
      <View style={s.summary}>
        {[[sm.won, "WON", C.won], [sm.lost, "LOST", C.lost], [sm.void + sm.pending, "VOID/OPEN", C.ink], [sm.win_rate != null ? `${sm.win_rate}%` : "–", "WIN RATE", C.accent]].map(([v, l, col], i) => (
          <View key={l} style={[s.sumCell, i > 0 && { borderLeftWidth: 1, borderLeftColor: C.line }]}>
            <Text style={[s.sumVal, { color: col }]}>{v}</Text>
            <Text style={s.sumLabel}>{l}</Text>
          </View>
        ))}
      </View>
      {d.vip ? (
        <View style={[s.vipResult, { borderColor: d.vip.status === "won" ? C.won : d.vip.status === "lost" ? C.lost : C.line }]}>
          <Text style={s.vipResultTitle}>★ VIP ACCUMULATOR · {d.vip.legs.length} LEGS @ {d.vip.total_odds}</Text>
          <Text style={[s.badge, badgeStyle(d.vip.status)]}>{String(d.vip.status).toUpperCase()}</Text>
        </View>
      ) : null}
      <PickList picks={d.picks} filter={filter} showResult />
    </>
  );
}

function VipView({ vip, unlocked, today, onUnlock }) {
  if (!unlocked) {
    return (
      <>
        <View style={s.vipLock}>
          <Text style={s.vipStar}>★</Text>
          <Text style={s.vipTitle}>TODAY'S VIP ACCUMULATOR</Text>
          <Text style={s.vipText}>
            {today?.vip_available
              ? `${today.vip_legs} of our strongest soccer and NBA picks combined into one slip, with total odds of about 5.`
              : "Our strongest soccer and NBA picks combined into one slip, with total odds of about 5."}
          </Text>
          <Pressable onPress={onUnlock} disabled={vip.busy || (today && !today.vip_available)} style={[s.vipBtn, (vip.busy || (today && !today.vip_available)) && { opacity: 0.6 }]}>
            {vip.busy ? <ActivityIndicator color={C.goldInk} /> : <Text style={s.vipBtnText}>▶  Watch a short video to unlock</Text>}
          </Pressable>
          {vip.msg ? <Text style={[s.vipText, { color: C.lost, marginTop: 4 }]}>{vip.msg}</Text> : null}
          {today && !today.vip_available ? <Text style={[s.vipText, { marginTop: 4 }]}>Today's VIP slip is still being prepared.</Text> : null}
        </View>
        <Notice />
      </>
    );
  }
  const d = vip.data;
  return (
    <>
      <View style={s.vipSlip}>
        <Text style={s.vipTitle}>★ VIP ACCUMULATOR</Text>
        <Text style={s.vipText}>{fmtDate(d.date)} · {d.legs.length} selections</Text>
        <View style={s.vipTotal}>
          <Text style={s.vipTotalLabel}>TOTAL ODDS</Text>
          <Text style={s.vipTotalVal}>{d.total_odds}</Text>
        </View>
      </View>
      <Notice />
      {d.legs.map((p) => <Ticket key={p.id} p={p} />)}
    </>
  );
}

function Footer() {
  return (
    <View style={s.footer}>
      <Text style={s.footerText}>
        <Text style={{ color: C.ink, fontFamily: F.bodyBold }}>Predictions are not guarantees.</Text> Tips are opinions based on form and public
        information and can be wrong. Never bet more than you can afford to lose. 18+ only. If betting stops being fun, contact a
        gambling support service in your country.
      </Text>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: C.bg },
  header: { flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: 16, paddingTop: 10, paddingBottom: 10 },
  logo: { width: 40, height: 30, borderRadius: 7, backgroundColor: C.accent, alignItems: "center", justifyContent: "center", overflow: "hidden" },
  logoB: { fontFamily: F.displayX, fontSize: 24, color: C.accentInk, marginTop: -2 },
  notch: { position: "absolute", top: 10, width: 10, height: 10, borderRadius: 5, backgroundColor: C.bg },
  brand: { fontFamily: F.displayX, fontSize: 26, color: C.ink, letterSpacing: 0.5, lineHeight: 28 },
  brandSub: { fontFamily: F.bodyMed, fontSize: 10, color: C.muted, letterSpacing: 1 },
  demo: { fontFamily: F.bodyBold, fontSize: 9, letterSpacing: 1, color: C.pend, backgroundColor: C.pendBg, paddingHorizontal: 7, paddingVertical: 5, borderRadius: 4, overflow: "hidden" },
  tabs: { flexDirection: "row", marginHorizontal: 16, backgroundColor: C.surface2, borderRadius: 10, padding: 4, gap: 4 },
  tab: { flex: 1, paddingVertical: 10, borderRadius: 7, alignItems: "center" },
  tabOn: { backgroundColor: C.surface },
  tabText: { fontFamily: F.display, fontSize: 17, letterSpacing: 1, color: C.muted, textTransform: "uppercase" },
  tabTextOn: { color: C.ink },
  chips: { flexDirection: "row", gap: 8, paddingHorizontal: 16, paddingTop: 10, paddingBottom: 6 },
  chip: { borderWidth: 1, borderColor: C.line, backgroundColor: C.surface, paddingVertical: 7, paddingHorizontal: 14, borderRadius: 999 },
  chipOn: { backgroundColor: C.ink, borderColor: C.ink },
  chipText: { fontFamily: F.bodyBold, fontSize: 13, color: C.ink },
  chipTextOn: { color: C.bg },
  content: { padding: 16, gap: 12, paddingBottom: 24 },
  dayline: { flexDirection: "row", justifyContent: "space-between", alignItems: "baseline" },
  dayTitle: { fontFamily: F.display, fontSize: 20, color: C.ink, letterSpacing: 0.5 },
  dayMeta: { fontFamily: F.body, fontSize: 13, color: C.muted },
  notice: { flexDirection: "row", gap: 10, alignItems: "center", backgroundColor: C.surface, borderWidth: 1, borderColor: C.line, borderRadius: 10, padding: 10 },
  age: { width: 30, height: 30, borderRadius: 15, backgroundColor: C.accent, alignItems: "center", justifyContent: "center" },
  ageText: { fontFamily: F.displayX, fontSize: 13, color: C.accentInk },
  noticeText: { flex: 1, fontFamily: F.body, fontSize: 12.5, color: C.muted, lineHeight: 18 },
  sectionHead: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 4 },
  sectionText: { fontFamily: F.display, fontSize: 15, letterSpacing: 1.5, color: C.muted },
  ticket: { backgroundColor: C.surface, borderRadius: 12, borderWidth: 1, borderColor: C.line, overflow: "hidden" },
  tTop: { padding: 14, paddingBottom: 12 },
  meta: { flexDirection: "row", justifyContent: "space-between", gap: 8, marginBottom: 6 },
  metaText: { fontFamily: F.bodyBold, fontSize: 11, letterSpacing: 0.8, color: C.muted, flexShrink: 1 },
  team: { fontFamily: F.display, fontSize: 21, color: C.ink, lineHeight: 24 },
  vs: { fontFamily: F.bodyMed, fontSize: 12, color: C.muted, marginVertical: 1 },
  perf: { height: 0, borderTopWidth: 2, borderStyle: "dashed", borderColor: C.line, marginHorizontal: 14 },
  hole: { position: "absolute", top: -10, width: 18, height: 18, borderRadius: 9, backgroundColor: C.bg, borderWidth: 1, borderColor: C.line },
  stub: { flexDirection: "row", alignItems: "center", gap: 12, paddingHorizontal: 14, paddingTop: 12, paddingBottom: 8 },
  market: { fontFamily: F.bodyBold, fontSize: 11, letterSpacing: 0.8, color: C.muted },
  pick: { fontFamily: F.bodyBold, fontSize: 17, color: C.ink },
  at: { fontFamily: F.mono, fontSize: 13, color: C.muted },
  odds: { fontFamily: F.mono, fontSize: 24, color: C.accent },
  oddsLabel: { fontFamily: F.bodyBold, fontSize: 10, letterSpacing: 1, color: C.muted },
  confRow: { flexDirection: "row", alignItems: "center", gap: 10 },
  bar: { flex: 1, height: 6, borderRadius: 3, backgroundColor: C.surface2, overflow: "hidden" },
  barFill: { height: "100%", borderRadius: 3, backgroundColor: C.court },
  confText: { fontFamily: F.mono, fontSize: 12, color: C.muted },
  why: { fontFamily: F.body, fontSize: 13.5, lineHeight: 20, color: C.muted },
  badge: { fontFamily: F.displayX, fontSize: 13, letterSpacing: 1.2, paddingHorizontal: 10, paddingVertical: 6, borderRadius: 6, overflow: "hidden" },
  resultRow: { flexDirection: "row", alignItems: "center", gap: 10, paddingHorizontal: 14, paddingBottom: 14 },
  score: { fontFamily: F.mono, fontSize: 15, color: C.ink },
  resultNote: { flex: 1, fontFamily: F.body, fontSize: 12.5, color: C.muted },
  summary: { flexDirection: "row", backgroundColor: C.surface, borderWidth: 1, borderColor: C.line, borderRadius: 12 },
  sumCell: { flex: 1, alignItems: "center", paddingVertical: 12 },
  sumVal: { fontFamily: F.displayX, fontSize: 28 },
  sumLabel: { fontFamily: F.bodyBold, fontSize: 9.5, letterSpacing: 1, color: C.muted },
  state: { alignItems: "center", gap: 8, padding: 32, backgroundColor: C.surface, borderRadius: 12, borderWidth: 1, borderColor: C.line, borderStyle: "dashed" },
  stateTitle: { fontFamily: F.display, fontSize: 20, color: C.ink, textAlign: "center", letterSpacing: 0.5, textTransform: "uppercase" },
  stateText: { fontFamily: F.body, fontSize: 14, color: C.muted, textAlign: "center", lineHeight: 20 },
  vipLock: { alignItems: "center", gap: 8, padding: 24, borderRadius: 14, backgroundColor: C.surface, borderWidth: 1, borderColor: "#5c4a1c" },
  vipStar: { fontSize: 40, color: C.gold },
  vipTitle: { fontFamily: F.displayX, fontSize: 24, letterSpacing: 1, color: C.gold, textAlign: "center" },
  vipText: { fontFamily: F.body, fontSize: 14, color: C.muted, textAlign: "center", lineHeight: 20 },
  vipBtn: { marginTop: 8, backgroundColor: C.gold, paddingVertical: 14, paddingHorizontal: 22, borderRadius: 10, minWidth: 260, alignItems: "center" },
  vipBtnText: { fontFamily: F.bodyBold, fontSize: 15, color: C.goldInk },
  vipSlip: { alignItems: "center", gap: 6, padding: 18, borderRadius: 14, backgroundColor: C.surface, borderWidth: 1, borderColor: "#5c4a1c" },
  vipTotal: { marginTop: 6, alignItems: "center", backgroundColor: C.pendBg, borderRadius: 10, paddingVertical: 8, paddingHorizontal: 26 },
  vipTotalLabel: { fontFamily: F.bodyBold, fontSize: 10, letterSpacing: 1.2, color: C.pend },
  vipTotalVal: { fontFamily: F.mono, fontSize: 34, color: C.gold },
  vipResult: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", gap: 10, padding: 12, borderRadius: 12, borderWidth: 1, backgroundColor: C.surface },
  vipResultTitle: { flex: 1, fontFamily: F.display, fontSize: 15, letterSpacing: 0.8, color: C.gold },
  footer: { paddingTop: 8 },
  footerText: { fontFamily: F.body, fontSize: 12, lineHeight: 18, color: C.muted },
});
