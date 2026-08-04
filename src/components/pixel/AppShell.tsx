import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { PixelIcon } from "./PixelIcon";
import { PixelBackground } from "./PixelBackground";

type ShellProps = {
  children: ReactNode;
  title?: ReactNode;
  back?: string | (() => void);
  action?: ReactNode;
  hideHeader?: boolean;
};

export function AppShell({ children, title, back, action, hideHeader }: ShellProps) {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[430px] flex-col bg-transparent">
      <PixelBackground />

      {/* Logo bar — always visible, tap to go home */}
      <div className="relative z-20 flex h-11 items-center justify-center">
        <Link
          to="/"
          className="text-[15px] tracking-[0.14em] text-[var(--purple-glow)]"
          style={{ textShadow: "2px 2px 0 #0a0416, 0 0 12px rgba(168,85,247,0.5)" }}
        >
          ANIMA HATCH
        </Link>
      </div>

      {!hideHeader && (
        <header className="relative z-20 flex h-12 items-center justify-between px-3">
          <div className="w-10">
            {back ? (
              typeof back === "string" ? (
                <Link to={back} className="flex h-10 w-10 items-center justify-center text-[var(--fg)]">
                  <PixelIcon name="arrow" size={22} className="-scale-x-100" />
                </Link>
              ) : (
                <button onClick={back} aria-label="뒤로가기" className="flex h-10 w-10 items-center justify-center text-[var(--fg)]">
                  <PixelIcon name="arrow" size={22} className="-scale-x-100" />
                </button>
              )
            ) : null}
          </div>
          <div className="text-[14px] text-[var(--fg)]">{title}</div>
          <div className="w-10 flex items-center justify-end">{action}</div>
        </header>
      )}

      <main className="relative z-10 flex-1 px-4 pb-8">{children}</main>
    </div>
  );
}
