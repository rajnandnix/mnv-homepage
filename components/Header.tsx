"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import MegaMenu from "@/components/MegaMenu";
import MobileNav from "@/components/MobileNav";
import { brand, nav } from "@/lib/content";
import { CONTACT_FIRST_FIELD_ID, anchorClick, goTo, scrollToTop } from "@/lib/navigation";

const NAV_ID = "site-nav";
const GLASS_AFTER_PX = 80;

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesOpen, setServicesOpen] = useState(false);
  const [glass, setGlass] = useState(false);
  const [tone, setTone] = useState<"light" | "dark">("dark");

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      setGlass(window.scrollY > GLASS_AFTER_PX);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    frame = requestAnimationFrame(update);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  useEffect(() => {
    // Watch the strip of the viewport under the header and take the theme of the section there.
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTone(entry.target.getAttribute("data-header-theme") === "dark" ? "dark" : "light");
          }
        });
      },
      { rootMargin: "0px 0px -92% 0px" },
    );
    document.querySelectorAll("[data-header-theme]").forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, []);

  const closeMenu = useCallback(() => {
    setMenuOpen(false);
    setServicesOpen(false);
  }, []);

  const toggleMenu = () => {
    setMenuOpen((open) => !open);
    setServicesOpen(false);
  };

  const go = (sectionId: string, focusId?: string) => {
    closeMenu();
    goTo(sectionId, focusId);
  };

  const onDark = tone === "dark" && !menuOpen;

  return (
    <header
      className="site-header fixed inset-x-0 top-0 z-50"
      data-glass={glass}
      data-tone={tone}
      data-open={menuOpen}
    >
      <div className="wrap flex h-[var(--header-h)] items-center justify-between gap-6">
        <button
          type="button"
          aria-label={nav.logoLabel}
          onClick={() => {
            closeMenu();
            scrollToTop();
          }}
          className="logo-swap relative flex shrink-0 items-center rounded-image"
        >
          <Image
            src={brand.logo.src}
            alt=""
            width={brand.logo.width}
            height={brand.logo.height}
            loading="eager"
            className="h-10 w-auto md:h-14"
            style={{ opacity: onDark ? 0 : 1 }}
          />
          <Image
            src={brand.logoWhite.src}
            alt=""
            width={brand.logoWhite.width}
            height={brand.logoWhite.height}
            loading="eager"
            className="absolute inset-0 h-10 w-auto md:h-14"
            style={{ opacity: onDark ? 1 : 0 }}
          />
        </button>

        <MobileNav open={menuOpen} controlsId={NAV_ID} onToggle={toggleMenu} onClose={closeMenu} />

        <nav
          id={NAV_ID}
          aria-label={nav.menuLabel}
          className={`${
            menuOpen
              ? "fixed inset-x-0 bottom-0 top-[calc(var(--header-h)+1px)] flex flex-col overflow-y-auto bg-white px-[var(--gutter)] pb-8 text-ink"
              : "hidden"
          } lg:static lg:flex lg:flex-1 lg:flex-row lg:items-center lg:justify-end lg:gap-8 lg:overflow-visible lg:bg-transparent lg:p-0 lg:text-inherit`}
        >
          <ul className="flex flex-col lg:flex-row lg:items-center lg:gap-8">
            {nav.items.map((item) =>
              item.hasMenu ? (
                <MegaMenu
                  key={item.href}
                  label={item.label}
                  open={servicesOpen}
                  onOpenChange={setServicesOpen}
                  onNavigate={closeMenu}
                />
              ) : (
                <li key={item.href} className="border-b border-line lg:border-0">
                  <a
                    href={item.href}
                    onClick={(event) => anchorClick(event, () => go(item.href.slice(1)))}
                    className="flex min-h-14 items-center text-h3 font-semibold lg:h-[var(--header-h)] lg:min-h-0 lg:text-body lg:font-normal"
                  >
                    <span className="nav-link">{item.label}</span>
                  </a>
                </li>
              ),
            )}
          </ul>
          <a
            href={nav.cta.href}
            onClick={(event) =>
              anchorClick(event, () => go(nav.cta.href.slice(1), CONTACT_FIRST_FIELD_ID))
            }
            className={`btn mt-8 shrink-0 lg:mt-0 ${onDark ? "btn-white" : "btn-primary"}`}
          >
            {nav.cta.label}
          </a>
        </nav>
      </div>
    </header>
  );
}
