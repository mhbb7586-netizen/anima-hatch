import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/pixel/AppShell";
import { SwipeFlow, clearSwipeDraft } from "@/components/pixel/SwipeFlow";
import { addPeerAnswer } from "@/lib/game/api";

type Search = { s?: string; from?: string; name?: string };

export const Route = createFileRoute("/friend/swipe")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    s: typeof s.s === "string" ? s.s : undefined,
    from: typeof s.from === "string" ? s.from : undefined,
    name: typeof s.name === "string" ? s.name : undefined,
  }),
  head: () => ({
    meta: [
      { title: "친구가 보는 강점 · ANIMA HATCH" },
      { name: "description", content: "친구의 강점 카드를 골라주세요." },
      { property: "og:title", content: "친구가 보는 강점" },
      { property: "og:description", content: "친구의 강점 카드를 골라주세요." },
    ],
  }),
  component: FriendSwipe,
});

/** Marks a submitted answer locally so a refresh or back-navigation never resends it. */
function sentKey(sessionId: string) {
  return `anima-hatch-peer-sent-${sessionId}`;
}

function alreadySent(sessionId: string) {
  if (typeof window === "undefined") return false;
  try { return window.localStorage.getItem(sentKey(sessionId)) === "1"; } catch { return false; }
}

function markSent(sessionId: string) {
  if (typeof window === "undefined") return;
  try { window.localStorage.setItem(sentKey(sessionId), "1"); } catch { /* noop */ }
}

function FriendSwipe() {
  const search = useSearch({ from: "/friend/swipe" });
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const draftKey = `anima-hatch-draft-peer-${search.s ?? "none"}`;

  async function finish(picks: string[]) {
    if (busy) return;
    if (!search.s) { setError("초대 링크가 올바르지 않아요."); return; }
    if (alreadySent(search.s)) {
      navigate({ to: "/friend/complete", search });
      return;
    }
    setBusy(true);
    setError(null);
    try {
      await addPeerAnswer(search.s, search.name?.trim() || "익명", picks);
    } catch (e) {
      const msg = e instanceof Error ? e.message : "전송에 실패했어요";
      setError(
        msg.includes("SESSION_FULL")
          ? "이미 친구 3명이 모두 응답해서 참여가 마감됐어요."
          : msg,
      );
      setBusy(false);
      return;
    }
    markSent(search.s);
    clearSwipeDraft(draftKey);
    navigate({ to: "/friend/complete", search });
  }

  return (
    <AppShell title={`${search.from || "친구"}의 강점 찾기`}>
      <SwipeFlow
        draftKey={draftKey}
        onFinish={finish}
        busy={busy}
        footer={error ? <div className="mt-3 text-center text-[11px] text-[var(--danger)]">{error}</div> : null}
      />
    </AppShell>
  );
}
