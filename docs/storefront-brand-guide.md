# Tarumed storefront brand guide

This document is the implementation plan for turning the live ERP catalogue into a professional medical-supplies website. The catalogue, quote cart, search, and admin tools stay in place. The storefront should sell **Tarumed the company** first, then make it easy to browse and request products.

## Goal

A visitor on phone or desktop should immediately understand:

> Tarumed supplies medical equipment, laboratory solutions, hospital furniture and other healthcare products across different healthcare divisions.

The site must feel modern, professional, premium, clean, trustworthy, and easy to navigate — not like an inventory dump.

Do **not** show ERP language on public pages (“ERP catalogue”, “live inventory”, “from the Tarumed ERP”).

## Information architecture

| Nav item | Route | Role |
| --- | --- | --- |
| Home | `/` | Brand story + divisions + featured products |
| Products | `/shop` plus mega-menu | Full catalogue; divisions listed in dropdown |
| Solutions | `/solutions` | How Tarumed serves hospitals, labs, maternity, theatre, dental |
| Services | `/services` | Supply, installation, training, support, delivery, laboratory solutions |
| About Us | `/about` | Company introduction |
| Blog | `/blog` | Unchanged |
| Contact | `/contact` | Unchanged |

Jobs remain at `/admin` for editors and `/jobs` for applicants. They belong in the footer, not the primary nav.

Product URLs stay `/products/[slug]`. Category URLs stay `/categories/[id]` for ERP categories. Brand divisions use `/divisions/[slug]` so “Explore” can group related ERP categories and product-name matches.

## Homepage sections (in order)

1. **Hero** — Headline “Complete Medical & Laboratory Solutions”, short company lede, **Shop Products** (`/shop`) and **Request a Quote** (`/quote`), medical/lab photograph, tight vertical padding (no large empty bands).
2. **Our product divisions** — Cards for live divisions only (skip empty ones). Each card: image or icon, short description, product count, **Explore**.
3. **Featured products** — About 8 items, diversified across divisions. Prefer products that have real photos. Cards must not dump the whole catalogue here.
4. **Why Tarumed** — Quality products, reliable supply, technical support, installation & training, delivery & transport.
5. **Our services** — Equipment supply, installation, equipment training, technical support, delivery/transport, laboratory solutions.
6. **About Tarumed** — Short introduction + **Learn more** to `/about`.

## Product divisions

Preferred brand names (from the business), mapped onto **what is actually in the ERP**:

| Division | How it is filled |
| --- | --- |
| Hospital Furniture | Product names (beds, trolleys, cabinets, screens, wheelchairs, …) |
| Laboratory Division | `Laboratory Equipment` plus lab analysers / microscopes currently filed under medical equipment |
| Maternity & Obstetrics | Product names (warmers, delivery beds, fetal monitors, CS sets, …) |
| Theatre & Surgical Equipment | Product names (operating tables, theatre lights, autoclaves, diathermy, …) |
| Medical Equipment | Remainder of `Medical Equipment Division` |
| Dental Equipment | Product names (dental chair, …) |
| Rapid Diagnostic Kits | ERP category `Rapid Diagnostic Kits` |
| Serology Kits | ERP category `Serology Kits` (kept because it exists in stock) |
| Glucometers & Hb Machines | ERP category `Glucometers & HB Machines` |
| Lab Consumables | `Lab consumables` + `Lab Division` (those SKUs are consumables) |
| Lab Chemicals | ERP category `lab chemicals` |

`Transport service` is a **service**, not a shop division. It is described on Services, not as a product grid.

When new ERP categories appear, `lib/divisions.ts` should:

1. Match known aliases first.
2. Otherwise publish the ERP category as its own division (if it has products).

Empty brand divisions stay defined in code so they appear automatically once matching stock exists. They must not show as dead “Explore” cards.

## Navigation

Replace the second header bar of ERP category names with:

`Home · Products · Solutions · Services · About Us · Blog · Contact`

**Products** opens a mega-menu (desktop hover/focus, mobile accordion) of divisions, each linking to `/divisions/[slug]`, plus “View all products” → `/shop`.

Search, quote-cart badge, and logo stay in the header. Collapse the text nav into the hamburger below ~1080px so the bar does not wrap on tablets.

## Product cards

Every card (homepage featured, shop, related, division):

- Photograph with `object-fit: contain` on a calm clinical background (do not crop devices).
- Professional placeholder if no photo (no large blue “+”).
- Product name
- Category, and brand/manufacturer when present
- Stock status (“In stock”)
- View product
- Add to quote

Do not repeat “Request a quote” as the main label on cards.

## Product page

- Large contained gallery; placeholder when no image.
- Title at article size, not a giant marketing headline.
- Specs where available: category, brand, product code, packaging (unit), availability.
- Description from admin `details`, then ERP description. Ignore descriptions that are only the category name.
- Primary CTAs: **Add to Quote** and **Ask on WhatsApp**. System quote form is a secondary action.
- Related section labelled **You may also need**.

## Imagery rules

1. Prefer real Tarumed product / installation / team photos from Cloudinary (admin product images).
2. Homepage hero may use `public/images/hero-medical-lab.jpg` until facility photography is supplied.
3. Division cards use the first real product photo in that division when one exists; otherwise a consistent icon panel (not random stock).
4. Replace `/product-placeholder.svg` with a quiet medical mark, not an “add image” plus.

To swap in real photography later: drop files in `public/images/` and point `HERO_IMAGE` / division `image` fields at them.

## Visual system

- **Navy** `#1b3d8f` for headings and trust
- **Teal** `#20b2aa` as the brand accent (logo ring)
- **Sky** `#1d8fd4` for primary buttons and links
- **Paper** `#f4f8fb` page background
- Display type for headlines, sans for UI and body
- Tight section padding on mobile; 2-column product grid on phones; mega-menu never a second crowded bar

## What not to change

- ERP fetch, Mongo product extras, Cloudinary uploads, quote cart, live search, admin, jobs CMS, contact form
- Public site still has no Admin link in the header

## File map

| Area | Files |
| --- | --- |
| Copy & services | `lib/brand.ts` |
| Division matching | `lib/divisions.ts` |
| Homepage | `app/page.tsx`, `components/home-*.tsx` |
| Nav | `components/site-header-nav.tsx`, `components/site-footer.tsx` |
| Product UI | `components/product-card.tsx`, `components/product-gallery.tsx`, `components/quote-form.tsx`, `app/products/[id]/page.tsx` |
| New pages | `app/about`, `app/services`, `app/solutions`, `app/divisions/[slug]` |
| Styles | `app/globals.css` |
| Hero asset | `public/images/hero-medical-lab.jpg` |
