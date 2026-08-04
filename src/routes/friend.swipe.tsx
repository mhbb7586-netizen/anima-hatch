import { createFileRoute, useNavigate, useSearch } from "@tanstack/react-router";
import { useState } from "react";
import { AppShell } from "@/components/pixel/AppShell";
import { SwipeFlow } from "@/components/pixel/SwipeFlow";
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

function FriendSwipe() {
  const search = useSearch({ from: "/friend/swipe" });
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function finish(picks: string[]) {
    if (busy) return;
    if (!search.s) { setError("초대 링크가 올바르지 않아요."); return; }
    setBusy(true);
    setError(null);
    try {
      await addPeerAnswer(search.s, search.name || "친구", picks);
    } catch (e) {
      setError(e instanceof Error ? e.message : "전송에 실패했어요");
      setBusy(false);
      return;
    }
    navigate({ to: "/friend/complete", search });
  }

  return (
    <AppShell title={`${search.from || "친구"}의 강점 찾기`}>
      <SwipeFlow
        onFinish={finish}
        busy={busy}
        footer={error ? <div className="mt-3 text-center text-[11px] text-[var(--danger)]">{error}</div> : null}
      />
    </AppShell>
  );
}
