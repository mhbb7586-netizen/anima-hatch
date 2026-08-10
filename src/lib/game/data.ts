import mage from "@/assets/characters/mage.png.asset.json";
import mercenary from "@/assets/characters/mercenary.png.asset.json";
import healer from "@/assets/characters/healer.png.asset.json";
import paladin from "@/assets/characters/paladin.png.asset.json";
import priest from "@/assets/characters/priest.png.asset.json";
import bard from "@/assets/characters/bard.png.asset.json";

export type StatKey =
  | "wisdom"
  | "courage"
  | "humanity"
  | "justice"
  | "temperance"
  | "transcendence";

export const STATS: Record<StatKey, { label: string; color: string; hex: string; icon: string }> = {
  wisdom:      { label: "지혜",   color: "var(--wisdom)",     hex: "#a855f7", icon: "book" },
  courage:     { label: "용기",   color: "var(--courage)",    hex: "#f97316", icon: "sword" },
  humanity:    { label: "인간애", color: "var(--humanity)",   hex: "#4ade80", icon: "leaf" },
  justice:     { label: "정의",   color: "var(--justice)",    hex: "#fbbf24", icon: "shield" },
  temperance:  { label: "절제",   color: "var(--temperance)", hex: "#93c5fd", icon: "hourglass" },
  transcendence: { label: "낭만", color: "var(--creativity)", hex: "#f472b6", icon: "star" },
};

/** Fixed evaluation order — also the deterministic tie-break order for the top virtue. */
export const STAT_KEYS: StatKey[] = [
  "wisdom", "courage", "humanity", "justice", "temperance", "transcendence",
];

export const STAT_ORDER: StatKey[] = [
  "humanity", "transcendence", "wisdom", "justice", "courage", "temperance",
];

/** Selection limits — identical for the user and for friends. */
export const MIN_PICKS = 5;
export const MAX_PICKS = 15;


export type Card = {
  id: string;
  stat: StatKey;
  keyword: string;
  description: string;
  icon: string;
};

