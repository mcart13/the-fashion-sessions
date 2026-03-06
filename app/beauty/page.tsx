import CategoryArchivePage from "@/components/CategoryArchivePage";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Beauty",
  description:
    "Tracy's favorite beauty products, hair tips, and skincare routines. Honest reviews and recommendations for women who want to look and feel their best.",
  path: "/beauty",
});

interface BeautyPageProps {
  searchParams?: {
    page?: string;
  };
}

export default function BeautyPage({ searchParams }: BeautyPageProps) {
  const page = Number(searchParams?.page ?? "1");

  return (
    <CategoryArchivePage
      slug="beauty"
      title="Beauty"
      currentPage={Number.isFinite(page) ? page : 1}
      heroImage="/images/wp-uploads/2024/01/IMG_7716_Facetune_18-01-2021-14-10-06-scaled.jpg"
      heroHeading={{ topSmall: "Tracy's", topLarge: "Beauty Blog" }}
      heroOverlay={{
        heading: "Beauty is what you make it.",
        subtitle: "Be your own kind of beautiful at any age.",
      }}
    />
  );
}
