import type { MetadataRoute } from "next";

export const dynamic = "force-dynamic";

// Sitemap minimal — multi-tenant: on ne peut pas résoudre le projet ici
// car sitemap.ts n'a pas accès aux headers() de Next.js.
// Chaque subdomain renvoie uniquement la racine.
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: "/",
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
  ];
}
