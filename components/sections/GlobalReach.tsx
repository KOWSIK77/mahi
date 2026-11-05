import Image from "next/image";
import { Building2, Boxes, Handshake } from "lucide-react";
import Reveal from "@/components/motion/Reveal";
import RouteMap from "@/components/motion/RouteMap";
import SectionHeading from "@/components/ui/SectionHeading";
import { MAP_HEIGHT, MAP_WIDTH } from "@/lib/world-map.data";

const points = [
  { icon: Building2, title: "Multi-country operations", body: "Nova Covenant operates from more than one country, close to the markets and suppliers we work with." },
  { icon: Boxes, title: "Multi-country sourcing", body: "Products are sourced from multiple countries, giving buyers a wider range of supply options." },
  { icon: Handshake, title: "International buyers", body: "We work with importers, distributors and commercial buyers across international markets." },
];

export default function GlobalReach() {
  return (
    <Reveal as="section" id="global-reach" aria-labelledby="reach-title" className="section-y relative isolate overflow-hidden bg-grad-navy text-white">
      <div aria-hidden className="absolute -right-48 top-0 -z-10 size-[44rem] rounded-full bg-brand/20 blur-[160px]" />
      <div aria-hidden className="absolute -left-40 bottom-0 -z-10 size-[36rem] rounded-full bg-[#F5B942]/[0.06] blur-[140px]" />

      <div className="container-x">
        <div className="grid gap-8 lg:grid-cols-12 lg:items-end">
          <SectionHeading
            tone="dark"
            eyebrow="Global Reach"
            title={<span id="reach-title">Connecting Businesses Across Markets.</span>}
            className="lg:col-span-7"
          />
          <p data-reveal className="max-w-xl text-lg leading-relaxed text-white/70 lg:col-span-5 lg:pb-2">
            From India, we connect suppliers and buyers across the Middle East, Africa and wider international markets, with a
            particular focus on the <span className="font-semibold text-[#FFE3A3]">UAE</span> and{" "}
            <span className="font-semibold text-[#FFE3A3]">Nigeria</span>.
          </p>
        </div>

        {/* World map with animated trade routes */}
        <div data-reveal className="relative mt-14 lg:mt-20">
          <div className="relative mx-auto w-full" style={{ aspectRatio: `${MAP_WIDTH} / ${MAP_HEIGHT}` }}>
            <Image
              src="/images/map/world-dots.svg"
              alt=""
              fill
              unoptimized
              className="pointer-events-none select-none opacity-[0.42]"
            />
            <RouteMap />
          </div>

          <ul className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-white/65">
            <li className="flex items-center gap-3">
              <span aria-hidden className="relative flex h-2 w-10 items-center">
                <span className="h-[3px] w-full rounded-full bg-[#F5B942] shadow-[0_0_12px_2px_rgba(245,185,66,0.6)]" />
              </span>
              <span>
                <strong className="font-semibold text-white">Key trade corridors</strong>: India – UAE (Dubai), India – Nigeria (Lagos)
              </span>
            </li>
            <li className="flex items-center gap-3">
              <span aria-hidden className="flex w-10 items-center justify-between">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className="size-1 rounded-full bg-[#5FA2FF]" />
                ))}
              </span>
              Middle East, Africa &amp; international markets
            </li>
          </ul>
        </div>

        <ul className="mt-16 grid gap-px overflow-hidden rounded-[var(--radius-card)] border border-white/10 bg-white/10 md:grid-cols-3">
          {points.map((p) => (
            <li key={p.title} data-reveal className="flex gap-5 bg-navy-950/55 p-7 transition-colors duration-300 hover:bg-navy-800/70">
              <span className="flex size-11 shrink-0 items-center justify-center rounded-full bg-brand/20 text-brand-bright">
                <p.icon className="size-5" aria-hidden />
              </span>
              <div>
                <h3 className="font-display text-lg font-semibold">{p.title}</h3>
                <p className="mt-1.5 text-[0.9375rem] leading-relaxed text-white/60">{p.body}</p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </Reveal>
  );
}
