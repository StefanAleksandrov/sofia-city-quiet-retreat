import type { MetadataRoute } from "next";
import { SITE_URL } from "@/app/configs/constants/siteConfig";

export default function sitemap(): MetadataRoute.Sitemap {
  const routes = ["", "/gallery", "/amenities", "/location", "/book"];
  return routes.map((path) => ({
    url: `${SITE_URL}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path === "" ? 1 : 0.8,
  }));
}
