"use client";

import { useRef } from "react";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";
import { cities, MAP_HEIGHT as H, MAP_WIDTH as W, type MapCity } from "@/lib/world-map.data";

const GOLD = "#F5B942";
const BLUE = "#5FA2FF";

/** Label placement per city: dx, dy (map units) and text anchor. */
const labelPos: Record<string, [number, number, "start" | "middle" | "end"]> = {
  india: [0, 44, "middle"],
  dubai: [6, -30, "middle"],
  lagos: [-20, 6, "end"],
  riyadh: [-14, 18, "end"],
  cairo: [-12, -14, "end"],
  nairobi: [14, 6, "start"],
  joburg: [14, 6, "start"],
  london: [0, -16, "middle"],
  newyork: [0, -16, "middle"],
  saopaulo: [-14, 6, "end"],
  singapore: [0, 28, "middle"],
  sydney: [6, -16, "end"],
};

/** Curved route that always bows "north" so lines read as flight/shipping arcs. */
function arc(a: MapCity, b: MapCity) {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const dist = Math.hypot(dx, dy);
  let nx = -dy / dist;
  let ny = dx / dist;
  if (ny > 0) {
    nx = -nx;
    ny = -ny;
  }
  const bend = dist * (dist < 300 ? 0.35 : 0.22);
  const cx = (a.x + b.x) / 2 + nx * bend;
  const cy = Math.max(16, (a.y + b.y) / 2 + ny * bend);
  return `M${a.x} ${a.y} Q${cx.toFixed(1)} ${cy.toFixed(1)} ${b.x} ${b.y}`;
}

const origin = cities.find((c) => c.tier === "origin")!;
const routes = cities
  .filter((c) => c.tier !== "origin")
  .sort((a, b) => Number(b.tier === "primary") - Number(a.tier === "primary"))
  .map((c) => ({ ...c, d: arc(origin, c), primary: c.tier === "primary" }));

