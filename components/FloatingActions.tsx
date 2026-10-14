"use client";

import { useEffect, useState } from "react";
import { contact, floating, footer } from "@/lib/content";
import { CONTACT_FIRST_FIELD_ID, goTo } from "@/lib/navigation";

export default function FloatingActions() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const hero = document.getElementById("hero");
    const contactBand = document.getElementById("contact");
    if (!hero || !contactBand) return;
    const inView = { hero: true, contact: false };
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        inView[entry.target === hero ? "hero" : "contact"] = entry.isIntersecting;
      });
      setVisible(!inView.hero && !inView.contact);
    });
    observer.observe(hero);
    observer.observe(contactBand);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      inert={!visible}
      className={`fixed bottom-4 right-4 z-40 flex flex-col gap-3 transition duration-300 md:bottom-6 md:right-6 ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <a
        href={contact.office.whatsapp.href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${floating.whatsapp}, ${footer.newTab}`}
        className="float-btn"
      >
        <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 21l1.6-4.6A9 9 0 1 1 8 19.6L3 21z" />
          <path d="M9.2 8.8c.3 2.6 2.8 5.2 5.6 5.7l1.2-1.4-2-1-.9.8a4.6 4.6 0 0 1-2.3-2.3l.8-.9-1-2z" />
        </svg>
        <span className="tip" aria-hidden="true">
          {floating.whatsapp}
        </span>
      </a>
      <button
        type="button"
        aria-label={floating.chat}
        onClick={() => goTo("contact", CONTACT_FIRST_FIELD_ID)}
        className="float-btn"
      >
        <svg aria-hidden="true" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M21 12a8 8 0 0 1-11.6 7.1L4 20.5l1.4-4.6A8 8 0 1 1 21 12z" />
          <path d="M8.5 11h7M8.5 14h4" />
        </svg>
        <span className="tip" aria-hidden="true">
          {floating.chat}
        </span>
      </button>
    </div>
  );
}
