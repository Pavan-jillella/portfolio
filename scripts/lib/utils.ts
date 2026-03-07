export function slugify(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function normalizeDomain(domain: string): string {
  return domain
    .toLowerCase()
    .replace(/^(https?:\/\/)?(www\.)?/, "")
    .replace(/\/+$/, "");
}

export function faviconUrl(domain: string): string {
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
}

export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function generateServiceId(slug: string): string {
  return slug;
}

export function generatePlanId(serviceSlug: string, planName: string): string {
  return `${serviceSlug}-${slugify(planName)}`;
}

export function escapeSQL(str: string): string {
  return str.replace(/'/g, "''");
}
