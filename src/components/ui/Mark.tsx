import type { SVGProps } from "react";

/** The Rhinos spark — eight chunky arms, used as logo mark and accent. */
export function Spark({ className, ...props }: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="-50 -50 100 100" aria-hidden="true" focusable="false" className={className} {...props}>
      <g fill="currentColor">
        {[0, 45, 90, 135].map((a) => (
          <rect key={a} x="-10" y="-48" width="20" height="96" rx="10" transform={`rotate(${a})`} />
        ))}
      </g>
    </svg>
  );
}

export function Logo({ className = "" }: { className?: string }) {
  return (
    <span className={`inline-flex items-center gap-2 ${className}`}>
      <Spark className="size-[1.05em] text-ember" />
      <span className="font-display text-[1.35em] leading-none tracking-[0.01em]">Rhinos</span>
    </span>
  );
}

export function ArrowUpRight({ className = "size-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path d="M7 17 17 7M8 7h9v9" />
    </svg>
  );
}

export function ArrowRight({ className = "size-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path d="M4 12h16M14 6l6 6-6 6" />
    </svg>
  );
}

export function ArrowLeft({ className = "size-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path d="M20 12H4M10 6l-6 6 6 6" />
    </svg>
  );
}

export function ArrowUp({ className = "size-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path d="M12 20V4M6 10l6-6 6 6" />
    </svg>
  );
}

export function Plus({ className = "size-4" }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      aria-hidden="true"
      focusable="false"
      className={className}
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}
