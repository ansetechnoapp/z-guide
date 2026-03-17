import { headers } from 'next/headers';

const API_URL = process.env.DOCS_API_URL || 'https://api.zoddev.site/api/docs/v1/public';

export interface ProjectInfo {
  id: number;
  name: string;
  slug: string;
  description: string | null;
}

export async function getProjectSlug(): Promise<string> {
  const h = await headers();
  return h.get('x-project-slug') || 'zodback-platform';
}

export async function resolveProject(slug: string): Promise<ProjectInfo> {
  const res = await fetch(`${API_URL}/project/${encodeURIComponent(slug)}`, {
    next: { revalidate: 300 },
  });
  if (!res.ok) throw new Error(`Project "${slug}" not found (${res.status})`);
  const json = await res.json();
  return (json.data ?? json) as ProjectInfo;
}
