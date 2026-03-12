import { getAll } from "@/lib/api";
import type { MetadataRoute } from "next";

export const dynamic = "force-dynamic";

const BASE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://guide.zoddev.site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const data = await getAll();

  const spaceUrls = data.spaces.map((space) => ({
    url: `${BASE_URL}/${space.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const pageUrls = data.pages.map((page) => {
    const space = data.spaces.find((s) => s.id === page.spaceId);
    return {
      url: `${BASE_URL}/${space?.slug || "unknown"}/${page.slug}`,
      lastModified: new Date(page.updatedAt),
      changeFrequency: "weekly" as const,
      priority: 0.6,
    };
  });

  return [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    ...spaceUrls,
    ...pageUrls,
  ];
}
