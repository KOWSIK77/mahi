import type { AnchorHTMLAttributes, ReactNode } from "react";
import { ArrowRight } from "lucide-react";

type Variant = "primary" | "light" | "ghost-dark" | "outline";

const styles: Record<Variant, string> = {
  primary:
    "bg-grad-brand text-white shadow-[0_8px_24px_-8px_rgba(40,85,217,0.7)] hover:bg-right hover:shadow-[0_12px_32px_-8px_rgba(22,119,248,0.75)]",
  light: "bg-white text-navy-900 hover:bg-cloud",
  "ghost-dark": "border border-white/25 text-white hover:border-white/60 hover:bg-white/5",
  outline: "border border-line bg-white text-navy-900 hover:border-brand hover:text-brand",
};

type Props = AnchorHTMLAttributes<HTMLAnchorElement> & {
  variant?: Variant;
  arrow?: boolean;
  size?: "md" | "sm";
  children: ReactNode;
};

export function buttonClass(variant: Variant = "primary", size: "md" | "sm" = "md") {
  return [
    "group inline-flex items-center justify-center gap-2 rounded-full font-semibold whitespace-nowrap",
    "transition-[background-color,background-position,border-color,color,box-shadow,transform] duration-300 ease-out-expo active:scale-[0.98]",
    size === "md" ? "h-13 px-7 text-[0.9375rem]" : "h-10 px-5 text-sm",
    styles[variant],
  ].join(" ");
}

export default function Button({ variant = "primary", arrow, size = "md", className = "", children, ...rest }: Props) {
  return (
    <a className={`${buttonClass(variant, size)} ${className}`} {...rest}>
      {children}
      {arrow && (
        <ArrowRight aria-hidden className="size-4 transition-transform duration-300 ease-out-expo group-hover:translate-x-0.5" />
      )}
    </a>
  );
}
