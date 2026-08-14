import type { Metadata } from "next";
import "./globals.css";
import { Chrome } from "@/components/Chrome";

export const metadata: Metadata = {
  title: "WeaveLink — B2B Textile Marketplace",
  description: "Find the perfect fabric. Grow your business.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-cream text-ink">
        <Chrome>{children}</Chrome>
      </body>
    </html>
  );
}
