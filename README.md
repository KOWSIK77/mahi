# Nova Covenant International Trading: Website

A single-page B2B website for **Nova Covenant International Trading**, built with Next.js 16 (App Router), TypeScript, Tailwind CSS 4, Playfair Display + Inter, GSAP + ScrollTrigger, Lucide icons, Zod and Resend.

## Quick start

```bash
npm install
cp .env.example .env.local   # then fill in real values
npm run dev                  # http://localhost:3000
```

Other scripts: `npm run build` (production build), `npm start` (serve the build), `npm run lint`.

## Structure

```
app/
  layout.tsx              fonts (Sora + Inter), SEO / Open Graph, Organization JSON-LD
  page.tsx                assembles the sections in order
  globals.css             design tokens (colors, fonts, radii), container + section utilities
  api/enquiry/route.ts    POST handler: honeypot, rate limit, Zod validation, Resend
components/
  layout/                 Navbar (sticky, active-section, mobile menu), Footer
  sections/               Hero, About, Divisions, Products, Process, GlobalReach, WhyUs, Contact
  ui/                     Button, SectionHeading, DivisionCard, EnquiryForm, EnquireLink, Wordmark
  motion/                 Reveal (scroll reveals), HeroMotion (hero timeline + parallax)
lib/
  site.ts                 company constants, nav, division options, photo credits
  gsap.ts                 GSAP/ScrollTrigger registration
  validation.ts           shared Zod schema (client and server)
  email.ts                server-only Resend sender
```

Section anchors: `#home`, `#about`, `#divisions`, `#products`, `#process`, `#global-reach`, `#why-us`, `#contact`, `#footer`.

## Brand assets (action needed)

| Item | Status | What to do |
|---|---|---|
| Official gold NC logo | **Not supplied** | The header and footer show a provisional typographic wordmark (`components/ui/Wordmark.tsx`). It is **not** the official logo. Add the logo files to `public/brand/` (for example `nc-logo-light.svg` for dark backgrounds) and replace the `<Wordmark />` usages in `Navbar.tsx` and `Footer.tsx` with `next/image`. |
| Brand guidelines | Not supplied | The palette and typography follow the project brief (midnight navy + international blue, Sora/Inter). Adjust the tokens in `app/globals.css` if the guidelines differ, for example if gold accents should match the logo. |
| Favicon | Default | Replace `app/favicon.ico` with an icon made from the official logo. |

## Photography

Company-supplied images (replace any time, same filename):

| File | Used in | Notes |
|---|---|---|
| `public/images/hero/shipment.png` | Hero | Shipment / port imagery **only**, with no products (brand rule). Landscape, 2000 px+ wide is ideal. |
| `public/images/automotive/spare-parts.png` | Automotive & Mobility card | Landscape; shown at 16:9 |
| `public/images/makhana/makhana.png` | Food & Agriculture card | Landscape; shown at 16:9 |

`next/image` automatically serves resized WebP/AVIF versions, so large PNGs are fine.

## Founder section

Edit **`lib/founder.ts`**. Any empty field (`""`) shows as a dashed placeholder on the site:
- `name`: full public name
- `photo`: portrait path, e.g. `/images/company/founder.jpg` (4:5, 1200 px+ tall). Put the file in `public/images/company/`.
- `background`: one line on experience or industry (optional)
- `linkedin`: full profile URL
- `message`: a **draft** founder's note; review and personalise it before launch
- Role ("Founder & Managing Director"), location ("Tirupur, India") and email are pre-filled from the business card details.

### 3D founder stage (three.js)

`components/three/ShipOrbitScene.tsx` renders the portrait as a **3D framed panel on a pedestal**, with a **low-poly container ship** sailing around it on a water ring. The ship has a hull, stacked containers in brand colours, a bridge, a funnel and a wake.
- When `founder.photo` is set, the photo is mapped onto the 3D panel, cover-fit to 4:5.
- three.js is **lazy-loaded** by `components/three/FounderStage.tsx` only as the card approaches the viewport. The static 2D placeholder shows first and stays if WebGL isn't available.
- It renders only while on screen, tilts slightly with the mouse, and shows a single still frame with reduced motion.
- Adjust `ORBIT_R`, the ship scale and the lap speed (`angle += dt * 0.42`) in that file.

## Hero mouse parallax

On desktop with a mouse or trackpad, hero layers marked `data-depth` follow the pointer: the photo moves against it, the glow moves with it, and the text drifts slightly. A soft blue light follows the cursor. Tune the depth values in `components/sections/Hero.tsx`. It is off on touch devices and with reduced motion.

## World map (Global Reach)

