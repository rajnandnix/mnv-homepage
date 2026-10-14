"use client";

import { useEffect } from "react";

// Only does work in browsers without CSS scroll-driven animations: a reversible
// IntersectionObserver fallback for [data-sd] elements and a scroll progress value.
export default function ScrollEffects() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const root = document.documentElement;
    // The faint word-fill state only switches on once the visitor starts scrolling, so the text
    // is at full contrast until then.
    const goLive = () => root.classList.add("sd-live");
    window.addEventListener("scroll", goLive, { once: true, passive: true });
    if (CSS.supports("animation-timeline: view()")) {
      return () => window.removeEventListener("scroll", goLive);
    }
    root.classList.add("sd-io");

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add("is-in");
          else if (entry.boundingClientRect.top > 0) entry.target.classList.remove("is-in");
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" },
    );
    document.querySelectorAll("[data-sd]").forEach((node) => observer.observe(node));

    let frame = 0;
    const onScroll = () => {
      if (frame) return;
      frame = requestAnimationFrame(() => {
        frame = 0;
        const max = root.scrollHeight - window.innerHeight;
        root.style.setProperty("--p", String(max > 0 ? window.scrollY / max : 0));
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("scroll", goLive);
      root.classList.remove("sd-io");
    };
  }, []);

  return <div aria-hidden="true" className="progress" />;
}
