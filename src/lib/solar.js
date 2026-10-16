// Pure solar sizing / savings / EMI maths. All inputs come from site.json `calculator` and `financing`.

/** System price: the per-kW rate of the bracket the system size falls into. */
export function systemCost(kw, costSlabs) {
  const slab = costSlabs.find((s) => kw <= s.uptoKw) ?? costSlabs[costSlabs.length - 1];
  return kw * slab.rate;
}

/** Slab-wise subsidy, e.g. PM Surya Ghar: ₹30k/kW up to 2 kW, ₹18k for the 3rd kW, capped at ₹78k. */
export function subsidyAmount(kw, subsidy) {
  if (!subsidy) return 0;
  let total = 0;
  let previous = 0;
  for (const slab of subsidy.slabs) {
    total += Math.max(0, Math.min(kw, slab.uptoKw) - previous) * slab.perKw;
    previous = slab.uptoKw;
    if (kw <= slab.uptoKw) break;
  }
  return subsidy.max != null ? Math.min(total, subsidy.max) : total;
}

/**
 * Sizes a system for a monthly bill and projects savings.
 * @param {number} bill monthly electricity bill (₹)
 * @param {object} segment one of calculator.segments
 * @param {object} cfg the calculator config
 */
export function estimateSolar(bill, segment, cfg) {
  const tariff = segment.tariffPerUnit;
  const fixed = Math.min(segment.fixedChargePerMonth ?? 0, bill);
  const monthlyUnits = Math.max(0, bill - fixed) / tariff;
  const neededKw = monthlyUnits / cfg.unitsPerKwPerMonth;
  const step = segment.kwStep;
  const roundedKw = Math.ceil(neededKw / step - 1e-9) * step;
  const systemKw = Math.min(segment.maxKw, Math.max(segment.minKw, roundedKw));
  const cappedBySize = neededKw > segment.maxKw;

  const monthlyGeneration = systemKw * cfg.unitsPerKwPerMonth;
  const offsetUnits = Math.min(monthlyGeneration, monthlyUnits);
  const monthlySavings = offsetUnits * tariff;
  const billAfter = Math.max(0, bill - monthlySavings);

  const cost = systemCost(systemKw, segment.costPerKw);
  const subsidy = subsidyAmount(systemKw, segment.subsidy);
  const netCost = cost - subsidy;
  const annualSavings = monthlySavings * 12;

  // Year-by-year savings with panel degradation and tariff escalation.
  let cumulative = 0;
  let paybackYears = null;
  for (let year = 0; year < cfg.lifetimeYears; year++) {
    const saving = annualSavings * (1 - cfg.panelDegradationPerYear) ** year * (1 + cfg.tariffEscalationPerYear) ** year;
    if (paybackYears == null && cumulative + saving >= netCost && saving > 0) {
      paybackYears = year + (netCost - cumulative) / saving;
    }
    cumulative += saving;
  }

  const annualCo2Kg = monthlyGeneration * 12 * cfg.co2KgPerUnit;

  return {
    bill,
    monthlyUnits,
    systemKw,
    cappedBySize,
    panels: Math.ceil((systemKw * 1000) / cfg.panelWattage),
    roofAreaSqft: Math.round(systemKw * cfg.roofAreaSqftPerKw),
    monthlyGeneration,
    coveragePct: monthlyUnits > 0 ? Math.min(100, (offsetUnits / monthlyUnits) * 100) : 0,
    monthlySavings,
    annualSavings,
    billAfter,
    cost,
    subsidy,
    netCost,
    paybackYears,
    lifetimeSavings: cumulative,
    lifetimeProfit: cumulative - netCost,
    annualCo2Tonnes: annualCo2Kg / 1000,
    treesEquivalent: Math.round(annualCo2Kg / cfg.co2KgPerTreePerYear),
  };
}

/** Reducing-balance EMI: P·r·(1+r)^n / ((1+r)^n − 1). */
export function emi(principal, annualRatePct, months) {
  if (principal <= 0 || months <= 0) return 0;
  const r = annualRatePct / 12 / 100;
  if (r === 0) return principal / months;
  const growth = (1 + r) ** months;
  return (principal * r * growth) / (growth - 1);
}

export function loanSummary({ cost, downPaymentPct, ratePct, months, processingFeePct = 0 }) {
  const downPayment = (cost * downPaymentPct) / 100;
  const principal = Math.max(0, cost - downPayment);
  const monthly = emi(principal, ratePct, months);
  const totalPayable = monthly * months;
  return {
    downPayment,
    principal,
    monthly,
    totalInterest: totalPayable - principal,
    totalPayable,
    processingFee: (principal * processingFeePct) / 100,
  };
}
