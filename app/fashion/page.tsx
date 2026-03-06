import CategoryArchivePage from "@/components/CategoryArchivePage";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Fashion",
  description: "Fashion posts from The Fashion Sessions.",
  path: "/fashion",
});

interface FashionPageProps {
  searchParams?: {
    page?: string;
  };
}

export default function FashionPage({ searchParams }: FashionPageProps) {
  const page = Number(searchParams?.page ?? "1");

  return (
    <CategoryArchivePage
      slug="fashion"
      title="Fashion"
      currentPage={Number.isFinite(page) ? page : 1}
      heroImage="/images/wp-uploads/2023/10/IMG_6997-4-scaled.jpg"
      heroHeading={{ topScript: "What's New on the Blog" }}
      heroOverlay={{
        heading: "See what's trending and what I'm loving on the blog!",
      }}
    />
  );
}
