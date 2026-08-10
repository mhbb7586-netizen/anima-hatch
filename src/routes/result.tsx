import { createFileRoute } from "@tanstack/react-router";
import { ResultView } from "@/components/result/ResultView";
import { useGame } from "@/lib/game/store";

export const Route = createFileRoute("/result")({
  head: () => ({
    meta: [
      { title: "나의 결과 · ANIMA HATCH" },
      { name: "description", content: "나만 아는 나, 남이 보는 나 — 조하리의 창 결과를 확인하세요." },
      { property: "og:title", content: "나의 결과 · ANIMA HATCH" },
      { property: "og:description", content: "나만 아는 나, 남이 보는 나 — 조하리의 창 결과를 확인하세요." },
    ],
  }),
  component: MyResultPage,
});

function MyResultPage() {
  const game = useGame();
  return <ResultView sessionId={game.sessionId} own />;
}
