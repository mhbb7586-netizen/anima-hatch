import type { ReactNode } from "react";

/** Glowing magic-circle base for characters/eggs */
export function MagicCircle({ size = 240, children, glowColor = "var(--purple)" }: { size?: number; children?: ReactNode; glowColor?: string }) {
  return (
    <div className="relative mx-auto" style={{ width: size, height: size }}>
      {/* rotating outer ring */}
      <div
        className="absolute inset-0 animate-spin-slow"
        style={{
          background: `
            conic-gradient(from 0deg,
              transparent 0deg, ${glowColor} 20deg, transparent 60deg,
              transparent 120deg, ${glowColor} 140deg, transparent 180deg,
              transparent 240deg, ${glowColor} 260deg, transparent 300deg)`,
          maskImage: "radial-gradient(circle, transparent 42%, black 44%, black 50%, transparent 52%)",
          WebkitMaskImage: "radial-gradient(circle, transparent 42%, black 44%, black 50%, transparent 52%)",
          filter: "drop-shadow(0 0 12px " + glowColor + ")",
          opacity: 0.9,
        }}
      />
      {/* inner ring counter-rotating */}
      <div
        className="absolute inset-6 animate-spin-slow"
        style={{
          animationDirection: "reverse",
          animationDuration: "8s",
          background: `conic-gradient(from 45deg, ${glowColor}, transparent 40deg, ${glowColor} 120deg, transparent 160deg, ${glowColor} 240deg, transparent 280deg)`,
          maskImage: "radial-gradient(circle, transparent 60%, black 62%, black 66%, transparent 68%)",
          WebkitMaskImage: "radial-gradient(circle, transparent 60%, black 62%, black 66%, transparent 68%)",
          opacity: 0.7,
        }}
      />
      {/* rune specks */}
      {Array.from({ length: 12 }).map((_, i) => (
        <div
          key={i}
          className="absolute w-[4px] h-[4px] animate-sparkle"
          style={{
            left: "50%",
            top: "50%",
            background: glowColor,
            transform: `translate(-50%, -50%) rotate(${i * 30}deg) translateY(-${size / 2 - 10}px)`,
            animationDelay: `${i * 0.15}s`,
            boxShadow: `0 0 6px ${glowColor}`,
          }}
        />
      ))}
      <div className="absolute inset-0 flex items-center justify-center">{children}</div>
    </div>
  );
}
