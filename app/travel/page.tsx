import CategoryArchivePage from "@/components/CategoryArchivePage";
import { buildMetadata } from "@/lib/metadata";

export const metadata = buildMetadata({
  title: "Travel",
  description: "Travel posts from The Fashion Sessions.",
  path: "/travel",
});

interface TravelPageProps {
  searchParams?: {
    page?: string;
  };
}

export default function TravelPage({ searchParams }: TravelPageProps) {
  const page = Number(searchParams?.page ?? "1");

  return (
    <CategoryArchivePage
      slug="travel"
      title="Travel"
      currentPage={Number.isFinite(page) ? page : 1}
      heroImage="/images/wp-uploads/2024/01/IMG_1592-scaled.jpg"
      heroHeading={{ topSmall: "Tracy's", topLarge: "Travel Blog" }}
      heroOverlay={{
        heading: "Wherever your travels take you...",
        subtitle:
          "Travel enriches your life. Never be afraid to book the trip.",
      }}
    />
  );
}
