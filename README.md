# Mustafa Traders — Boston Dream Cloud Mattress · e-Store

A single-product e-commerce site by **Mustafa Traders** selling the **Boston Dream Cloud** pocket spring mattress in a box, with free nationwide delivery across Pakistan and an owner-only admin panel.

> **Branding:** the business/store is **Mustafa Traders** (logo, footer, meta, emails, admin); the product is marketed as the **Boston Dream Cloud** mattress.

> **Status: Full-stack, deploy-ready.** Landing page (Claude Design "Boston Mattress Store" prototype — charcoal/gold/cream, Playfair + Inter), order flow persisting to Supabase + Resend email, protected admin (orders, status, notes, filters, CSV export, discount editor), GA4 + SEO structured data. Everything degrades gracefully when env vars are absent.

## Links

| | |
|---|---|
| **GitHub** | https://github.com/ahmed3209/Mustafa-Traders-Website |
| **Live (Vercel)** | https://mustafatraders.vercel.app |
| **Admin** | `/admin` (sign in at `/admin/login`) |

Deploy loop: commit → `git push` → Vercel auto-redeploys `main`.

---

## Tech stack

| Layer | Choice |
|---|---|
| Framework | Next.js 14 (App Router) + TypeScript |
| Styling | Tailwind CSS + CSS-variable design tokens |
| Motion | CSS scroll-reveal via IntersectionObserver (no 3D / JS animation libs) |
| Forms | React Hook Form + Zod |
| Database | Supabase (PostgreSQL) — orders + admin-managed pricing |
| Email | Resend — owner notification on new order |
| Admin auth | NextAuth (credentials) — middleware-protected `/admin` |
| Live chat | Tawk.to (embed) — to wire |
| Hosting | Vercel |

## Getting started

```bash
npm install
cp .env.example .env.local   # then fill in values
npm run dev                  # http://localhost:3000
```

Other scripts: `npm run build` · `npm run typecheck` · `npm run lint` · `npm run hash:password "your-password"`.

## Design system (UI/UX Guide v2.0)

- **Brand:** Boston Mattress® · product **Dream Cloud** · USP "Pakistan's First Pocket Spring Mattress in a Box"
- **Palette:** charcoal `#1C1412`, deep `#2A2520`, gold `#B8864E`, cream `#FDFAF6`, linen `#F5EDE0`
- **Type:** Playfair Display (display/serif) + Inter (body/UI)
- **Gold rule:** one gold CTA per viewport; sharp (0-radius) edges throughout
- Tokens live in [`src/app/globals.css`](src/app/globals.css) + [`tailwind.config.ts`](tailwind.config.ts). Edit content/business config in [`src/config/`](src/config/) (`product.ts`, `site.ts`, `cities.ts`, `testimonials.ts`).

### Confirmed business details (baked in)

- **Pricing:** King 78"×72" = **Rs. 85,000** · Queen 78"×66" = **Rs. 75,000** (discounts supported via `originalPrice` in `product.ts` → struck-through old price + bold new price)
- **Phone / WhatsApp:** 0332-4989289
- **Delivery:** Nationwide, 3–7 business days, free
- **Warranty:** 20-year (key differentiator)
- **Payment:** **Advance Bank Transfer** only at launch (admin can enable COD/others later)

## Page sections (single scroll)

Navbar (sticky, blur) → Hero (3D breathing fabric) → Product (gallery + size/qty selector + trust strip) → 5 Reasons → Delivery ("Small Box. Big Comfort.") → Order Form (sticky summary) → Contact → Footer (trust badges) + floating WhatsApp.

Size/quantity selection is shared between the Product section and the Order Form via [`SelectionProvider`](src/components/providers/SelectionProvider.tsx).

## Project structure

```
src/
  app/
    layout.tsx            Root layout, fonts (Playfair + Inter), metadata
    page.tsx              Landing page (composes sections inside SelectionProvider)
    globals.css           Design tokens + component classes (UI/UX Guide §2–§4)
    order-success/        Post-order confirmation page
    privacy-policy/ return-policy/   Policy pages (placeholder copy)
    admin/                Owner dashboard (login, orders, order detail, pricing) — protected
    api/orders/route.ts   POST order endpoint (validates, re-prices, persists, emails)
    api/admin/            Session-protected: order status/notes + pricing upsert
    api/auth/[...nextauth] NextAuth credentials handler
  components/
    sections/             Hero, Product, Reasons, Delivery, OrderForm, Testimonials, Contact, Footer
    ui/                   Navbar, Logo, WhatsAppFloat, LiveChat, RevealObserver
    providers/            SelectionProvider, PricingProvider
    admin/                AdminShell, LoginForm, LogoutButton, OrderStatusSelect, AdminNotes, PricingEditor
  config/                 product, site, cities, testimonials
  lib/                    pricing, orders, email, auth, utils, validations, supabase clients
  middleware.ts           Protects /admin (redirects to /admin/login)
  types/order.ts          Domain types (mirror DB schema)
supabase/schema.sql       orders + order_status_history + size_pricing, RLS, BM-YYYY-NNNN ids
scripts/hash-password.mjs Admin password hash
public/images/            Product images (dream-cloud-*.png)
```

