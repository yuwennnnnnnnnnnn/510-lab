import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-gray-900 text-white px-4 py-3">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <Link href="/" className="font-semibold text-base tracking-tight hover:text-gray-300 transition-colors">
          GIX Return Tracker
        </Link>
        <div className="flex gap-5 text-sm">
          <Link href="/" className="hover:text-gray-300 transition-colors">
            Home
          </Link>
          <Link href="/dashboard" className="hover:text-gray-300 transition-colors">
            Dashboard
          </Link>
          <Link href="/events" className="hover:text-gray-300 transition-colors">
            Events
          </Link>
        </div>
      </div>
    </nav>
  );
}
