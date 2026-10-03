"use client";

import Image from "next/image";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { classCategories, classes, type GymClass } from "@/content/site";
import { ArrowUpRight, Plus } from "@/components/ui/Mark";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

type Category = (typeof classCategories)[number];

function Intensity({ level, tone = "dark" }: { level: number; tone?: "dark" | "light" }) {
  return (
    <span className="inline-flex items-center gap-2" role="img" aria-label={`Intensity ${level} of 5`}>
      <span className="flex items-end gap-[3px]" aria-hidden="true">
        {[1, 2, 3, 4, 5].map((n) => (
          <span
            key={n}
            className={`w-[5px] rounded-[2px] ${n <= level ? "bg-ember" : tone === "dark" ? "bg-line" : "bg-line-ink"}`}
            style={{ height: `${6 + n * 2.5}px` }}
          />
        ))}
      </span>
    </span>
  );
}

export function Classes() {
  const [category, setCategory] = useState<Category>("All");
  const visible = useMemo(
    () => (category === "All" ? classes : classes.filter((c) => c.category === category)),
    [category],
  );
  const [activeId, setActiveId] = useState<string>(classes[0].id);
  const active = visible.find((c) => c.id === activeId) ?? visible[0];
  const tabsRef = useRef<HTMLDivElement>(null);
  const indicator = useRef<HTMLSpanElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const previewRef = useRef<HTMLDivElement>(null);
  const firstRender = useRef(true);
  const uid = useId();

  /* Sliding tab indicator (transform only). */
  useEffect(() => {
    const place = () => {
      const tab = tabsRef.current?.querySelector<HTMLElement>("[aria-selected='true']");
      if (!tab || !indicator.current) return;
      indicator.current.style.transform = `translateX(${tab.offsetLeft}px) scaleX(${tab.offsetWidth / 100})`;
    };
    place();
    window.addEventListener("resize", place);
    return () => window.removeEventListener("resize", place);
  }, [category]);

  /* Rows re-enter with a stagger when the filter changes. */
  useEffect(() => {
    if (firstRender.current || prefersReducedMotion() || !listRef.current) return;
    gsap.fromTo(
      listRef.current.children,
      { y: 18, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.6, stagger: 0.05, ease: "expo.out", overwrite: true },
    );
  }, [category]);

  /* Preview: wipe in the new art, fade the copy. */
  useEffect(() => {
    if (firstRender.current) {
      firstRender.current = false;
      return;
    }
    if (prefersReducedMotion() || !previewRef.current) return;
    const q = gsap.utils.selector(previewRef.current);
    gsap.fromTo(
      q("[data-preview-media]"),
      { clipPath: "inset(0% 0% 0% 100%)" },
      { clipPath: "inset(0% 0% 0% 0%)", duration: 0.9, ease: "expo.out", overwrite: true },
    );
    gsap.fromTo(
      q("[data-preview-img]"),
      { scale: 1.18 },
      { scale: 1, duration: 1.2, ease: "expo.out", overwrite: true },
    );
    gsap.fromTo(
      q("[data-preview-copy] > *"),
      { y: 14, autoAlpha: 0 },
      { y: 0, autoAlpha: 1, duration: 0.6, stagger: 0.05, ease: "expo.out", overwrite: true },
    );
  }, [active.id]);

  const onTabKey = (e: React.KeyboardEvent) => {
    const idx = classCategories.indexOf(category);
    let next = idx;
    if (e.key === "ArrowRight") next = (idx + 1) % classCategories.length;
    else if (e.key === "ArrowLeft") next = (idx - 1 + classCategories.length) % classCategories.length;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = classCategories.length - 1;
    else return;
    e.preventDefault();
    setCategory(classCategories[next]);
    tabsRef.current?.querySelectorAll<HTMLButtonElement>("[role='tab']")[next]?.focus();
  };

  return (
    <section id="classes" data-nav-theme="dark" aria-labelledby="classes-title" className="relative py-section">
      <div className="container-x">
        <div className="grid grid-cols-12 items-end gap-6">
          <SectionHeading
            index="02"
            eyebrow="Programs"
            id="classes-title"
            className="col-span-12 lg:col-span-7"
            title={
              <>
                Our fitness <span className="text-ember">classes</span>
              </>
            }
          />
          <p
            data-reveal
            className="col-span-12 max-w-[30rem] text-mute lg:col-[9/13] lg:justify-self-end lg:text-right"
          >
            Seven formats, one philosophy: coached, progressive and never boring. Every class is capped so your coach
            actually sees you.
          </p>
        </div>

        <div className="relative mt-10 border-b border-line lg:mt-14" data-reveal>
          <div
            ref={tabsRef}
            role="tablist"
            aria-label="Filter classes by type"
            onKeyDown={onTabKey}
            className="relative -mx-gutter flex gap-1 overflow-x-auto px-gutter pb-px [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
          >
            {classCategories.map((c) => (
              <button
                key={c}
                role="tab"
                type="button"
                id={`${uid}-tab-${c}`}
                aria-selected={c === category}
                aria-controls={`${uid}-panel`}
                tabIndex={c === category ? 0 : -1}
                onClick={() => setCategory(c)}
                className={`label relative min-h-11 shrink-0 whitespace-nowrap px-3.5 py-3 transition-colors duration-(--dur-2) ${
                  c === category ? "text-chalk" : "text-mute hover:text-chalk"
                }`}
              >
                {c}
              </button>
            ))}
            <span
              ref={indicator}
              aria-hidden="true"
              className="absolute bottom-0 left-0 h-0.5 w-[100px] origin-left bg-ember transition-transform duration-(--dur-3) ease-out-expo"
            />
          </div>
        </div>

        <div
          id={`${uid}-panel`}
          role="tabpanel"
          aria-labelledby={`${uid}-tab-${category}`}
          className="mt-6 grid grid-cols-12 gap-6 lg:mt-10"
        >
          <ul ref={listRef} className="col-span-12 flex flex-col lg:col-span-6">
            {visible.map((c, i) => (
              <ClassRow key={c.id} item={c} index={i} active={c.id === active.id} onSelect={() => setActiveId(c.id)} />
            ))}
          </ul>

          <div className="relative col-span-12 hidden lg:col-span-6 lg:block">
            <div
              ref={previewRef}
              className="sticky top-[calc(var(--nav-h)+2rem)] grid grid-cols-[3.25rem_1fr] gap-3"
              aria-live="polite"
            >
              <div className="flex flex-col items-center justify-between rounded-lg border border-line py-5">
                <Spark />
                <p className="label rotate-180 text-mute [writing-mode:vertical-rl]">
                  {active.category} — {String(classes.indexOf(active) + 1).padStart(2, "0")}
                </p>
              </div>
              <article className="overflow-clip rounded-lg border border-line bg-ink-2">
                <div data-preview-media className="relative aspect-[4/3.1] overflow-clip">
                  <Image
                    key={active.art}
                    data-preview-img
                    src={active.art}
                    alt={active.alt}
                    fill
                    sizes="(min-width: 1024px) 44vw, 0px"
                    className="object-cover"
                  />
                  <span className="label absolute left-4 top-4 rounded-full bg-ink/70 px-3 py-1.5 text-chalk backdrop-blur-sm">
                    {active.minutes} min
                  </span>
                </div>
                <div data-preview-copy className="flex flex-col gap-4 p-6 xl:p-8">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h3 className="font-display text-heading">{active.name}</h3>
                    <Intensity level={active.intensity} />
                  </div>
                  <p className="text-mute">{active.body}</p>
                  <div className="flex flex-wrap items-center justify-between gap-4 border-t border-line pt-4">
                    <p className="text-small text-mute">
                      Coached by <span className="text-chalk">{active.coach}</span>
                    </p>
                    <a href="#timetable" className="btn btn-ember" data-magnetic="0.2">
                      <span className="btn-label">Book a spot</span>
                      <span className="btn-icon">
                        <ArrowUpRight />
                      </span>
                    </a>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function ClassRow({
  item,
  index,
  active,
  onSelect,
}: {
  item: GymClass;
  index: number;
  active: boolean;
  onSelect: () => void;
}) {
  const panelId = `class-${item.id}`;
  return (
    <li className="border-b border-line">
      <button
        type="button"
        onClick={onSelect}
        onMouseEnter={() => window.matchMedia("(hover: hover) and (min-width: 1024px)").matches && onSelect()}
        onFocus={() => window.matchMedia("(min-width: 1024px)").matches && onSelect()}
        aria-expanded={active}
        aria-controls={panelId}
        className="group flex w-full items-center gap-4 py-5 text-left lg:py-6"
      >
        <span
          className={`label tabular w-7 shrink-0 transition-colors duration-(--dur-2) ${active ? "text-ember" : "text-mute"}`}
        >
          {String(index + 1).padStart(2, "0")}
        </span>
        <span
          className={`font-display text-[clamp(1.9rem,1.2rem+2.6vw,3.5rem)] leading-[0.95] transition-[color,transform] duration-(--dur-3) ease-out-expo ${
            active ? "translate-x-1 text-chalk" : "text-chalk/45 group-hover:text-chalk/80"
          }`}
        >
          {item.name}
        </span>
        <span className="label ml-auto hidden text-right text-mute sm:block lg:hidden xl:block">{item.category}</span>
        <span
          className={`grid size-9 shrink-0 place-items-center rounded-full border transition-[transform,background-color,border-color,color] duration-(--dur-2) ease-out-expo ${
            active ? "rotate-45 border-ember bg-ember text-ink" : "border-line text-chalk"
          }`}
          aria-hidden="true"
        >
          <Plus className="size-4" />
        </span>
      </button>
      {/* Inline detail for small screens (the preview card takes over on desktop). */}
      <div id={panelId} hidden={!active} className="pb-6 lg:hidden">
        <div className="relative aspect-[4/3] overflow-clip rounded-md bg-ink">
          <Image src={item.art} alt={item.alt} fill sizes="(min-width: 1024px) 0px, 92vw" className="object-cover" />
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-2">
          <span className="label text-chalk">{item.minutes} min</span>
          <Intensity level={item.intensity} />
          <span className="text-small text-mute">
            Coach <span className="text-chalk">{item.coach}</span>
          </span>
        </div>
        <p className="mt-3 text-mute">{item.body}</p>
        <a href="#timetable" className="btn btn-ember mt-5">
          <span className="btn-label">Book a spot</span>
          <span className="btn-icon">
            <ArrowUpRight />
          </span>
        </a>
      </div>
    </li>
  );
}

function Spark() {
  return (
    <svg viewBox="-50 -50 100 100" className="size-5 text-ember" aria-hidden="true">
      <g fill="currentColor">
        {[0, 45, 90, 135].map((a) => (
          <rect key={a} x="-10" y="-48" width="20" height="96" rx="10" transform={`rotate(${a})`} />
        ))}
      </g>
    </svg>
  );
}
