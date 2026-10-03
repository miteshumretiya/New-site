import { nav, site } from "@/content/site";
import { ArrowUp, Spark } from "@/components/ui/Mark";
import { FooterFx } from "./FooterFx";

export function Footer() {
  const year = 2026;
  return (
    <footer data-nav-theme="dark" className="relative overflow-clip border-t border-line pt-section">
      <div className="container-x">
        <h2 data-split className="font-display text-display">
          <span className="text-chalk/45">Feel great.</span> Body and mind.
        </h2>

        <div className="mt-[clamp(3rem,6vw,5.5rem)] grid grid-cols-2 gap-x-6 gap-y-10 border-t border-line pt-10 md:grid-cols-4">
          <div className="flex flex-col gap-3">
            <h3 className="label text-mute">Visit</h3>
            <address className="not-italic leading-relaxed">
              {site.address.line1}
              <br />
              {site.address.line2}
            </address>
            <p className="text-small text-mute">Parking &amp; bike racks on site</p>
          </div>
          <div className="flex flex-col gap-3">
            <h3 className="label text-mute">Hours</h3>
            <dl className="grid gap-1 leading-relaxed">
              {site.hours.map((h) => (
                <div key={h.days} className="flex flex-col xs:flex-row xs:gap-3">
                  <dt className="text-mute">{h.days}</dt>
                  <dd className="tabular">{h.time}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="col-span-2 flex flex-col gap-3 xs:col-span-1">
            <h3 className="label text-mute">Talk to us</h3>
            <a href={site.phone.href} className="link-line self-start">
              {site.phone.display}
            </a>
            <a href={site.email.href} className="link-line self-start">
              {site.email.display}
            </a>
            <p className="text-small text-mute">{site.social} everywhere</p>
          </div>
          <nav aria-label="Footer" className="flex flex-col gap-3">
            <h3 className="label text-mute">Explore</h3>
            <ul className="flex flex-col gap-1">
              {nav.map((n) => (
                <li key={n.href}>
                  <a href={n.href} className="link-line">
                    {n.label}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>

      <div className="container-x mt-[clamp(3rem,6vw,5rem)]" aria-hidden="true">
        <div
          data-footer-word
          className="flex justify-between overflow-clip font-display leading-[0.8] text-chalk [font-size:calc((min(100vw,var(--container))-2*var(--spacing-gutter))*0.345)]"
        >
          {"RHINOS".split("").map((ch, i) => (
            <span key={i} className="block">
              {ch}
            </span>
          ))}
        </div>
      </div>

      <div className="container-x">
        <div className="flex flex-col gap-4 border-t border-line py-6 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:flex-row sm:items-center sm:justify-between">
          <p className="label flex items-center gap-2 text-mute">
            <Spark className="size-3 text-ember" />© {year} {site.legalName}
          </p>
          <p className="label text-mute">Artwork: in-house thermal renders</p>
          <a href="#top" className="label inline-flex min-h-11 items-center gap-2 self-start text-chalk sm:self-auto">
            Back to top <ArrowUp className="size-3.5" />
          </a>
        </div>
      </div>
      <FooterFx />
    </footer>
  );
}
