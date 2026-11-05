"use client";

import dynamic from "next/dynamic";
import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";

// three.js is only downloaded when the founder card approaches the viewport.
const ShipOrbitScene = dynamic(() => import("./ShipOrbitScene"), { ssr: false });

/**
 * Shows the static placeholder (children) until the 3D stage has rendered its
 * first frame, then cross-fades to the WebGL scene. If WebGL is unavailable,
 * the static placeholder simply stays.
 */
export default function FounderStage({ photo, children }: { photo?: string; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [near, setNear] = useState(false);
  const [ready, setReady] = useState(false);
  const onReady = useCallback(() => setReady(true), []);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setNear(true);
          io.disconnect();
        }
      },
      { rootMargin: "600px 0px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className="absolute inset-0">
      <div className={`absolute inset-0 transition-opacity duration-700 ${ready ? "opacity-0" : "opacity-100"}`}>{children}</div>
      {near && (
        <div className={`absolute inset-0 transition-opacity duration-1000 ${ready ? "opacity-100" : "opacity-0"}`}>
          <ShipOrbitScene photo={photo} onReady={onReady} />
        </div>
      )}
    </div>
  );
}