## Backend setup

The site runs without a backend (orders return an id but aren't stored; admin shows "not configured"). To enable persistence, email, and admin:

**1. Supabase** — create a project, run [`supabase/schema.sql`](supabase/schema.sql) in the SQL editor, then set `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`.

**2. Email (Resend)** — set `RESEND_API_KEY` + `OWNER_EMAIL`. For real sending set `RESEND_FROM` to a verified-domain sender (the default `onboarding@resend.dev` only delivers to your own Resend account).

**3. Admin auth** — set `NEXTAUTH_SECRET` (32+ random chars), `NEXTAUTH_URL`, `ADMIN_USERNAME`, and `ADMIN_PASSWORD_HASH` (`npm run hash:password "your-password"`). Then sign in at `/admin/login`. All `/admin/*` routes are protected by middleware.

## Pricing & discounts (admin)

Prices are DB-managed. In **Admin → Pricing** the owner sets, per size, a **base price**, an optional **discounted price**, and an optional **tag** (e.g. "SUMMER SALE"). When a discount is set, the store shows the base price struck through, the discounted value in its place, a tag, and the savings — on the product section and order summary. The order API always re-prices server-side from the same source, so the charged total can't be tampered with client-side. Without Supabase, prices fall back to [`src/config/product.ts`](src/config/product.ts).

## Deploy to Vercel (free)

Target URL: **https://mustafatraders.vercel.app** (set in `site.url`).

1. Push this project to a GitHub repo (`git init && git add . && git commit && git push`).
2. On [vercel.com](https://vercel.com) → **New Project** → import the repo (Next.js is auto-detected).
3. Set the project name to **`mustafatraders`** so the URL becomes `mustafatraders.vercel.app`.
4. Add environment variables (Project → Settings → Environment Variables) — mirror `.env.example`. Important for production:
   - `NEXTAUTH_URL=https://mustafatraders.vercel.app`
   - `NEXTAUTH_SECRET`, `ADMIN_USERNAME`, `ADMIN_PASSWORD_HASH`
   - Supabase keys + `RESEND_API_KEY` / `OWNER_EMAIL` / `RESEND_FROM`
   - `NEXT_PUBLIC_GA_MEASUREMENT_ID` (optional)
5. Deploy. The site runs even with no env set (orders return an id but aren't stored; admin shows "not configured").

> The whole app works without a backend, so you can deploy first and add Supabase/Resend/admin env later — redeploys pick them up. If you add a custom domain later, update `NEXTAUTH_URL` and `site.url`.

## What works now vs. TODO

**Works:** full responsive landing page, order form → `/api/orders` (validates, re-prices server-side, **persists to Supabase**, **emails the owner**) → `/order-success`; **protected admin** with real dashboard aggregates, orders list, order detail (status + internal notes + call/WhatsApp), and the **pricing/discount editor**. Everything degrades gracefully when env vars are absent.

**TODO (nice-to-have):**
- Order filters (status/city/date) + CSV export; customer status-change emails (V2)
- Google Analytics 4, SEO structured data (Product/LocalBusiness schema), OG image
- Swap the built-in chat widget for Tawk.to if a real agent inbox is wanted

## Product images

Product images live in `public/images/` (referenced in [`src/config/product.ts`](src/config/product.ts)):

| Filename | Image |
|---|---|
| `dream-cloud-bedroom.png` | Lifestyle bedroom render — gallery/hero carousel |
| `dream-cloud-details.png` | Close-up grid — gallery/hero carousel |
| `dream-cloud-box.png` | Flat → rolled → boxed — gallery/hero carousel |
| `dream-cloud-layers.png` | Exploded cross-section — the "4 layers" breakdown |

## Pending / Open items

Confirm before/along with development:
1. Final mattress spec figures (spring count, thickness, comfort layers, cover material)
2. Product images (5+: full angle, pillow-top close-up, side piping, box, lifestyle)
3. Owner email for order notifications
4. Domain name (update `site.url`)
5. Whether to expose bank-transfer account details on the order/success page
6. Admin username + password (run `npm run hash:password`)
7. Tawk.to property id, GA4 measurement id

---

Built from `PocketSpring_Mattress_eStore_PRD.md` v1.0 + `PocketSpring_UIUXDesignGuide.md` v2.0.
