import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/pixel/AppShell";
import { SwipeFlow, clearSwipeDraft } from "@/components/pixel/SwipeFlow";
import { characterFor } from "@/lib/game/data";
import { createSession } from "@/lib/game/api";
import { getState, setState } from "@/lib/game/store";

const DRAFT_KEY = "anima-hatch-draft-self";

export const Route = createFileRoute("/swipe")({
  head: () => ({
    meta: [
      { title: "강점 카드 · ANIMA HATCH" },
      { name: "description", content: "카드를 스와이프해 나의 강점을 골라주세요." },
      { property: "og:title", content: "강점 카드" },
      { property: "og:description", content: "카드를 스와이프해 나의 강점을 골라주세요." },
    ],
  }),
  component: SwipePage,
});

function SwipePage() {
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function finish(picks: string[]) {
    if (busy) return;
    setBusy(true);
    setError(null);
    const cur = getState();

    // One journey = one session row. Re-submitting the same picks (refresh,
    // back-and-forward) must never create a second session.
    const same =
      cur.sessionId &&
      cur.myPicks.length === picks.length &&
      cur.myPicks.every((p, k) => p === picks[k]);
    if (same) {
      clearSwipeDraft(DRAFT_KEY);
      navigate({ to: "/complete" });
      return;
    }

    const character = characterFor(picks);
    setState({ myPicks: picks });
    try {
      const id = await createSession(cur.nickname || "모험가", picks, character.id);
      setState({ sessionId: id });
    } catch (e) {
      setError(e instanceof Error ? e.message : "저장에 실패했어요");
      setBusy(false);
      return;
    }
    clearSwipeDraft(DRAFT_KEY);
    navigate({ to: "/complete" });
  }

  return (
    <AppShell title="강점 키워드 선택" back="/tutorial">
      <SwipeFlow
        draftKey={DRAFT_KEY}
        onFinish={finish}
        busy={busy}
        footer={error ? <div className="mt-3 text-center text-[11px] text-[var(--danger)]">{error}</div> : null}
      />
    </AppShell>
  );
}
