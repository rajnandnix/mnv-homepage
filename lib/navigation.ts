import type { MouseEvent } from "react";

export const CONTACT_FIRST_FIELD_ID = "contact-name";

const SETTLE_TIMEOUT_MS = 900;
const MAX_CORRECTIONS = 5;

const prefersReducedMotion = () => window.matchMedia("(prefers-reduced-motion: reduce)").matches;

const headerOffset = () => parseFloat(getComputedStyle(document.documentElement).scrollPaddingTop) || 0;

// Sections far below the fold are not laid out until they approach the viewport, so their real
// heights only appear after a frame. Re-measure across frames and nudge until the target sits
// exactly under the sticky header.
function alignTo(target: HTMLElement, done: () => void, attempt = 0) {
  const drift = target.getBoundingClientRect().top - headerOffset();
  const atEnd = window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 1;
  if (Math.abs(drift) < 4 || (atEnd && drift > 0) || attempt >= MAX_CORRECTIONS) {
    done();
    return;
  }
  window.scrollBy({ top: drift, behavior: "instant" });
  requestAnimationFrame(() => requestAnimationFrame(() => alignTo(target, done, attempt + 1)));
}

function whenScrollSettles(target: HTMLElement, callback: () => void) {
  const offset = headerOffset();
  const alreadyThere = Math.abs(target.getBoundingClientRect().top - offset) < 4;
  if (alreadyThere || prefersReducedMotion()) {
    callback();
    return;
  }
  const finish = () => {
    window.clearTimeout(timer);
    window.removeEventListener("scrollend", finish);
    callback();
  };
  const timer = window.setTimeout(finish, SETTLE_TIMEOUT_MS);
  window.addEventListener("scrollend", finish, { once: true });
}

export function goTo(sectionId: string, focusId?: string) {
  requestAnimationFrame(() => {
    const section = document.getElementById(sectionId);
    if (!section) return;
    section.scrollIntoView({ block: "start" });
    history.replaceState(null, "", `#${sectionId}`);
    whenScrollSettles(section, () =>
      alignTo(section, () => {
        const field = focusId ? document.getElementById(focusId) : null;
        if (field) {
          field.focus({ preventScroll: true });
          return;
        }
        section.tabIndex = -1;
        section.focus({ preventScroll: true });
      }),
    );
  });
}

export function scrollToTop() {
  window.scrollTo({ top: 0 });
  history.replaceState(null, "", window.location.pathname + window.location.search);
}

export function anchorClick(event: MouseEvent, action: () => void) {
  if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
  event.preventDefault();
  action();
}
