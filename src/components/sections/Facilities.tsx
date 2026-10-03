import Image from "next/image";
import { facilities } from "@/content/site";
import { ArrowUpRight } from "@/components/ui/Mark";
import { FacilitiesFx } from "./FacilitiesFx";
import { SectionHeading } from "@/components/ui/SectionHeading";

/**
 * Horizontal gallery. Default (no JS, touch, small screens, reduced motion):
 * a native scroll-snap carousel with arrow buttons. Desktop with motion:
 * FacilitiesFx pins the section and maps vertical scroll to horizontal travel.
 */
export function Facilities() {
  const total = facilities.length + 1;
  return (
    <section id="facilities" data-nav-theme="dark" aria-labelledby="facilities-title" className="relative">
      <div data-hpin className="relative flex flex-col gap-[clamp(2rem,4vw,3.5rem)] py-section">
        <div className="container-x grid grid-cols-12 items-end gap-x-6 gap-y-6">
          <SectionHeading
            index="01"
            eyebrow="The club"
            id="facilities-title"
            className="col-span-12 lg:col-span-8"
            size="title"
            title={
              <>
                Facilities at <span className="text-ember">Rhinos.</span>
              </>
            }
          />
          <div className="col-span-12 flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-end lg:col-span-4 lg:flex-col lg:items-end">
            <p data-reveal className="max-w-[26rem] text-mute lg:text-right">
              2,400 m² across two floors in the Arts District — built for training hard and recovering properly.
            </p>
            <div className="flex shrink-0 items-center gap-3">
              <span className="label tabular text-mute">
                <span data-hcount>01</span> / {String(total).padStart(2, "0")}
              </span>
              <div className="flex gap-2" data-hnav>
                <button type="button" data-hprev aria-label="Previous facility" className="hscroll-btn">
                  <ArrowUpRight className="size-4 -rotate-[135deg]" />
                </button>
                <button type="button" data-hnext aria-label="Next facility" className="hscroll-btn hscroll-btn--accent">
                  <ArrowUpRight className="size-4 rotate-45" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div data-hviewport className="hscroll" tabIndex={0} role="region" aria-label="Facilities, scroll horizontally">
          <ol data-htrack className="hscroll__track">
            {facilities.map((f, i) => (
              <li key={f.id} data-hpanel className="hpanel">
                <article className="flex h-full flex-col gap-5 rounded-lg border border-line bg-ink-2 p-3 pb-6 sm:p-4 sm:pb-7">
                  <div
                    data-cursor="media"
                    data-cursor-label="Zoom"
                    className="hpanel__media relative overflow-clip rounded-md bg-ink"
                  >
                    <Image
                      src={f.art}
                      alt={f.alt}
                      fill
                      sizes="(min-width: 1024px) 32vw, 80vw"
                      className="hpanel__img object-cover"
                    />
                    <span className="label absolute left-3 top-3 rounded-full bg-ink/70 px-2.5 py-1 text-chalk backdrop-blur-sm">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col gap-3 px-2">
                    <h3 className="font-display text-heading">{f.name}</h3>
                    <p className="text-mute">{f.body}</p>
                    <ul className="mt-auto flex flex-wrap gap-2 pt-2">
                      {f.specs.map((s) => (
                        <li key={s} className="label rounded-full border border-line px-3 py-1.5 text-chalk/85">
                          {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                </article>
              </li>
            ))}
            <li data-hpanel className="hpanel">
              <article className="relative flex h-full flex-col justify-between gap-8 overflow-clip rounded-lg bg-ember p-6 text-ink sm:p-8">
                <div className="flex items-start justify-between">
                  <span className="label">{String(total).padStart(2, "0")}</span>
                  <CalendarGlyph />
                </div>
                <div className="flex flex-col gap-4">
                  <h3 className="font-display text-title">Timetable</h3>
                  <p className="max-w-[22rem] text-ink/80">
                    Find a class that fits your week. Early birds, lunch breakers and night owls all covered — seven
                    days a week.
                  </p>
                  <a href="#timetable" className="btn btn-ink mt-2 self-start" data-magnetic>
                    <span className="btn-label">Discover more</span>
                    <span className="btn-icon">
                      <ArrowUpRight />
                    </span>
                  </a>
                </div>
              </article>
            </li>
          </ol>
        </div>

        <div className="container-x" aria-hidden="true">
          <div className="h-px w-full bg-line">
            <div data-hprogress className="h-px w-full origin-left scale-x-0 bg-ember" />
          </div>
        </div>
      </div>
      <FacilitiesFx />
    </section>
  );
}

function CalendarGlyph() {
  return (
    <svg viewBox="0 0 48 48" className="size-12" fill="none" stroke="currentColor" strokeWidth="2.5" aria-hidden="true">
      <rect x="6" y="9" width="36" height="33" rx="5" />
      <path d="M6 19h36M16 5v8M32 5v8" strokeLinecap="round" />
      <rect x="13" y="25" width="7" height="6" rx="1.5" fill="currentColor" stroke="none" />
      <rect x="24" y="25" width="7" height="6" rx="1.5" fill="currentColor" stroke="none" opacity=".45" />
      <rect x="13" y="33" width="7" height="5" rx="1.5" fill="currentColor" stroke="none" opacity=".45" />
    </svg>
  );
}
