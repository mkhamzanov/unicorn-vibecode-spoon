"use client";

import { useMemo } from "react";

export function StarField({ count = 90, seed = 12345 }: { count?: number; seed?: number }) {
  const stars = useMemo(() => {
    let s = seed;
    const rand = () => {
      s = (s * 9301 + 49297) % 233280;
      return s / 233280;
    };
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: rand() * 100,
      top: rand() * 100,
      size: 0.6 + rand() * 2.4,
      delay: rand() * 5,
      duration: 2.4 + rand() * 3.6,
      hue: Math.floor(rand() * 360),
    }));
  }, [count, seed]);

  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      {stars.map((s) => (
        <span
          key={s.id}
          className="star-twinkle absolute rounded-full"
          style={{
            left: `${s.left}%`,
            top: `${s.top}%`,
            width: `${s.size}px`,
            height: `${s.size}px`,
            background: s.size > 2 ? `hsl(${s.hue} 90% 80%)` : "white",
            animationDelay: `${s.delay}s`,
            animationDuration: `${s.duration}s`,
          }}
        />
      ))}
    </div>
  );
}
