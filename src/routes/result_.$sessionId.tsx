import { createFileRoute, useParams } from "@tanstack/react-router";
import { ResultView } from "@/components/result/ResultView";
import { useGame } from "@/lib/game/store";

export const Route = createFileRoute("/result_/$sessionId")({
  head: () => ({
    meta: [
      { title: "공유된 결과 · ANIMA HATCH" },
      { name: "description", content: "친구가 공유한 ANIMA HATCH 결과를 확인해보세요." },
      { property: "og:title", content: "공유된 결과 · ANIMA HATCH" },
      { property: "og:description", content: "친구가 공유한 ANIMA HATCH 결과를 확인해보세요." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: SharedResultPage,
});

function SharedResultPage() {
  const { sessionId } = useParams({ from: "/result_/$sessionId" });
  const game = useGame();
  return <ResultView sessionId={sessionId} own={game.sessionId === sessionId} />;
}
