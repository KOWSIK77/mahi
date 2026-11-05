import { ArrowUpRight, Bike, CarFront, Wheat, MessageSquareText } from "lucide-react";
import Reveal from "@/components/motion/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import EnquireLink from "@/components/ui/EnquireLink";
import type { DivisionOption } from "@/lib/site";

const categories: {
  icon: typeof Bike;
  title: string;
  division: DivisionOption;
  body: string;
  share: string;
  accent: string;
}[] = [
  {
    icon: Bike,
    title: "Motorcycle Spare Parts",
    division: "Automotive & Mobility",
    body: "Replacement and aftermarket parts for motorcycles, sourced against the buyer's model and part requirements.",
    share: "Share bike models, part numbers and quantities.",
    accent: "var(--color-auto)",
  },
  {
    icon: CarFront,
    title: "Automobile Spare Parts",
    division: "Automotive & Mobility",
    body: "Spare parts for passenger and commercial vehicles, sourced to match the specifications buyers provide.",
    share: "Share vehicle models, part numbers and quantities.",
    accent: "var(--color-auto)",
  },
  {
    icon: Wheat,
    title: "Makhana (Fox Nuts)",
    division: "Food & Agriculture",
    body: "Makhana supplied for import, wholesale and food distribution, with details confirmed per enquiry.",
    share: "Share required size, packing and destination.",
    accent: "var(--color-makhana)",
  },
];

export default function Products() {
  return (
    <Reveal as="section" id="products" aria-labelledby="products-title" className="section-y bg-grad-white">
      <div className="container-x">
        <SectionHeading
          eyebrow="Product Categories"
          title={<span id="products-title">What We Trade.</span>}
          intro="Product details, availability and terms are confirmed for each enquiry. Tell us what you need and we will respond with the relevant information."
        />

        <ul className="mt-14 grid gap-5 sm:grid-cols-2 lg:mt-20 lg:grid-cols-4">
          {categories.map((c) => (
            <li key={c.title} data-reveal className="h-full">
              <EnquireLink
                division={c.division}
                aria-label={`Enquire about ${c.title}`}
                className="group relative flex h-full flex-col rounded-[var(--radius-card)] border border-line bg-cloud p-7 transition-[border-color,background-color,box-shadow] duration-300 hover:border-transparent hover:bg-white hover:shadow-[0_24px_48px_-24px_rgba(16,29,46,0.3)]"
              >
                <span
                  aria-hidden
                  className="absolute inset-x-7 top-0 h-0.5 origin-left scale-x-0 rounded-full transition-transform duration-500 ease-out-expo group-hover:scale-x-100"
                  style={{ background: c.accent }}
                />
                <div className="flex items-start justify-between">
                  <span className="flex size-12 items-center justify-center rounded-xl bg-white text-navy-900 ring-1 ring-line">
                    <c.icon className="size-5" aria-hidden />
                  </span>
                  <ArrowUpRight aria-hidden className="size-5 text-steel transition-all duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-brand" />
                </div>
                <p className="eyebrow mt-8 text-steel">{c.division}</p>
                <h3 className="mt-2 font-display text-xl font-semibold tracking-tight text-navy-900">{c.title}</h3>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-graphite">{c.body}</p>
                <p className="mt-auto pt-6 text-sm font-medium text-brand">{c.share}</p>
              </EnquireLink>
            </li>
          ))}

          <li data-reveal className="h-full">
            <EnquireLink
              division="General Trading Enquiry"
              className="group flex h-full flex-col justify-between rounded-[var(--radius-card)] bg-grad-navy p-7 text-white transition-shadow duration-300 hover:bg-grad-brand hover:shadow-[0_24px_48px_-24px_rgba(40,85,217,0.6)]"
            >
              <span className="flex size-12 items-center justify-center rounded-xl bg-white/10">
                <MessageSquareText className="size-5" aria-hidden />
              </span>
              <div className="pt-10">
                <h3 className="font-display text-xl font-semibold tracking-tight">Have a specific requirement?</h3>
                <p className="mt-3 text-[0.9375rem] leading-relaxed text-white/70 group-hover:text-white/85">
                  Send a general trading enquiry and we will review whether we can support it.
                </p>
                <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold">
                  Start an enquiry
                  <ArrowUpRight aria-hidden className="size-4 transition-transform duration-300 group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
                </span>
              </div>
            </EnquireLink>
          </li>
        </ul>
      </div>
    </Reveal>
  );
}
