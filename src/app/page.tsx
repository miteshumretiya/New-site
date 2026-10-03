import { Hero } from "@/components/sections/Hero";
import { Marquee } from "@/components/sections/Marquee";
import { Facilities } from "@/components/sections/Facilities";
import { Classes } from "@/components/sections/Classes";
import { Manifesto } from "@/components/sections/Manifesto";
import { Coaches } from "@/components/sections/Coaches";
import { Timetable } from "@/components/sections/Timetable";
import { Membership } from "@/components/sections/Membership";
import { Join } from "@/components/sections/Join";
import { Footer } from "@/components/sections/Footer";
import { site } from "@/content/site";

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ExerciseGym",
  name: site.legalName,
  alternateName: site.name,
  description: site.description,
  slogan: site.tagline,
  url: site.url,
  telephone: "+1-213-555-0148",
  email: site.email.display,
  image: `${site.url}/opengraph-image.png`,
  priceRange: "$59–$239",
  address: {
    "@type": "PostalAddress",
    streetAddress: site.address.line1,
    addressLocality: "Los Angeles",
    addressRegion: "CA",
    postalCode: "90021",
    addressCountry: "US",
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: "05:00",
      closes: "23:00",
    },
    { "@type": "OpeningHoursSpecification", dayOfWeek: ["Saturday", "Sunday"], opens: "07:00", closes: "21:00" },
  ],
};

export default function Home() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd).replace(/</g, "\\u003c") }}
      />
      <main id="main">
        <Hero />
        <Marquee />
        <Facilities />
        <Classes />
        <Manifesto />
        <Coaches />
        <Timetable />
        <Membership />
        <Join />
      </main>
      <Footer />
    </>
  );
}
