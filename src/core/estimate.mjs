/**
 * CrewStack core estimates: independent of trade, framework, and currency formatter.
 * Prices and costs represent a single currency chosen by the business.
 * This module does not calculate sales tax; jurisdiction-specific rules belong elsewhere.
 */
const cents = (value, field) => {
  if (typeof value !== 'number' || !Number.isFinite(value) || value < 0) {
    throw new TypeError(field + ' must be a non-negative finite number');
  }
  return Math.round((value + Number.EPSILON) * 100);
};
const dollars = value => Math.round(value) / 100;
const percentage = (part, whole) => whole === 0 ? null : Math.round(part / whole * 10000) / 100;

/** Line: { description, quantity, unitPrice, unitCost?, unit?, serviceCode? } */
export function calculateEstimate(lines = []) {
  if (!Array.isArray(lines)) throw new TypeError('lines must be an array');
  const items = lines.map((line, index) => {
    if (!line || typeof line !== 'object' || Array.isArray(line)) throw new TypeError('line must be an object');
    const description = String(line.description ?? '').trim();
    if (!description) throw new TypeError('line ' + index + ' needs a description');
    const quantity = line.quantity ?? 1;
    if (typeof quantity !== 'number' || !Number.isFinite(quantity) || quantity <= 0) {
      throw new TypeError('quantity must be a positive finite number');
    }
    const unitPriceCents = cents(line.unitPrice, 'unitPrice');
    const unitCostCents = cents(line.unitCost ?? 0, 'unitCost');
    const amountCents = Math.round(quantity * unitPriceCents);
    const costCents = Math.round(quantity * unitCostCents);
    return {
      description,
      serviceCode: line.serviceCode ?? null,
      unit: line.unit ?? 'each',
      quantity,
      unitPrice: dollars(unitPriceCents),
      unitCost: dollars(unitCostCents),
      amount: dollars(amountCents),
      cost: dollars(costCents),
      profit: dollars(amountCents - costCents),
    };
  });
  const revenueCents = items.reduce((sum, item) => sum + Math.round(item.amount * 100), 0);
  const costCents = items.reduce((sum, item) => sum + Math.round(item.cost * 100), 0);
  const grossProfitCents = revenueCents - costCents;
  return {
    items,
    subtotal: dollars(revenueCents),
    estimatedCost: dollars(costCents),
    grossProfit: dollars(grossProfitCents),
    grossMarginPercent: percentage(grossProfitCents, revenueCents),
    markupPercent: percentage(grossProfitCents, costCents),
    taxIncluded: false,
  };
}

/** Project service revenue from expected visit counts, without pretending work is booked. */
export function projectAnnualRevenue(services = []) {
  if (!Array.isArray(services)) throw new TypeError('services must be an array');
  const items = services.map(service => {
    if (!service || typeof service !== 'object') throw new TypeError('service must be an object');
    const visitsPerYear = service.visitsPerYear;
    if (!Number.isInteger(visitsPerYear) || visitsPerYear < 0) {
      throw new TypeError('visitsPerYear must be a non-negative integer');
    }
    const quote = calculateEstimate([{ description: service.description, unitPrice: service.unitPrice, quantity: 1 }]);
    return { description: quote.items[0].description, visitsPerYear, annualAmount: dollars(Math.round(quote.subtotal * 100) * visitsPerYear) };
  });
  const annualRevenueCents = items.reduce((sum, item) => sum + Math.round(item.annualAmount * 100), 0);
  return { items, annualRevenue: dollars(annualRevenueCents), averageMonthlyRevenue: dollars(Math.round(annualRevenueCents / 12)) };
}