export const CARDS: Card[] = [
  // 지혜 — 마법사
  { id: "w1", stat: "wisdom", keyword: "비판적인 사고", description: "주어진 정보를 무조건 수용하지 않고 옳고 그름을 판단하는 힘", icon: "eye" },
  { id: "w2", stat: "wisdom", keyword: "지혜로운", description: "경험에서 배우고, 그 깨달음을 삶에 녹여내는 힘", icon: "book" },
  { id: "w3", stat: "wisdom", keyword: "논리적인", description: "원인과 결과를 연결해서 앞뒤가 맞게 생각하는 힘", icon: "gear" },
  { id: "w4", stat: "wisdom", keyword: "관찰력 있는", description: "남들이 놓치는 작은 변화나 디테일을 알아채는 눈", icon: "crystal" },
  { id: "w5", stat: "wisdom", keyword: "자기성찰적", description: "자기 자신을 돌아보고, 거기서 의미를 찾는 습관", icon: "moon" },
  { id: "w6", stat: "wisdom", keyword: "탐구적인", description: "\"왜?\"를 멈추지 않고 끝까지 파고드는 호기심", icon: "compass" },
  // 용기 — 용병
  { id: "c1", stat: "courage", keyword: "용감한", description: "두려워도 해야 할 일 앞에서 물러서지 않는 것", icon: "sword" },
  { id: "c2", stat: "courage", keyword: "자신감 있는", description: "자기 생각과 능력을 믿고 당당하게 표현하는 힘", icon: "trophy" },
  { id: "c3", stat: "courage", keyword: "주도적인", description: "누가 시키지 않아도 먼저 나서서 이끄는 성격", icon: "torch" },
  { id: "c4", stat: "courage", keyword: "독립적인", description: "남에게 기대지 않고 스스로 결정하고 행동하는 것", icon: "wing" },
  { id: "c5", stat: "courage", keyword: "소신있는", description: "다수의 의견과 달라도 자기 생각을 지키는 용기", icon: "flag" },
  { id: "c6", stat: "courage", keyword: "활기찬", description: "에너지가 넘치고 주변까지 생기 있게 만드는 힘", icon: "fire" },
  // 인간애 — 힐러
  { id: "h1", stat: "humanity", keyword: "공감적인", description: "다른 사람의 감정을 자기 일처럼 느끼는 힘", icon: "heart" },
  { id: "h2", stat: "humanity", keyword: "이타적인", description: "가진 것을 나누는 데 주저하지 않는 너그러움", icon: "chest" },
  { id: "h3", stat: "humanity", keyword: "배려심 있는", description: "상대의 입장에서 먼저 생각하고 행동하는 습관", icon: "apple" },
  { id: "h4", stat: "humanity", keyword: "다정한", description: "누구에게나 기분 좋은 태도로 대하는 자연스러운 성품", icon: "clover" },
  { id: "h5", stat: "humanity", keyword: "친화력 있는", description: "처음 만난 사람과도 금방 편하게 어울리는 능력", icon: "bubble" },
  { id: "h6", stat: "humanity", keyword: "수용적인", description: "나와 다른 생각이나 사람도 있는 그대로 받아들이는 것", icon: "potion" },
  // 정의 — 성기사
  { id: "j1", stat: "justice", keyword: "책임감 있는", description: "맡은 일은 끝까지 해내야 직성이 풀리는 성격", icon: "shield" },
  { id: "j2", stat: "justice", keyword: "믿음직한", description: "\"이 사람한테 맡기면 된다\"는 신뢰를 주는 존재감", icon: "bell" },
  { id: "j3", stat: "justice", keyword: "체계적인", description: "계획을 세우고 정리하는 데 강한 사람", icon: "scroll" },
  { id: "j4", stat: "justice", keyword: "협조적인", description: "팀 안에서 자기 역할을 충실히 하며 돕는 사람", icon: "coin" },
  { id: "j5", stat: "justice", keyword: "즉각적인 반응", description: "도움이 필요한 순간 바로 움직이는 행동력", icon: "arrow" },
  { id: "j6", stat: "justice", keyword: "신뢰감", description: "말과 행동이 일치해서 믿고 의지할 수 있는 것", icon: "key" },
  // 절제 — 신관
  { id: "t1", stat: "temperance", keyword: "차분한", description: "급한 상황에서도 흔들리지 않는 고요한 내면", icon: "drop" },
  { id: "t2", stat: "temperance", keyword: "겸손한", description: "잘해도 티 내지 않고 조용히 자기 자리를 지키는 것", icon: "leaf" },
  { id: "t3", stat: "temperance", keyword: "성숙한", description: "나이와 상관없이 상황을 넓게 보는 어른스러운 시선", icon: "lantern" },
  { id: "t4", stat: "temperance", keyword: "신중한", description: "말이나 행동을 하기 전에 한 번 더 생각하는 습관", icon: "hourglass" },
  { id: "t5", stat: "temperance", keyword: "인내심", description: "결과가 바로 안 나와도 묵묵히 기다릴 줄 아는 힘", icon: "mushroom" },
  { id: "t6", stat: "temperance", keyword: "분별력 있는", description: "중요한 것과 중요하지 않은 것을 가려내는 감각", icon: "gem" },
  // 낭만 — 음유시인
  { id: "x1", stat: "transcendence", keyword: "재치있는", description: "적절한 타이밍에 딱 맞는 말을 던지는 센스", icon: "dice" },
  { id: "x2", stat: "transcendence", keyword: "쾌활함", description: "밝은 에너지로 주변을 환하게 만드는 존재감", icon: "note" },
  { id: "x3", stat: "transcendence", keyword: "이상주의적", description: "더 나은 세상을 꿈꾸고, 그 방향으로 나아가려는 마음", icon: "star" },
  { id: "x4", stat: "transcendence", keyword: "긍정적인", description: "어떤 상황에서도 좋은 면을 먼저 보려는 시선", icon: "sun" },
  { id: "x5", stat: "transcendence", keyword: "감수성 있는", description: "음악, 자연, 사소한 순간에서 깊이 감동받는 마음", icon: "feather" },
  { id: "x6", stat: "transcendence", keyword: "모험적인", description: "계획에 없던 것도 재미있으면 바로 뛰어드는 성격", icon: "rainbow" },
];

export type CharacterClass = {
  id: string;
  name: string;
  subtitle: string;
  tags: string;
  stat: StatKey;
  image: string;
  description: string;
};

