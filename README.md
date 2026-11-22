# CrewStack

**CrewStack** is a multi-industry field-service management app for independent contractors, service businesses, and small crews. Its goal is to make running field work simpler and more affordable across multiple trades, without assuming that every company is a landscaping business.

## Who it's for

**Any industry selected or entered by the business owner.** Landscaping, HVAC, plumbing, electrical, cleaning, construction, painting, and property maintenance are optional starter examples only. A user can enter an entirely new industry and define its own services without developer approval or changing the app.

## Core features (planned)

- Customer and property records, addresses and contact details
- Job and work-order tracking with notes, status, photos, and history
- Estimates and quotes with editable labor, materials, overhead, and profit calculations
- Scheduling, crew assignments, and start/finish time tracking
- Invoicing, payment status, and job costing
- GPS/job location context where appropriate and permissioned
- Recurring service contracts and optional add-ons
- Industry-specific service templates that can be customized or ignored

## Product principles

1. **User-defined industries, no whitelist.** Let each business select a starter industry or enter any new industry name, define services in its own words, and change them later. Never force a fixed set of trades or hard-code landscaping terminology into shared workflows.
2. **Flexible pricing.** Each business defines its own services, rates, schedules, travel fees, and add-ons.
3. **Preserve the existing CrewStack interface.** Keep the established dark evergreen design and orange action treatment unless intentionally revised.
4. **Lean and useful.** Focus on a working MVP for small crews before expanding features.
5. **Protect business data.** Do not commit customer records, passwords, credentials, billing secrets, or production keys.

## Project status

This repository is newly initialized. **The existing ChatGPT-hosted CrewStack website has not yet been imported here.** This README is project guidance, not the complete app or evidence that features are implemented. Source export/import and feature integration remain to be completed before deployment or Play Store packaging.

## Example: maintenance pricing templates

Landscaping may offer recurring mowing and optional gravel blowing or weed removal. Those are examples of custom service line items, **not** app-wide required fields. The same system should also support HVAC service calls, plumbing repairs, electrical inspections, cleaning contracts, and other industries.

## License

No open-source license has been granted. All rights reserved unless the repository owner chooses otherwise.
