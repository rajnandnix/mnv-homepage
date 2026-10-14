"use client";

import { useEffect, useId, useRef, type KeyboardEvent } from "react";
import Arrow from "@/components/Arrow";
import { hero, insights } from "@/lib/content";
import { CONTACT_FIRST_FIELD_ID, goTo } from "@/lib/navigation";

type InsightItem = (typeof insights.items)[number];

type InsightModalProps = {
  item: InsightItem;
  onClose: () => void;
};

export default function InsightModal({ item, onClose }: InsightModalProps) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const titleId = useId();

  useEffect(() => {
    const dialog = dialogRef.current;
    if (!dialog) return;
    if (!dialog.open) dialog.showModal();
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.documentElement.style.overflow = "";
    };
  }, []);

  const close = () => dialogRef.current?.close();

  const trapFocus = (event: KeyboardEvent<HTMLDialogElement>) => {
    if (event.key !== "Tab") return;
    const focusable = event.currentTarget.querySelectorAll<HTMLElement>("button, a[href]");
    const first = focusable[0];
    const last = focusable[focusable.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  };

  return (
    <dialog
      ref={dialogRef}
      aria-labelledby={titleId}
      onClose={onClose}
      onKeyDown={trapFocus}
      onClick={(event) => {
        if (event.target === event.currentTarget) close();
      }}
      className="m-auto max-h-[90dvh] w-[calc(100%-32px)] max-w-[680px] overflow-y-auto rounded-panel bg-white text-ink backdrop:bg-[rgba(36,26,51,0.5)] backdrop:backdrop-blur-[8px]"
    >
      <div className="p-6 sm:p-10">
        <div className="flex items-start justify-between gap-6">
          <p className="text-small">
            {item.categories.join(", ")}
            <br />
            <time dateTime={item.isoDate}>{item.date}</time> · {item.readTime}
          </p>
          <button
            type="button"
            onClick={close}
            className="-mr-2 -mt-2 flex h-11 shrink-0 items-center gap-2 rounded-full px-3 font-semibold transition duration-200 hover:bg-mist hover:text-brand active:scale-[0.98] focus-visible:bg-mist focus-visible:text-brand"
          >
            {insights.modal.close}
            <svg aria-hidden="true" width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 3l10 10M13 3L3 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
        </div>
        <h2 id={titleId} className="mt-4">
          {item.title}
        </h2>
        <div className="frame frame-soft mt-6 aspect-[16/9] w-full sm:aspect-[3/1]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={item.image.src}
            alt={item.image.alt}
            width={item.image.width}
            height={item.image.height}
            decoding="async"
            className="frame-img"
          />
        </div>
        <p className="mt-6">{item.summary}</p>
        <button
          type="button"
          onClick={() => {
            close();
            goTo(hero.primaryCta.href.slice(1), CONTACT_FIRST_FIELD_ID);
          }}
          className="btn btn-primary mt-8"
        >
          {hero.primaryCta.label}
          <Arrow />
        </button>
      </div>
    </dialog>
  );
}
