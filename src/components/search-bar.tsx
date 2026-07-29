"use client";

import { useRouter } from "next/navigation";
import { useState, useRef, useEffect } from "react";

export function SearchBar({ large = false }: { large?: boolean }) {
  const router = useRouter(); const [query, setQuery] = useState(""); const inputRef = useRef<HTMLInputElement>(null);
  useEffect(() => { const onKey = (e: KeyboardEvent) => { if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); inputRef.current?.focus(); } if (e.key === "Escape") inputRef.current?.blur(); }; window.addEventListener("keydown", onKey); return () => window.removeEventListener("keydown", onKey); }, []);
  function submit(e: React.FormEvent) { e.preventDefault(); if (query.trim()) router.push(`/search?q=${encodeURIComponent(query.trim())}`); }
  return <form onSubmit={submit} className={`search-form ${large ? "search-large" : ""}`}><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="11" cy="11" r="7" /><path d="m20 20-4-4" /></svg><input ref={inputRef} value={query} onChange={(e) => setQuery(e.target.value)} placeholder={large ? "Rechercher dans la documentation, les guides ou l'API..." : "Rechercher..."} aria-label="Rechercher" /><span className="shortcut"><kbd>Ctrl</kbd><kbd>K</kbd></span></form>;
}
