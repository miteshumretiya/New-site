"use client";

import { gsap, useGSAP, MOTION_OK, EASE } from "@/lib/gsap";
import { scheduleFx } from "@/lib/fx-queue";

/**
 * Hero choreography. The intro only plays while the CSS preloader still
 * covers the page — if scripts arrive late (slow network) the hero is already
 * visible and stays put, so nothing ever flashes or hides. Scroll effects
 * (sheet recedes, media drifts) run regardless.
 */
export function HeroIntro() {
  useGSAP(() => {
    const hero = document.getElementById("top");
    if (!hero) return;
    const mm = gsap.matchMedia();
    let cancelScroll = () => {};
    const sheetMms: gsap.MatchMedia[] = [];

    mm.add(MOTION_OK, () => {
      // Read the CSS preloader's own clock so the reveal lands exactly as the
      // curtain lifts, however late the stylesheet or this script arrived.
      const exit = document
        .querySelector(".preloader")
        ?.getAnimations()
        .find((a) => (a as CSSAnimation).animationName === "pl-exit");
      const t = exit?.currentTime == null ? Infinity : Number(exit.currentTime) / 1000;
      const EXIT_START = 0.85;

      if (t < EXIT_START + 0.25) {
        const q = gsap.utils.selector(hero);
        const delay = Math.max(0, EXIT_START - t) + 0.08;
        const tl = gsap.timeline({ delay, defaults: { ease: EASE.out } });
        tl.from(q(".line-mask > span"), {
          yPercent: 118,
          duration: 1.25,
          stagger: 0.09,
        })
          .from(q("[data-hero-pill]"), { scaleX: 0, duration: 1.1 }, 0.3)
          .from(q("[data-hero-fade]"), { y: 26, autoAlpha: 0, duration: 1, stagger: 0.07 }, 0.2)
          .fromTo(
            q("[data-hero-card]"),
            { clipPath: "inset(100% 0% 0% 0% round 28px)" },
            {
              clipPath: "inset(0% 0% 0% 0% round 28px)",
              duration: 1.3,
              stagger: 0.1,
              clearProps: "clipPath",
            },
            0.3,
          )
          .from(q("[data-hero-card] [data-hero-media]"), { scale: 1.3, duration: 1.8, stagger: 0.1 }, 0.3)
          .from(q("[data-hero-spark]"), { rotate: -120, scale: 0, duration: 1.4 }, 0.45);
      }

      // Scroll: the sheet recedes as the next section arrives (set up when idle).
      const sheetMm = gsap.matchMedia();
      cancelScroll = scheduleFx(() =>
        sheetMm.add(MOTION_OK, () => {
          gsap.to(hero, {
            scale: 0.94,
            borderRadius: "3.25rem",
            ease: "none",
            scrollTrigger: {
              trigger: hero,
              start: "bottom bottom",
              end: "bottom top",
              scrub: true,
            },
          });
          gsap.to(hero.querySelector("[data-hero-inner]"), {
            yPercent: 8,
            ease: "none",
            scrollTrigger: {
              trigger: hero,
              start: "top top",
              end: "bottom top",
              scrub: true,
            },
          });
        }),
      );
      sheetMms.push(sheetMm);
    });

    return () => {
      cancelScroll();
      sheetMms.forEach((m) => m.revert());
      mm.revert();
    };
  });

  return null;
}
