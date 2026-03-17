import Link from "next/link";
import { getSpaces } from "@/lib/api";
import { getProjectSlug, resolveProject } from "@/lib/project";
import { SearchBar } from "@/components/search-bar";

export default async function HomePage() {
  const slug = await getProjectSlug();
  const project = await resolveProject(slug);
  const spaces = await getSpaces(project.id);

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="border-b border-gray-200 dark:border-gray-800">
        <div className="max-w-5xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">Z</span>
            </div>
            <span className="font-semibold text-lg">{project.name} Docs</span>
          </Link>
          <SearchBar />
        </div>
      </header>

      {/* Hero */}
      <section className="max-w-5xl mx-auto px-6 py-16 text-center">
        <h1 className="text-4xl font-bold mb-4">Documentation</h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          {project.description || `Explore the ${project.name} documentation. Select a space below to get started.`}
        </p>
      </section>

      {/* Spaces grid */}
      <section className="max-w-5xl mx-auto px-6 pb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {spaces.map((space) => (
            <Link
              key={space.id}
              href={`/${space.slug}`}
              className="group block p-6 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 rounded-xl hover:border-blue-300 dark:hover:border-blue-700 hover:shadow-md transition-all"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">{space.icon || "📚"}</span>
                <h2 className="text-lg font-semibold group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                  {space.name}
                </h2>
              </div>
              {space.description && (
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">{space.description}</p>
              )}
              {space.pagesCount !== undefined && (
                <p className="text-xs text-gray-400 mt-3">{space.pagesCount} pages</p>
              )}
            </Link>
          ))}
        </div>

        {spaces.length === 0 && (
          <p className="text-center text-gray-500 py-12">No documentation spaces available.</p>
        )}
      </section>
    </div>
  );
}
