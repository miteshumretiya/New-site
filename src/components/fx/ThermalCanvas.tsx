"use client";

import { useEffect, useRef } from "react";

type Props = {
  /** Called with the current rep count each time the lifter locks out. */
  onRep?: (rep: number) => void;
  className?: string;
};

/**
 * Live thermal render of an athlete doing thrusters. The static poster image
 * underneath carries LCP and the no-JS / reduced-motion experience; this
 * canvas only boots once the page is idle, renders at a deliberately low
 * internal resolution (thermal cameras are low-res anyway), pauses when
 * off-screen or in a background tab, and fades in over the poster.
 */
export function ThermalCanvas({ onRep, className = "" }: Props) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const onRepRef = useRef(onRep);
  useEffect(() => {
    onRepRef.current = onRep;
  }, [onRep]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
    if (reduce || conn?.saveData) return;

    let disposed = false;
    let raf = 0;
    let visible = false;
    let started = false;
    let cleanup = () => {};

    const boot = async () => {
      const [{ createRenderer, sceneUniforms }, { heroScene, thrusterPhase }] = await Promise.all([
        import("@/lib/thermal/shader"),
        import("@/lib/thermal/poses"),
      ]);
      if (disposed) return;
      let renderer: ReturnType<typeof createRenderer>;
      try {
        renderer = createRenderer(canvas);
      } catch {
        return;
      }
      if (!renderer) return;

      // No GPU (software rasteriser) → the shader would run on the CPU. Keep
      // the poster instead; it is the same scene, just standing still.
      const gl = renderer.gl;
      const info = gl.getExtension("WEBGL_debug_renderer_info");
      const gpu = String(gl.getParameter(info ? info.UNMASKED_RENDERER_WEBGL : gl.RENDERER) ?? "");
      if (/swiftshader|llvmpipe|softpipe|software|basic render/i.test(gpu)) {
        renderer.dispose();
        return;
      }

      const resize = () => {
        const r = canvas.getBoundingClientRect();
        const scale = Math.min(window.devicePixelRatio || 1, 2) * 0.55;
        const w = Math.min(Math.round(r.width * scale), 1100);
        canvas.width = Math.max(w, 2);
        canvas.height = Math.max(Math.round((w * r.height) / Math.max(r.width, 1)), 2);
      };
      resize();
      const ro = new ResizeObserver(resize);
      ro.observe(canvas);

      const t0 = performance.now();
      let lastRepAt = -1;
      let reps = 0;
      // Frame-time guard: if the first frames crawl, retire to the poster.
      const deltas: number[] = [];
      let prev = 0;
      const frame = (now: number) => {
        raf = 0;
        if (!visible || document.hidden) {
          prev = 0;
          return;
        }
        if (prev && deltas.length < 40) {
          deltas.push(now - prev);
          if (deltas.length === 40) {
            const sorted = [...deltas].sort((a, b) => a - b);
            if (sorted[20] > 45) {
              canvas.dataset.live = "false";
              cleanup();
              return;
            }
          }
        }
        prev = now;
        const t = (now - t0) / 1000;
        const s = thrusterPhase(t);
        const scene = heroScene(s, Math.sin(t * 2.1) * 0.004);
        renderer!.draw(sceneUniforms(scene), t);
        const cycle = Math.floor(t / 2.6);
        if (s === 1 && cycle !== lastRepAt) {
          lastRepAt = cycle;
          reps = (reps % 8) + 1;
          onRepRef.current?.(reps);
        }
        if (!started) {
          started = true;
          canvas.dataset.live = "true";
        }
        raf = requestAnimationFrame(frame);
      };
      const kick = () => {
        if (!raf && visible && !document.hidden) raf = requestAnimationFrame(frame);
      };
      const io = new IntersectionObserver(([entry]) => {
        visible = entry.isIntersecting;
        kick();
      });
      io.observe(canvas);
      document.addEventListener("visibilitychange", kick);

      cleanup = () => {
        cancelAnimationFrame(raf);
        io.disconnect();
        ro.disconnect();
        document.removeEventListener("visibilitychange", kick);
        renderer!.dispose();
      };
    };

    // Wait for the intro to finish and the main thread to go quiet.
    const ric: (cb: () => void) => number =
      (
        window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number }
      ).requestIdleCallback?.bind(window) ?? ((cb) => window.setTimeout(cb, 1));
    const timer = window.setTimeout(() => ric(() => void boot()), 2600);

    return () => {
      disposed = true;
      window.clearTimeout(timer);
      cleanup();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className={`absolute inset-0 h-full w-full opacity-0 transition-opacity duration-[1200ms] data-[live=true]:opacity-100 ${className}`}
    />
  );
}
