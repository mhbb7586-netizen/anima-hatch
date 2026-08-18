import { STAT_KEYS, STATS, type StatKey } from "@/lib/game/data";

type Args = {
  nickname: string;
  character: { name: string; subtitle: string; image: string };
  statLabel: string;
  statHex: string;
  scores: Record<StatKey, number>;
};

/** Draws the character + stat bars onto a canvas and saves it as a PNG. */
export async function downloadResultCard({ nickname, character, statLabel, statHex, scores }: Args) {
  const w = 720, h = 1120;
  const canvas = document.createElement("canvas");
  canvas.width = w; canvas.height = h;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;
  ctx.imageSmoothingEnabled = false;

  // backdrop + pixel frame
  ctx.fillStyle = "#1a1035";
  ctx.fillRect(0, 0, w, h);
  ctx.fillStyle = "#0a0416";
  ctx.fillRect(0, 0, w, 14); ctx.fillRect(0, h - 14, w, 14);
  ctx.fillRect(0, 0, 14, h); ctx.fillRect(w - 14, 0, 14, h);
  ctx.strokeStyle = "#7c5cc9";
  ctx.lineWidth = 6;
  ctx.strokeRect(26, 26, w - 52, h - 52);

  const font = '"Galmuri11", monospace';
  ctx.textAlign = "center";

  ctx.fillStyle = "#d8b4fe";
  ctx.font = `26px ${font}`;
  ctx.fillText("ANIMA HATCH", w / 2, 86);

  ctx.fillStyle = statHex;
  ctx.font = `24px ${font}`;
  ctx.fillText(`${statLabel}의 결`, w / 2, 132);

  // character sprite
  const sprite = await loadImage(character.image).catch(() => null);
  if (sprite) {
    const boxH = 380;
    const ratio = sprite.width / sprite.height;
    const dh = boxH, dw = dh * ratio;
    ctx.drawImage(sprite, (w - dw) / 2, 160, dw, dh);
  }

  ctx.fillStyle = "#d8b4fe";
  ctx.font = `46px ${font}`;
  ctx.fillText(character.name, w / 2, 610);
  ctx.fillStyle = "#f4ecff";
  ctx.font = `22px ${font}`;
  ctx.fillText(`${nickname}님의 결과 · ${character.subtitle}`, w / 2, 650);

  // stat bars
  const max = Math.max(...STAT_KEYS.map((k) => scores[k]), 1);
  let y = 710;
  ctx.textAlign = "left";
  for (const k of STAT_KEYS) {
    const info = STATS[k];
    ctx.fillStyle = "#f4ecff";
    ctx.font = `22px ${font}`;
    ctx.fillText(info.label, 70, y + 20);
    const bx = 210, bw = 400, bh = 24;
    ctx.fillStyle = "#0a0416";
    ctx.fillRect(bx, y, bw, bh);
    ctx.fillStyle = info.hex;
    ctx.fillRect(bx, y, Math.round((scores[k] / max) * bw), bh);
    ctx.fillStyle = "#f4ecff";
    ctx.fillText(String(scores[k]), bx + bw + 16, y + 20);
    y += 44;
  }

  ctx.textAlign = "center";
  ctx.fillStyle = "#b7a8dc";
  ctx.font = `18px ${font}`;
  ctx.fillText("나와 친구의 선택을 기반으로 계산된 결과에요", w / 2, h - 60);

  const link = document.createElement("a");
  link.download = `anima-hatch-${character.name}.png`;
  link.href = canvas.toDataURL("image/png");
  link.click();
}

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}
