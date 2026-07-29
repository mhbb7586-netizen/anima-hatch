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
  | "creativity";

export const STATS: Record<StatKey, { label: string; color: string; icon: string }> = {
  wisdom:      { label: "지혜",   color: "var(--wisdom)",     icon: "book" },
  courage:     { label: "용기",   color: "var(--courage)",    icon: "sword" },
  humanity:    { label: "인간애", color: "var(--humanity)",   icon: "leaf" },
  justice:     { label: "정의",   color: "var(--justice)",    icon: "shield" },
  temperance:  { label: "절제",   color: "var(--temperance)", icon: "hourglass" },
  creativity:  { label: "초월",   color: "var(--creativity)", icon: "star" },
};

export const STAT_ORDER: StatKey[] = [
  "humanity", "creativity", "wisdom", "justice", "courage", "temperance",
];

export type Card = {
  id: string;
  stat: StatKey;
  keyword: string;
  description: string;
  icon: string;
};

export const CARDS: Card[] = [
  // wisdom
  { id: "w1", stat: "wisdom", keyword: "호기심", description: "새로운 것을 배우려는 강한 열망", icon: "book" },
  { id: "w2", stat: "wisdom", keyword: "통찰",   description: "본질을 꿰뚫어보는 눈", icon: "crystal" },
  { id: "w3", stat: "wisdom", keyword: "판단력", description: "상황을 바르게 읽어내는 힘", icon: "book" },
  { id: "w4", stat: "wisdom", keyword: "탐구",   description: "끝까지 파고드는 집요함", icon: "crystal" },
  // courage
  { id: "c1", stat: "courage", keyword: "용감함", description: "두려움 앞에서도 나아가는 힘", icon: "sword" },
  { id: "c2", stat: "courage", keyword: "끈기",   description: "쉽게 포기하지 않는 마음", icon: "fire" },
  { id: "c3", stat: "courage", keyword: "정직",   description: "있는 그대로 말하는 담대함", icon: "sword" },
  { id: "c4", stat: "courage", keyword: "열정",   description: "타오르는 뜨거운 심장", icon: "fire" },
  // humanity
  { id: "h1", stat: "humanity", keyword: "공감",   description: "다른 사람의 감정에 깊이 공감하는 능력", icon: "leaf" },
  { id: "h2", stat: "humanity", keyword: "친절",   description: "먼저 손을 내미는 따뜻함", icon: "leaf" },
  { id: "h3", stat: "humanity", keyword: "사랑",   description: "가까운 이를 소중히 여기는 마음", icon: "potion" },
  { id: "h4", stat: "humanity", keyword: "사회지능", description: "사람 사이를 읽어내는 감각", icon: "leaf" },
  // justice
  { id: "j1", stat: "justice", keyword: "책임감", description: "맡은 일을 끝까지 짊어지는 어깨", icon: "shield" },
  { id: "j2", stat: "justice", keyword: "공정함", description: "누구에게나 같은 기준을 적용", icon: "shield" },
  { id: "j3", stat: "justice", keyword: "리더십", description: "함께 앞으로 나아가게 하는 힘", icon: "star" },
  { id: "j4", stat: "justice", keyword: "협동",   description: "팀을 위해 자신을 내어놓음", icon: "shield" },
  // temperance
  { id: "t1", stat: "temperance", keyword: "겸손",   description: "낮은 자세로 배우는 태도", icon: "hourglass" },
  { id: "t2", stat: "temperance", keyword: "신중함", description: "돌다리도 두드리는 마음", icon: "hourglass" },
  { id: "t3", stat: "temperance", keyword: "자기조절", description: "감정과 충동을 다스리는 힘", icon: "potion" },
  { id: "t4", stat: "temperance", keyword: "용서",   description: "지난 일을 놓아주는 여유", icon: "hourglass" },
  // creativity / transcendence
  { id: "x1", stat: "creativity", keyword: "창의성", description: "새로운 길을 그려내는 재능", icon: "star" },
  { id: "x2", stat: "creativity", keyword: "심미안", description: "아름다움을 알아보는 눈", icon: "crystal" },
  { id: "x3", stat: "creativity", keyword: "감사",   description: "작은 것에도 마음이 움직이는 사람", icon: "star" },
  { id: "x4", stat: "creativity", keyword: "희망",   description: "내일을 밝게 그리는 상상력", icon: "potion" },
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
  { id: "bard",      name: "음유시인", subtitle: "별의 노래", tags: "초월 · 창의 · 감사",   stat: "creativity", image: bard.url,      description: "일상을 예술로 바꾸는 자. 모든 것에서 아름다움을 찾아냅니다." },
];

export const CHAR_BY_STAT: Record<StatKey, CharacterClass> = Object.fromEntries(
  CHARACTERS.map((c) => [c.stat, c])
) as Record<StatKey, CharacterClass>;

export function computeStats(cardIds: string[]): Record<StatKey, number> {
  const counts: Record<StatKey, number> = {
    wisdom: 0, courage: 0, humanity: 0, justice: 0, temperance: 0, creativity: 0,
  };
  for (const id of cardIds) {
    const card = CARDS.find((c) => c.id === id);
    if (card) counts[card.stat]++;
  }
  const total = Object.values(counts).reduce((a, b) => a + b, 0) || 1;
  return Object.fromEntries(
    Object.entries(counts).map(([k, v]) => [k, Math.round((v / total) * 100)])
  ) as Record<StatKey, number>;
}

export function topStat(stats: Record<StatKey, number>): StatKey {
  return (Object.entries(stats).sort((a, b) => b[1] - a[1])[0]?.[0] as StatKey) ?? "wisdom";
}
