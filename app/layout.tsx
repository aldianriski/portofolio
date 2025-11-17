import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "@/styles/globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "M. Aldian Rizki Lamani - Fullstack Developer & Tech Lead",
  description: "Leading teams to ship scalable systems in the AI era.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
