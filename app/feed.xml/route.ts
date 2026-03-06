import { buildRssFeed } from "@/lib/rss";

export async function GET() {
  return new Response(buildRssFeed(), {
    headers: {
      "Content-Type": "application/rss+xml; charset=utf-8",
    },
  });
}
