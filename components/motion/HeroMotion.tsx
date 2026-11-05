"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP, MOTION_OK, DESKTOP } from "@/lib/gsap";

/**
 * Hero load timeline: background settles, then eyebrow → headline → copy → CTAs.
 * Desktop only: slow scroll parallax on the shipment image.
 */
export default function HeroMotion({ children, className, id }: { children: ReactNode; className?: string; id?: string }) {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      (window as Window & { __ncMotion?: boolean }).__ncMotion = true;
      const mm = gsap.matchMedia();

      mm.add({ motion: MOTION_OK, desktop: DESKTOP }, (ctx) => {
        const { motion, desktop } = ctx.conditions as { motion: boolean; desktop: boolean };
        const items = gsap.utils.toArray<HTMLElement>("[data-hero-item]");
        if (!motion) {
          gsap.set(items, { opacity: 1, y: 0 });
          return;
        }

        const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
        tl.fromTo("[data-hero-bg]", { scale: desktop ? 1.14 : 1.06 }, { scale: 1, duration: 2.6, ease: "power2.out" }, 0);
        tl.fromTo("[data-hero-veil]", { opacity: 2 }, { opacity: 0, duration: 1.2 }, 0);
        tl.fromTo(items, { opacity: 0, y: desktop ? 36 : 18 }, { opacity: 1, y: 0, duration: 0.9, stagger: 0.12 }, 0.35);

        if (desktop) {
          gsap.to("[data-hero-parallax]", {
            yPercent: 12,
            ease: "none",
            scrollTrigger: { trigger: ref.current, start: "top top", end: "bottom top", scrub: true },
          });
          gsap.to("[data-hero-content]", {
            yPercent: -10,
            opacity: 0.2,
            ease: "none",
            scrollTrigger: { trigger: ref.current, start: "top top", end: "bottom top", scrub: true },
          });
        }
      });

      // Mouse parallax: each [data-depth] layer follows the pointer by its depth (px across
      // the full hero width; negative = moves against the pointer). Desktop mouse/trackpad only.
      mm.add("(prefers-reduced-motion: no-preference) and (min-width: 768px) and (pointer: fine)", () => {
        const section = ref.current;
        if (!section) return;
        const ease = { duration: 1.1, ease: "power3.out" };
        const layers = gsap.utils.toArray<HTMLElement>("[data-depth]", section).map((el) => ({
          depth: parseFloat(el.dataset.depth || "0"),
          x: gsap.quickTo(el, "x", ease),
          y: gsap.quickTo(el, "y", ease),
        }));
        const spot = section.querySelector<HTMLElement>("[data-hero-spot]");
        const spotX = spot ? gsap.quickTo(spot, "left", { duration: 0.6, ease: "power3.out" }) : null;
        const spotY = spot ? gsap.quickTo(spot, "top", { duration: 0.6, ease: "power3.out" }) : null;

        const onMove = (e: PointerEvent) => {
          const r = section.getBoundingClientRect();
          const nx = gsap.utils.clamp(-0.5, 0.5, (e.clientX - r.left) / r.width - 0.5);
          const ny = gsap.utils.clamp(-0.5, 0.5, (e.clientY - r.top) / r.height - 0.5);
          layers.forEach((l) => {
            l.x(nx * l.depth);
            l.y(ny * l.depth * 0.6);
          });
          spotX?.(e.clientX - r.left);
          spotY?.(e.clientY - r.top);
        };
        const onEnter = () => spot && gsap.to(spot, { opacity: 1, duration: 0.6 });
        const onLeave = () => {
          layers.forEach((l) => {
            l.x(0);
            l.y(0);
          });
          if (spot) gsap.to(spot, { opacity: 0, duration: 0.6 });
        };

        section.addEventListener("pointermove", onMove);
        section.addEventListener("pointerenter", onEnter);
        section.addEventListener("pointerleave", onLeave);
        return () => {
          section.removeEventListener("pointermove", onMove);
          section.removeEventListener("pointerenter", onEnter);
          section.removeEventListener("pointerleave", onLeave);
        };
      });

      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <section ref={ref} id={id} className={className}>
      {children}
    </section>
  );
}
