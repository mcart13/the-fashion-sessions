import CategoryArchivePage from "@/components/CategoryArchivePage";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Food",
  description: "Recipes and food posts from The Fashion Sessions.",
  path: "/food",
});

interface FoodPageProps {
  searchParams?: {
    page?: string;
  };
}

export default function FoodPage({ searchParams }: FoodPageProps) {
  const page = Number(searchParams?.page ?? "1");

  return (
    <CategoryArchivePage
      slug="food"
      title="Food"
      currentPage={Number.isFinite(page) ? page : 1}
      heroImage="/images/wp-uploads/2023/04/Hero-3.jpg"
      heroHeading={{ topSmall: "Tracy's", topLarge: "Food Blog" }}
      heroOverlay={{
        heading:
          "We're passionate about helping brands and businesses blossom into their full potential.",
      }}
    />
  );
}
