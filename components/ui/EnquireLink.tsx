"use client";

import type { ReactNode } from "react";
import { SELECT_DIVISION_EVENT, type DivisionOption } from "@/lib/site";

/** Anchor to the enquiry form that also pre-selects a product division. */
export default function EnquireLink({
  division,
  className,
  children,
  "aria-label": ariaLabel,
}: {
  division: DivisionOption;
  className?: string;
  children: ReactNode;
  "aria-label"?: string;
}) {
  return (
    <a
      href="#contact"
      aria-label={ariaLabel}
      className={className}
      onClick={() => window.dispatchEvent(new CustomEvent(SELECT_DIVISION_EVENT, { detail: division }))}
    >
      {children}
    </a>
  );
}
