"use client";

import { useEffect, useId, useRef, useState } from "react";
import { classById, site, week } from "@/content/site";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { ArrowUpRight } from "@/components/ui/Mark";
import { prefersReducedMotion, stagger } from "@/lib/motion";

const fullDay: Record<string, string> = {
  Mon: "Monday",
  Tue: "Tuesday",
  Wed: "Wednesday",
  Thu: "Thursday",
  Fri: "Friday",
  Sat: "Saturday",
  Sun: "Sunday",
};

export function Timetable() {
  const [day, setDay] = useState(0);
  const [today, setToday] = useState<number | null>(null);
  const listRef = useRef<HTMLOListElement>(null);
  const tabsRef = useRef<HTMLDivElement>(null);
  const mounted = useRef(false);
  const uid = useId();

  // Mark today without switching the panel (avoids a post-hydration layout change).
  useEffect(() => {
    const d = new Date().getDay(); // 0 = Sunday
    // eslint-disable-next-line react-hooks/set-state-in-effect -- client-only value, unknown during SSR
    setToday((d + 6) % 7);
  }, []);

  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true;
      return;
    }
    if (prefersReducedMotion() || !listRef.current) return;
    const anims = stagger(
      listRef.current.children,
      [
        { opacity: 0, transform: "translateY(16px)" },
        { opacity: 1, transform: "none" },
      ],
      { duration: 550, each: 45 },
    );
    return () => anims.forEach((a) => a.cancel());
  }, [day]);

  const onKey = (e: React.KeyboardEvent) => {
    let next = day;
    if (e.key === "ArrowRight") next = (day + 1) % week.length;
    else if (e.key === "ArrowLeft") next = (day - 1 + week.length) % week.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = week.length - 1;
    else return;
    e.preventDefault();
    setDay(next);
    tabsRef.current?.querySelectorAll<HTMLButtonElement>("[role='tab']")[next]?.focus();
  };

  const current = week[day];

  return (
    <section id="timetable" data-nav-theme="dark" aria-labelledby="timetable-title" className="relative py-section">
      <div className="container-x">
        <div className="grid grid-cols-12 items-end gap-6">
          <SectionHeading
            index="04"
            eyebrow="Timetable"
            id="timetable-title"
            className="col-span-12 lg:col-span-8"
            title={
              <>
                This week at <span className="text-ember">Rhinos</span>
              </>
            }
          />
          <p
            data-reveal
            className="col-span-12 max-w-[30rem] text-mute lg:col-[9/13] lg:justify-self-end lg:text-right"
          >
            Classes open for booking seven days ahead. Members book in the app; on a free week, tap any class and
            we&apos;ll hold your spot.
          </p>
        </div>

        <div
          ref={tabsRef}
          role="tablist"
          aria-label="Choose a day"
          onKeyDown={onKey}
          data-reveal
          className="mt-10 grid grid-cols-7 gap-1.5 rounded-full border border-line p-1.5 lg:mt-14"
        >
          {week.map((d, i) => (
            <button
              key={d.day}
              role="tab"
              type="button"
              id={`${uid}-t${i}`}
              aria-selected={i === day}
              aria-controls={`${uid}-p`}
              tabIndex={i === day ? 0 : -1}
              onClick={() => setDay(i)}
              className={`relative min-h-11 rounded-full py-2.5 text-center transition-colors duration-(--dur-2) ease-out-expo ${
                i === day ? "bg-chalk text-ink" : "text-mute hover:bg-ink-3 hover:text-chalk"
              }`}
            >
              <span className="label">
                <span className="sm:hidden">{d.day.slice(0, 2)}</span>
                <span className="hidden sm:inline">{d.day}</span>
              </span>
              {today === i && (
                <>
                  <span
                    className="absolute left-1/2 top-1.5 size-1.5 -translate-x-1/2 rounded-full bg-ember"
                    aria-hidden="true"
                  />
                  <span className="sr-only"> (today)</span>
                </>
              )}
            </button>
          ))}
        </div>

        <div id={`${uid}-p`} role="tabpanel" aria-labelledby={`${uid}-t${day}`} className="mt-6">
          <div className="label hidden grid-cols-[5.5rem_minmax(0,1fr)_10rem_8rem_6.5rem] gap-4 border-b border-line px-4 pb-3 text-mute lg:grid xl:grid-cols-[6rem_minmax(0,1fr)_11rem_9rem_8rem_7rem]">
            <span>Time</span>
            <span>Class</span>
            <span>Coach</span>
            <span className="hidden xl:block">Room</span>
            <span>Spots</span>
            <span className="sr-only">Book</span>
          </div>
          <ol ref={listRef} className="flex flex-col">
            {current.sessions.map((s) => {
              const c = classById[s.classId];
              const full = s.spots === 0;
              const subject = encodeURIComponent(
                `${full ? "Waitlist" : "Booking"}: ${c.name}, ${fullDay[current.day]} ${s.time}`,
              );
              return (
                <li key={`${current.day}-${s.time}`} className="tt-row">
                  <div className="tt-row__grid">
                    <span className="font-display text-[1.75rem] leading-none tabular lg:text-[2rem]">{s.time}</span>
                    <span className="flex min-w-0 flex-col gap-1">
                      <span className="font-display text-[clamp(1.5rem,1.1rem+1.4vw,2.25rem)] leading-[0.95]">
                        {c.name}
                      </span>
                      <span className="label text-mute tt-muted">
                        <span className="hidden sm:inline">{c.category} · </span>
                        {c.minutes} min
                      </span>
                    </span>
                    <span className="text-small tt-muted lg:text-body">
                      <span className="hidden sm:inline lg:hidden">Coach </span>
                      {s.coach}
                    </span>
                    <span className="text-small tt-muted lg:text-body">{s.room}</span>
                    <span className="flex items-center gap-3">
                      {full ? (
                        <span className="label rounded-full border border-current px-2.5 py-1 text-ember tt-accent">
                          Waitlist
                        </span>
                      ) : (
                        <>
                          <span
                            className="hidden h-1 w-14 overflow-clip rounded-full bg-line sm:block"
                            aria-hidden="true"
                          >
                            <span
                              className="block h-full origin-left bg-ember"
                              style={{ transform: `scaleX(${Math.max(0.12, 1 - s.spots / 16)})` }}
                            />
                          </span>
                          <span className="label tabular whitespace-nowrap">{s.spots} left</span>
                        </>
                      )}
                    </span>
                    <a
                      href={`${site.email.href.split("?")[0]}?subject=${subject}`}
                      className="tt-book"
                      aria-label={`${full ? "Join the waitlist for" : "Book"} ${c.name} on ${fullDay[current.day]} at ${s.time}`}
                    >
                      {full ? "Waitlist" : "Book"}
                      <ArrowUpRight className="size-3.5" />
                    </a>
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
    </section>
  );
}
