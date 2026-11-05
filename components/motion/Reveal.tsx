"use client";

import { useRef, type ElementType, type ReactNode, type ComponentPropsWithoutRef } from "react";
import { gsap, ScrollTrigger, useGSAP, MOTION_OK, DESKTOP } from "@/lib/gsap";

type Props<T extends ElementType> = {
  as?: T;
  children: ReactNode;
} & Omit<ComponentPropsWithoutRef<T>, "as" | "children">;

/**
 * Scopes one-time scroll reveals to its subtree:
 *  [data-reveal]        → fade + short rise, batched with stagger
 *  [data-reveal-image]  → clip-path mask reveal with a gentle inner settle
 *  [data-reveal-line]   → connector lines drawing in
 * Everything is cleaned up automatically by useGSAP on unmount.
 */
export default function Reveal<T extends ElementType = "div">({ as, children, ...rest }: Props<T>) {
  const ref = useRef<HTMLElement>(null);
  const Tag = (as ?? "div") as ElementType;

  useGSAP(
    () => {
      (window as Window & { __ncMotion?: boolean }).__ncMotion = true;
      const scope = ref.current;
      if (!scope) return;
      const mm = gsap.matchMedia();

      mm.add({ motion: MOTION_OK, desktop: DESKTOP }, (ctx) => {
        const { motion, desktop } = ctx.conditions as { motion: boolean; desktop: boolean };
        const items = gsap.utils.toArray<HTMLElement>("[data-reveal]", scope);
        const images = gsap.utils.toArray<HTMLElement>("[data-reveal-image]", scope);
        const lines = gsap.utils.toArray<HTMLElement>("[data-reveal-line]", scope);

        if (!motion) {
          gsap.set(items, { opacity: 1, y: 0 });
          gsap.set(images, { clipPath: "inset(0% 0% 0% 0%)" });
          gsap.set(lines, { scaleX: 1, scaleY: 1 });
          return;
        }

        const distance = desktop ? 28 : 16;
        gsap.set(items, { opacity: 0, y: distance });

        ScrollTrigger.batch(items, {
          start: "top 88%",
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, { opacity: 1, y: 0, duration: desktop ? 0.8 : 0.6, stagger: desktop ? 0.1 : 0.06, overwrite: true }),
        });

        images.forEach((el) => {
          const inner = el.querySelector("img");
          const tl = gsap.timeline({ scrollTrigger: { trigger: el, start: "top 85%", once: true } });
          tl.fromTo(el, { clipPath: "inset(100% 0% 0% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: 1.1, ease: "power3.inOut" });
          if (inner && desktop) tl.fromTo(inner, { scale: 1.15 }, { scale: 1, duration: 1.4 }, 0);
        });

        lines.forEach((el) => {
          const vertical = el.dataset.revealLine === "y";
          gsap.fromTo(
            el,
            vertical ? { scaleY: 0 } : { scaleX: 0 },
            {
              ...(vertical ? { scaleY: 1 } : { scaleX: 1 }),
              duration: 1.4,
              ease: "power2.inOut",
              scrollTrigger: { trigger: el, start: "top 80%", once: true },
            },
          );
        });
      });

      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <Tag ref={ref} {...rest}>
      {children}
    </Tag>
  );
}
