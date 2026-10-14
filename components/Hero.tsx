"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import { preload } from "react-dom";
import Arrow from "@/components/Arrow";
import { hero } from "@/lib/content";
import { CONTACT_FIRST_FIELD_ID, anchorClick, goTo } from "@/lib/navigation";
import { onPointer } from "@/lib/pointer";

const MAX_PARALLAX_PX = 12;

const delay = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

export default function Hero() {
  const { image, imageSmall, avif, bg } = hero;
  const parallax = useRef<HTMLDivElement>(null);

  const wideAvif = `${bg.avif[0].src} ${bg.avif[0].width}w, ${bg.avif[1].src} ${bg.avif[1].width}w`;
  const wideWebp = `${bg.webp[0].src} ${bg.webp[0].width}w, ${bg.webp[1].src} ${bg.webp[1].width}w`;
  const tallAvif = `${avif.small.src} ${avif.small.width}w, ${avif.large.src} ${avif.large.width}w`;
  const tallWebp = `${imageSmall.src} ${imageSmall.width}w, ${image.src} ${image.width}w`;

  // The preload scanner does not find images inside <picture>, so name them in <head>.
  preload(bg.avif[1].src, {
    as: "image",
    type: "image/avif",
    media: "(min-width: 768px)",
    imageSrcSet: wideAvif,
    imageSizes: "100vw",
    fetchPriority: "high",
  });
  preload(avif.large.src, {
    as: "image",
    type: "image/avif",
    media: "(max-width: 767px)",
    imageSrcSet: tallAvif,
    imageSizes: "100vw",
    fetchPriority: "high",
  });

  useEffect(
    () =>
      onPointer((x, y) => {
        const node = parallax.current;
        if (!node) return;
        const dx = (x / window.innerWidth - 0.5) * -2 * MAX_PARALLAX_PX;
        const dy = (y / window.innerHeight - 0.5) * -2 * MAX_PARALLAX_PX;
        node.style.translate = `${dx.toFixed(1)}px ${dy.toFixed(1)}px`;
      }),
    [],
  );

  return (
    <section
      id="hero"
      data-header-theme="dark"
      aria-labelledby="hero-title"
      className="surface-dark relative h-[100vh] h-[100svh] overflow-hidden bg-ink text-white"
    >
      <div ref={parallax} aria-hidden="true" className="absolute -inset-4">
        <picture className="block h-full w-full">
          <source media="(min-width: 768px)" type="image/avif" srcSet={wideAvif} sizes="100vw" />
          <source media="(min-width: 768px)" type="image/webp" srcSet={wideWebp} sizes="100vw" />
          <source type="image/avif" srcSet={tallAvif} sizes="100vw" />
          <img
            src={image.src}
            srcSet={tallWebp}
            sizes="100vw"
            alt=""
            width={image.width}
            height={image.height}
            fetchPriority="high"
            decoding="async"
            className="hero-bg-in h-full w-full object-cover [transform:scaleX(-1)]"
          />
        </picture>
      </div>
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(100deg, rgba(36,26,51,0.9) 0%, rgba(59,35,88,0.8) 42%, rgba(83,50,120,0.45) 100%)",
        }}
      />
      <div aria-hidden="true" className="hero-grain pointer-events-none absolute inset-0" />

      <div className="wrap relative z-10 flex h-full flex-col justify-center pt-[var(--header-h)]">
        <div className="flex max-w-[46rem] flex-col gap-[clamp(10px,2.2vh,28px)]">
          <p className="text-[clamp(44px,min(8.5vw,12vh),128px)] font-bold leading-[1.02] tracking-[-0.03em]">
            <span className="hero-mask">
              <span className="hero-line block" style={delay(0)}>
                unlock your
              </span>
            </span>{" "}
            <span className="hero-mask">
              <span className="hero-line block" style={delay(120)}>
                growth
              </span>
            </span>
          </p>
          <h1
            id="hero-title"
            className="hero-rise max-w-[30em] text-[clamp(22px,min(3vw,4.4vh),46px)] leading-[1.12]"
            style={delay(480)}
          >
            {hero.heading}
          </h1>
          <p
            className="hero-rise max-w-[56ch] text-[clamp(15px,min(1.2vw,2.2vh),18px)] leading-[1.55] text-white/90"
            style={delay(600)}
          >
            {hero.text}
          </p>
          <div className="hero-rise mt-[clamp(0px,1vh,12px)] flex flex-wrap gap-3" style={delay(720)}>
            <a
              href={hero.primaryCta.href}
              onClick={(event) =>
                anchorClick(event, () => goTo(hero.primaryCta.href.slice(1), CONTACT_FIRST_FIELD_ID))
              }
              className="btn btn-white !h-[clamp(40px,6vh,48px)] !px-5 text-[15px] sm:text-base"
            >
              {hero.primaryCta.label}
              <Arrow />
            </a>
            <a
              href={hero.secondaryCta.href}
              onClick={(event) => anchorClick(event, () => goTo(hero.secondaryCta.href.slice(1)))}
              className="btn btn-glass !h-[clamp(40px,6vh,48px)] !px-5 text-[15px] sm:text-base"
            >
              {hero.secondaryCta.label}
            </a>
          </div>
        </div>
      </div>

      <div className="hero-cue absolute inset-x-0 bottom-[clamp(10px,3vh,28px)] z-10">
        <div className="wrap flex items-center gap-3 text-small text-white/85">
          <span aria-hidden="true" className="cue-line">
            <i className="cue-dot" />
          </span>
          {hero.scrollCue}
        </div>
      </div>
    </section>
  );
}
