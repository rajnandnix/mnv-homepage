"use client";

import Image from "next/image";
import type { ReactNode } from "react";
import { brand, contact, footer, services } from "@/lib/content";
import { anchorClick, goTo } from "@/lib/navigation";
import { selectService } from "@/lib/service-selection";

const SOCIAL_ICONS: Record<string, ReactNode> = {
  linkedin: (
    <>
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
      <rect x="2" y="9" width="4" height="12" />
      <circle cx="4" cy="4" r="2" />
    </>
  ),
  facebook: <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />,
  x: <path d="M4 4l16 16M20 4L4 20" />,
  youtube: (
    <>
      <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z" />
      <path d="M9.75 15.02l5.75-3.27-5.75-3.27v6.54z" />
    </>
  ),
  instagram: (
    <>
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <path d="M17.5 6.5h.01" />
    </>
  ),
};

const linkClass = "block py-1.5 text-white/90 transition-transform duration-300 hover:translate-x-1 focus-visible:translate-x-1";

function TaglineGroup({ hidden = false }: { hidden?: boolean }) {
  return (
    <div aria-hidden={hidden || undefined} className="flex shrink-0 items-center gap-[0.35em] pr-[0.35em]">
      {[0, 1, 2].map((i) => (
        <span key={i} className="flex items-center gap-[0.35em]">
          <span>{footer.tagline}</span>
          <span className="size-[0.12em] rounded-full bg-lilac" />
        </span>
      ))}
    </div>
  );
}

export default function Footer() {
  return (
    <footer
      data-header-theme="dark"
      className="surface-dark defer-render bg-ink text-white [--defer-h:1400px] md:[--defer-h:1000px] lg:[--defer-h:760px]"
    >
      <div aria-hidden="true" className="marquee border-b border-white/10 py-[clamp(20px,4vh,40px)]">
        <div
          className="marquee-track text-[clamp(56px,8vw,120px)] font-light leading-none tracking-[-0.03em] text-lilac"
          style={{ "--marquee-s": "70s" } as React.CSSProperties}
        >
          <TaglineGroup />
          <TaglineGroup hidden />
        </div>
      </div>

      <div className="wrap py-16 lg:py-20">
        <div className="grid gap-12 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1.4fr_auto] lg:gap-12">
          <div>
            <Image
              src={brand.logoFooter.src}
              alt={brand.logoFooter.alt}
              width={brand.logoFooter.width}
              height={brand.logoFooter.height}
              className="h-24 w-auto"
            />
            <p className="mt-4 font-semibold text-lilac">{footer.tagline}</p>
          </div>

          <nav aria-label={footer.columns.services}>
            <p className="font-semibold">{footer.columns.services}</p>
            <ul className="mt-3">
              {services.pillars.map((pillar) => (
                <li key={pillar.id}>
                  <a
                    href="#services"
                    onClick={(event) =>
                      anchorClick(event, () => {
                        selectService(pillar.id);
                        goTo("services");
                      })
                    }
                    className={linkClass}
                  >
                    {pillar.name}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-label={footer.columns.company}>
            <p className="font-semibold">{footer.columns.company}</p>
            <ul className="mt-3">
              {footer.companyLinks.map((link) => (
                <li key={link.href}>
                  <a
                    href={link.href}
                    onClick={(event) => anchorClick(event, () => goTo(link.href.slice(1)))}
                    className={linkClass}
                  >
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div>
            <p className="font-semibold">{footer.columns.contact}</p>
            <address className="mt-3 not-italic">
              <p className="py-1.5 text-white/90">{contact.office.address}</p>
              <ul>
                {contact.office.phones.map((phone) => (
                  <li key={phone.href}>
                    <a href={phone.href} className={linkClass}>
                      {phone.label}
                    </a>
                  </li>
                ))}
                <li>
                  <a href={contact.office.email.href} className={linkClass}>
                    {contact.office.email.label}
                  </a>
                </li>
              </ul>
            </address>
          </div>

          <div>
            <p className="font-semibold">{footer.columns.social}</p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {footer.social.map((item) => (
                <li key={item.id}>
                  <a
                    href={item.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${brand.name} on ${item.label}, ${footer.newTab}`}
                    className="flex h-11 w-11 items-center justify-center rounded-full border border-lilac text-white transition duration-300 hover:-translate-y-1 hover:border-brand hover:bg-brand focus-visible:-translate-y-1 focus-visible:bg-brand active:scale-[0.96]"
                  >
                    <svg
                      aria-hidden="true"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      {SOCIAL_ICONS[item.id]}
                    </svg>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-14 border-t border-white/15 pt-8">
          <p className="text-small text-lilac">{footer.legal}</p>
        </div>
      </div>
    </footer>
  );
}
