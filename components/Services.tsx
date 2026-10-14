"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import Arrow from "@/components/Arrow";
import SectionHeading from "@/components/SectionHeading";
import WordFill from "@/components/WordFill";
import { services } from "@/lib/content";
import { CONTACT_FIRST_FIELD_ID, anchorClick, goTo } from "@/lib/navigation";
import { useServiceSelection } from "@/lib/service-selection";
import { tabKeyDown } from "@/lib/tabs";

function ToggleIcon({ open }: { open: boolean }) {
  return (
    <svg aria-hidden="true" width="20" height="20" viewBox="0 0 20 20" fill="none" className="row-icon shrink-0">
      <path
        d={open ? "M4 10h12" : "M4 10h12M10 4v12"}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function Services() {
  const { pillars } = services;
  const [activeId, setActiveId] = useState(pillars[0].id);
  const [openIds, setOpenIds] = useState<string[]>([]);
  const [highlightId, setHighlightId] = useState<string | null>(null);
  const [handledRequest, setHandledRequest] = useState(0);
  const tabScroller = useRef<HTMLDivElement>(null);
  const selection = useServiceSelection();

  if (selection && selection.requestId !== handledRequest) {
    setHandledRequest(selection.requestId);
    setActiveId(selection.pillarId);
    setHighlightId(selection.serviceId);
    setOpenIds(selection.serviceId ? [selection.serviceId] : []);
  }

  const activeIndex = pillars.findIndex((pillar) => pillar.id === activeId);

  const tabChanged = useRef(false);
  useEffect(() => {
    if (!tabChanged.current) {
      tabChanged.current = true;
      return;
    }
    const scroller = tabScroller.current;
    const tab = scroller?.querySelector<HTMLElement>('[aria-selected="true"]');
    if (!scroller || !tab) return;
    const tabLeft = tab.getBoundingClientRect().left - scroller.getBoundingClientRect().left + scroller.scrollLeft;
    scroller.scrollTo({ left: Math.max(0, tabLeft - (scroller.clientWidth - tab.offsetWidth) / 2) });
  }, [activeId]);

  const chooseTab = (id: string) => {
    setActiveId(id);
    setHighlightId(null);
  };

  const toggleRow = (id: string) => {
    setHighlightId(null);
    setOpenIds((ids) => (ids.includes(id) ? ids.filter((open) => open !== id) : [...ids, id]));
  };

  return (
    <section
      id="services"
      data-header-theme="light"
      aria-labelledby="services-title"
      className="section defer-render [--defer-h:900px] lg:[--defer-h:880px]"
    >
      <div className="wrap">
        <SectionHeading id="services-title" lines={services.headingLines} />
        <WordFill text={services.intro} className="mt-[clamp(16px,3vh,32px)] max-w-[56ch] text-h3 font-light" />

        <div
          ref={tabScroller}
          className="-mx-[var(--gutter)] mt-[clamp(32px,6vh,64px)] overflow-x-auto px-[var(--gutter)] pb-4 [scrollbar-width:none] motion-safe:scroll-smooth md:mx-0 md:px-0 [&::-webkit-scrollbar]:hidden"
        >
          <div
            role="tablist"
            aria-label={services.tabsLabel}
            className="relative grid min-w-[1020px] grid-cols-3 md:min-w-0"
            style={{ "--i": activeIndex } as CSSProperties}
          >
            {pillars.map((pillar, index) => {
              const selected = pillar.id === activeId;
              return (
                <button
                  key={pillar.id}
                  type="button"
                  role="tab"
                  id={`services-tab-${pillar.id}`}
                  aria-selected={selected}
                  aria-controls={`services-panel-${pillar.id}`}
                  tabIndex={selected ? 0 : -1}
                  onClick={() => chooseTab(pillar.id)}
                  onKeyDown={(event) =>
                    tabKeyDown(event, index, pillars.length, (next) => chooseTab(pillars[next].id))
                  }
                  className={`tab whitespace-nowrap py-5 pr-6 text-h3 font-semibold ${
                    selected ? "text-brand" : "text-ink"
                  }`}
                >
                  {pillar.name}
                </button>
              );
            })}
            <span aria-hidden="true" className="tab-base" />
            <span aria-hidden="true" className="tab-dot" />
          </div>
        </div>

        {pillars.map((pillar) => (
          <div
            key={pillar.id}
            role="tabpanel"
            id={`services-panel-${pillar.id}`}
            aria-labelledby={`services-tab-${pillar.id}`}
            hidden={pillar.id !== activeId}
            className="grid gap-8 pt-[clamp(24px,5vh,48px)] lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-16"
          >
            <div className="sd-left" data-sd="left">
              <p className="text-h3">{pillar.line}</p>
              <a
                href="#contact"
                onClick={(event) =>
                  anchorClick(event, () => goTo("contact", CONTACT_FIRST_FIELD_ID))
                }
                className="u-link mt-8 text-brand"
              >
                {services.discover}
                <Arrow />
              </a>
            </div>
            <div className="sd-right" data-sd="right">
              <ul className="border-t border-line">
                {pillar.services.map((service) => {
                  const open = openIds.includes(service.id);
                  const highlighted = highlightId === service.id;
                  return (
                    <li
                      key={service.id}
                      className={`row isolate border-b border-line ${
                        highlighted
                          ? "before:absolute before:inset-y-0 before:-inset-x-4 before:-z-10 before:rounded-image before:bg-mist"
                          : ""
                      }`}
                    >
                      <h3>
                        <button
                          type="button"
                          id={`service-${service.id}`}
                          aria-expanded={open}
                          aria-controls={`service-${service.id}-description`}
                          onClick={() => toggleRow(service.id)}
                          className="block w-full py-5 text-left font-semibold"
                        >
                          <span className="row-title">
                            <span>{service.name}</span>
                            <ToggleIcon open={open} />
                          </span>
                        </button>
                      </h3>
                      <span aria-hidden="true" className="row-dot" />
                      <div
                        id={`service-${service.id}-description`}
                        role="region"
                        aria-labelledby={`service-${service.id}`}
                        className={`grid transition-[grid-template-rows] duration-500 ease-out motion-reduce:transition-none ${
                          open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                        }`}
                      >
                        <div inert={!open} className="overflow-hidden">
                          <p className="pb-6">{service.description}</p>
                        </div>
                      </div>
                    </li>
                  );
                })}
              </ul>
              <p className="mt-6 text-small">
                {services.alsoLabel}: {pillar.also.join(", ")}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
