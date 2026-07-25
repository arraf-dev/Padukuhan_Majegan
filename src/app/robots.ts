import type { MetadataRoute } from "next";
import { situsUrl } from "@/content/majegan";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: { userAgent: "*", allow: "/", disallow: "/admin" },
    sitemap: `${situsUrl}/sitemap.xml`,
  };
}
