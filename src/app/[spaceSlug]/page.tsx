import { getSpaces, getSpacePages } from "@/lib/api";
import { getProjectSlug, resolveProject } from "@/lib/project";
import { Breadcrumb } from "@/components/breadcrumb";
import Link from "next/link";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ spaceSlug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { spaceSlug } = await params;
  const slug = await getProjectSlug();
  const project = await resolveProject(slug);
  const spaces = await getSpaces(project.id);
  const space = spaces.find((s) => s.slug === spaceSlug);
  return {
    title: space?.name || spaceSlug,
    description: space?.description || `Documentation for ${spaceSlug}`,
  };
}

export default async function SpacePage({ params }: Props) {
  const { spaceSlug } = await params;
  const slug = await getProjectSlug();
  const project = await resolveProject(slug);
  const [spaces, pages] = await Promise.all([
    getSpaces(project.id),
    getSpacePages(spaceSlug, project.id),
  ]);
  const space = spaces.find((s) => s.slug === spaceSlug);

  return (
    <div className="space-index">
      <Breadcrumb items={[{ label: space?.name || spaceSlug }]} />

      <h1>{space?.name || spaceSlug}</h1>
      {space?.description && (
        <p className="space-description">{space.description}</p>
      )}

      <div className="space-page-list">
        {pages.map((page, i) => (
          <Link
            key={page.id}
            href={`/${spaceSlug}/${page.slug}`}
            className="space-page-card"
          >
            <span className="space-page-number">{i + 1}</span>
            <div>
              <p className="space-page-title">{page.title}</p>
              {page.excerpt && (
                <p className="space-page-excerpt">{page.excerpt}</p>
              )}
            </div>
          </Link>
        ))}
      </div>

      {pages.length === 0 && (
        <p className="empty-state">Aucune page dans cet espace pour le moment.</p>
      )}
    </div>
  );
}
