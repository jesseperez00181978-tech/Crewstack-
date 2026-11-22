# CrewStack source integration plan

The original CrewStack website was built in ChatGPT Sites. Its source is **not yet in this repository**. Do not overwrite its existing design or pretend the web UI is connected to these modules.

## Safe import steps

1. Export the complete current website source as a ZIP, including its configuration and assets.
2. Inspect its framework and dependencies, then integrate rather than replace its existing Jobs, Customers, Crews, Estimates, and Invoices screens.
3. Wire the existing estimate UI to `calculateEstimate()`, mapping its line-item fields to `description`, `quantity`, `unitPrice`, and `unitCost`.
4. Store all quotes and service prices per business/customer, never as landscaping-only global constants.
5. Provide optional industry starter templates; users may ignore templates, mix services, and create their own service names.
6. Include recurring services and separate visits as independent scheduled jobs and invoice line items.
7. Validate data storage, authentication, billing, Android packaging, and testing before release.

## Pricing module boundaries

- The core is trade-neutral and has no visual components.
- Currency conversion, local sales tax, payroll, payment processing, and licensing are **not implemented**.
- Estimates and annual projections are examples or planning figures, not booked revenue.
- `src/catalog/industry-templates.mjs` contains *examples*, not a restriction on supported businesses.

## Testing

Node.js 18+: `node --test tests/estimate.test.mjs`
