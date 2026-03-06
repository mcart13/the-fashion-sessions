import type { Metadata } from "next";
import { Roboto, Roboto_Slab, Poppins } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NewsletterPopup from "@/components/NewsletterPopup";
import ScrollToTop from "@/components/ScrollToTop";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/siteConfig";
import { getPopupNewsletterFormId } from "@/lib/siteContent";
import { Agentation } from "agentation";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400"],
  variable: "--font-roboto",
});

const robotoSlab = Roboto_Slab({
  subsets: ["latin"],
  weight: ["300", "400"],
  variable: "--font-roboto-slab",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "600"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${SITE_NAME} | Fashion & Lifestyle Blog`,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    title: `${SITE_NAME} | Fashion & Lifestyle Blog`,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    images: [
      {
        url: "/images/logo.png",
        width: 1250,
        height: 1250,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${SITE_NAME} | Fashion & Lifestyle Blog`,
    description: SITE_DESCRIPTION,
    images: ["/images/logo.png"],
  },
  icons: {
    icon: "/images/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const popupFormId = getPopupNewsletterFormId();

  return (
    <html lang="en">
      <head>
        <link rel="preconnect" href="https://assets.flodesk.com" />
        <link rel="preconnect" href="https://widgets-static.rewardstyle.com" />
        <link rel="preconnect" href="https://static.elfsight.com" />
      </head>
      <body
        className={`${roboto.variable} ${robotoSlab.variable} ${poppins.variable} font-poppins antialiased`}
      >
        <Header />
        <main>{children}</main>
        <Footer />
        <NewsletterPopup formId={popupFormId} />
        <ScrollToTop />
        {process.env.NODE_ENV === "development" && <Agentation />}
      </body>
    </html>
  );
}
