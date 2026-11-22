import test from 'node:test';
import assert from 'node:assert/strict';
import { calculateEstimate, projectAnnualRevenue } from '../src/core/estimate.mjs';
import { INDUSTRY_TEMPLATES } from '../src/catalog/industry-templates.mjs';

test('estimates work for any industry, not just landscaping', () => {
  const result = calculateEstimate([
    { description: 'HVAC diagnostic', quantity: 1, unitPrice: 150, unitCost: 45 },
    { description: 'Replacement part', quantity: 2, unitPrice: 36.5, unitCost: 20 },
  ]);
  assert.equal(result.subtotal, 223);
  assert.equal(result.estimatedCost, 85);
  assert.equal(result.grossProfit, 138);
  assert.equal(result.items.length, 2);
  assert.equal(result.taxIncluded, false);
});
test('supports fractional labor and the difference between markup and margin', () => {
  const result = calculateEstimate([
    { description: 'Painting labor', quantity: 2.5, unit: 'hour', unitPrice: 40, unitCost: 20 },
    { description: 'Supplies', quantity: 4, unitPrice: 22.5, unitCost: 12 },
  ]);
  assert.equal(result.subtotal, 190);
  assert.equal(result.estimatedCost, 98);
  assert.equal(result.grossProfit, 92);
  assert.equal(result.grossMarginPercent, 48.42);
  assert.equal(result.markupPercent, 93.88);
});
test('unpriced work is not silently marked profitable', () => {
  const result = calculateEstimate([{ description: 'Warranty revisit', unitPrice: 0 }]);
  assert.equal(result.subtotal, 0);
  assert.equal(result.grossMarginPercent, null);
  assert.equal(result.markupPercent, null);
});
test('rejects negative prices and zero quantities', () => {
  assert.throws(() => calculateEstimate([{ description: 'Work', unitPrice: -1 }]), /non-negative/);
  assert.throws(() => calculateEstimate([{ description: 'Work', quantity: 0, unitPrice: 10 }]), /positive/);
  assert.throws(() => calculateEstimate([{ description: '', unitPrice: 10 }]), /description/);
});
test('projects revenue across different contracts', () => {
  const result = projectAnnualRevenue([
    { description: 'Quarterly HVAC service', visitsPerYear: 4, unitPrice: 150 },
    { description: 'Monthly commercial cleaning', visitsPerYear: 12, unitPrice: 90 },
  ]);
  assert.equal(result.annualRevenue, 1680);
  assert.equal(result.averageMonthlyRevenue, 140);
});
test('supports extra service categories without changing the core', () => {
  assert.ok(INDUSTRY_TEMPLATES.landscaping.includes('Weed removal'));
  assert.ok(INDUSTRY_TEMPLATES.hvac.includes('Diagnostic visit'));
  assert.ok(INDUSTRY_TEMPLATES.cleaning.includes('Commercial janitorial visit'));
});
