"use client";

import { useEffect } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

/** Magnetic pull for every [data-magnetic] element (desktop, fine pointer).
 *  The element drifts toward the pointer; an optional [data-magnetic-inner]
 *  child drifts further for a subtle parallax. Releases with an elastic ease. */
export function Magnetic() {
  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!fine.matches || prefersReducedMotion()) return;

    const cleanups: (() => void)[] = [];

    document.querySelectorAll<HTMLElement>("[data-magnetic]").forEach((el) => {
      const strength = Number(el.dataset.magnetic || 0.35);
      const inner = el.querySelector<HTMLElement>("[data-magnetic-inner]");
      const xTo = gsap.quickTo(el, "x", { duration: 0.6, ease: "power3.out" });
      const yTo = gsap.quickTo(el, "y", { duration: 0.6, ease: "power3.out" });
      const ixTo = inner ? gsap.quickTo(inner, "x", { duration: 0.6, ease: "power3.out" }) : null;
      const iyTo = inner ? gsap.quickTo(inner, "y", { duration: 0.6, ease: "power3.out" }) : null;

      const move = (e: PointerEvent) => {
        const r = el.getBoundingClientRect();
        const dx = e.clientX - (r.left + r.width / 2);
        const dy = e.clientY - (r.top + r.height / 2);
        xTo(dx * strength);
        yTo(dy * strength);
        ixTo?.(dx * strength * 0.5);
        iyTo?.(dy * strength * 0.5);
      };
      const leave = () => {
        gsap.to(el, { x: 0, y: 0, duration: 0.9, ease: "elastic.out(1, 0.4)", overwrite: true });
        if (inner) gsap.to(inner, { x: 0, y: 0, duration: 0.9, ease: "elastic.out(1, 0.4)", overwrite: true });
      };

      el.addEventListener("pointermove", move);
      el.addEventListener("pointerleave", leave);
      cleanups.push(() => {
        el.removeEventListener("pointermove", move);
        el.removeEventListener("pointerleave", leave);
        gsap.set([el, inner].filter(Boolean), { clearProps: "transform" });
      });
    });

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return null;
}
