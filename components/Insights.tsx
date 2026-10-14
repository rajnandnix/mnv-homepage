"use client";

import { useRef, useState, type CSSProperties } from "react";
import InsightModal from "@/components/InsightModal";
import SectionHeading from "@/components/SectionHeading";
import { insights } from "@/lib/content";

type InsightItem = (typeof insights.items)[number];

const IMAGE_SIZES =
  "(min-width: 1280px) 373px, (min-width: 1024px) 30vw, (min-width: 768px) 290px, calc(100vw - 48px)";

export default function Insights() {
  const [selected, setSelected] = useState<InsightItem | null>(null);
  const trigger = useRef<HTMLButtonElement | null>(null);

  const closeModal = () => {
    setSelected(null);
    trigger.current?.focus({ preventScroll: true });
  };

  return (
    <section
      id="insights"
      data-header-theme="light"
      aria-labelledby="insights-title"
      className="section defer-render [--defer-h:1580px] md:[--defer-h:1020px] lg:[--defer-h:820px]"
    >
      <div className="wrap">
        <SectionHeading id="insights-title" lines={insights.headingLines} />
        <p className="sd-up mt-6" data-sd="up">
          {insights.intro}
        </p>

        <div className="mt-[clamp(32px,6vh,64px)] grid gap-12 lg:grid-cols-3 lg:gap-10">
          {insights.items.map((item, index) => (
            <article
              key={item.id}
              className="sd-card group relative flex flex-col gap-5 md:flex-row md:gap-8 lg:flex-col lg:gap-5"
              data-sd="card"
              style={{ "--i": index } as CSSProperties}
            >
              <div
                className="frame frame-tint sd-wipe aspect-[4/3] w-full md:w-[42%] md:self-start lg:w-full"
                data-sd="wipe"
              >
                <div className="sd-parallax">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image.src}
                    srcSet={`${item.imageSmall.src} ${item.imageSmall.width}w, ${item.image.src} ${item.image.width}w`}
                    sizes={IMAGE_SIZES}
                    alt={item.image.alt}
                    width={item.image.width}
                    height={item.image.height}
                    loading="lazy"
                    decoding="async"
                    className="frame-img frame-zoom sd-zoom"
                  />
                </div>
              </div>
              <div className="md:flex-1">
                <p className="text-small">{item.categories.join(", ")}</p>
                <h3 className="mt-2">
                  <button
                    type="button"
                    onClick={(event) => {
                      trigger.current = event.currentTarget;
                      setSelected(item);
                    }}
                    className="text-left font-semibold transition-colors after:absolute after:inset-0 after:rounded-image hover:text-brand focus-visible:text-brand focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-offset-2 focus-visible:after:outline-brand"
                  >
                    {item.title}
                  </button>
                </h3>
                <p className="mt-3 text-small">
                  <time dateTime={item.isoDate}>{item.date}</time> · {item.readTime}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>

      {selected && <InsightModal item={selected} onClose={closeModal} />}
    </section>
  );
}
