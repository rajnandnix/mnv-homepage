"use client";

import { useEffect, useRef } from "react";

type CountUpProps = {
  value: string;
  className?: string;
};

// "100+" counts from 0 once when it enters the viewport. The final value stays in the DOM for
// screen readers and for reduced-motion users.
export default function CountUp({ value, className = "" }: CountUpProps) {
  const visual = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const node = visual.current;
    if (!node || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const target = parseInt(value, 10);
    const suffix = value.replace(/^\d+/, "");
    node.textContent = `0${suffix}`;

    let frame = 0;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / 1400);
          node.textContent = `${Math.round(target * (1 - Math.pow(1 - t, 3)))}${suffix}`;
          if (t < 1) frame = requestAnimationFrame(tick);
        };
        frame = requestAnimationFrame(tick);
      },
      { threshold: 0.6 },
    );
    observer.observe(node);
    return () => {
      observer.disconnect();
      cancelAnimationFrame(frame);
    };
  }, [value]);

  return (
    <>
      <span className="sr-only">{value}</span>
      <span ref={visual} aria-hidden="true" className={className}>
        {value}
      </span>
    </>
  );
}
