import { getSpaces, getSpacePages } from "@/lib/api";
import { getDocsBrandName, getProjectSlug, resolveProject } from "@/lib/project";
import { Sidebar } from "@/components/sidebar";
import { SearchBar } from "@/components/search-bar";
import Link from "next/link";

function HeaderIcon({ name }: { name: "globe" | "moon" | "code" }) {
  const paths = {
    globe: <><circle cx="12" cy="12" r="8" /><path d="M4 12h16M12 4a12 12 0 0 1 0 16M12 4a12 12 0 0 0 0 16" /></>,
    moon: <path d="M20 15.5A8 8 0 0 1 8.5 4 8 8 0 1 0 20 15.5Z" />,
    code: <><path d="m8 7-4 5 4 5M16 7l4 5-4 5M14 4l-4 16" /></>,
  };
  return <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">{paths[name]}</svg>;
}

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
    <div className="docs-shell">
      <Sidebar spaces={spaces} pages={pages} currentSpaceSlug={spaceSlug} projectName={project.name} />

      <div className="docs-frame">
        {/* Top bar */}
        <header className="docs-topbar">
          <div className="docs-topbar-inner">
            <Link href="/" className="docs-brand">{getDocsBrandName(project.name)} Docs</Link>
            <nav className="docs-nav" aria-label="Navigation principale">
              <Link href="/">Documentation</Link><Link href="#api">API</Link><Link href="#guides">Guides</Link><Link href="#examples">Examples</Link><Link href="#community">Community</Link>
            </nav>
            <SearchBar />
            <div className="docs-actions">
              <button aria-label="Changer de langue"><HeaderIcon name="globe" /></button>
              <button aria-label="Changer de thème"><HeaderIcon name="moon" /></button>
              <button aria-label="Voir le code"><HeaderIcon name="code" /></button>
              <span className="version">v2.4</span>
            </div>
          </div>
        </header>

        {/* Content */}
        <main className="docs-main">
          {children}
        </main>
      </div>
    </div>
  );
}
