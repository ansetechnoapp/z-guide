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
    <nav className="prev-next-nav">
      {prevHref ? (
        <Link
          href={prevHref}
          className="prev-next-link"
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
          className="prev-next-link next"
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
