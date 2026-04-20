import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Bali Business Club Dashboard",
  description: "BBC member dashboard and admin console."
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
