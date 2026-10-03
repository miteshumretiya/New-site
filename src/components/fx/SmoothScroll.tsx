"use client";

import { useEffect } from "react";
import type Lenis from "lenis";
import { prefersReducedMotion } from "@/lib/motion";
import { scheduleFx } from "@/lib/fx-queue";

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

const OFFSET = -72;

/** Lenis smooth scrolling driven by GSAP's ticker so ScrollTrigger stays in
 *  lock-step. Loaded from the idle queue (native scrolling until then) and
 *  skipped entirely for reduced motion. Also owns same-page anchor clicks so
 *  they glide instead of jumping. */
export function SmoothScroll() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = (e.target as Element | null)?.closest<HTMLAnchorElement>("a[href^='#']");
      if (!a) return;
      const hash = a.getAttribute("href")!;
      const target = hash === "#top" || hash === "#" ? document.body : document.querySelector<HTMLElement>(hash);
      if (!target) return;
      e.preventDefault();
      scrollToTarget(target);
      if (hash.length > 1) history.replaceState(null, "", hash);
    };
    document.addEventListener("click", onClick);
    if (prefersReducedMotion()) return () => document.removeEventListener("click", onClick);

    let teardown = () => {};
    let disposed = false;
    const cancel = scheduleFx(({ gsap, ScrollTrigger }) => {
      void import("lenis").then(({ default: LenisCtor }) => {
        if (disposed) return;
        const lenis = new LenisCtor({ lerp: 0.11, autoRaf: false });
        window.__lenis = lenis;
        lenis.on("scroll", ScrollTrigger.update);
        const tick = (time: number) => lenis.raf(time * 1000);
        gsap.ticker.add(tick);
        gsap.ticker.lagSmoothing(0);
        teardown = () => {
          gsap.ticker.remove(tick);
          lenis.destroy();
          delete window.__lenis;
        };
      });
    });

    return () => {
      disposed = true;
      cancel();
      teardown();
      document.removeEventListener("click", onClick);
    };
  }, []);

  return null;
}

/** Scroll to an in-page target through Lenis when available. */
export function scrollToTarget(target: string | HTMLElement) {
  const el = typeof target === "string" ? document.querySelector<HTMLElement>(target) : target;
  if (!el) return;
  const isTop = el === document.body;
  if (window.__lenis) {
    window.__lenis.scrollTo(isTop ? 0 : el, { offset: isTop ? 0 : OFFSET, force: true });
  } else {
    const y = isTop ? 0 : el.getBoundingClientRect().top + window.scrollY + OFFSET;
    window.scrollTo({ top: y, behavior: prefersReducedMotion() ? "auto" : "smooth" });
  }
  // Move focus for keyboard and screen reader users without a second jump.
  if (!isTop) {
    if (!el.hasAttribute("tabindex")) el.setAttribute("tabindex", "-1");
    el.focus({ preventScroll: true });
  }
}
