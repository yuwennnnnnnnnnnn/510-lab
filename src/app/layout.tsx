import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "TECHIN 510 — Week 5 Lab",
  description: "Minimal Next.js App Router starter for PRIMM and API lab work",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col bg-gray-50">
        <Navbar />
        <main className="flex-grow max-w-6xl mx-auto px-4 py-8 w-full">
          {children}
        </main>
        <footer className="border-t border-gray-200 bg-white py-4 text-center text-sm text-gray-500">
          TECHIN 510 · Week 5 starter (no Supabase in this template)
        </footer>
      </body>
    </html>
  );
}