export default function RouteMap() {
  const ref = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        const root = ref.current;
        if (!root) return;
        const q = gsap.utils.selector(root);
        const one = <T extends Element>(sel: string) => root.querySelector<T>(sel);

        gsap.set(q("[data-route-mask]"), { strokeDashoffset: 1 });
        gsap.set(q("[data-city], [data-origin]"), { scale: 0, opacity: 1, transformOrigin: "50% 50%", transformBox: "fill-box" });
        gsap.set(q("[data-label]"), { opacity: 0 });

        /** Start the looping travelling lights for a route only once its line exists. */
        const startPulse = (key: string) => {
          const g = one<SVGGElement>(`[data-pulse="${key}"]`);
          if (!g) return;
          g.setAttribute("visibility", "visible");
          g.querySelectorAll<SVGAnimationElement>("animateMotion").forEach((a) => a.beginElement());
        };

        /** Line grows out of India with a glowing head; the destination appears on arrival. */
        const drawRoute = (tl: gsap.core.Timeline, r: (typeof routes)[number], at: number | string, dur: number) => {
          const path = one<SVGPathElement>(`[data-route-path="${r.key}"]`);
          const mask = one<SVGPathElement>(`[data-route-mask="${r.key}"]`);
          const head = one<SVGGElement>(`[data-head="${r.key}"]`);
          if (!path || !mask || !head) return;
          const len = path.getTotalLength();
          const prog = { p: 0 };
          tl.to(
            prog,
            {
              p: 1,
              duration: dur,
              ease: "power1.inOut",
              onStart: () => head.setAttribute("opacity", "1"),
              onUpdate: () => {
                mask.style.strokeDashoffset = String(1 - prog.p);
                const pt = path.getPointAtLength(prog.p * len);
                head.setAttribute("transform", `translate(${pt.x} ${pt.y})`);
              },
              onComplete: () => {
                gsap.to(head, { opacity: 0, duration: 0.4 });
                // Fully drawn: drop the mask so the idle animation doesn't pay for it every frame
                one(`[data-route-group="${r.key}"]`)?.removeAttribute("mask");
                startPulse(r.key);
              },
            },
            at,
          );
          tl.to(q(`[data-city="${r.key}"]`), { scale: 1, duration: 0.5, ease: "back.out(2.6)" }, ">-0.05");
          tl.to(q(`[data-label="${r.key}"]`), { opacity: 1, duration: 0.4 }, "<0.1");
        };

        const tl = gsap.timeline({ scrollTrigger: { trigger: root, start: "top 70%", once: true } });
        tl.to(q("[data-origin]"), { scale: 1, duration: 0.6, ease: "back.out(2)" })
          .to(q("[data-label='india']"), { opacity: 1, duration: 0.4 }, "<0.2");

        // Key corridors first, one after another, then the wider network.
        let cursor = 0.7;
        routes.forEach((r) => {
          if (r.primary) {
            drawRoute(tl, r, cursor, 1.5);
            cursor += 1.25;
          }
        });
        routes
          .filter((r) => !r.primary)
          .forEach((r, i) => drawRoute(tl, r, cursor + 0.2 + i * 0.22, 1.1));
      });

      // Reduced motion: everything static and visible; travelling lights stay hidden (CSS).
      return () => mm.revert();
    },
    { scope: ref },
  );

  return (
    <div ref={ref} className="absolute inset-0">
      <svg viewBox={`0 0 ${W} ${H}`} className="h-full w-full overflow-visible" role="img" aria-labelledby="route-map-title">
        <title id="route-map-title">
          Trade connections from India to the UAE, Nigeria, the Middle East, Africa and international markets
        </title>
        <defs>
          <filter id="route-glow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="5" />
          </filter>
          <radialGradient id="origin-halo">
            <stop offset="0%" stopColor={BLUE} stopOpacity="0.55" />
            <stop offset="100%" stopColor={BLUE} stopOpacity="0" />
          </radialGradient>
          {routes.map((r) => (
            <path key={r.key} id={`route-${r.key}`} d={r.d} />
          ))}
          {routes.map((r) => (
            <mask key={r.key} id={`route-mask-${r.key}`} maskUnits="userSpaceOnUse" x="-50" y="-50" width={W + 100} height={H + 100}>
              <path d={r.d} data-route-mask={r.key} pathLength={1} strokeDasharray="1 1" fill="none" stroke="#fff" strokeWidth="24" />
            </mask>
          ))}
        </defs>

        {/* Routes: secondary first so the two key corridors render on top */}
        {[...routes].reverse().map((r) => (
          <g key={r.key} data-route-group={r.key} mask={`url(#route-mask-${r.key})`} fill="none" strokeLinecap="round">
            {r.primary ? (
              <>
                {/* Soft glow from stacked wide strokes (cheaper than a blur filter) */}
                <path d={r.d} stroke={GOLD} strokeWidth="14" strokeOpacity="0.07" />
                <path d={r.d} stroke={GOLD} strokeWidth="8" strokeOpacity="0.14" />
                <path d={r.d} data-route-path={r.key} stroke={GOLD} strokeWidth="1.6" strokeOpacity="0.55" />
                <path d={r.d} stroke={GOLD} strokeWidth="4.5" strokeDasharray="0.1 11" className="route-flow route-flow-fast" />
              </>
            ) : (
              <>
                <path d={r.d} data-route-path={r.key} stroke={BLUE} strokeWidth="1" strokeOpacity="0.18" />
                <path d={r.d} stroke={BLUE} strokeWidth="2.6" strokeOpacity="0.85" strokeDasharray="0.1 9" className="route-flow" />
              </>
            )}
          </g>
        ))}

        {/* Drawing heads: glowing dot that leads each line out of India (animation only) */}
        {routes.map((r) => (
          <g key={r.key} data-head={r.key} opacity="0" transform={`translate(${origin.x} ${origin.y})`} className="route-pulses">
            <circle r={r.primary ? 14 : 9} fill={r.primary ? GOLD : BLUE} opacity="0.45" filter="url(#route-glow)" />
            <circle r={r.primary ? 5.5 : 3.6} fill={r.primary ? "#FFF4D6" : "#E3EEFF"} />
          </g>
        ))}

        {/* Travelling lights: start (begin="indefinite") only after their route is drawn */}
        {routes.map((r, i) => (
          <g key={r.key} data-pulse={r.key} visibility="hidden" className="route-pulses">
            {r.primary ? (
              <>
                <circle r="11" fill={GOLD} opacity="0.35" filter="url(#route-glow)">
                  <animateMotion dur="2.8s" begin="indefinite" repeatCount="indefinite">
                    <mpath href={`#route-${r.key}`} />
                  </animateMotion>
                </circle>
                <circle r="4.5" fill="#FFF4D6">
                  <animateMotion dur="2.8s" begin="indefinite" repeatCount="indefinite">
                    <mpath href={`#route-${r.key}`} />
                  </animateMotion>
                </circle>
              </>
            ) : (
              <circle r="3" fill="#CFE3FF">
                <animateMotion dur={`${4 + (i % 3)}s`} begin="indefinite" repeatCount="indefinite">
                  <mpath href={`#route-${r.key}`} />
                </animateMotion>
              </circle>
            )}
          </g>
        ))}

        {/* Destination markers + labels */}
        {routes.map((r) => {
          const [dx, dy, anchor] = labelPos[r.key] ?? [12, 5, "start"];
          return (
            <g key={r.key}>
              <g data-city={r.key}>
                {r.primary ? (
                  <>
                    <circle cx={r.x} cy={r.y} r="16" fill={GOLD} fillOpacity="0.18" className="motion-safe:animate-[node-pulse_2.4s_ease-out_infinite]" style={{ transformOrigin: `${r.x}px ${r.y}px` }} />
                    <circle cx={r.x} cy={r.y} r="8" fill={GOLD} />
                    <circle cx={r.x} cy={r.y} r="3.2" fill="#fff" />
                  </>
                ) : (
                  <>
                    <circle cx={r.x} cy={r.y} r="7" fill="none" stroke={BLUE} strokeOpacity="0.6" strokeWidth="1.5" />
                    <circle cx={r.x} cy={r.y} r="3.4" fill="#fff" />
                  </>
                )}
              </g>
              <text
                data-label={r.key}
                x={r.x + dx}
                y={r.y + dy}
                textAnchor={anchor}
                className={
                  r.primary
                    ? "fill-[#FFE3A3] font-display text-[30px] font-semibold sm:text-[19px]"
                    : "hidden fill-white/60 text-[14px] font-medium sm:block"
                }
                style={r.primary ? { paintOrder: "stroke", stroke: "#0B1729", strokeWidth: 6 } : undefined}
              >
                {r.label}
              </text>
            </g>
          );
        })}

        {/* Origin: India */}
        <g data-origin>
          <circle cx={origin.x} cy={origin.y} r="46" fill="url(#origin-halo)" />
          <circle cx={origin.x} cy={origin.y} r="20" fill={BLUE} fillOpacity="0.2" className="motion-safe:animate-[node-pulse_2s_ease-out_infinite]" style={{ transformOrigin: `${origin.x}px ${origin.y}px` }} />
          <circle cx={origin.x} cy={origin.y} r="11" fill="#fff" stroke={BLUE} strokeWidth="4" />
        </g>
        <text
          data-label="india"
          x={origin.x + labelPos.india[0]}
          y={origin.y + labelPos.india[1]}
          textAnchor="middle"
          className="fill-white font-display text-[32px] font-semibold sm:text-[21px]"
          style={{ paintOrder: "stroke", stroke: "#0B1729", strokeWidth: 6 }}
        >
          India
        </text>
      </svg>
    </div>
  );
}
