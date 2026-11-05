import { Globe2, Route, MessagesSquare, Handshake } from "lucide-react";
import Reveal from "@/components/motion/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";

const themes = [
  {
    icon: Globe2,
    title: "Multi-country sourcing approach",
    body: "Sourcing from more than one country gives buyers broader options and more flexibility when matching supply to requirements.",
  },
  {
    icon: Route,
    title: "Trading and distribution focus",
    body: "Our business is trading and distribution — connecting the right products with the businesses that sell and use them.",
  },
  {
    icon: MessagesSquare,
    title: "Clear product communication",
    body: "Specifications, packing and terms are discussed openly and confirmed in writing, so expectations are aligned from the start.",
  },
  {
    icon: Handshake,
    title: "Commercial buyer relationships",
    body: "We work business-to-business with importers, dealers, distributors and procurement teams, with a view to long-term cooperation.",
  },
];

export default function WhyUs() {
  return (
    <Reveal as="section" id="why-us" aria-labelledby="why-title" className="section-y bg-grad-white">
      <div className="container-x grid gap-14 lg:grid-cols-12 lg:gap-8">
        <div className="lg:col-span-5">
          <div className="lg:sticky lg:top-32">
            <SectionHeading
              eyebrow="Why Nova Covenant"
              title={<span id="why-title">Why Work With Nova Covenant.</span>}
              intro="The principles that shape how we approach every trading relationship."
            />
            <div data-reveal className="mt-10">
              <Button href="#contact" arrow>
                Start a Conversation
              </Button>
            </div>
          </div>
        </div>

        <ul className="grid gap-5 sm:grid-cols-2 lg:col-span-7">
          {themes.map((t, i) => (
            <li
              key={t.title}
              data-reveal
              className={`group rounded-[var(--radius-card)] border border-line bg-cloud p-8 transition-[background-color,border-color,transform] duration-500 ease-out-expo hover:-translate-y-1 hover:border-brand/30 hover:bg-white ${
                i % 2 === 1 ? "sm:translate-y-12 sm:hover:translate-y-11" : ""
              }`}
            >
              <span className="flex size-12 items-center justify-center rounded-xl bg-grad-navy text-white transition-shadow duration-300 group-hover:bg-grad-brand group-hover:shadow-[0_10px_24px_-10px_rgba(40,85,217,0.8)]">
                <t.icon className="size-5" aria-hidden />
              </span>
              <h3 className="mt-10 font-display text-xl font-semibold leading-snug tracking-tight text-navy-900">{t.title}</h3>
              <p className="mt-3 leading-relaxed text-graphite">{t.body}</p>
            </li>
          ))}
        </ul>
      </div>
    </Reveal>
  );
}
