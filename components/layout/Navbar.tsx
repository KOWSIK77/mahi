"use client";

import { useEffect, useRef, useState } from "react";
import { Menu, X } from "lucide-react";
import Wordmark from "@/components/ui/Wordmark";
import Button from "@/components/ui/Button";
import { navLinks } from "@/lib/site";
import { gsap, useGSAP, MOTION_OK } from "@/lib/gsap";

export default function Navbar() {
  const ref = useRef<HTMLElement>(null);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState("home");

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(MOTION_OK, () => {
        gsap.from(ref.current, { y: -24, opacity: 0, duration: 0.8, delay: 0.15 });
      });
      return () => mm.revert();
    },
    { scope: ref },
  );

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Highlight the section currently in the middle band of the viewport.
  useEffect(() => {
    const ids = [...navLinks.map((l) => l.href.slice(1)), "products", "global-reach", "why-us"];
    const owner: Record<string, string> = { products: "divisions", "global-reach": "process", "why-us": "founder" };
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) setActive(owner[e.target.id] ?? e.target.id);
        });
      },
      { rootMargin: "-45% 0px -50% 0px" },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onResize = () => window.innerWidth >= 1024 && setOpen(false);
    window.addEventListener("keydown", onKey);
    window.addEventListener("resize", onResize);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("resize", onResize);
    };
  }, [open]);

  const solid = scrolled || open;

  return (
    <header
      ref={ref}
      className={`fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-500 ${
        solid ? "border-b border-white/10 bg-navy-950/85 backdrop-blur-xl" : "border-b border-transparent bg-transparent"
      }`}
    >
      <nav aria-label="Primary" className="container-wide flex h-[72px] items-center justify-between gap-6 lg:h-20">
        <a href="#home" className="shrink-0 rounded-md" onClick={() => setOpen(false)}>
          <Wordmark tone="dark" />
        </a>

        <ul className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => {
            const isActive = active === link.href.slice(1);
            return (
              <li key={link.href}>
                <a
                  href={link.href}
                  aria-current={isActive ? "true" : undefined}
                  className={`relative rounded-full px-4 py-2 text-sm font-medium transition-colors duration-300 ${
                    isActive ? "text-white" : "text-white/60 hover:text-white"
                  }`}
                >
                  {link.label}
                  <span
                    aria-hidden
                    className={`absolute inset-x-4 -bottom-0.5 h-px origin-left bg-brand-bright transition-transform duration-500 ease-out-expo ${
                      isActive ? "scale-x-100" : "scale-x-0"
                    }`}
                  />
                </a>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-3">
          <Button href="#contact" size="sm" className="max-sm:hidden">
            Business Enquiry
          </Button>
          <button
            type="button"
            className="inline-flex size-11 items-center justify-center rounded-full border border-white/20 text-white lg:hidden"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? "Close menu" : "Open menu"}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="size-5" aria-hidden /> : <Menu className="size-5" aria-hidden />}
          </button>
        </div>
      </nav>

      <div
        id="mobile-menu"
        hidden={!open}
        className="border-t border-white/10 bg-navy-950 lg:hidden"
      >
        <ul className="container-wide flex flex-col py-4">
          {navLinks.map((link) => (
            <li key={link.href}>
              <a
                href={link.href}
                onClick={() => setOpen(false)}
                className="flex items-center justify-between border-b border-white/5 py-4 font-display text-xl text-white"
              >
                {link.label}
              </a>
            </li>
          ))}
          <li className="pt-6 pb-2">
            <Button href="#contact" arrow className="w-full" onClick={() => setOpen(false)}>
              Business Enquiry
            </Button>
          </li>
        </ul>
      </div>
    </header>
  );
}
