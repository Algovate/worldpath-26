import type { Match, MatchStatus, Stage } from "./types";

const statusLabels: Record<MatchStatus, string> = {
  scheduled: "未开始",
  live: "进行中",
  halfTime: "中场",
  finished: "已结束",
  extraTime: "加时",
  penalties: "点球",
  postponed: "延期",
  cancelled: "取消",
};

const stageLabels: Record<Stage, string> = {
  group: "小组赛",
  round32: "32 强",
  round16: "16 强",
  quarter: "1/4 决赛",
  semi: "半决赛",
  third: "三四名",
  final: "决赛",
};

export function formatMatchStatus(status: MatchStatus, minute?: number) {
  if ((status === "live" || status === "extraTime") && minute) {
    return `${statusLabels[status]} ${minute}'`;
  }
  return statusLabels[status];
}

export function formatScore(match: Match) {
  if (match.homeScore == null || match.awayScore == null) return "vs";
  return `${match.homeScore} - ${match.awayScore}`;
}

export function formatStage(stage: Stage) {
  return stageLabels[stage];
}

export function formatDateTime(date: string) {
  return new Intl.DateTimeFormat("zh-CN", {
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}
