"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import type { DocSpace, DocPage } from "@/lib/api";

interface SidebarProps {
  spaces: DocSpace[];
  pages?: DocPage[];
  currentSpaceSlug?: string;
}

export function Sidebar({ spaces, pages, currentSpaceSlug }: SidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <>
      {/* Mobile toggle */}
      <button
        onClick={() => setMobileOpen(!mobileOpen)}
        className="lg:hidden fixed top-4 left-4 z-50 p-2 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700"
        aria-label="Toggle sidebar"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
      <aside
        className={`fixed top-0 left-0 z-40 h-full w-64 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 overflow-y-auto transition-transform lg:translate-x-0 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="p-5">
          <Link href="/" className="flex items-center gap-2 mb-6" onClick={() => setMobileOpen(false)}>
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-sm">Z</span>
            </div>
            <span className="font-semibold text-gray-900 dark:text-white">ZodBack Docs</span>
          </Link>

          {/* Spaces list */}
          <nav className="space-y-1">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Spaces</p>
            {spaces.map((space) => {
              const isActive = currentSpaceSlug === space.slug;
              return (
                <Link
                  key={space.id}
                  href={`/${space.slug}`}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${
                    isActive
                      ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 font-medium"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                >
                  <span>{space.icon || "📄"}</span>
                  <span>{space.name}</span>
                </Link>
              );
            })}
          </nav>

          {/* Pages in current space */}
          {pages && pages.length > 0 && (
            <nav className="mt-6 space-y-1">
              <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-2">Pages</p>
              {pages.map((page) => {
                const href = `/${currentSpaceSlug}/${page.slug}`;
                const isActive = pathname === href;
                return (
                  <Link
                    key={page.id}
                    href={href}
                    onClick={() => setMobileOpen(false)}
                    className={`block px-3 py-1.5 rounded-lg text-sm transition-colors ${
                      isActive
                        ? "bg-blue-50 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 font-medium"
                        : "text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }`}
                  >
                    {page.icon || "·"} {page.title}
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
