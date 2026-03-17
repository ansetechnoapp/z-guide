"use client";

import Link from "next/link";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

interface Props {
  prevHref?: string;
  prevTitle?: string;
  nextHref?: string;
  nextTitle?: string;
}

export function PrevNextNav({ prevHref, prevTitle, nextHref, nextTitle }: Props) {
  const router = useRouter();

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement).tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === "ArrowLeft" && prevHref) router.push(prevHref);
      if (e.key === "ArrowRight" && nextHref) router.push(nextHref);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [prevHref, nextHref, router]);

  if (!prevHref && !nextHref) return null;

  return (
    <nav className="flex justify-between mt-12 pt-6 border-t border-gray-200 dark:border-gray-800">
      {prevHref ? (
        <Link
          href={prevHref}
          className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          <span>&larr;</span>
          <span>{prevTitle}</span>
        </Link>
      ) : (
        <div />
      )}
      {nextHref ? (
        <Link
          href={nextHref}
          className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
        >
          <span>{nextTitle}</span>
          <span>&rarr;</span>
        </Link>
      ) : (
        <div />
      )}
    </nav>
  );
}
