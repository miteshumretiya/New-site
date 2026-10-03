import Image from "next/image";
import { stats } from "@/content/site";
import { Spark } from "@/components/ui/Mark";
import { ManifestoFx } from "./ManifestoFx";

function Chip({ src, pos, label }: { src: string; pos: string; label: string }) {
  return (
    <span
      data-chip
      className="relative mx-[0.12em] inline-block h-[0.78em] w-[1.5em] -translate-y-[0.04em] overflow-clip rounded-full align-middle bg-ink-3"
      role="img"
      aria-label={label}
    >
      <Image src={src} alt="" fill sizes="10rem" className="object-cover" style={{ objectPosition: pos }} />
    </span>
  );
}

/** Scroll-scrubbed manifesto: words brighten as you read (ManifestoFx),
 *  inline thermal chips punctuate the line, counters close the section. */
export function Manifesto() {
  return (
    <section aria-label="Our philosophy" data-nav-theme="dark" className="relative py-section">
      <div className="container-x">
        <div className="relative mx-auto max-w-[72rem] text-center">
          <Spark className="mx-auto mb-8 size-10 text-ember motion-safe:animate-[spin_12s_linear_infinite]" />
          <blockquote>
            <p
              data-manifesto
              className="font-display text-[clamp(2.1rem,1.1rem+4.2vw,5.5rem)] leading-[0.98] tracking-[-0.005em] [text-wrap:balance]"
            >
              Nobody remembers the easy sets.{" "}
              <Chip src="/art/deadlift.webp" pos="40% 45%" label="Thermal crop of a heavy deadlift" />
              We live for the last three reps — the ones that shake,{" "}
              <Chip src="/art/boxing.webp" pos="70% 30%" label="Thermal crop of a jab" /> the ones that count, the ones
              that quietly turn showing up{" "}
              <Chip src="/art/flow.webp" pos="50% 40%" label="Thermal crop of a warrior pose" /> into who you are.
            </p>
            <footer data-reveal className="label mt-10 flex items-center justify-center gap-3 text-mute">
              <span className="h-px w-8 bg-line" /> Dara Okafor, Head of Strength <span className="h-px w-8 bg-line" />
            </footer>
          </blockquote>
        </div>

        <dl
          data-reveal-group
          className="mt-[clamp(4rem,8vw,7rem)] grid grid-cols-2 gap-x-6 gap-y-10 border-t border-line pt-10 lg:grid-cols-4"
        >
          {stats.map((s) => {
            const prefix = "prefix" in s ? s.prefix : "";
            const finalText = new Intl.NumberFormat("en-US").format(s.value);
            return (
              <div key={s.label} className="flex flex-col gap-3">
                <dt className="label order-2 text-mute">{s.label}</dt>
                <dd className="order-1 whitespace-nowrap font-display text-[clamp(2.5rem,1.2rem+4vw,5.5rem)] leading-[0.9]">
                  {prefix}
                  <span className="relative inline-block tabular">
                    <span className="invisible">{finalText}</span>
                    <span className="absolute inset-0 text-right" data-counter={s.value}>
                      {finalText}
                    </span>
                  </span>
                  <span className="text-ember normal-case">{s.suffix}</span>
                </dd>
              </div>
            );
          })}
        </dl>
      </div>
      <ManifestoFx />
    </section>
  );
}
