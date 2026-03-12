const API_URL = process.env.DOCS_API_URL || "https://api.zoddev.site/api/docs/v1/public";
const API_TOKEN = process.env.DOCS_API_TOKEN || "";
const PROJECT_ID = process.env.DOCS_PROJECT_ID || "1";

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

async function apiFetch<T>(path: string, params?: Record<string, string | undefined>): Promise<T> {
  const url = new URL(`${API_URL}/${path}`.replace(/\/+$/, ""));

  if (PROJECT_ID) url.searchParams.set("projectId", PROJECT_ID);
  if (params) {
    for (const [k, v] of Object.entries(params)) {
      if (v !== undefined && v !== "") url.searchParams.set(k, v);
    }
  }

  const res = await fetch(url.toString(), {
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${API_TOKEN}`,
      "x-api-key": API_TOKEN,
      "Origin": process.env.NEXT_PUBLIC_SITE_URL || "https://guide.zoddev.site",
    },
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    throw new Error(`API ${res.status}: ${res.statusText}`);
  }

  const json = await res.json();
  // API wraps responses in { success: true, data: ... }
  return (json.data !== undefined ? json.data : json) as T;
}

// ── Public functions ───────────────────────────────────

export async function getAll(): Promise<AllData> {
  return apiFetch<AllData>("all");
}

export async function getSpaces(): Promise<DocSpace[]> {
  return apiFetch<DocSpace[]>("spaces");
}

export async function getSpacePages(spaceSlug: string): Promise<DocPage[]> {
  return apiFetch<DocPage[]>(`spaces/${encodeURIComponent(spaceSlug)}/pages`);
}

export async function getPage(slug: string): Promise<DocPage> {
  return apiFetch<DocPage>(`pages/${encodeURIComponent(slug)}`);
}

export async function searchDocs(query: string, spaceId?: string): Promise<DocSearchResult[]> {
  return apiFetch<DocSearchResult[]>("search", { q: query, spaceId });
}
