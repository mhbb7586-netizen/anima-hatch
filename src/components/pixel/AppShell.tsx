import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { PixelIcon } from "./PixelIcon";
import { PixelBackground } from "./PixelBackground";
import { cn } from "@/lib/utils";

type ShellProps = {
  children: ReactNode;
  title?: ReactNode;
  back?: string | (() => void);
  action?: ReactNode;
  hideHeader?: boolean;
  /** Long screens (the result page) may scroll vertically. */
  scroll?: boolean;
};

export function AppShell({ children, title, back, action, hideHeader, scroll }: ShellProps) {
  return (
    <div
      className="mx-auto flex w-full max-w-[430px] flex-col bg-transparent"
      style={{
        // dvh follows the browser UI; svh/lvh act as progressive fallbacks
        height: "100svh",
        maxHeight: "100dvh",
        minHeight: "100svh",
        paddingTop: "env(safe-area-inset-top)",
      }}
    >
      <PixelBackground />

      {/* Logo bar — always visible, tap to go home */}
      <div className="relative z-20 flex h-10 shrink-0 items-center justify-center">
        <Link
          to="/"
          className="text-[15px] tracking-[0.14em] text-[var(--purple-glow)]"
          style={{ textShadow: "2px 2px 0 #0a0416, 0 0 12px rgba(168,85,247,0.5)" }}
        >
          ANIMA HATCH
        </Link>
      </div>

      {!hideHeader && (
        <header className="relative z-20 flex h-11 shrink-0 items-center justify-between px-3">
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

      <main
        className={cn(
          "relative z-10 min-h-0 flex-1 px-4",
          scroll ? "overflow-y-auto" : "overflow-y-auto",
        )}
        style={{
          paddingBottom: "calc(env(safe-area-inset-bottom) + 12px)",
          WebkitOverflowScrolling: "touch",
          overscrollBehavior: "contain",
        }}
      >
        {children}
      </main>
    </div>
  );
}
