import Link from "next/link";
import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Breadcrumb } from "@/components/breadcrumb";
import { SearchBar } from "@/components/search-bar";
import { searchDocs } from "@/lib/api";
import { getDocsBrandName, getProjectSlug, resolveProject } from "@/lib/project";

function HeaderIcon({ name }: { name: "globe" | "moon" | "code" }) {
  const paths = {
    globe: (
      <>
        <circle cx="12" cy="12" r="8" />
        <path d="M4 12h16M12 4a12 12 0 0 1 0 16M12 4a12 12 0 0 0 0 16" />
      </>
    ),
    moon: <path d="M20 15.5A8 8 0 0 1 8.5 4 8 8 0 1 0 20 15.5Z" />,
    code: <><path d="m8 7-4 5 4 5M16 7l4 5-4 5M14 4l-4 16" /></>,
  };

  return (
    <svg aria-hidden="true" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      {paths[name]}
    </svg>
  );
}

function highlight(text: string, query: string): ReactNode {
  if (!query) return text;
  const parts = text.split(new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")})`, "gi"));
  return parts.map((part, i) =>
    part.toLowerCase() === query.toLowerCase() ? (
      <mark key={i} className="bg-yellow-100 text-yellow-800 rounded px-0.5">
        {part}
      </mark>
    ) : (
      part
    )
  );
}

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
    <div className="docs-shell">
      <div className="docs-frame">
        <header className="docs-topbar">
          <div className="docs-topbar-inner">
            <Link href="/" className="docs-brand">{getDocsBrandName(project.name)} Docs</Link>
            <nav className="docs-nav" aria-label="Navigation principale">
              <Link href="/">Documentation</Link>
              <Link href="#api">API</Link>
              <Link href="#guides">Guides</Link>
              <Link href="#examples">Examples</Link>
              <Link href="#community">Community</Link>
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

        <main className="docs-main">
          <div className="space-index">
            <Breadcrumb items={[{ label: "Search" }]} />

            <header className="doc-header">
              <h1>
                {q ? (
                  <>
                    Results for <span style={{ color: "var(--primary)" }}>&ldquo;{q}&rdquo;</span>
                  </>
                ) : (
                  "Search"
                )}
              </h1>
              <p>Search the ZodBack documentation, guides, and API reference.</p>
            </header>

            <SearchBar large />

            {q && results.length === 0 && (
              <p className="empty-state">No results found for &ldquo;{q}&rdquo;.</p>
            )}

            <div className="space-page-list" style={{ marginTop: "28px" }}>
              {results.map((result, index) => (
                <Link
                  key={result.id}
                  href={`/${result.spaceSlug}/${result.slug}`}
                  className="space-page-card"
                >
                  <span className="space-page-number">{index + 1}</span>
                  <div>
                    <p className="space-page-title">{highlight(result.title, q || "")}</p>
                    <p className="search-result-space">{result.spaceName}</p>
                    {result.excerpt && (
                      <p className="space-page-excerpt">{highlight(result.excerpt, q || "")}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
