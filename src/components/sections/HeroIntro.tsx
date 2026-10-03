"use client";

import { useEffect } from "react";
import { EASE, MOTION_OK, stagger } from "@/lib/motion";
import { scheduleFx } from "@/lib/fx-queue";

/**
 * Hero choreography. The intro uses the Web Animations API so it needs no
 * library and is ready the moment the page hydrates. It only plays while the
 * CSS preloader still covers the page — if scripts arrive late the hero is
 * already visible and stays put, so nothing ever flashes or hides. The scroll
 * effects (sheet recedes, content drifts) load later from the idle queue.
 */
export function HeroIntro() {
  useEffect(() => {
    const hero = document.getElementById("top");
    if (!hero || !window.matchMedia(MOTION_OK).matches) return;

    // Read the CSS preloader's own clock so the reveal lands exactly as the
    // curtain lifts, however late the stylesheet or this script arrived.
    const exit = document
      .querySelector(".preloader")
      ?.getAnimations()
      .find((a) => (a as CSSAnimation).animationName === "pl-exit");
    const t = exit?.currentTime == null ? Infinity : Number(exit.currentTime);
    const EXIT_START = 850;
    const running: Animation[] = [];

    if (t < EXIT_START + 150) {
      const at = Math.max(0, EXIT_START - t) + 80;
      const q = (s: string) => hero.querySelectorAll(s);
      running.push(
        ...stagger(q(".line-mask > span"), [{ transform: "translateY(118%)" }, { transform: "none" }], {
          duration: 1250,
          delay: at,
          each: 90,
        }),
        ...stagger(q("[data-hero-pill]"), [{ transform: "scaleX(0)" }, { transform: "none" }], {
          duration: 1100,
          delay: at + 300,
        }),
        ...stagger(
          q("[data-hero-fade]"),
          [
            { opacity: 0, transform: "translateY(26px)" },
            { opacity: 1, transform: "none" },
          ],
          { duration: 1000, delay: at + 200, each: 70 },
        ),
        ...stagger(
          q("[data-hero-card]"),
          [{ clipPath: "inset(100% 0% 0% 0% round 28px)" }, { clipPath: "inset(0% 0% 0% 0% round 28px)" }],
          { duration: 1300, delay: at + 300, each: 100 },
        ),
        ...stagger(q("[data-hero-card] [data-hero-media]"), [{ transform: "scale(1.3)" }, { transform: "none" }], {
          duration: 1800,
          delay: at + 300,
          each: 100,
        }),
        ...stagger(q("[data-hero-spark]"), [{ transform: "rotate(-120deg) scale(0)" }, { transform: "none" }], {
          duration: 1400,
          delay: at + 450,
          easing: EASE.out,
        }),
      );
    }

    // Scroll: the sheet recedes as the next section arrives.
    let revert = () => {};
    const cancel = scheduleFx(({ gsap }) => {
      const mm = gsap.matchMedia();
      revert = () => mm.revert();
      mm.add(MOTION_OK, () => {
        gsap.to(hero, {
          scale: 0.94,
          borderRadius: "3.25rem",
          ease: "none",
          scrollTrigger: { trigger: hero, start: "bottom bottom", end: "bottom top", scrub: true },
        });
        gsap.to(hero.querySelector("[data-hero-inner]"), {
          yPercent: 8,
          ease: "none",
          scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true },
        });
      });
    });

    return () => {
      cancel();
      revert();
      running.forEach((a) => a.cancel());
    };
  }, []);

  return null;
}
