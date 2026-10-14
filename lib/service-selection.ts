import { useSyncExternalStore } from "react";

export type ServiceSelection = {
  pillarId: string;
  serviceId: string | null;
  requestId: number;
};

let selection: ServiceSelection | null = null;
const listeners = new Set<() => void>();

export function selectService(pillarId: string, serviceId: string | null = null) {
  selection = { pillarId, serviceId, requestId: (selection?.requestId ?? 0) + 1 };
  listeners.forEach((listener) => listener());
}

function subscribe(listener: () => void) {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export function useServiceSelection() {
  return useSyncExternalStore(
    subscribe,
    () => selection,
    () => null,
  );
}
