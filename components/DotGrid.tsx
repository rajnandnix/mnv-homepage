"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { onPointer } from "@/lib/pointer";

const COLS = 16;
const ROWS = 12;
const RADIUS_PX = 120;

const pulseStyle = (i: number) =>
  ({ "--pd": `${3 + ((i * 13) % 5)}s`, "--pdelay": `${((i * 7) % 9) * 0.5}s` }) as CSSProperties;

// Decorative dot grid. Dots near the cursor grow and brighten; a few pulse on their own.
export default function DotGrid({ className = "" }: { className?: string }) {
  const grid = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = grid.current;
    if (!node) return;
    const dots = node.children;
    let active = new Set<number>();

    const reset = () => {
      active.forEach((i) => {
        const dot = dots[i] as HTMLElement;
        dot.style.scale = "";
        dot.style.opacity = "";
      });
      active = new Set();
    };

    const stop = onPointer((x, y) => {
      const rect = node.getBoundingClientRect();
      const inside =
        x > rect.left - RADIUS_PX && x < rect.right + RADIUS_PX && y > rect.top - RADIUS_PX && y < rect.bottom + RADIUS_PX;
      if (!inside) {
        if (active.size) reset();
        return;
      }
      const cw = rect.width / COLS;
      const ch = rect.height / ROWS;
      const next = new Set<number>();
      for (let r = 0; r < ROWS; r++) {
        for (let c = 0; c < COLS; c++) {
          const dx = rect.left + (c + 0.5) * cw - x;
          const dy = rect.top + (r + 0.5) * ch - y;
          const d = Math.hypot(dx, dy);
          if (d > RADIUS_PX) continue;
          const t = 1 - d / RADIUS_PX;
          const i = r * COLS + c;
          const dot = dots[i] as HTMLElement;
          dot.style.scale = String(1 + t * 2.4);
          dot.style.opacity = String(0.4 + t * 0.6);
          next.add(i);
        }
      }
      active.forEach((i) => {
        if (!next.has(i)) {
          const dot = dots[i] as HTMLElement;
          dot.style.scale = "";
          dot.style.opacity = "";
        }
      });
      active = next;
    });

    return () => {
      stop();
      reset();
    };
  }, []);

  return (
    <div
      ref={grid}
      aria-hidden="true"
      className={`dotgrid pointer-events-none ${className}`}
      style={{ "--cols": COLS } as CSSProperties}
    >
      {Array.from({ length: COLS * ROWS }, (_, i) => (
        <i key={i} className={i % 9 === 0 ? "pulse" : undefined} style={i % 9 === 0 ? pulseStyle(i) : undefined} />
      ))}
    </div>
  );
}
