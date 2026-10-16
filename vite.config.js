import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const root = path.dirname(fileURLToPath(import.meta.url));
const SITE_JSON = path.join(root, 'src/config/site.json');

// Writes <title>, meta/OG tags, favicon and LocalBusiness JSON-LD into index.html from
// src/config/site.json, so search engines and link previews see the same details as the UI.
function siteHead() {
  let base = '/';
  return {
    name: 'site-head',
    configResolved(config) {
      base = config.base;
    },
    transformIndexHtml() {
      const site = JSON.parse(fs.readFileSync(SITE_JSON, 'utf8'));
      const { seo, brand, contact, theme, socials = [] } = site;
      const local = (p) => (/^https?:/.test(p) ? p : base.replace(/\/$/, '') + p);
      const absolute = (p) => (/^https?:/.test(p) ? p : seo.siteUrl.replace(/\/$/, '') + p);
      const meta = (attrs) => ({ tag: 'meta', attrs, injectTo: 'head' });
      const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'LocalBusiness',
        name: brand.name,
        legalName: brand.legalName,
        slogan: brand.tagline,
        url: seo.siteUrl,
        logo: absolute(brand.logo),
        image: absolute(seo.ogImage),
        telephone: contact.phone,
        email: contact.email,
        address: {
          '@type': 'PostalAddress',
          streetAddress: [contact.address.line1, contact.address.line2].filter(Boolean).join(', '),
          addressLocality: contact.address.city,
          addressRegion: contact.address.state,
          postalCode: contact.address.pincode,
          addressCountry: 'IN',
        },
        areaServed: contact.serviceArea,
        sameAs: socials.map((s) => s.url),
      };
      return [
        { tag: 'title', children: seo.title, injectTo: 'head' },
        meta({ name: 'description', content: seo.description }),
        meta({ name: 'keywords', content: seo.keywords }),
        meta({ name: 'theme-color', content: theme.navy }),
        meta({ property: 'og:type', content: 'website' }),
        meta({ property: 'og:site_name', content: brand.name }),
        meta({ property: 'og:title', content: seo.title }),
        meta({ property: 'og:description', content: seo.description }),
        meta({ property: 'og:url', content: seo.siteUrl }),
        meta({ property: 'og:image', content: absolute(seo.ogImage) }),
        meta({ name: 'twitter:card', content: 'summary_large_image' }),
        { tag: 'link', attrs: { rel: 'icon', href: local(brand.favicon) }, injectTo: 'head' },
        { tag: 'link', attrs: { rel: 'canonical', href: seo.siteUrl }, injectTo: 'head' },
        { tag: 'script', attrs: { type: 'application/ld+json' }, children: JSON.stringify(jsonLd), injectTo: 'head' },
      ];
    },
  };
}

export default defineConfig({
  plugins: [react(), siteHead()],
});
