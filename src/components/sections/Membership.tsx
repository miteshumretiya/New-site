"use client";

import { useEffect, useRef, useState } from "react";
import { plans, site } from "@/content/site";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ArrowUpRight } from "@/components/ui/Mark";

type Billing = "monthly" | "annual";

export function Membership() {
  const [billing, setBilling] = useState<Billing>("monthly");
  const [active, setActive] = useState(1);
  const [hovering, setHovering] = useState(false);
  const listRef = useRef<HTMLOListElement>(null);
  const sticker = useRef<HTMLDivElement>(null);

  /* The sticker glides to the focused row (transform only). */
  useEffect(() => {
    const place = () => {
      const row = listRef.current?.children[active] as HTMLElement | undefined;
      if (!row || !sticker.current) return;
      sticker.current.style.transform = `translateY(${row.offsetTop + row.offsetHeight / 2}px) translateY(-50%) rotate(${active * 8 - 8}deg)`;
    };
    place();
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, [active, billing]);

  const price = (p: (typeof plans)[number]) => (billing === "monthly" ? p.monthly : p.annual);

  return (
    <section
      id="membership"
      data-nav-theme="light"
      aria-labelledby="membership-title"
      className="sheet relative py-section"
    >
      <div className="container-x">
        <div className="flex flex-col items-center gap-6 text-center">
          <SectionHeading
            index="05"
            eyebrow="Membership"
            id="membership-title"
            tone="light"
            className="items-center"
            title={
              <>
                Choose your <span className="text-ember-ink">plan</span>
              </>
            }
          />
          <p data-reveal className="max-w-[34rem] text-mute-ink">
            No joining fee. Freeze for up to three months a year. Cancel with 30 days&apos; notice — no phone tree, no
            guilt trip.
          </p>

          <div
            data-reveal
            role="radiogroup"
            aria-label="Billing period"
            className="relative grid grid-cols-2 rounded-full bg-chalk-2 p-1.5"
          >
            <span
              aria-hidden="true"
              className="absolute inset-y-1.5 left-1.5 w-[calc(50%-0.375rem)] rounded-full bg-ink transition-transform duration-(--dur-3) ease-out-expo"
              style={{ transform: billing === "annual" ? "translateX(100%)" : "translateX(0)" }}
            />
            {(["monthly", "annual"] as const).map((b) => (
              <button
                key={b}
                type="button"
                role="radio"
                aria-checked={billing === b}
                onClick={() => setBilling(b)}
                className={`relative z-10 min-h-11 rounded-full px-5 text-sm font-semibold transition-colors duration-(--dur-2) sm:px-7 ${
                  billing === b ? "text-chalk" : "text-ink/70 hover:text-ink"
                }`}
              >
                {b === "monthly" ? (
                  "Monthly"
                ) : (
                  <>
                    Annual <span className={billing === b ? "text-ember" : "text-ember-ink"}>−15%</span>
                  </>
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="relative mt-10 rounded-xl bg-ink p-3 text-chalk sm:p-5 lg:mt-14 lg:p-8">
          <ol
            ref={listRef}
            className="flex flex-col"
            onPointerEnter={() => setHovering(true)}
            onPointerLeave={() => setHovering(false)}
          >
            {plans.map((p, i) => {
              const isActive = i === active;
              return (
                <li
                  key={p.id}
                  onPointerEnter={() => setActive(i)}
                  onFocusCapture={() => setActive(i)}
                  className={`plan-row ${hovering && !isActive ? "lg:opacity-40" : ""}`}
                >
                  <div className="flex min-w-0 flex-col gap-3">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="font-display text-[clamp(2rem,1.2rem+3.2vw,4.25rem)] leading-[0.9]">{p.name}</h3>
                      {p.id === "unlimited" && (
                        <span className="label rounded-full bg-ember px-2.5 py-1 text-ink lg:hidden">Most popular</span>
                      )}
                    </div>
                    <ul className="flex flex-wrap gap-x-4 gap-y-1.5 text-small text-mute">
                      {p.features.map((f) => (
                        <li key={f} className="flex items-center gap-2">
                          <span className="size-1 rounded-full bg-ember" aria-hidden="true" />
                          {f}
                        </li>
                      ))}
                    </ul>
                  </div>

                  <p className="label hidden text-mute xl:block">{p.tag}</p>

                  <div className="flex items-end gap-1.5">
                    <span className="sr-only">
                      ${price(p)} per month{billing === "annual" ? ", billed annually" : ""}
                    </span>
                    <span
                      aria-hidden="true"
                      className="font-display text-[clamp(2.5rem,1.6rem+3vw,4.5rem)] leading-[0.85]"
                    >
                      $
                      <span className="price-roll">
                        <span data-on={billing === "monthly"}>{p.monthly}</span>
                        <span data-on={billing === "annual"}>{p.annual}</span>
                      </span>
                    </span>
                    <span aria-hidden="true" className="label pb-1.5 text-mute">
                      /mo
                    </span>
                  </div>

                  <a
                    href={`${site.email.href.split("?")[0]}?subject=${encodeURIComponent(`Membership: ${p.name} (${billing})`)}`}
                    className={`btn ${isActive ? "btn-ember" : "btn-ghost"} w-full sm:w-auto`}
                    data-magnetic="0.2"
                  >
                    <span className="btn-label">Choose {p.name}</span>
                    <span className="btn-icon">
                      <ArrowUpRight />
                    </span>
                  </a>
                </li>
              );
            })}
          </ol>

          <div
            ref={sticker}
            aria-hidden="true"
            className="pointer-events-none absolute -right-5 top-0 hidden size-32 transition-transform duration-(--dur-3) ease-out-expo lg:block xl:-right-8"
          >
            <div className="relative grid size-full place-items-center rounded-full bg-ember text-ink shadow-lift">
              <svg
                viewBox="0 0 100 100"
                className="absolute inset-0 size-full motion-safe:animate-[spin_16s_linear_infinite]"
              >
                <defs>
                  <path id="sticker-circle" d="M50,50 m-38,0 a38,38 0 1,1 76,0 a38,38 0 1,1 -76,0" />
                </defs>
                <text className="fill-ink font-mono text-[9.5px] uppercase tracking-[0.18em]">
                  <textPath href="#sticker-circle">
                    {plans[active].tag} * {billing} *{" "}
                  </textPath>
                </text>
              </svg>
              <span className="font-display text-[2rem] leading-none">${price(plans[active])}</span>
            </div>
          </div>
        </div>

        <p data-reveal className="label mt-6 text-center text-mute-ink">
          Prices in USD, tax included. Student and first-responder rates at the front desk.
        </p>
      </div>
    </section>
  );
}
