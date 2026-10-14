"use client";

import { useEffect, useRef } from "react";
import { nav } from "@/lib/content";

type MobileNavProps = {
  open: boolean;
  controlsId: string;
  onToggle: () => void;
  onClose: () => void;
};

const DESKTOP_QUERY = "(min-width: 1024px)";

export default function MobileNav({ open, controlsId, onToggle, onClose }: MobileNavProps) {
  const buttonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (!open) return;

    const root = document.documentElement;
    const behind = [document.getElementById("main"), document.querySelector("footer")];
    root.style.overflow = "hidden";
    behind.forEach((element) => element?.setAttribute("inert", ""));

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      onClose();
      buttonRef.current?.focus();
    };
    const desktop = window.matchMedia(DESKTOP_QUERY);
    const onBreakpoint = (event: MediaQueryListEvent) => {
      if (event.matches) onClose();
    };
    document.addEventListener("keydown", onKeyDown);
    desktop.addEventListener("change", onBreakpoint);

    return () => {
      root.style.overflow = "";
      behind.forEach((element) => element?.removeAttribute("inert"));
      document.removeEventListener("keydown", onKeyDown);
      desktop.removeEventListener("change", onBreakpoint);
    };
  }, [open, onClose]);

  return (
    <button
      ref={buttonRef}
      type="button"
      aria-label={open ? nav.closeMenu : nav.openMenu}
      aria-expanded={open}
      aria-controls={controlsId}
      onClick={onToggle}
      className="-mr-2 flex h-12 w-12 items-center justify-center rounded-full hover:text-brand lg:hidden"
    >
      <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none">
        <path
          d={open ? "M6 6l12 12M18 6L6 18" : "M4 7h16M4 12h16M4 17h16"}
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
        />
      </svg>
    </button>
  );
}
