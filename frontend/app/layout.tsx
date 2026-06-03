import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LensArthropoda — Smart Insect Identifier",
  description: "Identifikasi serangga otomatis dengan AI",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body>{children}</body>
    </html>
  );
}
