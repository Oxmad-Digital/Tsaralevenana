import type { MetadataRoute } from "next";
import { siteInfo } from "@/lib/data";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin", "/login"],
    },
    sitemap: `${siteInfo.url}/sitemap.xml`,
  };
}
