/**
 * PROVISIONAL typographic wordmark.
 * This is NOT the official Nova Covenant logo. Replace with the supplied gold NC
 * logo (public/brand/) when available — see README "Brand assets".
 */
export default function Wordmark({ tone = "dark", className = "" }: { tone?: "dark" | "light"; className?: string }) {
  const onDark = tone === "dark";
  return (
    <span className={`inline-flex flex-col leading-none ${className}`} aria-label="Nova Covenant International Trading">
      <span aria-hidden className={`font-display text-[1.0625rem] font-semibold tracking-[0.2em] ${onDark ? "text-white" : "text-navy-900"}`}>
        NOVA COVENANT
      </span>
      <span aria-hidden className={`mt-1.5 text-[0.5625rem] font-medium tracking-[0.42em] ${onDark ? "text-white/55" : "text-steel"}`}>
        INTERNATIONAL TRADING
      </span>
    </span>
  );
}
