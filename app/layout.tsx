import Providers from "./providers";
import "../styles/dist.css";
import "tailwindcss/tailwind.css";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <Providers>
      <html lang="en" className="h-full">
        <head />
        <body className="h-full">{children}</body>
      </html>
    </Providers>
  );
}
