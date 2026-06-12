import { SectionHeader } from "@/components/section-header";
import { PredictionWorkspace } from "@/features/predictions/prediction-workspace";
import { getTournamentSnapshot } from "@/lib/tournament/snapshot";

export default async function PredictionsPage() {
  const snapshot = await getTournamentSnapshot();

  return (
    <div>
      <SectionHeader
        eyebrow="Predictions"
        title="冠军路径预测"
        description="先调整小组排名，再逐轮选择淘汰赛胜者。修改小组排名会重置淘汰赛选择。"
      />
      <PredictionWorkspace teams={snapshot.teams} matches={snapshot.matches} />
    </div>
  );
}
