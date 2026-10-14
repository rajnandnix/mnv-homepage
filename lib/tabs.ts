import type { KeyboardEvent } from "react";

export function tabKeyDown(
  event: KeyboardEvent<HTMLElement>,
  index: number,
  count: number,
  select: (index: number) => void,
) {
  const moves: Record<string, number> = {
    ArrowRight: index + 1,
    ArrowLeft: index - 1,
    Home: 0,
    End: count - 1,
  };
  if (!(event.key in moves)) return;
  event.preventDefault();
  const next = (moves[event.key] + count) % count;
  select(next);
  const role = event.currentTarget.getAttribute("role");
  const siblings = event.currentTarget.parentElement?.querySelectorAll<HTMLElement>(`[role="${role}"]`);
  siblings?.[next]?.focus();
}
