import Providers from "./providers";
import GoogleAnalytics from "@/lib/google-analytics";
// import "../styles/dist.css";
import "tailwindcss/tailwind.css";
import type { Metadata } from "next";
import Head from "next/head";

export const metadata: Metadata = {
  title: "VYBE Events - All the hottest events in your city",
  description: `Discover and book tickets for the hottest events in your city with VYBE Events. From concerts and festivals to art shows and nightlife, we have you covered. Don't miss out on the fun - check out our upcoming events now.`,
};

export default function RootLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: any;
}) {
  return (
    <html lang="en" className="h-full">
      {/* <Head>{children}</Head> */}
      <head />
      <GoogleAnalytics />
      <body className="h-full">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
