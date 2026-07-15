const DEFAULT_DOCS_API_URL = "https://api.zodev.live/api/docs/v1/public";
const LEGACY_DOCS_HOST = "api.zoddev.site";

export function getDocsApiUrl(): string {
  const configured = process.env.DOCS_API_URL?.trim();
  if (!configured) return DEFAULT_DOCS_API_URL;

  try {
    const url = new URL(configured);
    if (url.hostname === LEGACY_DOCS_HOST) return DEFAULT_DOCS_API_URL;
    return configured;
  } catch {
    if (configured.includes(LEGACY_DOCS_HOST)) return DEFAULT_DOCS_API_URL;
    return configured;
  }
}
