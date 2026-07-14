const API_URL = process.env.DOCS_API_URL || "https://api.zodev.live/api/docs/v1/public";
const MASTER_TOKEN = process.env.DOCS_MASTER_TOKEN || process.env.DOCS_API_TOKEN || "";

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

  const res = await fetch(url.toString(), {
    headers: {
      "Authorization": `Bearer ${MASTER_TOKEN}`,
      "x-api-key": MASTER_TOKEN,
    },
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    throw new Error(`API ${res.status}: ${res.statusText}`);
  }

  const json = await res.json();
  return (json.data !== undefined ? json.data : json) as T;
}

// ── Public functions ───────────────────────────────────

export async function getAll(projectId: number): Promise<AllData> {
  return apiFetch<AllData>("all", projectId);
}

export async function getSpaces(projectId: number): Promise<DocSpace[]> {
  return apiFetch<DocSpace[]>("spaces", projectId);
}

export async function getSpacePages(spaceSlug: string, projectId: number): Promise<DocPage[]> {
  const data = await apiFetch<{ space: DocSpace; pages: DocPage[] } | DocPage[]>(
    `spaces/${encodeURIComponent(spaceSlug)}/pages`,
    projectId
  );
  return Array.isArray(data) ? data : data.pages;
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
