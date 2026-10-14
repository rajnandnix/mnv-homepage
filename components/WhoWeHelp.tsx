"use client";

import { useState, type CSSProperties } from "react";
import SectionHeading from "@/components/SectionHeading";
import { services, whoWeHelp } from "@/lib/content";
import { goTo } from "@/lib/navigation";
import { selectService } from "@/lib/service-selection";
import { tabKeyDown } from "@/lib/tabs";

const allServices = services.pillars.flatMap((pillar) =>
  pillar.services.map((service) => ({ ...service, pillarId: pillar.id })),
);

export default function WhoWeHelp() {
  const { audiences } = whoWeHelp;
  const [activeId, setActiveId] = useState(audiences[0].id);
  const active = audiences.find((audience) => audience.id === activeId) ?? audiences[0];
  const highlighted = active.serviceIds
    .map((id) => allServices.find((service) => service.id === id))
    .filter((service) => service !== undefined);

  return (
    <section
      id="who-we-help"
      data-header-theme="light"
      aria-labelledby="who-we-help-title"
      className="section defer-render pt-0 [--defer-h:1100px] md:[--defer-h:660px] lg:[--defer-h:600px]"
    >
      <div className="wrap">
        <SectionHeading id="who-we-help-title" lines={whoWeHelp.headingLines} />
        <p className="sd-up mt-6" data-sd="up">
          {whoWeHelp.line}
        </p>

        <div
          role="radiogroup"
          aria-labelledby="who-we-help-title"
          className="sd-up mt-10 flex flex-wrap gap-3"
          data-sd="up"
        >
          {audiences.map((audience, index) => {
            const selected = audience.id === activeId;
            return (
              <button
                key={audience.id}
                type="button"
                role="radio"
                aria-checked={selected}
                tabIndex={selected ? 0 : -1}
                onClick={() => setActiveId(audience.id)}
                onKeyDown={(event) =>
                  tabKeyDown(event, index, audiences.length, (next) => setActiveId(audiences[next].id))
                }
                className={`inline-flex h-11 items-center rounded-full border-2 border-brand px-5 font-semibold transition duration-200 active:scale-[0.98] hover:-translate-y-0.5 ${
                  selected ? "bg-brand text-white" : "hover:bg-mist"
                }`}
              >
                {audience.label}
              </button>
            );
          })}
        </div>

        <ul aria-live="polite" className="mt-10 grid gap-8 md:grid-cols-3">
          {highlighted.map((service, index) => (
            <li
              key={service.id}
              className="sd-card border-t border-line pt-6"
              data-sd="card"
              style={{ "--i": index } as CSSProperties}
            >
              <h3>
                <button
                  type="button"
                  onClick={() => {
                    selectService(service.pillarId, service.id);
                    goTo("services");
                  }}
                  className="u-link text-left"
                >
                  {service.name}
                </button>
              </h3>
              <p className="mt-3">{service.description}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
