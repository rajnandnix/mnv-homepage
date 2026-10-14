type PointerListener = (x: number, y: number) => void;

const listeners = new Set<PointerListener>();
let attached = false;
let frame = 0;
let lastX = 0;
let lastY = 0;

const enabled = () =>
  window.matchMedia("(hover: hover) and (pointer: fine)").matches &&
  !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function flush() {
  frame = 0;
  listeners.forEach((listener) => listener(lastX, lastY));
}

function onMove(event: PointerEvent) {
  lastX = event.clientX;
  lastY = event.clientY;
  if (!frame) frame = requestAnimationFrame(flush);
}

// The one shared pointermove listener, throttled with requestAnimationFrame and off on touch.
export function onPointer(listener: PointerListener) {
  if (!enabled()) return () => {};
  listeners.add(listener);
  if (!attached) {
    window.addEventListener("pointermove", onMove, { passive: true });
    attached = true;
  }
  return () => {
    listeners.delete(listener);
    if (!listeners.size && attached) {
      window.removeEventListener("pointermove", onMove);
      attached = false;
    }
  };
}
