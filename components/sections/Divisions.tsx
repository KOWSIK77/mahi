import Reveal from "@/components/motion/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import DivisionCard from "@/components/ui/DivisionCard";

export default function Divisions() {
  return (
    <Reveal as="section" id="divisions" aria-labelledby="divisions-title" className="section-y bg-grad-cloud">
      <div className="container-x">
        <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
          <SectionHeading
            eyebrow="Business Divisions"
            title={<span id="divisions-title">Two Divisions. One Trading Partner.</span>}
          />
          <p data-reveal className="max-w-md text-lg leading-relaxed text-graphite lg:pb-2">
            Our trading activity is organised into two focused divisions, each served under the same standards of communication and
            commercial clarity.
          </p>
        </div>

        <div className="mt-14 grid gap-6 lg:mt-20 lg:grid-cols-2 lg:gap-8">
          <DivisionCard
            index="01"
            name="Automotive & Mobility"
            summary="Motorcycle and automobile spare parts for dealers, distributors and aftermarket buyers."
            products={["Motorcycle spare parts", "Automobile spare parts"]}
            image={{ src: "/images/automotive/spare-parts.png", alt: "Automotive spare parts including brake discs, shock absorber, filters, alternator, clutch plate and belts" }}
            accent="var(--color-auto)"
            accentLabel="Automotive"
          />
          <DivisionCard
            index="02"
            name="Food & Agriculture"
            summary="Makhana (fox nuts) for importers, wholesalers and food distribution partners."
            products={["Makhana (fox nuts)"]}
            image={{ src: "/images/makhana/makhana.png", alt: "A wooden bowl and jute sack of makhana (fox nuts) beside a lotus field" }}
            accent="var(--color-makhana)"
            accentLabel="Food & Agri"
          />
        </div>
      </div>
    </Reveal>
  );
}
