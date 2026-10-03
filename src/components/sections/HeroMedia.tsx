"use client";

import Image from "next/image";
import { useCallback, useRef } from "react";
import { ThermalCanvas } from "@/components/fx/ThermalCanvas";

/** The big hero card: thermal poster (LCP + no-JS) with the live shader on
 *  top and a camera-style HUD whose rep counter follows the animation. */
export function HeroMedia() {
  const repRef = useRef<HTMLSpanElement>(null);
  const tempRef = useRef<HTMLSpanElement>(null);
  const tempLgRef = useRef<HTMLSpanElement>(null);

  const onRep = useCallback((rep: number) => {
    if (repRef.current) repRef.current.textContent = String(rep).padStart(2, "0");
    const temp = (36.4 + rep * 0.11).toFixed(1);
    if (tempRef.current) tempRef.current.textContent = temp;
    if (tempLgRef.current) tempLgRef.current.textContent = temp;
  }, []);

  return (
    <>
      <div data-hero-media className="absolute inset-0">
        <Image
          src="/art/hero-poster.webp"
          alt="Thermal camera view of an athlete locking out a barbell thruster overhead"
          fill
          loading="eager"
          fetchPriority="high"
          sizes="(min-width: 1024px) 62vw, (min-width: 768px) 58vw, 100vw"
          className="object-cover"
        />
        <ThermalCanvas onRep={onRep} />
      </div>

      {/* HUD */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgb(13_13_12/.55),transparent_28%,transparent_62%,rgb(13_13_12/.75))]" />
      <div
        aria-hidden="true"
        className="label pointer-events-none absolute inset-x-4 top-4 flex items-start justify-between text-chalk/90 sm:inset-x-6 sm:top-5"
      >
        <span className="flex items-center gap-2">
          <span className="live-dot" /> Rec · <span className="hidden xs:inline">Thermal&nbsp;</span>cam 02
        </span>
        <span className="tabular text-right lg:hidden">
          Core <span ref={tempRef}>36.9</span>°C
        </span>
      </div>
      <div
        aria-hidden="true"
        className="pointer-events-none absolute left-1/2 top-1/2 hidden size-16 -translate-x-1/2 -translate-y-1/2 md:block"
      >
        <span className="absolute left-0 top-0 size-3 border-l border-t border-chalk/60" />
        <span className="absolute right-0 top-0 size-3 border-r border-t border-chalk/60" />
        <span className="absolute bottom-0 left-0 size-3 border-b border-l border-chalk/60" />
        <span className="absolute bottom-0 right-0 size-3 border-b border-r border-chalk/60" />
      </div>
      <div className="pointer-events-none absolute inset-x-4 bottom-4 flex items-end justify-between gap-4 sm:inset-x-6 sm:bottom-6">
        <p className="font-display text-[clamp(1.75rem,1rem+2.6vw,3.25rem)] leading-[0.9] text-chalk">
          Strength
          <br />
          Conditioning
          <br />
          <span className="text-ember">Recovery</span>
        </p>
        <div aria-hidden="true" className="label hidden flex-col items-end gap-1 text-chalk/90 xs:flex">
          <span className="tabular">
            Rep <span ref={repRef}>06</span> / 08
          </span>
          <span className="tabular whitespace-nowrap">Bar 0.71 m/s</span>
          <span className="tabular hidden lg:inline">
            Core <span ref={tempLgRef}>36.9</span>°C
          </span>
        </div>
      </div>
    </>
  );
}
