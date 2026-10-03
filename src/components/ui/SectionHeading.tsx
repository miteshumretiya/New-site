import type { ReactNode } from "react";

type Props = {
  index: string;
  eyebrow: string;
  title: ReactNode;
  id: string;
  className?: string;
  tone?: "dark" | "light";
  as?: "h2" | "h3";
  size?: "display" | "title";
};

/** Eyebrow + split-reveal title used to open every section. */
export function SectionHeading({
  index,
  eyebrow,
  title,
  id,
  className = "",
  tone = "dark",
  as: Tag = "h2",
  size = "display",
}: Props) {
  return (
    <div className={`flex flex-col gap-5 ${className}`}>
      <p data-reveal className={`label flex items-center gap-3 ${tone === "dark" ? "text-mute" : "text-mute-ink"}`}>
        <span className="text-ember">({index})</span>
        <span className={`h-px w-8 ${tone === "dark" ? "bg-line" : "bg-line-ink"}`} />
        {eyebrow}
      </p>
      <Tag id={id} data-split className={`font-display ${size === "display" ? "text-display" : "text-title"}`}>
        {title}
      </Tag>
    </div>
  );
}
