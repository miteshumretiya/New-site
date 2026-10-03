"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/gsap";

type State = "default" | "link" | "media" | "label" | "hidden";

/** Dot + lagging ring cursor. Only mounts behaviour on fine-pointer, hover
 *  capable devices without reduced motion; otherwise the native cursor stays.
 *  Elements can opt into states with data-cursor="media|label|hidden" and
 *  data-cursor-label="View". */
export function Cursor() {
  const root = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const label = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    if (!fine.matches || prefersReducedMotion() || !root.current) return;

    const html = document.documentElement;
    const el = root.current;
    const pos = { x: -100, y: -100 };
    const dotPos = { ...pos };
    const ringPos = { ...pos };
    let visible = false;
    let state: State = "default";

    const setState = (next: State, text = "") => {
      if (label.current && text) label.current.textContent = text;
      if (next === state) return;
      state = next;
      el.dataset.state = next;
    };

    const onMove = (e: PointerEvent) => {
      if (e.pointerType !== "mouse") return;
      pos.x = e.clientX;
      pos.y = e.clientY;
      if (!visible) {
        visible = true;
        dotPos.x = ringPos.x = pos.x;
        dotPos.y = ringPos.y = pos.y;
        html.classList.add("has-cursor");
      }
      const target = (e.target as Element | null)?.closest<HTMLElement>(
        "[data-cursor], a, button, [role='tab'], label, summary, input, textarea, select",
      );
      if (!target) return setState("default");
      const kind = target.dataset.cursor as State | undefined;
      if (kind) return setState(kind, target.dataset.cursorLabel ?? "");
      if (target.matches("input, textarea, select")) return setState("hidden");
      setState("link");
    };
    const onLeave = () => setState("hidden");
    const onEnter = () => setState("default");

    const tick = () => {
      dotPos.x += (pos.x - dotPos.x) * 0.55;
      dotPos.y += (pos.y - dotPos.y) * 0.55;
      ringPos.x += (pos.x - ringPos.x) * 0.16;
      ringPos.y += (pos.y - ringPos.y) * 0.16;
      if (dot.current) dot.current.style.transform = `translate3d(${dotPos.x}px, ${dotPos.y}px, 0)`;
      if (ring.current) ring.current.style.transform = `translate3d(${ringPos.x}px, ${ringPos.y}px, 0)`;
    };

    window.addEventListener("pointermove", onMove, { passive: true });
    document.documentElement.addEventListener("pointerleave", onLeave);
    document.documentElement.addEventListener("pointerenter", onEnter);
    gsap.ticker.add(tick);

    return () => {
      window.removeEventListener("pointermove", onMove);
      document.documentElement.removeEventListener("pointerleave", onLeave);
      document.documentElement.removeEventListener("pointerenter", onEnter);
      gsap.ticker.remove(tick);
      html.classList.remove("has-cursor");
    };
  }, []);

  return (
    <div ref={root} className="cursor" data-state="default" aria-hidden="true">
      <div ref={ring} className="cursor__ring">
        <div className="cursor__ring-inner">
          <span ref={label} className="cursor__label">
            View
          </span>
        </div>
      </div>
      <div ref={dot} className="cursor__dot" />
    </div>
  );
}
