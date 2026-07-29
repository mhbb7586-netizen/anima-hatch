import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { PixelIcon } from "./PixelIcon";
import { PixelBottomNav } from "./PixelBottomNav";
import { PixelBackground } from "./PixelBackground";

type ShellProps = {
  children: ReactNode;
  title?: ReactNode;
  back?: string | (() => void);
  action?: ReactNode;
  showNav?: boolean;
  hideHeader?: boolean;
};

export function AppShell({ children, title, back, action, showNav = true, hideHeader }: ShellProps) {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[420px] flex-col bg-transparent">
      <PixelBackground />
      {!hideHeader && (
        <header className="relative z-20 flex h-14 items-center justify-between px-3">
          <div className="w-10">
            {back ? (
              typeof back === "string" ? (
                <Link to={back} className="flex h-10 w-10 items-center justify-center text-[var(--fg)]">
                  <PixelIcon name="arrow" size={22} className="-scale-x-100" />
                </Link>
              ) : (
                <button onClick={back} className="flex h-10 w-10 items-center justify-center text-[var(--fg)]">
                  <PixelIcon name="arrow" size={22} className="-scale-x-100" />
                </button>
              )
            ) : null}
          </div>
          <div className="text-[14px] text-[var(--fg)]">{title}</div>
          <div className="w-10 flex items-center justify-end">{action}</div>
        </header>
      )}
      <main className="relative z-10 flex-1 px-4 pb-4">{children}</main>
      {showNav && <PixelBottomNav />}
    </div>
  );
}
