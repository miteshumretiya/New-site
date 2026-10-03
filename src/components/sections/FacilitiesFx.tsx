"use client";

import { useEffect } from "react";
import { scheduleFx } from "@/lib/fx-queue";

const pad = (n: number) => String(n).padStart(2, "0");

export function FacilitiesFx() {
  useEffect(() => {
    const section = document.getElementById("facilities");
    if (!section) return;
    const pin = section.querySelector<HTMLElement>("[data-hpin]")!;
    const viewport = section.querySelector<HTMLElement>("[data-hviewport]")!;
    const track = section.querySelector<HTMLElement>("[data-htrack]")!;
    const progress = section.querySelector<HTMLElement>("[data-hprogress]")!;
    const count = section.querySelector<HTMLElement>("[data-hcount]")!;
    const panels = Array.from(section.querySelectorAll<HTMLElement>("[data-hpanel]"));
    const total = panels.length;

    /* Native carousel (touch, small screens, reduced motion, no pin). */
    const stepWidth = () => {
      const a = panels[0]?.getBoundingClientRect();
      const b = panels[1]?.getBoundingClientRect();
      return a && b ? b.left - a.left : viewport.clientWidth;
    };
    const syncNative = () => {
      if (section.dataset.pinned) return;
      const max = viewport.scrollWidth - viewport.clientWidth;
      const p = max > 0 ? viewport.scrollLeft / max : 0;
      progress.style.transform = `scaleX(${p})`;
      count.textContent = pad(Math.min(total, Math.round(viewport.scrollLeft / stepWidth()) + 1));
    };
    const go = (dir: number) => () => viewport.scrollBy({ left: dir * stepWidth(), behavior: "smooth" });
    const prev = section.querySelector<HTMLButtonElement>("[data-hprev]")!;
    const next = section.querySelector<HTMLButtonElement>("[data-hnext]")!;
    const onPrev = go(-1);
    const onNext = go(1);
    prev.addEventListener("click", onPrev);
    next.addEventListener("click", onNext);
    viewport.addEventListener("scroll", syncNative, { passive: true });
    syncNative();

    /* Desktop with motion: pin and translate the track with vertical scroll. */
    let revert = () => {};
    const cancel = scheduleFx(({ gsap, ScrollTrigger }) => {
      const mm = gsap.matchMedia();
      revert = () => mm.revert();
      mm.add("(min-width: 1024px) and (prefers-reduced-motion: no-preference)", () => {
        section.dataset.pinned = "true";
        viewport.scrollLeft = 0;
        const distance = () => {
          const cs = getComputedStyle(viewport);
          const inner = viewport.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
          return Math.max(0, track.scrollWidth - inner);
        };

        const tween = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: pin,
            pin: true,
            start: "top top",
            end: () => `+=${distance()}`,
            scrub: 0.7,
            invalidateOnRefresh: true,
            anticipatePin: 1,
            onUpdate(self) {
              progress.style.transform = `scaleX(${self.progress})`;
              count.textContent = pad(Math.min(total, Math.round(self.progress * (total - 1)) + 1));
            },
          },
        });

        panels.forEach((panel) => {
          const img = panel.querySelector<HTMLElement>(".hpanel__img");
          if (!img) return;
          gsap.fromTo(
            img,
            { xPercent: -7, scale: 1.16 },
            {
              xPercent: 7,
              scale: 1.16,
              ease: "none",
              scrollTrigger: {
                trigger: panel,
                containerAnimation: tween,
                start: "left right",
                end: "right left",
                scrub: true,
              },
            },
          );
        });

        // Keep keyboard focus visible: scroll the page to the focused panel.
        const onFocus = (e: FocusEvent) => {
          const panel = (e.target as Element).closest<HTMLElement>("[data-hpanel]");
          const st = tween.scrollTrigger;
          if (!panel || !st) return;
          const ratio = Math.min(1, panel.offsetLeft / Math.max(distance(), 1));
          const y = st.start + ratio * (st.end - st.start);
          if (window.__lenis) window.__lenis.scrollTo(y, { immediate: true, force: true });
          else window.scrollTo(0, y);
        };
        track.addEventListener("focusin", onFocus);

        return () => {
          track.removeEventListener("focusin", onFocus);
          delete section.dataset.pinned;
          progress.style.transform = "";
          ScrollTrigger.refresh();
        };
      });
    });

    return () => {
      cancel();
      revert();
      prev.removeEventListener("click", onPrev);
      next.removeEventListener("click", onNext);
      viewport.removeEventListener("scroll", syncNative);
    };
  }, []);

  return null;
}
