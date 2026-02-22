import type { Metadata } from "next";
import { Playfair_Display, Poppins } from "next/font/google";

import "../styles/globals.css";
import { Footer } from "../components/Footer";
import { Header } from "../components/Header";

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
  weight: ["400", "500", "600", "700"],
});

const poppins = Poppins({
  subsets: ["latin"],
  variable: "--font-poppins",
  weight: ["400", "500", "600"],
});

export const metadata: Metadata = {
  title: "For the Girl Who Sends Wishlists as Jokes",
  description: "A cute, interactive birthday wishlist.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${playfair.variable} ${poppins.variable}`}>
      <body className="relative min-h-dvh font-body text-slate-800">
        <div className="relative z-10 flex min-h-dvh flex-col">
          <Header />
          <main className="flex-1">{children}</main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
