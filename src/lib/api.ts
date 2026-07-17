import { getDocsApiUrl } from "./docs-api-url";

const API_URL = getDocsApiUrl();
const MASTER_TOKEN =
  (process.env.DOCS_MASTER_TOKEN || process.env.DOCS_API_TOKEN || "").trim();

// ── Types ──────────────────────────────────────────────

export interface DocSpace {
  id: number;
  name: string;
  slug: string;
  description: string | null;
  icon: string | null;
  isPublic: boolean;
  sortOrder: number;
  pagesCount?: number;
}

export interface DocPage {
  id: number;
  spaceId: number;
  title: string;
  slug: string;
  content: string | null;
  excerpt: string | null;
  icon: string | null;
  sortOrder: number;
  parentId: number | null;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
  space?: DocSpace;
}

export interface DocSearchResult {
  id: number;
  title: string;
  slug: string;
  excerpt: string;
  spaceSlug: string;
  spaceName: string;
}

export interface AllData {
  spaces: DocSpace[];
  pages: DocPage[];
}

// ── Fetch helper ───────────────────────────────────────

async function apiFetch<T>(
  path: string,
  projectId: number,
  params?: Record<string, string | undefined>
): Promise<T> {
  const url = new URL(`${API_URL}/${path}`.replace(/\/+$/, ""));
  url.searchParams.set("projectId", String(projectId));
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== "") url.searchParams.set(k, v);
    }
  }

  const headers: Record<string, string> = {};
  if (MASTER_TOKEN) {
    headers.Authorization = `Bearer ${MASTER_TOKEN}`;
    headers["x-api-key"] = MASTER_TOKEN;
  }

  const res = await fetch(url.toString(), {
    headers,
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    throw new Error(`API ${res.status}: ${res.statusText}`);
  }

  const json = await res.json();
  return (json.data !== undefined ? json.data : json) as T;
}

function isApiNotFoundError(error: unknown): boolean {
  return error instanceof Error && error.message.startsWith("API 404:");
}

// ── Public functions ───────────────────────────────────

export async function getAll(projectId: number): Promise<AllData> {
  return apiFetch<AllData>("all", projectId);
}

export async function getSpaces(projectId: number): Promise<DocSpace[]> {
  try {
    return await apiFetch<DocSpace[]>("spaces", projectId);
  } catch (error) {
    if (isApiNotFoundError(error)) return [];
    throw error;
  }
}

export async function getSpacePages(spaceSlug: string, projectId: number): Promise<DocPage[]> {
  try {
    const data = await apiFetch<{ space: DocSpace; pages: DocPage[] } | DocPage[]>(
      `spaces/${encodeURIComponent(spaceSlug)}/pages`,
      projectId
    );
    return Array.isArray(data) ? data : data.pages;
  } catch (error) {
    if (isApiNotFoundError(error)) return [];
    throw error;
  }
}

export async function getPage(slug: string, projectId: number): Promise<DocPage> {
  return apiFetch<DocPage>(`pages/${encodeURIComponent(slug)}`, projectId);
}

export async function searchDocs(
  query: string,
  projectId: number,
  spaceId?: string
): Promise<DocSearchResult[]> {
  return apiFetch<DocSearchResult[]>("search", projectId, { q: query, spaceId });
}
