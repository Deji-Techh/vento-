import { create } from "zustand";

interface FlyBurst {
  x: number;
  y: number;
  id: number;
}

interface FlyStore {
  burst: FlyBurst | null;
  fire: (x: number, y: number) => void;
  clear: () => void;
}

let id = 0;

export const useFly = create<FlyStore>()((set) => ({
  burst: null,
  fire: (x, y) => set({ burst: { x, y, id: ++id } }),
  clear: () => set({ burst: null }),
}));

// Measure a press target's center and fire the fly-to-bag burst.
// Works on native (measureInWindow) and web (getBoundingClientRect).
export function fireFromEvent(e: any) {
  const node = e?.currentTarget;
  try {
    if (node?.measureInWindow) {
      node.measureInWindow((x: number, y: number, w: number, h: number) => {
        useFly.getState().fire(x + w / 2, y + h / 2);
      });
      return;
    }
    if (node?.getBoundingClientRect) {
      const r = node.getBoundingClientRect();
      useFly.getState().fire(r.x + r.width / 2, r.y + r.height / 2);
    }
  } catch {}
}
