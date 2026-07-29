import { Link, useRouterState } from "@tanstack/react-router";
import { PixelIcon } from "./PixelIcon";
import { cn } from "@/lib/utils";

const items: { to: string; label: string; icon: string; match: (p: string) => boolean }[] = [
  { to: "/", label: "홈", icon: "home", match: (p) => p === "/" },
  { to: "/result", label: "결과", icon: "eye", match: (p) => p.startsWith("/result") || p.startsWith("/hatch") },
  { to: "/character", label: "캐릭터", icon: "ghost", match: (p) => p.startsWith("/character") },
  { to: "/mypage", label: "마이페이지", icon: "mask", match: (p) => p.startsWith("/mypage") },
];

export function PixelBottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav
      className="relative z-30 grid grid-cols-4 bg-[var(--bg-deep)]"
      style={{
        boxShadow: "inset 0 3px 0 0 var(--pixel-border), 0 -3px 0 0 #0a0416",
      }}
    >
      {items.map((it) => {
        const active = it.match(pathname);
        return (
          <Link
            key={it.to}
            to={it.to}
            className={cn(
              "flex flex-col items-center gap-1 py-3 text-[10px] transition-colors",
              active ? "text-[var(--purple-glow)]" : "text-[var(--fg)]/50",
            )}
          >
            <span className={cn("flex items-center justify-center", active && "animate-glow-pulse")}>
              <PixelIcon name={it.icon} size={26} />
            </span>
            <span>{it.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
