# Raywave Solars website

Single-page React (Vite) site for a rooftop solar installer. All content (contact details, logo, images, colours,
section text, calculator prices) lives in **one file**: [`src/config/site.json`](src/config/site.json).

```bash
npm install
npm run dev       # http://localhost:5173 – edits to site.json appear instantly
npm run build     # production build in dist/
npm run preview   # serve the production build locally
npm run lint      # ESLint
npm run format    # Prettier
```

## Editing content

Open `src/config/site.json` and change values. While `npm run dev` is running, the page updates as soon as you save,
without a reload. For production, run `npm run build` again and redeploy `dist/`.

| What you want to change | Key in `site.json` |
| --- | --- |
| Phone, WhatsApp, email, address, hours, map | `contact` |
| Company name, tagline, logo, favicon | `brand` |
| Title / description for Google and link previews | `seo` (also used for the LocalBusiness data Google reads) |
| Brand colours | `theme` |
| Social media links | `socials` (`platform`: facebook, instagram, youtube, linkedin, x) |
| Show / hide / reorder sections, menu labels | `sections.order` (`enabled`, `inNav`, list order = page order) |
| Hero headline, offer cards | `hero` |
| Stats strip | `trust` |
| Calculator prices, tariff, subsidy slabs | `calculator` |
| EMI defaults, lenders | `financing` |
| Projects, reviews, FAQ, brands | `projects`, `reviews`, `faq`, `partners` |
| YouTube videos under reviews | `videos.items` (list of YouTube IDs; empty = hidden) |
| Where enquiries go | `leadForm` (see below) |

Keys starting with `_` (like `_comment`) are notes for editors and are ignored by the site.

**Before going live, replace everything marked SAMPLE**: the contact details, stats, projects, reviews, the hero
savings card, EMI rates, and the `seo.siteUrl`.

## Images and logo

Images live in `public/assets/` and are referenced in the JSON by path, e.g. `"/assets/brand/logo.jpeg"`.

- `public/assets/brand/logo.jpeg`: the full logo (footer, link previews)
- `public/assets/brand/logo-mark.svg`: the small sun-and-panel mark used in the header and browser tab
- `public/assets/images/…`: solution and project pictures (placeholder illustrations for now)

To use a real photo, drop it into `public/assets/images/` (JPG/WebP, ~1200 px wide) and update the path in the
JSON. If your new header logo already contains the company name, set `brand.headerLogo.showName` to `false`.
Brand logos can be added to `partners` items with a `logo` path; otherwise the brand name is shown.

## Enquiry form

`leadForm.mode`:

- `"whatsapp"` (default): opens WhatsApp to `contact.whatsapp` with the enquiry pre-filled. No server needed.
- `"endpoint"`: POSTs the form as JSON to `leadForm.endpoint` (e.g. a Formspree URL or your own API).

## Privacy Policy and Terms

Both documents live in `legal.documents` in `site.json` and open in a pop-up for any link to `#<id>`
(`#privacy-policy`, `#terms`), from the footer, the enquiry form or a shared URL like `yoursite.com/#privacy-policy`.
Text can use `{{brand.legalName}}`, `{{contact.phone}}`, `{{contact.address}}` and similar placeholders, so contact details
are written only once. `**bold**` and `[link](#privacy-policy)` are supported. The grievance contact is
`legal.grievanceOfficer`. The current text is a **draft**: have it reviewed by a lawyer or CA, then update `lastUpdated`.

## Calculator maths

`src/lib/solar.js` reads the numbers in `calculator`: monthly units = (bill − fixed charge) ÷ tariff; system size =
units ÷ `unitsPerKwPerMonth`, rounded up to `kwStep`; cost from the `costPerKw` slab; subsidy from `subsidy.slabs`
(PM Surya Ghar by default: ₹30k/kW up to 2 kW, ₹18k for the 3rd kW, max ₹78k). Payback and 25-year savings
include panel degradation and tariff escalation. The EMI section uses the calculator's system cost.

## Project structure

```
public/assets/          images, logo (referenced from site.json)
src/config/site.json    ALL content
src/config/index.js     helpers: asset paths, tel/WhatsApp links, address formatting
src/lib/                calculator, EMI and simulator logic (pure functions)
src/context/            shared calculator state + contact-form prefill
src/layout/             top bar, header, footer, floating call/WhatsApp
src/sections/           one component (+ CSS) per page section
src/styles/global.css   design tokens, buttons, forms, utilities
vite.config.js          injects <title>, meta, OG and JSON-LD from site.json into index.html
research/               competitor analysis and captures (not part of the site)
```
