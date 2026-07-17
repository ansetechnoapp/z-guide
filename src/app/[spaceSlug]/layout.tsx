import { getSpaces, getSpacePages } from "@/lib/api";
import { getProjectSlug, resolveProject } from "@/lib/project";
import { Sidebar } from "@/components/sidebar";
import { SearchBar } from "@/components/search-bar";
import Link from "next/link";

export default async function SpaceLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ spaceSlug: string }>;
}) {
  const { spaceSlug } = await params;
  const slug = await getProjectSlug();
  const project = await resolveProject(slug);
  const [spaces, pages] = await Promise.all([
    getSpaces(project.id),
    getSpacePages(spaceSlug, project.id),
  ]);

  return (
    <div className="min-h-screen">
      <Sidebar spaces={spaces} pages={pages} currentSpaceSlug={spaceSlug} projectName={project.name} />

      <div className="lg:pl-64">
        {/* Top bar */}
        <header className="sticky top-0 z-30 bg-white/80 dark:bg-gray-950/80 backdrop-blur border-b border-gray-200 dark:border-gray-800">
          <div className="flex items-center justify-between px-6 py-3">
            <Link href="/" className="flex items-center gap-2 lg:hidden">
              <div className="w-7 h-7 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-xs">Z</span>
              </div>
            </Link>
            <div className="hidden lg:block" />
            <SearchBar />
          </div>
        </header>

        {/* Content */}
        <main className="px-6 lg:px-10 py-8 max-w-4xl">
          {children}
        </main>
      </div>
    </div>
  );
}
