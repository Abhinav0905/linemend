import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "LineMend | Recover the working day",
  description: "Turn a workshop handover note into a checked recovery schedule. NVIDIA Nemotron on Nebius Token Factory.",
  icons: {
    icon: "/favicon.svg",
    shortcut: "/favicon.svg",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">{children}</body>
    </html>
  );
}
