import type { Metadata } from "next";
import { Roboto, Roboto_Slab, Poppins } from "next/font/google";
import "./globals.css";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import NewsletterPopup from "@/components/NewsletterPopup";
import ScrollToTop from "@/components/ScrollToTop";

const roboto = Roboto({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-roboto",
});

const robotoSlab = Roboto_Slab({
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-roboto-slab",
});

const poppins = Poppins({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-poppins",
});

export const metadata: Metadata = {
  title: "TFS The Label",
  description: "A Fashion & Lifestyle Blog by Tracy",
  icons: {
    icon: "/images/logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${roboto.variable} ${robotoSlab.variable} ${poppins.variable} font-roboto antialiased`}
      >
        <Header />
        <main>{children}</main>
        <Footer />
        <NewsletterPopup />
        <ScrollToTop />
      </body>
    </html>
  );
}
