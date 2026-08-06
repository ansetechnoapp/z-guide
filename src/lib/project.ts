import { headers } from "next/headers";
import { getDocsApiUrl } from "./docs-api-url";

const API_URL = getDocsApiUrl();
const MASTER_TOKEN = (process.env.DOCS_MASTER_TOKEN || "").trim();
if (process.env.NODE_ENV === "production" && !MASTER_TOKEN) {
  throw new Error("DOCS_MASTER_TOKEN is required in production");
}

export interface ProjectInfo {
  id: number;
  name: string;
  slug: string;
  description: string | null;
}

export async function getProjectSlug(): Promise<string> {
  const configuredSlug = process.env.DOCS_PROJECT_SLUG?.trim();
  if (process.env.NODE_ENV === "production" && !configuredSlug) {
    throw new Error("DOCS_PROJECT_SLUG is required in production");
  }
  const headerStore = await headers();
  const headerSlug = headerStore.get("x-project-slug")?.trim();
  if (headerSlug) return headerSlug;

  return configuredSlug || "zodback-platform";
}

export async function resolveProject(slug: string): Promise<ProjectInfo> {
  const res = await fetch(`${API_URL}/project/${encodeURIComponent(slug)}`, {
    headers: {
      ...(MASTER_TOKEN ? { Authorization: `Bearer ${MASTER_TOKEN}`, "x-api-key": MASTER_TOKEN } : {}),
      "x-project-id": slug === "projecttest1" ? "2" : "3",
    },
    next: { revalidate: 300 },
  });
  if (!res.ok) throw new Error(`Project "${slug}" not found (${res.status})`);
  const json = await res.json();
  return (json.data ?? json) as ProjectInfo;
}

export function getDocsBrandName(projectName: string): string {
  return projectName.replace(/\s+Platform$/i, "").trim() || projectName;
}
