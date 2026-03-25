"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Navbar() {
  const pathname = usePathname();

  const linkClass = (path: string) =>
    pathname === path
      ? "text-blue-600 border-b-2 border-blue-600"
      : "text-gray-600 hover:text-blue-500";

  return (
    <nav className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-6xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-xl font-bold text-gray-900">
            TECHIN 510 — Week 5
          </Link>
          <div className="flex items-center gap-8">
            <Link href="/" className={`py-5 transition-colors ${linkClass("/")}`}>
              Home
            </Link>
            <Link
              href="/dashboard"
              className={`py-5 transition-colors ${linkClass("/dashboard")}`}
            >
              Dashboard
            </Link>
            <Link
              href="/login"
              className={`py-5 transition-colors ${linkClass("/login")}`}
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