export const CHARACTERS: CharacterClass[] = [
  { id: "mage",      name: "마법사",   subtitle: "지혜의 서", tags: "지혜 · 통찰 · 탐구",   stat: "wisdom",     image: mage.url,      description: "고대의 지식을 다루는 자. 조용히 세상의 이치를 읽어냅니다." },
  { id: "mercenary", name: "용병",     subtitle: "불꽃의 검", tags: "용기 · 열정 · 도전",   stat: "courage",    image: mercenary.url, description: "두려움을 태워버리는 심장. 앞에 서서 길을 여는 자입니다." },
  { id: "healer",    name: "힐러",     subtitle: "숲의 손길", tags: "인간애 · 공감 · 사랑", stat: "humanity",   image: healer.url,    description: "상처를 어루만지는 따뜻한 사람. 함께 있는 것만으로 위로가 됩니다." },
  { id: "paladin",   name: "성기사",   subtitle: "정의의 방패", tags: "정의 · 책임 · 원칙", stat: "justice",    image: paladin.url,   description: "무너지지 않는 원칙의 사람. 옳음을 위해 방패를 드는 자입니다." },
  { id: "priest",    name: "신관",     subtitle: "고요한 빛", tags: "절제 · 겸손 · 균형",   stat: "temperance", image: priest.url,    description: "자신을 다스리는 자. 흔들림 없이 중심을 지키는 사람입니다." },
  { id: "bard",      name: "음유시인", subtitle: "별의 노래", tags: "낭만 · 감성 · 상상",   stat: "transcendence", image: bard.url,      description: "일상을 예술로 바꾸는 자. 모든 것에서 아름다움을 찾아냅니다." },
];

export const CHAR_BY_STAT: Record<StatKey, CharacterClass> = Object.fromEntries(
  CHARACTERS.map((c) => [c.stat, c])
) as Record<StatKey, CharacterClass>;

export const CHAR_BY_ID: Record<string, CharacterClass> = Object.fromEntries(
  CHARACTERS.map((c) => [c.id, c])
);

export const CARD_BY_ID: Record<string, Card> = Object.fromEntries(
  CARDS.map((c) => [c.id, c])
);

/**
 * Stable numeric keyword ids used by the database (`keyword_ids integer[]`).
 * Derived from the fixed CARDS order — never reorder or remove entries above,
 * only append new cards at the end.
 */
export const KEYWORD_NUM_BY_ID: Record<string, number> = Object.fromEntries(
  CARDS.map((c, i) => [c.id, i + 1])
);
export const KEYWORD_ID_BY_NUM: Record<number, string> = Object.fromEntries(
  CARDS.map((c, i) => [i + 1, c.id])
);
export function toKeywordIds(cardIds: string[]): number[] {
  return cardIds.map((id) => KEYWORD_NUM_BY_ID[id]).filter((n): n is number => Number.isFinite(n));
}
export function toCardIds(keywordIds: number[]): string[] {
  return keywordIds.map((n) => KEYWORD_ID_BY_NUM[n]).filter((id): id is string => Boolean(id));
}


function emptyCounts(): Record<StatKey, number> {
  return { wisdom: 0, courage: 0, humanity: 0, justice: 0, temperance: 0, transcendence: 0 };
}

/** Raw number of selected cards per virtue. Unknown ids are ignored. */
export function countByStat(cardIds: string[]): Record<StatKey, number> {
  const counts = emptyCounts();
  for (const id of cardIds) {
    const card = CARD_BY_ID[id];
    if (card) counts[card.stat]++;
  }
  return counts;
}

/** Percentage share per virtue (rounded). */
export function computeStats(cardIds: string[]): Record<StatKey, number> {
  const counts = countByStat(cardIds);
  const total = STAT_KEYS.reduce((a, k) => a + counts[k], 0) || 1;
  const out = emptyCounts();
  for (const k of STAT_KEYS) out[k] = Math.round((counts[k] / total) * 100);
  return out;
}

/** Highest-scoring virtue. Ties break deterministically along STAT_KEYS. */
export function topStat(stats: Record<StatKey, number>): StatKey {
  let best: StatKey = STAT_KEYS[0]!;
  for (const k of STAT_KEYS) {
    if (stats[k] > stats[best]) best = k;
  }
  return best;
}

/** The single character unlocked by a set of self-selected cards. */
export function characterFor(cardIds: string[]): CharacterClass {
  return CHAR_BY_STAT[topStat(countByStat(cardIds))];
}

