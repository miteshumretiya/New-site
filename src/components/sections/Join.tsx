import Image from "next/image";
import { site } from "@/content/site";
import { ArrowUpRight } from "@/components/ui/Mark";

export function Join() {
  return (
    <section id="join" data-nav-theme="dark" aria-labelledby="join-title" className="relative overflow-clip py-section">
      <div className="container-x">
        <div className="relative overflow-clip rounded-xl border border-line bg-ink-2">
          <div className="absolute inset-0 opacity-55" aria-hidden="true">
            <Image src="/art/sled.webp" alt="" fill sizes="100vw" className="object-cover object-[60%_45%]" />
            <div className="absolute inset-0 bg-[linear-gradient(100deg,rgb(21_21_19/.98)_30%,rgb(21_21_19/.75)_60%,rgb(21_21_19/.35))]" />
          </div>

          <div className="relative grid grid-cols-12 items-end gap-x-6 gap-y-10 p-[clamp(1.5rem,1rem+3vw,4.5rem)]">
            <div className="col-span-12 flex flex-col gap-7 lg:col-span-9">
              <p data-reveal className="label flex items-center gap-3 text-mute">
                <span className="text-ember">(06)</span>
                <span className="h-px w-8 bg-line" />
                Free week
              </p>
              <h2 id="join-title" data-split className="font-display text-display">
                Get fit for real. <span className="text-ember">Your first week</span> is on us.
              </h2>
              <p data-reveal className="max-w-[36rem] text-lead text-mute">
                Seven days, every class, no card required. Tell us when you&apos;d like to come in and a coach will be
                waiting at the front desk.
              </p>
              <div data-reveal className="flex flex-wrap items-center gap-3">
                <a href={site.email.href} className="btn btn-ember" data-magnetic>
                  <span className="btn-label">Claim your free week</span>
                  <span className="btn-icon">
                    <ArrowUpRight />
                  </span>
                </a>
                <a href={site.phone.href} className="btn btn-ghost">
                  <span className="btn-label">Call {site.phone.display}</span>
                </a>
              </div>
            </div>

            <div className="col-span-12 flex lg:col-span-3 lg:justify-end">
              <a
                href={site.email.href}
                className="join-orb group"
                data-magnetic="0.45"
                data-cursor="hidden"
                aria-label="Email us to claim your free week"
              >
                <span data-magnetic-inner className="relative grid size-full place-items-center">
                  <svg
                    viewBox="0 0 100 100"
                    className="absolute inset-0 size-full motion-safe:animate-[spin_18s_linear_infinite]"
                    aria-hidden="true"
                  >
                    <defs>
                      <path id="orb-circle" d="M50,50 m-40,0 a40,40 0 1,1 80,0 a40,40 0 1,1 -80,0" />
                    </defs>
                    <text className="fill-chalk font-mono text-[8.5px] uppercase tracking-[0.22em]">
                      <textPath href="#orb-circle">Free week * No card * Every class * </textPath>
                    </text>
                  </svg>
                  <span className="grid size-[46%] place-items-center rounded-full bg-ember text-ink transition-transform duration-(--dur-3) ease-out-expo group-hover:scale-110">
                    <ArrowUpRight className="size-7 transition-transform duration-(--dur-3) ease-out-expo group-hover:rotate-45" />
                  </span>
                </span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
