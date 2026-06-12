import type { Match, Team } from "./types";

const groups = {
  A: [
    ["can", "加拿大", "CAN", "🇨🇦", "CONCACAF", 31],
    ["mex", "墨西哥", "MEX", "🇲🇽", "CONCACAF", 14],
    ["kor", "韩国", "KOR", "🇰🇷", "AFC", 22],
    ["mar", "摩洛哥", "MAR", "🇲🇦", "CAF", 12],
  ],
  B: [
    ["usa", "美国", "USA", "🇺🇸", "CONCACAF", 11],
    ["jpn", "日本", "JPN", "🇯🇵", "AFC", 18],
    ["cro", "克罗地亚", "CRO", "🇭🇷", "UEFA", 10],
    ["gha", "加纳", "GHA", "🇬🇭", "CAF", 62],
  ],
  C: [
    ["arg", "阿根廷", "ARG", "🇦🇷", "CONMEBOL", 1],
    ["den", "丹麦", "DEN", "🇩🇰", "UEFA", 19],
    ["egy", "埃及", "EGY", "🇪🇬", "CAF", 36],
    ["aus", "澳大利亚", "AUS", "🇦🇺", "AFC", 24],
  ],
  D: [
    ["bra", "巴西", "BRA", "🇧🇷", "CONMEBOL", 5],
    ["sui", "瑞士", "SUI", "🇨🇭", "UEFA", 20],
    ["sen", "塞内加尔", "SEN", "🇸🇳", "CAF", 17],
    ["qat", "卡塔尔", "QAT", "🇶🇦", "AFC", 34],
  ],
  E: [
    ["fra", "法国", "FRA", "🇫🇷", "UEFA", 2],
    ["uru", "乌拉圭", "URU", "🇺🇾", "CONMEBOL", 15],
    ["tun", "突尼斯", "TUN", "🇹🇳", "CAF", 28],
    ["nzl", "新西兰", "NZL", "🇳🇿", "OFC", 103],
  ],
  F: [
    ["eng", "英格兰", "ENG", "🏴", "UEFA", 4],
    ["col", "哥伦比亚", "COL", "🇨🇴", "CONMEBOL", 13],
    ["nga", "尼日利亚", "NGA", "🇳🇬", "CAF", 30],
    ["uae", "阿联酋", "UAE", "🇦🇪", "AFC", 69],
  ],
  G: [
    ["esp", "西班牙", "ESP", "🇪🇸", "UEFA", 3],
    ["usa2", "厄瓜多尔", "ECU", "🇪🇨", "CONMEBOL", 27],
    ["rsa", "南非", "RSA", "🇿🇦", "CAF", 58],
    ["irq", "伊拉克", "IRQ", "🇮🇶", "AFC", 59],
  ],
  H: [
    ["ger", "德国", "GER", "🇩🇪", "UEFA", 9],
    ["per", "秘鲁", "PER", "🇵🇪", "CONMEBOL", 32],
    ["cot", "科特迪瓦", "CIV", "🇨🇮", "CAF", 38],
    ["ksa", "沙特", "KSA", "🇸🇦", "AFC", 56],
  ],
  I: [
    ["ita", "意大利", "ITA", "🇮🇹", "UEFA", 8],
    ["chi", "智利", "CHI", "🇨🇱", "CONMEBOL", 42],
    ["cmr", "喀麦隆", "CMR", "🇨🇲", "CAF", 49],
    ["chn", "中国", "CHN", "🇨🇳", "AFC", 88],
  ],
  J: [
    ["por", "葡萄牙", "POR", "🇵🇹", "UEFA", 6],
    ["par", "巴拉圭", "PAR", "🇵🇾", "CONMEBOL", 48],
    ["alg", "阿尔及利亚", "ALG", "🇩🇿", "CAF", 37],
    ["uzb", "乌兹别克斯坦", "UZB", "🇺🇿", "AFC", 57],
  ],
  K: [
    ["ned", "荷兰", "NED", "🇳🇱", "UEFA", 7],
    ["ven", "委内瑞拉", "VEN", "🇻🇪", "CONMEBOL", 47],
    ["mli", "马里", "MLI", "🇲🇱", "CAF", 44],
    ["jor", "约旦", "JOR", "🇯🇴", "AFC", 64],
  ],
  L: [
    ["bel", "比利时", "BEL", "🇧🇪", "UEFA", 16],
    ["bol", "玻利维亚", "BOL", "🇧🇴", "CONMEBOL", 78],
    ["cod", "刚果民主共和国", "COD", "🇨🇩", "CAF", 60],
    ["tha", "泰国", "THA", "🇹🇭", "AFC", 101],
  ],
} as const;

