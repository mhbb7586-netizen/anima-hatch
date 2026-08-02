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

export const STATS: Record<StatKey, { label: string; color: string; icon: string }> = {
  wisdom:      { label: "지혜",   color: "var(--wisdom)",     icon: "book" },
  courage:     { label: "용기",   color: "var(--courage)",    icon: "sword" },
  humanity:    { label: "인간애", color: "var(--humanity)",   icon: "leaf" },
  justice:     { label: "정의",   color: "var(--justice)",    icon: "shield" },
  temperance:  { label: "절제",   color: "var(--temperance)", icon: "hourglass" },
  transcendence: { label: "초월", color: "var(--creativity)", icon: "star" },
};

export const STAT_ORDER: StatKey[] = [
  "humanity", "transcendence", "wisdom", "justice", "courage", "temperance",
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
  { id: "w1", stat: "wisdom", keyword: "지혜로운", description: "삶의 이치를 헤아리는 사람", icon: "book" },
  { id: "w2", stat: "wisdom", keyword: "박식함", description: "폭넓은 지식을 갖춘 사람", icon: "crystal" },
  { id: "w3", stat: "wisdom", keyword: "지적임", description: "생각의 깊이가 느껴지는 사람", icon: "book" },
  { id: "w4", stat: "wisdom", keyword: "영리함", description: "빠르게 이해하고 응용하는 사람", icon: "crystal" },
  { id: "w5", stat: "wisdom", keyword: "논리성", description: "앞뒤가 맞게 생각을 정리하는 힘", icon: "book" },
  { id: "w6", stat: "wisdom", keyword: "관찰력", description: "작은 변화도 놓치지 않는 눈", icon: "crystal" },
  { id: "w7", stat: "wisdom", keyword: "성찰력", description: "자신을 돌아볼 줄 아는 힘", icon: "book" },
  { id: "w8", stat: "wisdom", keyword: "자기성찰적", description: "내면을 자주 들여다보는 태도", icon: "crystal" },
  { id: "w9", stat: "wisdom", keyword: "탐구적인", description: "끝까지 파고드는 집요함", icon: "book" },
  { id: "w10", stat: "wisdom", keyword: "분별력있는", description: "옳고 그름을 가려내는 판단", icon: "crystal" },
  { id: "w11", stat: "wisdom", keyword: "총명함", description: "맑고 밝게 깨우치는 머리", icon: "book" },
  // courage
  { id: "c1", stat: "courage", keyword: "용감함", description: "두려움 앞에서도 나아가는 힘", icon: "sword" },
  { id: "c2", stat: "courage", keyword: "대담함", description: "큰 결정을 두려워하지 않음", icon: "fire" },
  { id: "c3", stat: "courage", keyword: "자신감", description: "스스로를 믿는 단단한 마음", icon: "sword" },
  { id: "c4", stat: "courage", keyword: "주도적인", description: "먼저 나서서 이끄는 태도", icon: "fire" },
  { id: "c5", stat: "courage", keyword: "독립성", description: "혼자서도 서 있을 수 있는 힘", icon: "sword" },
  { id: "c6", stat: "courage", keyword: "소신있는", description: "흔들리지 않는 자기 기준", icon: "fire" },
  { id: "c7", stat: "courage", keyword: "활력", description: "주변까지 살아나게 하는 에너지", icon: "sword" },
  { id: "c8", stat: "courage", keyword: "자부심", description: "스스로를 자랑스러워하는 마음", icon: "fire" },
  // humanity
  { id: "h1", stat: "humanity", keyword: "공감력", description: "타인의 감정을 깊이 느끼는 능력", icon: "leaf" },
  { id: "h2", stat: "humanity", keyword: "공감적인", description: "상대의 입장에서 함께 느낌", icon: "potion" },
  { id: "h3", stat: "humanity", keyword: "따뜻함", description: "곁에 있으면 편안해지는 온도", icon: "leaf" },
  { id: "h4", stat: "humanity", keyword: "다정한", description: "말과 행동에 정이 묻어남", icon: "potion" },
  { id: "h5", stat: "humanity", keyword: "친절함", description: "먼저 손을 내미는 마음", icon: "leaf" },
  { id: "h6", stat: "humanity", keyword: "배려심", description: "상대를 먼저 생각하는 습관", icon: "potion" },
  { id: "h7", stat: "humanity", keyword: "베풂", description: "아낌없이 나누는 마음", icon: "leaf" },
  { id: "h8", stat: "humanity", keyword: "수용적인", description: "있는 그대로 받아들이는 품", icon: "potion" },
  // justice
  { id: "j1", stat: "justice", keyword: "책임감있는", description: "맡은 일을 끝까지 짊어짐", icon: "shield" },
  { id: "j2", stat: "justice", keyword: "믿음직함", description: "기대어도 무너지지 않는 사람", icon: "star" },
  { id: "j3", stat: "justice", keyword: "품위있는", description: "태도에서 격이 느껴짐", icon: "shield" },
  { id: "j4", stat: "justice", keyword: "체계성", description: "질서 있게 정리하는 힘", icon: "star" },
  { id: "j5", stat: "justice", keyword: "유능함", description: "맡기면 해내는 실력", icon: "shield" },
  { id: "j6", stat: "justice", keyword: "협조적인", description: "함께 맞춰 나가는 자세", icon: "star" },
  { id: "j7", stat: "justice", keyword: "즉각적인 반응", description: "필요할 때 바로 응답함", icon: "shield" },
  { id: "j8", stat: "justice", keyword: "신뢰감", description: "약속을 지키는 사람", icon: "star" },
  { id: "j9", stat: "justice", keyword: "인내심", description: "묵묵히 견뎌내는 힘", icon: "shield" },
  // temperance
  { id: "t1", stat: "temperance", keyword: "차분함", description: "흔들려도 중심을 지키는 마음", icon: "hourglass" },
  { id: "t2", stat: "temperance", keyword: "여유로운", description: "서두르지 않는 넉넉함", icon: "potion" },
  { id: "t3", stat: "temperance", keyword: "겸손함", description: "낮은 자세로 배우는 태도", icon: "hourglass" },
  { id: "t4", stat: "temperance", keyword: "감수성있는", description: "섬세하게 느끼는 마음", icon: "potion" },
  { id: "t5", stat: "temperance", keyword: "성숙함", description: "감정을 다스릴 줄 아는 태도", icon: "hourglass" },
  { id: "t6", stat: "temperance", keyword: "신중한", description: "돌다리도 두드리는 마음", icon: "potion" },
  { id: "t7", stat: "temperance", keyword: "적응을 잘하는", description: "어디서든 자리를 찾는 유연함", icon: "hourglass" },
  { id: "t8", stat: "temperance", keyword: "내향적인", description: "조용히 자신을 채우는 사람", icon: "potion" },
  // transcendence
  { id: "x1", stat: "transcendence", keyword: "유머러스한", description: "분위기를 웃음으로 바꾸는 재주", icon: "star" },
  { id: "x2", stat: "transcendence", keyword: "재치있는", description: "상황을 가볍게 넘기는 센스", icon: "crystal" },
  { id: "x3", stat: "transcendence", keyword: "기지", description: "순간을 살리는 번뜩임", icon: "star" },
  { id: "x4", stat: "transcendence", keyword: "쾌활함", description: "밝은 기운이 퍼지는 사람", icon: "crystal" },
  { id: "x5", stat: "transcendence", keyword: "친화력", description: "누구와도 금방 가까워짐", icon: "star" },
  { id: "x6", stat: "transcendence", keyword: "외향적인", description: "사람 속에서 힘을 얻는 사람", icon: "crystal" },
  { id: "x7", stat: "transcendence", keyword: "이상주의적", description: "더 나은 세상을 그리는 마음", icon: "star" },
  { id: "x8", stat: "transcendence", keyword: "즉흥적인", description: "순간의 영감을 따르는 자유", icon: "crystal" },
  { id: "x9", stat: "transcendence", keyword: "다면적인", description: "여러 얼굴을 가진 풍부함", icon: "star" },
  { id: "x10", stat: "transcendence", keyword: "긍정적인", description: "내일을 밝게 보는 시선", icon: "crystal" },
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
  { id: "bard",      name: "음유시인", subtitle: "별의 노래", tags: "초월 · 창의 · 감사",   stat: "transcendence", image: bard.url,      description: "일상을 예술로 바꾸는 자. 모든 것에서 아름다움을 찾아냅니다." },
];

export const CHAR_BY_STAT: Record<StatKey, CharacterClass> = Object.fromEntries(
  CHARACTERS.map((c) => [c.stat, c])
) as Record<StatKey, CharacterClass>;

export function computeStats(cardIds: string[]): Record<StatKey, number> {
  const counts: Record<StatKey, number> = {
    wisdom: 0, courage: 0, humanity: 0, justice: 0, temperance: 0, transcendence: 0,
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
