const inrFormatter = new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 });

/** ₹1,23,456 (Indian digit grouping). */
export const inr = (n) => `₹${inrFormatter.format(Math.round(n))}`;

/** ₹1.85 L / ₹2.40 Cr for big amounts, ₹45,000 otherwise. */
export function inrShort(n) {
  const abs = Math.abs(n);
  if (abs >= 1e7) return `₹${trim(n / 1e7)} Cr`;
  if (abs >= 1e5) return `₹${trim(n / 1e5)} L`;
  return inr(n);
}

const trim = (n) => n.toFixed(2).replace(/\.?0+$/, '');

export const number = (n, decimals = 0) =>
  new Intl.NumberFormat('en-IN', { minimumFractionDigits: decimals, maximumFractionDigits: decimals }).format(n);

/** 4 kW, 4.5 kW */
export const kw = (n) => `${trim(n)} kW`;

export function years(n) {
  if (n == null) return '25+ yrs';
  return `${n.toFixed(1).replace(/\.0$/, '')} yrs`;
}
