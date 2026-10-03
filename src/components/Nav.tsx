"use client";

import { useEffect, useRef, useState } from "react";
import { nav, site } from "@/content/site";
import { ArrowUpRight, Logo } from "@/components/ui/Mark";
import { EASE, prefersReducedMotion, stagger } from "@/lib/motion";
import { scrollToTarget } from "@/components/fx/SmoothScroll";

export function Nav() {
  const [open, setOpen] = useState(false);
  const header = useRef<HTMLElement>(null);
  const menu = useRef<HTMLDivElement>(null);
  const button = useRef<HTMLButtonElement>(null);
  const firstRun = useRef(true);

  /* Hide on scroll down, show on scroll up, go more opaque after the hero. */
  useEffect(() => {
    const el = header.current!;
    let lastY = window.scrollY;
    let ticking = false;
    const update = () => {
      ticking = false;
      const y = window.scrollY;
      const hero = document.getElementById("top");
      el.dataset.solid = String(y > (hero?.offsetHeight ?? window.innerHeight) - 96);
      if (Math.abs(y - lastY) < 6) return;
      const goingDown = y > lastY && y > 160;
      el.dataset.hidden = String(goingDown && !el.contains(document.activeElement));
      lastY = y;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    const onFocus = () => (el.dataset.hidden = "false");
    window.addEventListener("scroll", onScroll, { passive: true });
    el.addEventListener("focusin", onFocus);
    update();
    return () => {
      window.removeEventListener("scroll", onScroll);
      el.removeEventListener("focusin", onFocus);
    };
  }, []);

  /* Match the glass to whatever section sits under the bar (AA contrast on
     light and dark surfaces), and highlight the section in view. */
  useEffect(() => {
    const el = header.current!;
    let themeIO: IntersectionObserver | undefined;
    let spyIO: IntersectionObserver | undefined;
    const links = Array.from(el.querySelectorAll<HTMLAnchorElement>("[data-spy]"));

    const setup = () => {
      themeIO?.disconnect();
      spyIO?.disconnect();
      const probe = 40;
      themeIO = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (e.isIntersecting) el.dataset.theme = (e.target as HTMLElement).dataset.navTheme ?? "dark";
          }
        },
        { rootMargin: `-${probe}px 0px -${Math.max(window.innerHeight - probe - 2, 0)}px 0px` },
      );
      document.querySelectorAll<HTMLElement>("[data-nav-theme]").forEach((s) => themeIO!.observe(s));

      spyIO = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (!e.isIntersecting) continue;
            const id = `#${(e.target as HTMLElement).id}`;
            links.forEach((a) => {
              if (a.getAttribute("href") === id) a.setAttribute("aria-current", "location");
              else a.removeAttribute("aria-current");
            });
          }
        },
        { rootMargin: "-45% 0px -54% 0px" },
      );
      document.querySelectorAll<HTMLElement>("main section[id]").forEach((s) => spyIO!.observe(s));
    };
    setup();
    window.addEventListener("resize", setup);
    return () => {
      themeIO?.disconnect();
      spyIO?.disconnect();
      window.removeEventListener("resize", setup);
    };
  }, []);

  /* Full-screen menu: clip-path wipe + staggered links (Web Animations API,
     so it works the instant the page hydrates). Locks scroll while open. */
  useEffect(() => {
    const html = document.documentElement;
    const el = menu.current!;
    if (firstRun.current) {
      firstRun.current = false;
      if (!open) return;
    }
    const reduce = prefersReducedMotion();
    el.getAnimations({ subtree: true }).forEach((a) => a.cancel());
    if (open) {
      window.__lenis?.stop();
      html.style.overflow = "hidden";
      el.style.visibility = "visible";
      if (!reduce) {
        el.animate([{ clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)" }], {
          duration: 700,
          easing: EASE.inOut,
        });
        stagger(el.querySelectorAll("[data-menu-item]"), [{ transform: "translateY(110%)" }, { transform: "none" }], {
          duration: 900,
          delay: 350,
          each: 60,
        });
      }
      const first = el.querySelector<HTMLElement>("a, button");
      requestAnimationFrame(() => first?.focus({ preventScroll: true }));
    } else {
      window.__lenis?.start();
      html.style.overflow = "";
      if (reduce) {
        el.style.visibility = "hidden";
        return;
      }
      const out = el.animate([{ clipPath: "inset(0% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 100% 0%)" }], {
        duration: 500,
        easing: EASE.inOut,
        fill: "forwards",
      });
      out.onfinish = () => {
        el.style.visibility = "hidden";
        out.cancel();
      };
    }
  }, [open]);

  /* Escape closes, Tab stays inside the open menu. */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        button.current?.focus();
      }
      if (e.key !== "Tab") return;
      const focusables = [
        button.current,
        ...Array.from(menu.current!.querySelectorAll<HTMLElement>("a, button")),
      ].filter(Boolean) as HTMLElement[];
      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const close = () => mq.matches && setOpen(false);
    mq.addEventListener("change", close);
    return () => mq.removeEventListener("change", close);
  }, []);

  const go = (href: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setOpen(false);
    window.setTimeout(() => scrollToTarget(href), 60);
  };

  return (
    <header ref={header} className="nav" data-theme="light" data-hidden="false" data-solid="false" data-open={open}>
      <div className="container-x">
        <nav aria-label="Primary" className="nav-pill">
          <a href="#top" className="nav-logo" aria-label={`${site.name} — back to top`}>
            <Logo />
          </a>

          <ul className="hidden items-center gap-1 lg:flex">
            {nav.map((item) => (
              <li key={item.href}>
                <a href={item.href} data-spy className="nav-link">
                  <span className="roll" data-text={item.label}>
                    <span>{item.label}</span>
                  </span>
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-2">
            <a href="#join" className="btn btn-ember nav-cta" data-magnetic="0.25">
              <span className="btn-label">Free week</span>
              <span className="btn-icon">
                <ArrowUpRight className="size-3.5" />
              </span>
            </a>
            <button
              ref={button}
              type="button"
              className="menu-btn lg:hidden"
              aria-expanded={open}
              aria-controls="mobile-menu"
              aria-label={open ? "Close menu" : "Open menu"}
              onClick={() => setOpen((o) => !o)}
            >
              <span className="burger" aria-hidden="true">
                <span />
                <span />
              </span>
            </button>
          </div>
        </nav>
      </div>

      <div
        id="mobile-menu"
        ref={menu}
        className="mobile-menu"
        role="dialog"
        aria-modal="true"
        aria-label="Site menu"
        inert={!open}
      >
        <div className="container-x flex h-full flex-col justify-between pb-[max(2rem,env(safe-area-inset-bottom))] pt-28">
          <ul className="flex flex-col gap-1">
            {nav.map((item, i) => (
              <li key={item.href} className="overflow-clip">
                <a
                  href={item.href}
                  onClick={go(item.href)}
                  data-menu-item
                  className="group flex items-baseline gap-4 py-1 font-display text-[clamp(3rem,13vw,5.5rem)] leading-[0.92]"
                >
                  <span className="label text-ember">{String(i + 1).padStart(2, "0")}</span>
                  <span className="transition-transform duration-(--dur-2) ease-out-expo group-hover:translate-x-2">
                    {item.label}
                  </span>
                </a>
              </li>
            ))}
          </ul>
          <div className="grid gap-6 border-t border-line pt-6 sm:grid-cols-2">
            <div className="overflow-clip">
              <div data-menu-item className="flex flex-col gap-1">
                <span className="label text-mute">Talk to us</span>
                <a href={site.phone.href} className="text-lead">
                  {site.phone.display}
                </a>
                <a href={site.email.href} className="text-lead">
                  {site.email.display}
                </a>
              </div>
            </div>
            <div className="overflow-clip">
              <div data-menu-item>
                <a href="#join" onClick={go("#join")} className="btn btn-ember w-full sm:w-auto">
                  <span className="btn-label">Claim your free week</span>
                  <span className="btn-icon">
                    <ArrowUpRight />
                  </span>
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
