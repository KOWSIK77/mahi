import { ClipboardList, Globe2, FileCheck2, PackageCheck } from "lucide-react";
import Reveal from "@/components/motion/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";

const steps = [
  {
    icon: ClipboardList,
    title: "Understand the Requirement",
    body: "We start with your product, specifications, quantities, destination and commercial expectations.",
  },
  {
    icon: Globe2,
    title: "Source and Coordinate",
    body: "We identify suitable supply options across our sourcing countries and coordinate with suppliers.",
  },
  {
    icon: FileCheck2,
    title: "Confirm Product Details",
    body: "Specifications, packing, pricing and terms are shared and agreed with you before anything moves.",
  },
  {
    icon: PackageCheck,
    title: "Arrange Supply",
    body: "Once confirmed, we arrange supply and keep you informed at each stage through to dispatch.",
  },
];

export default function Process() {
  return (
    <Reveal as="section" id="process" aria-labelledby="process-title" className="section-y bg-grad-cloud">
      <div className="container-x">
        <SectionHeading
          eyebrow="How We Work"
          title={<span id="process-title">From Sourcing to Distribution.</span>}
          intro="A straightforward working process, so buyers always know what happens next."
        />

        <ol className="relative mt-16 grid gap-10 md:grid-cols-2 lg:mt-24 lg:grid-cols-4 lg:gap-8">
          {/* Connector (desktop) */}
          <span aria-hidden className="absolute left-0 right-0 top-6 hidden h-px bg-line lg:block" />
          <span aria-hidden data-reveal-line="x" className="absolute left-0 right-0 top-6 hidden h-px origin-left bg-gradient-to-r from-brand via-brand-bright to-brand lg:block" />

          {steps.map((s, i) => (
            <li key={s.title} data-reveal className="relative">
              <div className="flex items-center gap-4">
                <span className="relative z-10 flex size-12 items-center justify-center rounded-full bg-grad-brand font-display text-sm font-semibold text-white ring-8 ring-cloud">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <s.icon aria-hidden className="size-5 text-brand lg:hidden" />
              </div>
              <h3 className="mt-7 font-display text-xl font-semibold tracking-tight text-navy-900">{s.title}</h3>
              <p className="mt-3 max-w-xs leading-relaxed text-graphite">{s.body}</p>
            </li>
          ))}
        </ol>

        <p data-reveal className="mt-16 max-w-2xl border-l-2 border-brand pl-5 text-sm leading-relaxed text-steel">
          Timelines and terms depend on the product, quantity, origin and destination, and are confirmed individually for each order.
        </p>
      </div>
    </Reveal>
  );
}
