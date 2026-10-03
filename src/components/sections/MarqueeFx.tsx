"use client";

import { useEffect } from "react";
import { MOTION_OK } from "@/lib/motion";
import { scheduleFx } from "@/lib/fx-queue";

/** Takes over the CSS loop: constant drift plus a boost and skew from scroll
 *  velocity, flipping direction with the scroll direction. */
export function MarqueeFx() {
  useEffect(() => {
    let revert = () => {};
    const cancel = scheduleFx(({ gsap, ScrollTrigger }) => {
      const mm = gsap.matchMedia();
      revert = () => mm.revert();
      mm.add(MOTION_OK, () => {
        const tracks = gsap.utils.toArray<HTMLElement>("[data-marquee-track]");
        if (!tracks.length) return;
        const state = tracks.map((el) => {
          el.style.animation = "none";
          return {
            el,
            dir: Number(el.dataset.direction) || 1,
            x: 0,
            half: el.scrollWidth / 2,
            setX: gsap.quickSetter(el, "x", "px") as (v: number) => void,
            skewTo: gsap.quickTo(el, "skewX", { duration: 0.6, ease: "power3.out" }),
          };
        });
        let boost = 0;
        let scrollDir = 1;
        const st = ScrollTrigger.create({
          trigger: tracks[0].closest("section"),
          start: "top bottom",
          end: "bottom top",
          onUpdate(self) {
            const v = self.getVelocity();
            scrollDir = self.direction;
            boost = Math.min(Math.abs(v) / 120, 14);
            state.forEach((s) => s.skewTo(gsap.utils.clamp(-8, 8, v / -300) * s.dir));
          },
        });
        const measure = () => state.forEach((s) => (s.half = s.el.scrollWidth / 2));
        window.addEventListener("resize", measure);

        const tick = (_t: number, dt: number) => {
          boost *= 0.94;
          state.forEach((s) => {
            s.x -= (0.045 + boost * 0.02) * dt * s.dir * scrollDir;
            s.x = gsap.utils.wrap(-s.half, 0, s.x);
            s.setX(s.x);
          });
        };
        gsap.ticker.add(tick);
        return () => {
          gsap.ticker.remove(tick);
          st.kill();
          window.removeEventListener("resize", measure);
          state.forEach((s) => (s.el.style.animation = ""));
        };
      });
    });
    return () => {
      cancel();
      revert();
    };
  }, []);
  return null;
}
