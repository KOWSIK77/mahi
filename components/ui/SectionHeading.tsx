import type { ReactNode } from "react";

type Props = {
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  tone?: "light" | "dark";
  align?: "left" | "center";
  className?: string;
  as?: "h2" | "h3";
};

export default function SectionHeading({
  eyebrow,
  title,
  intro,
  tone = "light",
  align = "left",
  className = "",
  as: Tag = "h2",
}: Props) {
  const dark = tone === "dark";
  return (
    <div className={`${align === "center" ? "mx-auto text-center" : ""} max-w-3xl ${className}`}>
      <p data-reveal className={`eyebrow flex items-center gap-3 ${align === "center" ? "justify-center" : ""} ${dark ? "text-brand-bright" : "text-brand"}`}>
        <span aria-hidden className="h-px w-8 bg-current" />
        {eyebrow}
      </p>
      <Tag
        data-reveal
        className={`mt-5 font-display text-[clamp(2.25rem,4vw,3.5rem)] font-semibold leading-[1.05] tracking-[-0.03em] text-balance ${dark ? "text-grad-light" : "text-grad-navy"}`}
      >
        {title}
      </Tag>
      {intro && (
        <p data-reveal className={`mt-6 max-w-[60ch] text-lg leading-relaxed ${align === "center" ? "mx-auto" : ""} ${dark ? "text-white/70" : "text-graphite"}`}>
          {intro}
        </p>
      )}
    </div>
  );
}
