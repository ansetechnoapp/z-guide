const API_URL = process.env.DOCS_API_URL || 'https://api.zoddev.site/api/docs/v1/public';

export interface ProjectInfo {
  id: number;
  name: string;
  slug: string;
  description: string | null;
}

export function getProjectSlug(): string {
  return process.env.DOCS_PROJECT_SLUG || 'zodback-platform';
}

export async function resolveProject(slug: string): Promise<ProjectInfo> {
  const res = await fetch(`${API_URL}/project/${encodeURIComponent(slug)}`, {
    next: { revalidate: 300 },
  });
  if (!res.ok) throw new Error(`Project "${slug}" not found (${res.status})`);
  const json = await res.json();
  return (json.data ?? json) as ProjectInfo;
}
