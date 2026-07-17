const DEFAULT_DOCS_API_URL = "https://integrations-api.zodev.live/api/docs/v1/public";
const LEGACY_DOCS_HOSTS = new Set(["api.zoddev.site", "api.zodev.live"]);

export function getDocsApiUrl(): string {
  const configured = process.env.DOCS_API_URL?.trim();
  if (!configured) return DEFAULT_DOCS_API_URL;

  try {
    const url = new URL(configured);
    if (LEGACY_DOCS_HOSTS.has(url.hostname)) return DEFAULT_DOCS_API_URL;
    return url.toString().replace(/\/+$/, "");
  } catch {
    if ([...LEGACY_DOCS_HOSTS].some((host) => configured.includes(host))) {
      return DEFAULT_DOCS_API_URL;
    }
    return configured.replace(/\/+$/, "");
  }
}
