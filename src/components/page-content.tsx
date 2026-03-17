"use client";

import { useState, useEffect } from "react";
import type { TocItem } from "@/lib/markdown";

interface PageContentProps {
  html: string;
  toc: TocItem[];
}

export function PageContent({ html, toc }: PageContentProps) {
  const [activeId, setActiveId] = useState<string>("");

  useEffect(() => {
    if (toc.length <= 2) return;
    const headings = toc.map((item) => document.getElementById(item.id)).filter(Boolean) as HTMLElement[];
    if (headings.length === 0) return;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
            break;
          }
        }
      },
      { rootMargin: "0px 0px -60% 0px", threshold: 0 }
    );

    headings.forEach((h) => observer.observe(h));
    return () => observer.disconnect();
  }, [toc]);

  return (
    <div className="flex gap-8">
      {/* Main content */}
      <article
        className="prose prose-gray dark:prose-invert max-w-none flex-1 min-w-0
          prose-headings:scroll-mt-20
          prose-a:text-blue-600 dark:prose-a:text-blue-400
          prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:text-sm
          prose-pre:bg-gray-900 dark:prose-pre:bg-gray-950 prose-pre:border prose-pre:border-gray-200 dark:prose-pre:border-gray-800"
        dangerouslySetInnerHTML={{ __html: html }}
      />

      {/* Table of contents */}
      {toc.length > 2 && (
        <nav className="hidden xl:block w-56 shrink-0">
          <div className="sticky top-24">
            <p className="text-xs font-medium text-gray-400 uppercase tracking-wider mb-3">On this page</p>
            <ul className="space-y-1.5 text-sm">
              {toc.map((item) => (
                <li key={item.id} style={{ paddingLeft: `${(item.level - 1) * 12}px` }}>
                  <a
                    href={`#${item.id}`}
                    className={`transition-colors ${
                      activeId === item.id
                        ? "text-blue-600 dark:text-blue-400 font-medium"
                        : "text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
                    }`}
                  >
                    {item.text}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      )}
    </div>
  );
}
