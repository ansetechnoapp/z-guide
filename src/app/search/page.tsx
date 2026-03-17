import { searchDocs } from "@/lib/api";
import { getProjectSlug, resolveProject } from "@/lib/project";
import { Breadcrumb } from "@/components/breadcrumb";
import { SearchBar } from "@/components/search-bar";
import Link from "next/link";
import type { Metadata } from "next";

interface Props {
  searchParams: Promise<{ q?: string }>;
}

export async function generateMetadata({ searchParams }: Props): Promise<Metadata> {
  const { q } = await searchParams;
  return {
    title: q ? `Search: ${q}` : "Search",
  };
}

export default async function SearchPage({ searchParams }: Props) {
  const { q } = await searchParams;
  const slug = await getProjectSlug();
  const project = await resolveProject(slug);
  const results = q ? await searchDocs(q, project.id) : [];

  return (
    <div className="min-h-screen">
      <header className="border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">Z</span>
            </div>
            <span className="font-semibold text-lg">{project.name} Docs</span>
          </Link>
          <SearchBar />
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-6 py-8">
        <Breadcrumb items={[{ label: "Search" }]} />

        <h1 className="text-2xl font-bold mb-6">
          {q ? (
            <>
              Results for <span className="text-blue-600 dark:text-blue-400">&ldquo;{q}&rdquo;</span>
            </>
          ) : (
            "Search"
          )}
        </h1>

        {q && results.length === 0 && (
          <p className="text-gray-500 py-8">No results found for &ldquo;{q}&rdquo;.</p>
        )}

        <div className="space-y-3">
          {results.map((result) => (
            <Link
              key={result.id}
              href={`/${result.spaceSlug}/${result.slug}`}
              className="block p-4 rounded-lg border border-gray-200 dark:border-gray-800 hover:border-blue-300 dark:hover:border-blue-700 hover:bg-gray-50 dark:hover:bg-gray-900 transition-all"
            >
              <p className="font-medium">{result.title}</p>
              <p className="text-xs text-gray-400 mt-1">{result.spaceName}</p>
              {result.excerpt && (
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2 line-clamp-2">{result.excerpt}</p>
              )}
            </Link>
          ))}
        </div>
      </main>
    </div>
  );
}
