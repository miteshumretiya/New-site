import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import "./globals.css";
import { site } from "@/content/site";
import { Preloader } from "@/components/Preloader";
import { Nav } from "@/components/Nav";
import { SmoothScroll } from "@/components/fx/SmoothScroll";
import { Cursor } from "@/components/fx/Cursor";
import { Magnetic } from "@/components/fx/Magnetic";
import { ScrollFx } from "@/components/fx/ScrollFx";

/* Self-hosted, range-limited subsets of Archivo and JetBrains Mono (SIL OFL,
   see src/fonts and scripts/subset-fonts.py). One Archivo file covers both the
   ultra-condensed display cut (wdth 62) and the body text (wdth 100). */
const archivo = localFont({
  src: "../fonts/Archivo-latin-var.woff2",
  weight: "400 900",
  style: "normal",
  variable: "--font-archivo",
  display: "swap",
  declarations: [{ prop: "font-stretch", value: "62% 100%" }],
  adjustFontFallback: "Arial",
});

const jetbrains = localFont({
  src: "../fonts/JetBrainsMono-latin-var.woff2",
  weight: "400 600",
  style: "normal",
  variable: "--font-jetbrains",
  display: "swap",
  preload: false,
  adjustFontFallback: false,
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: `${site.name} — ${site.tagline} Strength & conditioning in Los Angeles`,
    template: `%s — ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  keywords: [
    "gym Los Angeles",
    "strength and conditioning",
    "Arts District gym",
    "boxing classes LA",
    "indoor cycling",
    "personal training",
    "recovery sauna cold plunge",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: "/",
    siteName: site.name,
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
    locale: "en_US",
  },
  twitter: {
    card: "summary_large_image",
    title: `${site.name} — ${site.tagline}`,
    description: site.description,
  },
  robots: { index: true, follow: true },
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: "#0d0d0c",
  colorScheme: "dark",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

/* Runs before first paint: flags JS support (enables preloader + motion
   initial states) and skips the preloader on repeat visits this session. */
const bootScript = `(function(){var d=document.documentElement;d.classList.add('js');try{if(sessionStorage.getItem('rhinos:seen')){d.classList.add('no-preloader')}else{sessionStorage.setItem('rhinos:seen','1')}}catch(e){}})();`;

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className={`${archivo.variable} ${jetbrains.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: bootScript }} />
      </head>
      <body>
        <Preloader />
        <a
          href="#main"
          className="label sr-only z-[95] rounded-full bg-ember px-4 py-3 text-ink focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
        >
          Skip to content
        </a>
        <Nav />
        {children}
        <SmoothScroll />
        <ScrollFx />
        <Magnetic />
        <Cursor />
      </body>
    </html>
  );
}
