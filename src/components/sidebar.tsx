"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { ReactNode } from "react";
import type { DocSpace, DocPage } from "@/lib/api";

interface SidebarProps {
  spaces: DocSpace[];
  pages?: DocPage[];
  currentSpaceSlug?: string;
  projectName?: string;
}

export function Sidebar({ spaces, pages, currentSpaceSlug, projectName }: SidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="mobile-menu-button"
        aria-label="Toggle sidebar"
      >
        <svg width="20" height="20" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          {mobileOpen ? (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          ) : (
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          )}
        </svg>
      </button>

      {/* Overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 bg-black/30 z-40" onClick={() => setMobileOpen(false)} />
      )}

      {/* Sidebar */}
      <aside className={`docs-sidebar ${mobileOpen ? "is-open" : ""}`}>
        <div className="sidebar-inner">
          <Link href="/" className="sidebar-heading" onClick={() => setMobileOpen(false)}>
            <span>Documentation</span>
            <small>v2.4 LTS</small>
          </Link>

          {/* Spaces list */}
          <nav className="space-nav">
            {spaces.map((space) => {
              const isActive = currentSpaceSlug === space.slug;
              return (
                <Link
                  key={space.id}
                  href={`/${space.slug}`}
                  onClick={() => setMobileOpen(false)}
                  className={`space-link ${isActive ? "is-active" : ""}`}
                >
                  <span className="space-icon" aria-hidden="true">
                    <SpaceIcon slug={space.slug} />
                  </span>
                  <span>{space.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Pages in current space */}
          {pages && pages.length > 0 && (
            <nav className="page-nav">
              <p className="nav-label">{spaces.find((space) => space.slug === currentSpaceSlug)?.name || spaceLabel(currentSpaceSlug)}</p>
              {pages.map((page) => {
                const href = `/${currentSpaceSlug}/${page.slug}`;
                const isActive = pathname === href;
                return (
                  <Link
                    key={page.id}
                    href={href}
                    onClick={() => setMobileOpen(false)}
                    className={`page-link ${isActive ? "is-active" : ""}`}
                  >
                    <span className="page-marker" aria-hidden="true">{page.icon || "•"}</span>
                    {page.title}
                  </Link>
                );
              })}
            </nav>
          )}
        </div>
      </aside>
    </>
  );
}

function spaceLabel(slug?: string) {
  if (!slug) return "Documentation";
  return slug.replace(/[-_]/g, " ").replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function SpaceIcon({ slug }: { slug: string }) {
  const icons: Record<string, ReactNode> = {
    "zodback-modules": (
      <>
        <path d="M5 7.5A2.5 2.5 0 0 1 7.5 5H12v14H7.5A2.5 2.5 0 0 0 5 21.5v-14Z" />
        <path d="M19 7.5A2.5 2.5 0 0 0 16.5 5H12v14h4.5A2.5 2.5 0 0 1 19 21.5v-14Z" />
      </>
    ),
    "api-blog": (
      <>
        <path d="m6 18 3.5-1 8-8a2.1 2.1 0 0 0 0-3l-.5-.5a2.1 2.1 0 0 0-3 0l-8 8L5 17l1 1Z" />
        <path d="M13.5 7.5 16.5 10.5" />
      </>
    ),
    "api-portfolio": (
      <>
        <circle cx="9" cy="9" r="3.2" />
        <path d="M4.8 19a5.5 5.5 0 0 1 8.4 0" />
        <path d="M16 7h4M18 5v4" />
      </>
    ),
    "guide-deployer-site-externe": (
      <>
        <path d="M12 4.5 7 9.2V19h10V9.2L12 4.5Z" />
        <path d="M9.5 19v-4.5h5V19" />
        <path d="M12 4.5v4.2" />
      </>
    ),
  };

  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
      {icons[slug] ?? (
        <>
          <circle cx="12" cy="12" r="8" />
          <path d="M4 12h16" />
        </>
      )}
    </svg>
  );
}
