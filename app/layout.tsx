import Image from "next/image";
import Providers from "./providers";
import Menu from "./components/layout/menu";
import Sidebar from "./components/layout/sidebar";
import GoogleButton from "./components/buttons/google-button";
// import LoginImg from "../public/login.jpeg";
import { unstable_getServerSession } from "next-auth/next";

import "../styles/dist.css";

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // console.log(params);

  return (
    <Providers>
      <html lang="en">
        <head />
        <body>{children}</body>
      </html>
    </Providers>
  );
}
