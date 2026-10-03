"use client";

import { useEffect } from "react";
import { MOTION_OK } from "@/lib/motion";
import { scheduleFx } from "@/lib/fx-queue";

const nf = new Intl.NumberFormat("en-US");

/**
 * Site-wide scroll effects, declared in markup with data attributes so the
 * sections themselves can stay server components:
 *
 *  data-reveal          fade + rise when entering the viewport
 *  data-reveal-group    stagger the direct children instead
 *  data-split           masked line reveal (SplitText, re-splits on resize)
 *  data-clip            clip-path wipe up for media frames
 *  data-parallax="n"    scrubbed yPercent drift (n = percent, can be negative)
 *  data-parallax-lg="n" same, desktop only
 *  data-counter="1900"  count up from zero once
 *
 * Initial states are only ever applied here, so without JS (or with reduced
 * motion) every element simply renders in its final state. Setup runs from the
 * idle queue once GSAP has loaded, so it never touches the critical path.
 */
export function ScrollFx() {
  useEffect(() => {
    const reverts: (() => void)[] = [];
    const start = "top 88%";

    const cancels = [
      scheduleFx(({ gsap, EASE, DUR }) => {
        const mm = gsap.matchMedia();
        reverts.push(() => mm.revert());
        mm.add(MOTION_OK, () => {
          gsap.utils.toArray<HTMLElement>("[data-reveal]").forEach((el) => {
            gsap.from(el, {
              y: 36,
              autoAlpha: 0,
              duration: DUR.md,
              ease: EASE.out,
              delay: Number(el.dataset.revealDelay ?? 0),
              scrollTrigger: { trigger: el, start, once: true },
            });
          });
          gsap.utils.toArray<HTMLElement>("[data-reveal-group]").forEach((group) => {
            gsap.from(group.children, {
              y: 36,
              autoAlpha: 0,
              duration: DUR.md,
              ease: EASE.out,
              stagger: 0.08,
              scrollTrigger: { trigger: group, start, once: true },
            });
          });
        });
      }),

      scheduleFx(({ gsap, SplitText, EASE, DUR }) => {
        const mm = gsap.matchMedia();
        reverts.push(() => mm.revert());
        mm.add(MOTION_OK, () => {
          gsap.utils.toArray<HTMLElement>("[data-split]").forEach((el) => {
            SplitText.create(el, {
              type: "lines",
              mask: "lines",
              linesClass: "split-line",
              autoSplit: true,
              onSplit(self) {
                return gsap.from(self.lines, {
                  yPercent: 110,
                  duration: DUR.lg,
                  ease: EASE.out,
                  stagger: 0.09,
                  scrollTrigger: { trigger: el, start: "top 90%", once: true },
                });
              },
            });
          });
        });
      }),

      scheduleFx(({ gsap, EASE, DUR }) => {
        const mm = gsap.matchMedia();
        reverts.push(() => mm.revert());
        mm.add(MOTION_OK, () => {
          gsap.utils.toArray<HTMLElement>("[data-clip]").forEach((el) => {
            const media = el.querySelector<HTMLElement>("[data-clip-media]");
            const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top 85%", once: true } });
            tl.fromTo(
              el,
              { clipPath: "inset(100% 0% 0% 0%)" },
              { clipPath: "inset(0% 0% 0% 0%)", duration: DUR.lg, ease: EASE.out, clearProps: "clipPath" },
            );
            if (media) tl.from(media, { scale: 1.25, duration: 1.6, ease: EASE.out }, 0);
          });

          const drift = (el: HTMLElement, amount: number) =>
            gsap.fromTo(
              el,
              { yPercent: -amount / 2 },
              {
                yPercent: amount / 2,
                ease: "none",
                scrollTrigger: { trigger: el.parentElement ?? el, start: "top bottom", end: "bottom top", scrub: true },
              },
            );
          gsap.utils
            .toArray<HTMLElement>("[data-parallax]")
            .forEach((el) => drift(el, Number(el.dataset.parallax || 12)));
          if (window.matchMedia("(min-width: 1024px)").matches) {
            gsap.utils
              .toArray<HTMLElement>("[data-parallax-lg]")
              .forEach((el) => drift(el, Number(el.dataset.parallaxLg || 10)));
          }

          gsap.utils.toArray<HTMLElement>("[data-counter]").forEach((el) => {
            const target = Number(el.dataset.counter);
            const obj = { v: 0 };
            el.textContent = "0";
            gsap.to(obj, {
              v: target,
              duration: 1.6,
              ease: "power3.out",
              scrollTrigger: { trigger: el, start: "top 90%", once: true },
              onUpdate: () => {
                el.textContent = nf.format(Math.round(obj.v));
              },
            });
          });
        });
      }),
    ];

    return () => {
      cancels.forEach((c) => c());
      reverts.forEach((r) => r());
    };
  }, []);

  return null;
}
