"use client";

import { loadGsap, type GsapModule } from "@/lib/motion";

type Job = (m: GsapModule) => void;

const queue: Job[] = [];
let running = false;

type IdleWindow = Window & {
  requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
};

function nextIdle(cb: () => void) {
  const w = window as IdleWindow;
  if (w.requestIdleCallback) w.requestIdleCallback(cb, { timeout: 600 });
  else window.setTimeout(cb, 16);
}

async function drain() {
  const m = await loadGsap();
  const step = () => {
    const job = queue.shift();
    if (job) {
      job(m);
      nextIdle(step);
      return;
    }
    running = false;
    // Everything registered so far: settle trigger order and positions once.
    m.ScrollTrigger.sort();
    m.ScrollTrigger.refresh();
  };
  nextIdle(step);
}

/**
 * Effect setup that needs GSAP (scroll triggers, pins, SplitText, smooth
 * scroll, cursor) is queued: GSAP is fetched lazily after hydration, then one
 * job runs per idle period in registration (page) order. The critical path
 * ships no animation library, and each section's setup is its own short task.
 * Content stays visible until its effect is ready.
 */
export function scheduleFx(job: Job) {
  let cancelled = false;
  queue.push((m) => {
    if (!cancelled) job(m);
  });
  if (!running) {
    running = true;
    void drain();
  }
  return () => {
    cancelled = true;
  };
}
