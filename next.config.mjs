/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.fashn.ai",
      },
    ],
  },
  async redirects() {
    return [
      {
        source: "/shop",
        destination: "https://tfsthelabel.com/",
        permanent: true,
      },
      {
        source: "/cart",
        destination: "https://tfsthelabel.com/cart",
        permanent: true,
      },
      {
        source: "/checkout",
        destination: "https://tfsthelabel.com/cart",
        permanent: true,
      },
      {
        source: "/my-account",
        destination: "https://account.tfsthelabel.com/",
        permanent: true,
      },
      {
        source: "/comments/feed",
        destination: "/feed.xml",
        permanent: true,
      },
      {
        source: "/feed/",
        destination: "/feed.xml",
        permanent: true,
      },
      {
        source: "/feed",
        destination: "/feed.xml",
        permanent: true,
      },
      {
        source: "/rss.xml",
        destination: "/feed.xml",
        permanent: true,
      },
      {
        source: "/recipes",
        destination: "/food",
        permanent: true,
      },
      {
        source: "/author/:slug",
        destination: "/about",
        permanent: true,
      },
      {
        source: "/home",
        destination: "/",
        permanent: true,
      },
      {
        source: "/category/fashion",
        destination: "/fashion",
        permanent: true,
      },
      {
        source: "/category/beauty",
        destination: "/beauty",
        permanent: true,
      },
      {
        source: "/category/travel",
        destination: "/travel",
        permanent: true,
      },
      {
        source: "/category/food",
        destination: "/food",
        permanent: true,
      },
      {
        source: "/page/:page",
        destination: "/?page=:page",
        permanent: true,
      },
      {
        source: "/fashion/page/:page",
        destination: "/fashion?page=:page",
        permanent: true,
      },
      {
        source: "/beauty/page/:page",
        destination: "/beauty?page=:page",
        permanent: true,
      },
      {
        source: "/food/page/:page",
        destination: "/food?page=:page",
        permanent: true,
      },
      {
        source: "/travel/page/:page",
        destination: "/travel?page=:page",
        permanent: true,
      },
      {
        source: "/category/:slug/page/:page",
        destination: "/category/:slug?page=:page",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;
