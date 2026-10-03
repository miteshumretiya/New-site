import Image from "next/image";
import { HeroMedia } from "./HeroMedia";
import { HeroIntro } from "./HeroIntro";
import { ArrowRight, ArrowUpRight, Spark } from "@/components/ui/Mark";

const members = [
  { i: "DO", c: "from-ember to-[#ffb36b]" },
  { i: "MT", c: "from-[#c2261b] to-ember" },
  { i: "LF", c: "from-[#6b0f1a] to-[#e0461a]" },
  { i: "PR", c: "from-ember-2 to-[#ffd08a]" },
];

export function Hero() {
  return (
    <section
      id="top"
      data-nav-theme="light"
      aria-labelledby="hero-title"
      className="hero sheet relative mt-2 overflow-clip pb-3 pt-[calc(var(--nav-h)+1.75rem)] sm:pb-4 lg:pt-[calc(var(--nav-h)+2.25rem)]"
    >
      <div data-hero-inner className="container-x">
        <div data-hero-fade className="flex items-center justify-between gap-4 border-b border-line-ink pb-3">
          <p className="label flex items-center gap-2 text-mute-ink">
            <span className="live-dot" />
            <span>
              Strength &amp; conditioning club<span className="hidden sm:inline"> — Arts District, LA</span>
            </span>
          </p>
          <p className="label hidden text-mute-ink md:block">Open daily · 05:00 – 23:00</p>
        </div>

        <div className="relative grid grid-cols-12 gap-x-6 pt-5 lg:pt-7">
          <h1
            id="hero-title"
            className="col-[1/-1] row-[1/2] font-display text-[clamp(3.6rem,17.2vw,9.5rem)] leading-[0.84] tracking-[-0.012em] lg:row-[1/3] lg:grid lg:grid-rows-subgrid lg:text-hero"
          >
            <span className="line-mask">
              <span>
                Built for<span className="hidden lg:inline"> the</span>
                <span aria-hidden="true" className="hidden lg:inline">
                  {" "}
                  <HeadlinePill />
                </span>
              </span>
            </span>
            <span className="line-mask lg:hidden">
              <span>
                the <HeadlinePill />
              </span>
            </span>
            <span className="line-mask">
              <span>
                last rep<span className="text-ember">.</span>
              </span>
            </span>
          </h1>

          <Spark
            data-hero-spark
            className="pointer-events-none absolute right-0 top-4 size-[clamp(3.25rem,9vw,5rem)] text-ember motion-safe:animate-[spin_14s_linear_infinite] lg:hidden"
          />

          <div className="col-[1/-1] row-[2/3] mt-6 flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between lg:col-[8/13] lg:mt-0 lg:flex-col lg:items-start lg:justify-start lg:self-start lg:pt-[clamp(0.6rem,1.5vw,1.6rem)]">
            <p data-hero-fade className="max-w-[26rem] text-lead text-mute-ink">
              Coached strength, conditioning and recovery under one roof — 1,900+ classes a month and coaches who learn
              your name.
            </p>
            <div data-hero-fade className="flex flex-wrap items-center gap-x-5 gap-y-3">
              <a href="#join" className="btn btn-ink" data-magnetic data-cursor-label="Join">
                <span className="btn-label">Claim a free week</span>
                <span className="btn-icon">
                  <ArrowUpRight />
                </span>
              </a>
              <a href="#timetable" className="link-line font-semibold">
                See the timetable <ArrowRight />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-12 gap-3 sm:gap-4 lg:mt-10">
          <div className="col-span-12 hidden flex-col gap-3 md:col-span-5 md:flex lg:col-span-4">
            <a
              href="#classes"
              data-hero-card
              data-cursor="media"
              data-cursor-label="Classes"
              className="group relative isolate block min-h-[clamp(18rem,30vw,30rem)] flex-1 overflow-clip rounded-lg bg-ink text-chalk"
            >
              <div data-hero-media className="absolute inset-0">
                <Image
                  src="/art/ropes.webp"
                  alt="Thermal render of an athlete whipping battle ropes"
                  fill
                  sizes="(min-width: 1024px) 30vw, 40vw"
                  className="object-cover object-[30%_50%] transition-transform duration-(--dur-4) ease-out-expo group-hover:scale-105"
                />
              </div>
              <div className="absolute inset-0 bg-[linear-gradient(to_top,rgb(13_13_12/.8),transparent_55%)]" />
              <div className="absolute inset-x-5 bottom-5 flex items-end justify-between gap-4">
                <p className="font-display text-[clamp(1.5rem,1rem+1.4vw,2.25rem)] leading-[0.92]">
                  Reach your
                  <br />
                  body goals
                </p>
                <span className="grid size-11 shrink-0 place-items-center rounded-full bg-ember text-ink transition-transform duration-(--dur-2) ease-out-expo group-hover:-rotate-45">
                  <ArrowRight />
                </span>
              </div>
            </a>
            <div data-hero-fade className="flex items-center gap-3 rounded-full bg-ink py-2 pl-2 pr-5 text-chalk">
              <div className="flex -space-x-2" aria-hidden="true">
                {members.map((m) => (
                  <span
                    key={m.i}
                    className={`grid size-9 place-items-center rounded-full bg-gradient-to-br ${m.c} text-[0.65rem] font-bold text-ink ring-2 ring-ink`}
                  >
                    {m.i}
                  </span>
                ))}
              </div>
              <p className="text-small leading-tight">
                <strong className="font-display text-xl tracking-wide">12,400+</strong>
                <span className="block text-mute">members training with us</span>
              </p>
            </div>
          </div>

          <div className="relative col-span-12 md:col-span-7 lg:col-span-8">
            <div
              data-hero-card
              className="relative aspect-[4/5] h-full overflow-clip rounded-lg bg-ink xs:aspect-square sm:aspect-[16/11] md:aspect-auto md:min-h-[clamp(22rem,36vw,36rem)]"
            >
              <HeroMedia />
            </div>
            <div
              data-hero-spark
              aria-hidden="true"
              className="pointer-events-none absolute -right-4 -top-12 z-10 hidden size-[clamp(5.5rem,8vw,8rem)] place-items-center rounded-full bg-chalk lg:grid"
            >
              <Spark className="size-[72%] text-ember motion-safe:animate-[spin_14s_linear_infinite]" />
            </div>
          </div>
        </div>
      </div>
      <HeroIntro />
    </section>
  );
}

function HeadlinePill() {
  return (
    <span data-hero-pill className="pill-media bg-ink">
      <Image
        src="/art/boxing.webp"
        alt=""
        fill
        sizes="20vw"
        className="object-cover object-[50%_32%] motion-safe:animate-[pill-pan_9s_ease-in-out_infinite_alternate]"
      />
    </span>
  );
}
