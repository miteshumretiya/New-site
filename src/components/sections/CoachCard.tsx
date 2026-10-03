"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import type { Coach } from "@/content/site";
import { site } from "@/content/site";
import { ArrowUpRight } from "@/components/ui/Mark";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

/** Trading-card style coach profile: flips (button, or hover on desktop) to
 *  reveal the bio; tilts toward the pointer on fine-pointer devices. */
export function CoachCard({ coach }: { coach: Coach }) {
  const [flipped, setFlipped] = useState(false);
  const tilt = useRef<HTMLDivElement>(null);
  const first = coach.name.split(" ")[0];

  const onMove = (e: React.PointerEvent) => {
    if (e.pointerType !== "mouse" || prefersReducedMotion() || !tilt.current) return;
    const r = tilt.current.getBoundingClientRect();
    const x = (e.clientX - r.left) / r.width - 0.5;
    const y = (e.clientY - r.top) / r.height - 0.5;
    gsap.to(tilt.current, { rotateY: x * 10, rotateX: -y * 10, duration: 0.6, ease: "power3.out" });
  };
  const onLeave = () => {
    if (tilt.current) gsap.to(tilt.current, { rotateY: 0, rotateX: 0, duration: 0.9, ease: "elastic.out(1, 0.5)" });
  };

  return (
    <div className="coach-card group/card" data-flipped={flipped} onPointerMove={onMove} onPointerLeave={onLeave}>
      <div ref={tilt} className="coach-card__tilt">
        <div className="coach-card__inner">
          {/* Front */}
          <article className="coach-card__face coach-card__front" aria-hidden={flipped} inert={flipped}>
            <div className="absolute inset-0">
              <Image
                src={coach.art}
                alt={coach.alt}
                fill
                sizes="(min-width: 1024px) 24vw, (min-width: 640px) 45vw, 78vw"
                className="object-cover"
              />
            </div>
            <div className="absolute inset-0 bg-[linear-gradient(to_top,rgb(13_13_12/.92)_8%,rgb(13_13_12/.2)_45%,transparent_70%)]" />
            <span className="absolute right-4 top-3 font-display text-[clamp(3rem,2rem+3vw,4.5rem)] leading-none text-chalk/90">
              {coach.number}
            </span>
            <span className="label absolute left-4 top-4 rounded-full bg-ink/70 px-2.5 py-1 text-chalk backdrop-blur-sm">
              {coach.years} yrs
            </span>
            <div className="absolute inset-x-4 bottom-4 flex items-end justify-between gap-3">
              <div className="flex flex-col gap-1">
                <h3 className="font-display text-[clamp(1.75rem,1.2rem+1.4vw,2.5rem)] leading-[0.92] text-chalk">
                  {coach.name}
                </h3>
                <p className="label text-ember">{coach.role}</p>
              </div>
              <span
                aria-hidden="true"
                className="grid size-10 shrink-0 place-items-center rounded-full bg-chalk text-ink transition-transform duration-(--dur-2) ease-out-expo group-hover/card:rotate-90"
              >
                <PlusIcon />
              </span>
            </div>
            <button
              type="button"
              onClick={() => setFlipped(true)}
              className="absolute inset-0 z-10 rounded-[inherit]"
              aria-label={`Read ${coach.name}'s profile`}
              data-cursor="media"
              data-cursor-label="Flip"
            />
          </article>

          {/* Back */}
          <article className="coach-card__face coach-card__back" aria-hidden={!flipped} inert={!flipped}>
            <div className="flex items-start justify-between gap-3">
              <p className="label pt-1 text-ink/70">
                {coach.role} · #{coach.number}
              </p>
              <button
                type="button"
                onClick={() => setFlipped(false)}
                className="grid size-11 shrink-0 place-items-center rounded-full border border-ink/20 transition-colors duration-(--dur-2) hover:bg-ink hover:text-chalk"
                aria-label={`Back to ${first}'s card`}
              >
                <ArrowUpRight className="size-4 -rotate-[135deg]" />
              </button>
            </div>
            <div className="flex flex-col gap-4">
              <p className="font-display text-[clamp(1.6rem,1.2rem+1.2vw,2.25rem)] leading-[0.95]">{coach.name}</p>
              <p className="text-[0.95rem] leading-relaxed text-ink/80">{coach.bio}</p>
              <ul className="flex flex-wrap gap-1.5">
                {coach.specialties.map((s) => (
                  <li key={s} className="label rounded-full border border-ink/25 px-2.5 py-1">
                    {s}
                  </li>
                ))}
              </ul>
            </div>
            <div className="flex flex-wrap items-end justify-between gap-3 border-t border-ink/15 pt-4">
              <div>
                <p className="label text-ink/70">{coach.stat.label}</p>
                <p className="font-display text-3xl leading-none">{coach.stat.value}</p>
              </div>
              <a
                href={`${site.email.href.split("?")[0]}?subject=${encodeURIComponent(`Session with ${coach.name}`)}`}
                className="btn btn-ink min-h-11 px-4 text-sm"
              >
                <span className="btn-label">Train with {first}</span>
                <span className="btn-icon">
                  <ArrowUpRight className="size-3.5" />
                </span>
              </a>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}

function PlusIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      className="size-4"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}
