import type { Metadata } from "next";
import { notFound } from "next/navigation";
import CategoryArchivePage from "@/components/CategoryArchivePage";
import { buildMetadata } from "@/lib/metadata";
import {
  formatCategoryTitle,
  getCategoryBySlug,
  getPostsForCategory,
} from "@/lib/siteContent";

interface CategoryRouteProps {
  params: {
    slug: string;
  };
  searchParams?: {
    page?: string;
  };
}

export async function generateMetadata({
  params,
}: CategoryRouteProps): Promise<Metadata> {
  const category = getCategoryBySlug(params.slug);
  const title = category?.name ?? formatCategoryTitle(params.slug);

  return buildMetadata({
    title,
    description: `Browse ${title} posts from The Fashion Sessions.`,
    path: `/category/${params.slug}`,
  });
}

export default function LegacyCategoryPage({
  params,
  searchParams,
}: CategoryRouteProps) {
  const category = getCategoryBySlug(params.slug);
  const posts = getPostsForCategory(params.slug);

  if (!category || posts.length === 0) {
    notFound();
  }

  const page = Number(searchParams?.page ?? "1");

  return (
    <CategoryArchivePage
      slug={params.slug}
      title={category.name}
      currentPage={Number.isFinite(page) ? page : 1}
      basePath={`/category/${params.slug}`}
    />
  );
}
