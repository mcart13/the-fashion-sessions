import { getAllPosts, getPostPath } from "@/lib/siteContent";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/siteConfig";

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

export function buildRssFeed() {
  const posts = getAllPosts();

  const items = posts
    .slice(0, 25)
    .map((post) => {
      const url = `${SITE_URL}${getPostPath(post)}`;

      return `
        <item>
          <title>${escapeXml(post.title)}</title>
          <link>${url}</link>
          <guid>${url}</guid>
          <pubDate>${new Date(post.date).toUTCString()}</pubDate>
          <description>${escapeXml(post.excerpt)}</description>
        </item>
      `.trim();
    })
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(SITE_NAME)}</title>
    <link>${SITE_URL}</link>
    <description>${escapeXml(SITE_DESCRIPTION)}</description>
    <language>en-us</language>
    <atom:link href="${SITE_URL}/feed" rel="self" type="application/rss+xml" />
    ${items}
  </channel>
</rss>`;
}