export const teams: Team[] = Object.entries(groups).flatMap(([group, list]) =>
  list.map(([id, name, code, flag, confederation, fifaRank]) => ({
    id,
    name,
    code,
    flag,
    confederation,
    fifaRank,
    group,
  })),
);

const venues = [
  "多伦多",
  "墨西哥城",
  "洛杉矶",
  "纽约/新泽西",
  "达拉斯",
  "迈阿密",
];

function groupMatch(
  id: string,
  group: string,
  date: string,
  homeTeamId: string,
  awayTeamId: string,
  status: Match["status"],
  score?: [number, number],
  minute?: number,
): Match {
  return {
    id,
    stage: "group",
    group,
    date,
    venue: venues[id.charCodeAt(id.length - 1) % venues.length],
    homeTeamId,
    awayTeamId,
    homeScore: score?.[0],
    awayScore: score?.[1],
    status,
    minute,
    lastUpdatedAt:
      status === "scheduled" ? undefined : "2026-06-12T10:24:00+08:00",
  };
}

export const matches: Match[] = [
  groupMatch("m-a-1", "A", "2026-06-11T20:00:00-04:00", "can", "mex", "finished", [1, 2]),
  groupMatch("m-a-2", "A", "2026-06-12T17:00:00-04:00", "kor", "mar", "live", [0, 1], 67),
  groupMatch("m-a-3", "A", "2026-06-17T19:00:00-04:00", "can", "kor", "scheduled"),
  groupMatch("m-a-4", "A", "2026-06-18T18:00:00-04:00", "mex", "mar", "scheduled"),
  groupMatch("m-b-1", "B", "2026-06-12T21:00:00-04:00", "usa", "jpn", "halfTime", [1, 1], 45),
  groupMatch("m-b-2", "B", "2026-06-13T18:00:00-04:00", "cro", "gha", "finished", [2, 0]),
  groupMatch("m-b-3", "B", "2026-06-18T20:00:00-04:00", "usa", "cro", "scheduled"),
  groupMatch("m-c-1", "C", "2026-06-13T21:00:00-04:00", "arg", "den", "finished", [2, 2]),
  groupMatch("m-c-2", "C", "2026-06-14T18:00:00-04:00", "egy", "aus", "scheduled"),
  groupMatch("m-d-1", "D", "2026-06-14T21:00:00-04:00", "bra", "sui", "finished", [3, 1]),
  groupMatch("m-d-2", "D", "2026-06-15T18:00:00-04:00", "sen", "qat", "scheduled"),
  groupMatch("m-e-1", "E", "2026-06-15T21:00:00-04:00", "fra", "uru", "live", [1, 0], 31),
  groupMatch("m-e-2", "E", "2026-06-16T18:00:00-04:00", "tun", "nzl", "scheduled"),
  groupMatch("m-f-1", "F", "2026-06-16T21:00:00-04:00", "eng", "col", "finished", [1, 0]),
  groupMatch("m-f-2", "F", "2026-06-17T18:00:00-04:00", "nga", "uae", "scheduled"),
  groupMatch("m-g-1", "G", "2026-06-17T21:00:00-04:00", "esp", "usa2", "finished", [2, 1]),
  groupMatch("m-g-2", "G", "2026-06-18T17:00:00-04:00", "rsa", "irq", "scheduled"),
  groupMatch("m-h-1", "H", "2026-06-18T21:00:00-04:00", "ger", "per", "finished", [0, 0]),
  groupMatch("m-h-2", "H", "2026-06-19T18:00:00-04:00", "cot", "ksa", "scheduled"),
  groupMatch("m-i-1", "I", "2026-06-19T21:00:00-04:00", "ita", "chi", "scheduled"),
  groupMatch("m-i-2", "I", "2026-06-20T18:00:00-04:00", "cmr", "chn", "scheduled"),
  groupMatch("m-j-1", "J", "2026-06-20T21:00:00-04:00", "por", "par", "scheduled"),
  groupMatch("m-j-2", "J", "2026-06-21T18:00:00-04:00", "alg", "uzb", "scheduled"),
  groupMatch("m-k-1", "K", "2026-06-21T21:00:00-04:00", "ned", "ven", "scheduled"),
  groupMatch("m-k-2", "K", "2026-06-22T18:00:00-04:00", "mli", "jor", "scheduled"),
  groupMatch("m-l-1", "L", "2026-06-22T21:00:00-04:00", "bel", "bol", "scheduled"),
  groupMatch("m-l-2", "L", "2026-06-23T18:00:00-04:00", "cod", "tha", "scheduled"),
];
