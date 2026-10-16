// Everything the UI shows comes from site.json. Import `site` from here, never hard-code content.
import site from './site.json';

export default site;

/** Resolves a /public path from site.json (e.g. "/assets/brand/logo.jpeg") against the app base URL. */
export function asset(path) {
  if (!path) return '';
  if (/^(https?:|data:)/.test(path)) return path;
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return base + (path.startsWith('/') ? path : `/${path}`);
}

export const digitsOnly = (value = '') => String(value).replace(/\D/g, '');

export const telHref = (phone) => `tel:+${digitsOnly(phone)}`;

export const mailHref = (email) => `mailto:${email}`;

export function whatsappHref(number, text) {
  const query = text ? `?text=${encodeURIComponent(text)}` : '';
  return `https://wa.me/${digitsOnly(number)}${query}`;
}

export function formatAddress({ line1, line2, city, state, pincode }) {
  return `${[line1, line2, city, state].filter(Boolean).join(', ')}${pincode ? ` – ${pincode}` : ''}`;
}

/** Sections that are enabled, in the order listed in site.json. */
export const enabledSections = (s = site) => s.sections.order.filter((sec) => sec.enabled);

/**
 * Replaces {{brand.name}}, {{contact.phone}}, {{contact.address}}, {{grievanceOfficer.email}} … in JSON text,
 * so names and contact details are written once in site.json and reused everywhere.
 */
export function fillTokens(text) {
  const context = {
    brand: site.brand,
    contact: { ...site.contact, address: formatAddress(site.contact.address) },
    grievanceOfficer: site.legal?.grievanceOfficer,
  };
  const pass = (s) =>
    s.replace(/\{\{\s*([\w.]+)\s*\}\}/g, (match, path) => {
      const value = path.split('.').reduce((obj, key) => obj?.[key], context);
      return value == null || typeof value === 'object' ? match : String(value);
    });
  return pass(pass(String(text ?? ''))); // twice: a token's value may itself contain a token
}

/** Legal documents (privacy policy, terms) open in a dialog when the URL hash is `#<id>`. */
export const legalDocuments = site.legal?.documents ?? [];
