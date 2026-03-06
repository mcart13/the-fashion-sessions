import siteContentJson from "@/data/site-content.json";

export interface SiteCategory {
  id: number;
  name: string;
  slug: string;
  count: number;
}

export interface SitePost {
  id: number;
  slug: string;
  link: string;
  title: string;
  excerpt: string;
  contentHtml: string;
  date: string;
  modified: string;
  featuredImage: string | null;
  author: string;
  categories: SiteCategory[];
  type?: string;
}

interface SidebarLtkConfig {
  widgetInstanceId: string;
  appId: string;
  userId: string;
  rows: number;
  cols: number;
  padding: number;
}

interface SiteContent {
  generatedAt: string;
  categories: SiteCategory[];
  posts: SitePost[];
  home: {
    postIds: number[];
    trendingIds: number[];
    shopWidgetIds: string[];
    sidebarLtk: SidebarLtkConfig | null;
  };
  newsletter: {
    inlineFormId: string | null;
    popupFormId: string | null;
  };
  footer: {
    elfsightAppId: string | null;
  };
  pages: {
    contact: {
      title: string;
      videoUrl: string | null;
    };
    shopInstagram: {
      title: string;
      appId: string;
      userId: string;
      rows: number;
      cols: number;
    } | null;
    shopTiktok: {
      title: string;
      headings: string[];
      widgetIds: string[];
      amazonIframes: string[];
    };
  };
}

const siteContent = siteContentJson as SiteContent;
const topLevelCategorySlugs = new Set(["fashion", "beauty", "food", "travel"]);
const HOME_POSTS_PER_PAGE = 5;

const postMap = new Map(siteContent.posts.map((post) => [post.id, post]));

export function getPostPath(post: SitePost) {
  const url = new URL(post.link);
  return url.pathname.replace(/\/$/, "") || "/";
}

function normalizeExcerpt(excerpt: string) {
  return excerpt
    .replace(/\[\u2026\]|\[&hellip;\]|&hellip;|\u2026$/g, "")
    .trim();
}

function normalizeTiktokHeadings(headings: string[]) {
  return headings.filter(
    (heading) =>
      heading !== "Shop My Tiktok" &&
      heading !==
        "Sign up to receive my newsletter, and be the first to receive subscriber-only offers!" &&
      heading !== "follow along!",
  );
}

export function formatDisplayDate(value: string) {
  return new Date(value).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function getAllPosts() {
  return siteContent.posts;
}

export function getAllCategories() {
  return siteContent.categories;
}

export function getHomePageCount() {
  return Math.max(1, Math.ceil(siteContent.posts.length / HOME_POSTS_PER_PAGE));
}

export function getHomePosts(page = 1) {
  if (page <= 1) {
    return siteContent.home.postIds
      .map((id) => postMap.get(id))
      .filter((post): post is SitePost => Boolean(post));
  }

  const featuredPostIds = new Set(siteContent.home.postIds);
  const remainingPosts = siteContent.posts.filter(
    (post) => !featuredPostIds.has(post.id),
  );
  const offset = (page - 2) * HOME_POSTS_PER_PAGE;

  return remainingPosts.slice(offset, offset + HOME_POSTS_PER_PAGE);
}

export function getTrendingPosts() {
  return siteContent.home.trendingIds
    .map((id) => postMap.get(id))
    .filter((post): post is SitePost => Boolean(post));
}

export function getPostByPathSegments(segments: string[]) {
  const joined = `/${segments.join("/")}`;
  return siteContent.posts.find((post) => getPostPath(post) === joined) ?? null;
}

export function getPostsForCategory(categorySlug: string) {
  return siteContent.posts.filter((post) =>
    post.categories.some((category) => category.slug === categorySlug),
  );
}

export function getCategoryBySlug(categorySlug: string) {
  return (
    siteContent.categories.find((category) => category.slug === categorySlug) ??
    null
  );
}

export function formatCategoryTitle(categorySlug: string) {
  return categorySlug
    .split("-")
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}

export function getPrimaryCategory(post: SitePost) {
  return post.categories[0] ?? null;
}

export function getCategoryHref(categorySlug: string) {
  return topLevelCategorySlugs.has(categorySlug)
    ? `/${categorySlug}`
    : `/category/${categorySlug}`;
}

export function getPostHref(post: SitePost) {
  return getPostPath(post);
}

export function getPostPathSegments(post: SitePost) {
  return getPostPath(post).split("/").filter(Boolean);
}

export function getPostExcerpt(post: SitePost) {
  return normalizeExcerpt(post.excerpt);
}

export function getSidebarLtkConfig() {
  return siteContent.home.sidebarLtk;
}

export function getHomeShopWidgetIds() {
  return siteContent.home.shopWidgetIds.slice(0, 2);
}

export function getInlineNewsletterFormId() {
  return siteContent.newsletter.inlineFormId;
}

export function getPopupNewsletterFormId() {
  return siteContent.newsletter.popupFormId;
}

export function getElfsightAppId() {
  return siteContent.footer.elfsightAppId;
}

export function getContactVideoUrl() {
  return siteContent.pages.contact.videoUrl;
}

export function getShopInstagramConfig() {
  return siteContent.pages.shopInstagram;
}

export function getShopTiktokSections(limit = 8) {
  const headings = normalizeTiktokHeadings(
    siteContent.pages.shopTiktok.headings,
  );
  return headings.slice(0, limit).map((heading, index) => ({
    title: heading,
    widgetId: siteContent.pages.shopTiktok.widgetIds[index] ?? null,
  }));
}
