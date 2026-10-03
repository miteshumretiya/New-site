import { disciplines, site } from "@/content/site";
import { Spark } from "@/components/ui/Mark";
import { MarqueeFx } from "./MarqueeFx";

/** Two crossing tapes. Speed and skew react to scroll velocity (MarqueeFx);
 *  without JS they fall back to a slow CSS loop, and stay still for
 *  reduced motion. */
export function Marquee() {
  const tapeA = disciplines;
  const tapeB = [`Open 05:00 – 23:00, every day`, `${site.address.line1}, Los Angeles`, "First week on us"];

  return (
    <section
      aria-label="Disciplines"
      data-nav-theme="dark"
      className="relative overflow-clip py-[clamp(4rem,9vw,8rem)]"
    >
      <ul className="sr-only">
        {disciplines.map((d) => (
          <li key={d}>{d}</li>
        ))}
      </ul>
      <div data-marquee-wrap className="relative" aria-hidden="true">
        <div className="relative z-10 -mx-4 -rotate-2 bg-ember py-3 text-ink sm:py-4">
          <Track
            items={tapeA}
            direction={1}
            className="font-display text-[clamp(2.25rem,1.4rem+3.6vw,5rem)] leading-none"
            sparkClass="text-ink"
          />
        </div>
        <div className="relative -mx-4 -mt-2 rotate-[1.5deg] border-y border-line bg-ink-2 py-3 text-chalk sm:py-4">
          <Track
            items={tapeB}
            direction={-1}
            className="font-display text-[clamp(1.5rem,1rem+2.2vw,3.25rem)] leading-none text-outline"
            sparkClass="text-ember"
          />
        </div>
      </div>
      <MarqueeFx />
    </section>
  );
}

function Track({
  items,
  direction,
  className,
  sparkClass,
}: {
  items: readonly string[];
  direction: 1 | -1;
  className: string;
  sparkClass: string;
}) {
  const row = (
    <div className="flex shrink-0 items-center gap-[0.45em] pr-[0.45em]">
      {items.map((item) => (
        <span key={item} className="flex items-center gap-[0.45em] whitespace-nowrap">
          {item}
          <Spark className={`size-[0.62em] shrink-0 ${sparkClass}`} />
        </span>
      ))}
    </div>
  );
  return (
    <div
      className={`flex w-max ${className}`}
      data-marquee-track
      data-direction={direction}
      style={{
        animation: `marquee ${direction === 1 ? 38 : 46}s linear infinite ${direction === 1 ? "normal" : "reverse"}`,
      }}
    >
      {row}
      {row}
    </div>
  );
}
