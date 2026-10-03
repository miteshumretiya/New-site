import { coaches } from "@/content/site";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { CoachCard } from "./CoachCard";

export function Coaches() {
  return (
    <section
      id="coaches"
      data-nav-theme="dark"
      aria-labelledby="coaches-title"
      className="relative overflow-clip py-section"
    >
      <div className="container-x">
        <div className="grid grid-cols-12 items-end gap-6">
          <SectionHeading
            index="03"
            eyebrow="Coaches"
            id="coaches-title"
            className="col-span-12 lg:col-span-7"
            title={
              <>
                Meet the <span className="text-ember">crash.</span>
              </>
            }
          />
          <p
            data-reveal
            className="col-span-12 max-w-[30rem] text-mute lg:col-[9/13] lg:justify-self-end lg:text-right"
          >
            A group of rhinos is called a crash. Ours is 38 certified coaches strong — here are four you&apos;ll meet in
            your first week. Tap a card for the full story.
          </p>
        </div>
      </div>

      <ul className="coach-rail mt-12 lg:mt-16">
        {coaches.map((c, i) => (
          <li key={c.id} className="coach-rail__item" style={{ ["--i" as string]: i }}>
            <div data-parallax-lg={i % 2 === 0 ? "-8" : "8"}>
              <CoachCard coach={c} />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
