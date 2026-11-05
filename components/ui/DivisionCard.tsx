import Image from "next/image";
import { ArrowRight } from "lucide-react";
import EnquireLink from "./EnquireLink";
import type { DivisionOption } from "@/lib/site";

type Props = {
  index: string;
  name: DivisionOption;
  summary: string;
  products: string[];
  image: { src: string; alt: string };
  accent: string; // CSS color
  accentLabel: string;
};

export default function DivisionCard({ index, name, summary, products, image, accent, accentLabel }: Props) {
  return (
    <article
      data-reveal
      className="group flex flex-col overflow-hidden rounded-[var(--radius-feature)] border border-line bg-white transition-[box-shadow,transform] duration-500 ease-out-expo hover:-translate-y-1 hover:shadow-[0_30px_60px_-30px_rgba(16,29,46,0.35)]"
      style={{ ["--accent" as string]: accent }}
    >
      <div data-reveal-image className="relative aspect-[16/9] overflow-hidden bg-navy-900">
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes="(min-width: 1024px) 640px, 100vw"
          className="object-cover transition-transform duration-[1.2s] ease-out-expo group-hover:scale-[1.04]"
        />
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-navy-950/70 via-transparent to-transparent" />
        <span className="absolute left-6 top-6 inline-flex items-center gap-2 rounded-full bg-white/95 px-3.5 py-1.5 text-[0.6875rem] font-semibold tracking-[0.16em] text-navy-900 uppercase backdrop-blur">
          <span aria-hidden className="size-1.5 rounded-full bg-[var(--accent)]" />
          {accentLabel}
        </span>
        <span aria-hidden className="absolute bottom-5 right-6 font-display text-6xl font-semibold text-white/15 sm:text-7xl">
          {index}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-7 sm:p-10">
        <span aria-hidden className="h-1 w-16 rounded-full bg-[linear-gradient(90deg,var(--accent),color-mix(in_srgb,var(--accent)_25%,transparent))]" />
        <h3 className="mt-6 font-display text-[clamp(1.625rem,2.4vw,2rem)] font-semibold tracking-tight text-navy-900">{name}</h3>
        <p className="mt-3 max-w-md text-lg leading-relaxed text-graphite">{summary}</p>

        <ul className="mt-8 divide-y divide-line border-y border-line">
          {products.map((p) => (
            <li key={p} className="flex items-center gap-3 py-4 font-medium text-navy-900">
              <span aria-hidden className="size-2 rotate-45 bg-[var(--accent)]" />
              {p}
            </li>
          ))}
        </ul>

        <div className="mt-auto pt-8">
          <EnquireLink
            division={name}
            className="inline-flex items-center gap-2 font-semibold text-brand transition-colors hover:text-brand-bright"
          >
            Enquire about {name}
            <ArrowRight aria-hidden className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
          </EnquireLink>
        </div>
      </div>
    </article>
  );
}
