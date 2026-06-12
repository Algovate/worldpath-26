import { SectionHeader } from "@/components/section-header";
import { PredictionWorkspace } from "@/features/predictions/prediction-workspace";
import { mockScoreAdapter } from "@/lib/tournament/score-adapter";

export default async function PredictionsPage() {
  const [teams, matches] = await Promise.all([
    mockScoreAdapter.getTeams(),
    mockScoreAdapter.getMatches(),
  ]);

  return (
    <div>
      <SectionHeader
        eyebrow="Predictions"
        title="冠军路径预测"
        description="先调整小组排名，再逐轮选择淘汰赛胜者。修改小组排名会重置淘汰赛选择。"
      />
      <PredictionWorkspace teams={teams} matches={matches} />
    </div>
  );
}
