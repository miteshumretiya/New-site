"use client";

import { ScrollTrigger } from "@/lib/gsap";

type Job = () => void;

const queue: Job[] = [];
let scheduled = false;

type IdleWindow = Window & {
  requestIdleCallback?: (cb: (deadline: { timeRemaining: () => number }) => void, opts?: { timeout: number }) => number;
};

function nextIdle(cb: () => void) {
  const w = window as IdleWindow;
  if (w.requestIdleCallback) w.requestIdleCallback(() => cb(), { timeout: 600 });
  else window.setTimeout(cb, 16);
}

function drain() {
  const job = queue.shift();
  if (job) {
    job();
    nextIdle(drain);
    return;
  }
  scheduled = false;
  // Everything is registered: settle trigger order and positions once.
  ScrollTrigger.sort();
  ScrollTrigger.refresh();
}

/**
 * Below-the-fold effect setup (SplitText, ScrollTriggers, pins) is queued and
 * run one job per idle period, in registration (page) order. This keeps the
 * hydration task short — each section's setup becomes its own small task —
 * while content stays visible until its effect is ready.
 */
export function scheduleFx(job: Job) {
  let cancelled = false;
  queue.push(() => {
    if (!cancelled) job();
  });
  if (!scheduled) {
    scheduled = true;
    nextIdle(drain);
  }
  return () => {
    cancelled = true;
  };
}
