/** Optional starting templates only. Businesses can create unlimited custom services. */
export const INDUSTRY_TEMPLATES = Object.freeze({
  landscaping: ['Lawn maintenance visit', 'Detailed gravel blowing', 'Weed removal', 'Irrigation repair', 'Yard cleanup'],
  hvac: ['Diagnostic visit', 'Preventive maintenance', 'Equipment repair', 'System installation'],
  plumbing: ['Service call', 'Leak repair', 'Fixture replacement', 'Drain service'],
  electrical: ['Troubleshooting visit', 'Outlet or switch service', 'Lighting installation', 'Panel inspection'],
  cleaning: ['Standard cleaning visit', 'Deep cleaning', 'Commercial janitorial visit', 'Move-out cleaning'],
  construction: ['Site preparation', 'Project labor', 'Materials', 'Project milestone'],
  painting: ['Surface preparation', 'Interior painting', 'Exterior painting', 'Touch-up service'],
  handyman: ['General service visit', 'Assembly', 'Minor repairs', 'Installations'],
  propertyMaintenance: ['Property inspection', 'Preventive maintenance', 'Turnover preparation', 'Emergency service'],
});

export const units = Object.freeze(['each', 'hour', 'visit', 'day', 'sq ft', 'linear ft', 'project']);

/**
 * Any user-supplied industry name is valid. Starter categories are suggestions,
 * never a whitelist. Custom services can describe any kind of job.
 */
export function createIndustryProfile({ industry, services = [] } = {}) {
  if (typeof industry !== 'string' || !industry.trim()) {
    throw new TypeError('industry is required');
  }
  if (!Array.isArray(services)) {
    throw new TypeError('services must be an array');
  }
  const cleanIndustry = industry.trim();
  const cleanServices = services.map(service => {
    if (typeof service !== 'string' || !service.trim()) {
      throw new TypeError('each service must be a nonempty name');
    }
    return service.trim();
  });
  const starterKey = Object.keys(INDUSTRY_TEMPLATES)
    .find(key => key.toLowerCase() === cleanIndustry.toLowerCase()) ?? null;
  return {
    industry: cleanIndustry,
    starterTemplate: starterKey,
    services: cleanServices.length
      ? cleanServices
      : starterKey
        ? [...INDUSTRY_TEMPLATES[starterKey]]
        : [],
  };
}
