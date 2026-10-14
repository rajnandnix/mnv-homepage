"use client";

import { useState, type CSSProperties } from "react";
import Arrow from "@/components/Arrow";
import SectionHeading from "@/components/SectionHeading";
import { testimonials } from "@/lib/content";

const EXTRA_ID = "testimonials-extra";

export default function Testimonials() {
  const [expanded, setExpanded] = useState(false);
  const { items, initialCount } = testimonials;

  return (
    <section
      id="testimonials"
      data-header-theme="light"
      aria-labelledby="testimonials-title"
      className="section defer-render bg-mist [--defer-h:1400px] md:[--defer-h:1050px] lg:[--defer-h:760px]"
    >
      <div className="wrap">
        <SectionHeading id="testimonials-title" lines={testimonials.headingLines} />

        <div className="mt-[clamp(32px,6vh,64px)] grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
          {items.map((item, index) => (
            <figure
              key={item.name}
              id={index === initialCount ? EXTRA_ID : undefined}
              hidden={index >= initialCount && !expanded}
              className="quote-card sd-card relative flex flex-col overflow-hidden rounded-panel bg-white p-8"
              data-sd="card"
              style={{ "--i": index % 3 } as CSSProperties}
            >
              <span aria-hidden="true" className="q-mark absolute right-6 top-4 select-none text-[6rem]">
                {"“"}
              </span>
              <blockquote className="relative">
                <p className="font-serif text-[1.375rem] italic leading-snug">{item.quote}</p>
              </blockquote>
              <figcaption className="relative mt-auto pt-6">
                <span className="block font-semibold">{item.name}</span>
                <span className="block text-small">
                  {item.role}, {item.company}
                </span>
              </figcaption>
            </figure>
          ))}
        </div>

        <button
          type="button"
          aria-expanded={expanded}
          aria-controls={EXTRA_ID}
          onClick={() => setExpanded((open) => !open)}
          className="u-link mt-12"
        >
          {expanded ? testimonials.showLess : testimonials.showMore}
          <Arrow />
        </button>
      </div>
    </section>
  );
}
