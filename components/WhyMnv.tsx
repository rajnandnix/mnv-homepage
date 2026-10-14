"use client";

import Image from "next/image";
import { useState, type CSSProperties } from "react";
import CountUp from "@/components/CountUp";
import SectionHeading from "@/components/SectionHeading";
import WordFill from "@/components/WordFill";
import { whyMnv } from "@/lib/content";
import { tabKeyDown } from "@/lib/tabs";

export default function WhyMnv() {
  const { circle } = whyMnv;
  const [activeIndex, setActiveIndex] = useState(0);
  const active = circle.values[activeIndex];

  return (
    <section
      id="why-mnv"
      data-header-theme="light"
      aria-labelledby="why-mnv-title"
      className="section defer-render bg-mist [--defer-h:2000px] md:[--defer-h:1700px] lg:[--defer-h:1300px]"
    >
      <div className="wrap">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,5fr)_minmax(0,6fr)] lg:gap-20">
          <div className="lg:self-start [@media(min-height:720px)]:lg:sticky [@media(min-height:720px)]:lg:top-[calc(var(--header-h)+24px)]">
            <SectionHeading id="why-mnv-title" lines={whyMnv.headingLines} />
            <WordFill text={whyMnv.credentials} className="mt-[clamp(14px,2.5vh,24px)] text-h3 font-light" />
            <ul className="mt-[clamp(20px,4vh,40px)] flex gap-10 sm:gap-16">
              {whyMnv.stats.map((stat) => (
                <li key={stat.label}>
                  <CountUp value={stat.value} className="block text-h1 font-semibold text-brand" />
                  <span className="block">{stat.label}</span>
                </li>
              ))}
            </ul>

            <div className="mt-[clamp(24px,5vh,56px)]">
              <p className="text-h3 font-semibold">{circle.intro}</p>
              <div role="tablist" aria-label={circle.intro} className="mt-5 flex gap-2 sm:gap-3">
                {circle.values.map((value, index) => {
                  const selected = index === activeIndex;
                  return (
                    <button
                      key={`${value.letter}-${index}`}
                      type="button"
                      role="tab"
                      id={`circle-tab-${index}`}
                      aria-label={value.name}
                      aria-selected={selected}
                      aria-controls="circle-panel"
                      tabIndex={selected ? 0 : -1}
                      onClick={() => setActiveIndex(index)}
                      onKeyDown={(event) =>
                        tabKeyDown(event, index, circle.values.length, setActiveIndex)
                      }
                      className={`flex h-11 w-11 items-center justify-center rounded-full border-2 border-brand text-h3 font-bold transition duration-200 active:scale-[0.96] hover:-translate-y-1 sm:h-14 sm:w-14 ${
                        selected ? "bg-brand text-white" : "bg-white"
                      }`}
                    >
                      {value.letter}
                    </button>
                  );
                })}
              </div>
              <div
                role="tabpanel"
                id="circle-panel"
                aria-labelledby={`circle-tab-${activeIndex}`}
                className="mt-6"
              >
                <h3>{active.name}</h3>
                <p className="mt-2">{active.text}</p>
              </div>
            </div>
          </div>

          <div className="why-track relative pl-8 lg:pl-12">
            <div aria-hidden="true" className="why-line">
              <span className="why-dot" />
            </div>
            <ul>
              {whyMnv.differentiators.map((item, index) => (
                <li
                  key={item.title}
                  className="sd-right py-10 first:pt-2 lg:flex lg:min-h-[44vh] lg:flex-col lg:justify-center"
                  data-sd="right"
                  style={{ "--i": index } as CSSProperties}
                >
                  <h3>{item.title}</h3>
                  <p className="mt-3">{item.text}</p>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <ul className="mt-16 flex flex-wrap gap-x-12 gap-y-6 border-t border-lilac pt-8">
          {whyMnv.partners.map((partner) => (
            <li key={partner.name} className="group flex items-center gap-4">
              <span className="frame w-14 shrink-0">
                <Image
                  src={partner.photo.src}
                  alt={partner.photo.alt}
                  width={partner.photo.width}
                  height={partner.photo.height}
                  className="frame-img frame-color h-auto w-14"
                />
              </span>
              <div>
                <p className="font-semibold">{partner.name}</p>
                <p className="text-small">{partner.role}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
