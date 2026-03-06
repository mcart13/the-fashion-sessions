import CategoryArchivePage from "@/components/CategoryArchivePage";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Food",
  description:
    "Easy, delicious recipes and food inspiration from Tracy. From homemade BBQ sauce to weeknight dinners, find your next favorite meal.",
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
          "Good food brings people together. Here are my favorite recipes and foodie finds!",
      }}
    />
  );
}
