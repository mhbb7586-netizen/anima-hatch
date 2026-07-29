import { useEffect, useState } from "react";

/** Animated star + fog + particle backdrop for the whole app */
export function PixelBackground() {
  const [stars, setStars] = useState<{ x: number; y: number; s: number; d: number }[]>([]);
  const [particles, setParticles] = useState<{ x: number; y: number; d: number }[]>([]);

  useEffect(() => {
    const s = Array.from({ length: 60 }).map(() => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      s: Math.random() < 0.3 ? 3 : 2,
      d: Math.random() * 3,
    }));
    setStars(s);
    const p = Array.from({ length: 14 }).map(() => ({
      x: Math.random() * 100,
      y: Math.random() * 100,
      d: Math.random() * 6,
    }));
    setParticles(p);
  }, []);

  return (
    <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden>
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(120% 80% at 50% 0%, #2a1b4a 0%, #1a1035 55%, #0a0416 100%)",
        }}
      />
      {/* stars */}
      {stars.map((st, i) => (
        <div
          key={i}
          className="absolute animate-star"
          style={{
            left: `${st.x}%`,
            top: `${st.y}%`,
            width: st.s,
            height: st.s,
            background: "#e9d5ff",
            animationDelay: `${st.d}s`,
            boxShadow: st.s === 3 ? "0 0 4px #d8b4fe" : undefined,
          }}
        />
      ))}
      {/* fog bands */}
      <div
        className="absolute inset-x-[-20%] top-[30%] h-40 opacity-40 animate-drift-fog"
        style={{
          background:
            "radial-gradient(closest-side, rgba(168,85,247,0.35), transparent 70%)",
        }}
      />
      <div
        className="absolute inset-x-[-20%] top-[60%] h-52 opacity-30 animate-drift-fog"
        style={{
          background:
            "radial-gradient(closest-side, rgba(139,92,246,0.35), transparent 70%)",
          animationDelay: "-6s",
        }}
      />
      {/* floating pixel particles */}
      {particles.map((p, i) => (
        <div
          key={i}
          className="absolute w-[3px] h-[3px] animate-float-slow"
          style={{
            left: `${p.x}%`,
            top: `${p.y}%`,
            background: i % 2 ? "#d8b4fe" : "#a855f7",
            animationDelay: `${p.d}s`,
            boxShadow: "0 0 4px #a855f7",
          }}
        />
      ))}
    </div>
  );
}
