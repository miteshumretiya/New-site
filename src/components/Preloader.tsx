import { Spark } from "@/components/ui/Mark";

/** Pure-CSS preloader (see globals.css). Rendered for everyone but only
 *  displayed when JS is on, first visit in the session, motion allowed.
 *  It removes itself after ~1.4s whether or not scripts have loaded. */
export function Preloader() {
  const word = "RHINOS".split("");
  return (
    <div className="preloader" aria-hidden="true">
      <span className="preloader__bar" />
      <div className="preloader__word font-display">
        {word.map((ch, i) => (
          <span key={i} style={{ ["--i" as string]: i }}>
            {ch}
          </span>
        ))}
      </div>
      <div className="preloader__meta label text-mute">
        <span className="flex items-center gap-2">
          <Spark className="size-3 text-ember" /> Strength &amp; conditioning club
        </span>
        <span className="preloader__count tabular text-chalk" />
      </div>
    </div>
  );
}
