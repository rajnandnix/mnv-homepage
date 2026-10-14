"use client";

import { useEffect, useId, useRef, type KeyboardEvent as ReactKeyboardEvent } from "react";
import Arrow from "@/components/Arrow";
import { nav, services } from "@/lib/content";
import { anchorClick, goTo } from "@/lib/navigation";
import { selectService } from "@/lib/service-selection";

type MegaMenuProps = {
  label: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNavigate: () => void;
};

const DESKTOP_QUERY = "(min-width: 1024px)";
const HOVER_CLOSE_DELAY_MS = 150;

const isDesktop = () => window.matchMedia(DESKTOP_QUERY).matches;

export default function MegaMenu({ label, open, onOpenChange, onNavigate }: MegaMenuProps) {
  const panelId = useId();
  const rootRef = useRef<HTMLLIElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const openedBy = useRef<"hover" | "click">("click");
  const closeTimer = useRef(0);

  useEffect(() => {
    if (!open) return;

    const onPointerDown = (event: PointerEvent) => {
      if (isDesktop() && !rootRef.current?.contains(event.target as Node)) onOpenChange(false);
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      const focusInside = rootRef.current?.contains(document.activeElement);
      onOpenChange(false);
      if (focusInside && isDesktop()) buttonRef.current?.focus();
    };
    document.addEventListener("pointerdown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("pointerdown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onOpenChange]);

  const select = (pillarId: string, serviceId: string | null) => {
    selectService(pillarId, serviceId);
    onNavigate();
    goTo("services");
  };

  const onArrowKeys = (event: ReactKeyboardEvent<HTMLLIElement>) => {
    if (!["ArrowDown", "ArrowUp", "Home", "End"].includes(event.key)) return;
    const panel = panelRef.current;
    const button = buttonRef.current;
    if (!panel || !button) return;
    const links = [...panel.querySelectorAll("a")].filter((link) => link.getClientRects().length > 0);

    if (event.target === button) {
      if (event.key !== "ArrowDown") return;
      event.preventDefault();
      openedBy.current = "click";
      const focusFirstLink = () => panel.querySelector("a")?.focus();
      if (open) {
        focusFirstLink();
      } else {
        onOpenChange(true);
        requestAnimationFrame(focusFirstLink);
      }
      return;
    }
    if (!panel.contains(event.target as Node)) return;

    event.preventDefault();
    const index = links.indexOf(document.activeElement as HTMLAnchorElement);
    if (event.key === "ArrowUp" && index <= 0) {
      button.focus();
      return;
    }
    const next = {
      ArrowDown: Math.min(index + 1, links.length - 1),
      ArrowUp: index - 1,
      Home: 0,
      End: links.length - 1,
    }[event.key as "ArrowDown" | "ArrowUp" | "Home" | "End"];
    links[next]?.focus();
  };

  return (
    <li
      ref={rootRef}
      onKeyDown={onArrowKeys}
      onPointerEnter={(event) => {
        if (event.pointerType !== "mouse" || !isDesktop()) return;
        window.clearTimeout(closeTimer.current);
        if (!open) {
          openedBy.current = "hover";
          onOpenChange(true);
        }
      }}
      onPointerLeave={(event) => {
        if (event.pointerType !== "mouse" || !isDesktop() || openedBy.current !== "hover") return;
        closeTimer.current = window.setTimeout(() => onOpenChange(false), HOVER_CLOSE_DELAY_MS);
      }}
      onBlur={(event) => {
        const next = event.relatedTarget;
        if (isDesktop() && next instanceof Node && !event.currentTarget.contains(next)) {
          onOpenChange(false);
        }
      }}
      className="border-b border-line lg:border-0"
    >
      <button
        ref={buttonRef}
        type="button"
        aria-expanded={open}
        aria-controls={panelId}
        onClick={() => {
          if (open && openedBy.current === "click") {
            onOpenChange(false);
            return;
          }
          openedBy.current = "click";
          onOpenChange(true);
        }}
        className="flex min-h-14 w-full items-center justify-between gap-2 text-h3 font-semibold lg:h-[var(--header-h)] lg:min-h-0 lg:w-auto lg:justify-start lg:text-body lg:font-normal"
      >
        <span className="nav-link">{label}</span>
        <svg
          aria-hidden="true"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          className={`transition-transform ${open ? "rotate-180" : ""}`}
        >
          <path
            d="M3 6l5 5 5-5"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      <div
        ref={panelRef}
        id={panelId}
        hidden={!open}
        className="glass-panel text-ink lg:absolute lg:inset-x-0 lg:top-full lg:border-b lg:border-line"
      >
        <div className="lg:wrap">
          <div className="grid gap-8 pb-6 lg:grid-cols-3 lg:gap-10 lg:py-10">
            {services.pillars.map((pillar) => (
              <div key={pillar.id}>
                <a
                  href="#services"
                  onClick={(event) => anchorClick(event, () => select(pillar.id, null))}
                  className="font-semibold text-brand hover:underline"
                >
                  {pillar.name}
                </a>
                <p className="mt-1 hidden text-small lg:block">{pillar.line}</p>
                <ul className="mt-3 flex flex-col gap-1 lg:mt-4">
                  {pillar.services.map((service) => (
                    <li key={service.id}>
                      <a
                        href="#services"
                        onClick={(event) => anchorClick(event, () => select(pillar.id, service.id))}
                        className="block py-1.5 hover:text-brand"
                      >
                        {service.name}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
          <div className="hidden border-t border-line py-4 lg:block">
            <a
              href="#services"
              onClick={(event) =>
                anchorClick(event, () => {
                  onNavigate();
                  goTo("services");
                })
              }
              className="u-link text-brand"
            >
              {nav.viewAllServices}
              <Arrow />
            </a>
          </div>
        </div>
      </div>
    </li>
  );
}
