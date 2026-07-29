"use client";

import { useState, useEffect } from "react";
import type { TocItem } from "@/lib/markdown";

interface PageContentProps {
  html: string;
  toc: TocItem[];
}

export function PageContent({ html, toc }: PageContentProps) {
  const [activeId, setActiveId] = useState<string>("");
  const visibleToc = toc.filter((item) => item.level === 2);
  const tocItems = visibleToc.length > 0 ? visibleToc : toc;

  useEffect(() => {
    if (tocItems.length <= 1) return;
    const headings = tocItems.map((item) => document.getElementById(item.id)).filter(Boolean) as HTMLElement[];
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
  }, [tocItems]);

  return (
    <div className="content-with-toc">
      {/* Main content */}
      <article
        className="docs-content"
        dangerouslySetInnerHTML={{ __html: html }}
      />

      {/* Table of contents */}
      {tocItems.length > 1 && (
        <nav className="toc-nav">
          <div className="toc-sticky">
            <p className="toc-label">Sommaire local</p>
            <ul>
              {tocItems.map((item, index) => (
                <li key={item.id} style={{ paddingLeft: `${(item.level - 1) * 12}px` }}>
                  <a
                    href={`#${item.id}`}
                    className={`toc-link ${
                      activeId === item.id
                        ? "is-active"
                        : ""
                      }`}
                  >
                    <span className="toc-index">{index + 1}.</span>
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
