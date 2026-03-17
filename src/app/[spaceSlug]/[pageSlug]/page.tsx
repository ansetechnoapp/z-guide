import { getPage, getSpaces, getSpacePages } from "@/lib/api";
import { getProjectSlug, resolveProject } from "@/lib/project";
import { renderMarkdown, extractToc } from "@/lib/markdown";
import { Breadcrumb } from "@/components/breadcrumb";
import { PageContent } from "@/components/page-content";
import Link from "next/link";
import type { Metadata } from "next";

interface Props {
  params: Promise<{ spaceSlug: string; pageSlug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { pageSlug } = await params;
  const slug = getProjectSlug();
  const project = await resolveProject(slug);
  const page = await getPage(pageSlug, project.id);
  return {
    title: page.title,
    description: page.excerpt || `Documentation: ${page.title}`,
  };
}

export default async function DocPageRoute({ params }: Props) {
  const { spaceSlug, pageSlug } = await params;
  const slug = getProjectSlug();
  const project = await resolveProject(slug);
  const [page, spaces, pages] = await Promise.all([
    getPage(pageSlug, project.id),
    getSpaces(project.id),
    getSpacePages(spaceSlug, project.id),
  ]);

  const space = spaces.find((s) => s.slug === spaceSlug);
  const html = page.content ? await renderMarkdown(page.content) : "";
  const toc = page.content ? extractToc(page.content) : [];

  // Find prev/next pages
  const currentIndex = pages.findIndex((p) => p.slug === pageSlug);
  const prevPage = currentIndex > 0 ? pages[currentIndex - 1] : null;
  const nextPage = currentIndex < pages.length - 1 ? pages[currentIndex + 1] : null;

  return (
    <div>
      <Breadcrumb
        items={[
          { label: space?.name || spaceSlug, href: `/${spaceSlug}` },
          { label: page.title },
        ]}
      />

      <h1 className="text-3xl font-bold mb-8">{page.title}</h1>

      <PageContent html={html} toc={toc} />

      {/* Prev / Next navigation */}
      {(prevPage || nextPage) && (
        <nav className="flex justify-between mt-12 pt-6 border-t border-gray-200 dark:border-gray-800">
          {prevPage ? (
            <Link
              href={`/${spaceSlug}/${prevPage.slug}`}
              className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <span>&larr;</span>
              <span>{prevPage.title}</span>
            </Link>
          ) : (
            <div />
          )}
          {nextPage ? (
            <Link
              href={`/${spaceSlug}/${nextPage.slug}`}
              className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
            >
              <span>{nextPage.title}</span>
              <span>&rarr;</span>
            </Link>
          ) : (
            <div />
          )}
        </nav>
      )}
    </div>
  );
}
