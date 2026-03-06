import type { MetadataRoute } from "next";
import { getAllCategories, getAllPosts, getPostPath } from "@/lib/siteContent";
import { SITE_URL } from "@/lib/siteConfig";

const MAIN_CATEGORY_SLUGS = ["fashion", "beauty", "food", "travel"];

export default function sitemap(): MetadataRoute.Sitemap {
  const posts = getAllPosts();
  const categorySlugsWithPosts = new Set(
    posts.flatMap((post) => post.categories.map((category) => category.slug)),
  );

  const staticRoutes = [
    "",
    "/about",
    "/contact",
    "/fashion",
    "/beauty",
    "/food",
    "/travel",
    "/shop-my-instagram",
    "/shop-my-tiktok",
  ];

  const pages = staticRoutes.map((route) => ({
    url: `${SITE_URL}${route || "/"}`,
    changeFrequency: route ? ("weekly" as const) : ("daily" as const),
    priority: route ? 0.7 : 1,
  }));

  const categories = getAllCategories()
    .filter(
      (cat) =>
        !MAIN_CATEGORY_SLUGS.includes(cat.slug) &&
        cat.count > 0 &&
        categorySlugsWithPosts.has(cat.slug),
    )
    .map((category) => ({
      url: `${SITE_URL}/category/${category.slug}`,
      changeFrequency: "weekly" as const,
      priority: 0.6,
    }));

  const postEntries = posts.map((post) => ({
    url: `${SITE_URL}${getPostPath(post)}`,
    lastModified: new Date(post.modified || post.date),
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...pages, ...categories, ...postEntries];
}
