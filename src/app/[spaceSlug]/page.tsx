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
  const slug = getProjectSlug();
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
  const slug = getProjectSlug();
  const project = await resolveProject(slug);
  const [spaces, pages] = await Promise.all([
    getSpaces(project.id),
    getSpacePages(spaceSlug, project.id),
  ]);
  const space = spaces.find((s) => s.slug === spaceSlug);

  return (
    <div>
      <Breadcrumb items={[{ label: space?.name || spaceSlug }]} />

      <h1 className="text-3xl font-bold mb-2">{space?.name || spaceSlug}</h1>
      {space?.description && (
        <p className="text-gray-600 dark:text-gray-400 mb-8">{space.description}</p>
      )}

      <div className="space-y-2">
        {pages.map((page, i) => (
          <Link
            key={page.id}
            href={`/${spaceSlug}/${page.slug}`}
            className="flex items-center gap-3 p-4 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-gray-50 dark:hover:bg-gray-900 transition-all"
          >
            <span className="text-gray-400 text-sm font-mono w-6 text-right">{i + 1}</span>
            <div>
              <p className="font-medium">{page.title}</p>
              {page.excerpt && (
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5 line-clamp-1">{page.excerpt}</p>
              )}
            </div>
          </Link>
        ))}
      </div>

      {pages.length === 0 && (
        <p className="text-gray-500 py-8">No pages in this space yet.</p>
      )}
    </div>
  );
}
