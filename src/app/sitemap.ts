import { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.SITE_URL || "https://pavanjillella.com";

  const staticPages = [
    "",
    "/about",
    "/blog",
    "/vlogs",
    "/projects",
    "/education",
    "/finance",
    "/contact",
  ].map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  return staticPages;
}