- `public/images/map/world-dots.svg` (dotted map) and `lib/world-map.data.ts` (projected city positions) are **generated** by `node scripts/generate-world-map.mjs` (uses the `dotted-map` dev dependency). Edit the `cities` list in that script, run it, then adjust label placement in `components/motion/RouteMap.tsx` (`labelPos`).
- Routes start in India. **India – UAE (Dubai)** and **India – Nigeria (Lagos)** are tier `primary`: gold, glowing and drawn first. All others are blue dotted secondary routes.
- Animation: routes draw outward from India when the map scrolls into view, then dots march along each line and lights travel along the routes. With reduced motion, the map is static.

## Enquiry email (Resend)

1. Create a Resend account and **verify `novacovenanttrading.com`** (Domains → Add). Resend gives DNS records (SPF/DKIM TXT and an MX record on a `send.` subdomain). Add them in Namecheap → Advanced DNS.
   - ⚠️ **Do not remove or change the existing Google Workspace MX, SPF, DKIM or DMARC records.** Resend's records go on their own subdomain. If you already have an SPF record on the root domain, don't create a second one.
2. Create an API key and set the environment variables (see `.env.example`):
   - `RESEND_API_KEY`: server-side only, never exposed to the browser
   - `CONTACT_TO_EMAIL=mahi@novacovenanttrading.com`
   - `CONTACT_FROM_EMAIL`: an address on the verified domain, e.g. `Nova Covenant Website <enquiries@novacovenanttrading.com>`
3. The buyer's validated email is set as **Reply-To**. It is never used as the sender. The recipient comes only from server config.

Behaviour:
- **No credentials:** the API returns 503 and the form tells the visitor to email `mahi@novacovenanttrading.com` directly. It never shows a false success.
- **Success** shows only after Resend accepts the message.
- Validation runs in the browser (for fast feedback) and again on the server with the same Zod schema. HTML in the email is escaped.
- **Abuse protection:** hidden honeypot field, plus a best-effort in-memory limit of 5 requests per IP per 10 minutes. **Limitation:** on serverless hosts each instance has its own memory, so this is not persistent rate limiting. For stronger protection, add Upstash Redis rate limiting or Cloudflare Turnstile.
- Enquiries are **not stored** in a database.

## Deployment

**Vercel (recommended, needed for the email API):** import the folder or repo, add the three environment variables, deploy, then add `novacovenanttrading.com` and `www` under Project → Domains. Set the DNS records Vercel shows in Namecheap (usually an `A` record for `@` and a `CNAME` for `www`). Change only those records and keep every email record. Check HTTPS, the form, and mobile layout before announcing the site.

Static-only hosts (Netlify drop, Namecheap shared hosting) cannot run `app/api/enquiry`. Use a Node-capable host, or replace the route with a form service.

## Motion and accessibility

- GSAP runs inside `useGSAP` scopes with `gsap.matchMedia`, so everything is cleaned up automatically. Scroll reveals fire once and page scroll is never hijacked.
- `prefers-reduced-motion: reduce` skips the timelines and shows content immediately. Parallax runs only at ≥768 px.
- If the animation layer fails to start, a fallback in `layout.tsx` makes the content visible after 2.5 s.
- Semantic landmarks, skip link, labelled form fields with `aria-invalid` and `aria-describedby` errors, visible focus rings, and a keyboard-accessible mobile menu (Escape closes it).

## Content assumptions

- All copy uses only the confirmed facts: multi-country operations and sourcing; trading, sourcing and distribution; the two divisions and their products; a global B2B audience; the enquiry email.
- The Global Reach map names India as origin and the UAE, Nigeria, the Middle East, Africa and other markets as trade connections, at the founder's request. These are markets served, not offices.
- **Not included on purpose:** office locations, statistics, certifications, client logos, testimonials, phone number, postal address, social links, registration numbers, and delivery promises. Add them only once confirmed.
- Brand content (from the founder): the hero headline is the primary tagline **"Bridging Nations. Building Trust."** and its eyebrow is the secondary tagline **"Trade Beyond Borders."** The vision statement ("Build a globally recognized, trustworthy and profitable international trading company") sits in the About section. All three live in `lib/site.ts`. The brief's original headline is now the hero's supporting sentence.
- Typography: **Playfair Display** (serif) for headings and **Inter** for body and interface text.
- The "Helpful to include" list and form placeholders tell buyers what to send (part numbers, quantity, port, Incoterm). They make no claims about the company.

## Still needed before launch

- [ ] Official logo files (SVG/PNG, light and dark variants) and brand guidelines
- [ ] Resend account, domain verification and environment variables
- [ ] Hosting account and DNS changes (keep the email records)
- [ ] Founder name, portrait, LinkedIn URL and approved founder's message (`lib/founder.ts`)
- [ ] Optional confirmed details: WhatsApp business number, LinkedIn page, public location
