import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="bg-uw-purple text-white px-4 py-3 shadow-md">
      <div className="max-w-5xl mx-auto flex items-center justify-between">
        <Link
          href="/"
          className="font-semibold text-base tracking-tight hover:text-uw-gold transition-colors"
        >
          GIX Return Tracker
        </Link>
        <div className="flex gap-5 text-sm">
          <Link href="/" className="hover:text-uw-gold transition-colors">
            Home
          </Link>
          <Link href="/dashboard" className="hover:text-uw-gold transition-colors">
            Dashboard
          </Link>
        </div>
      </div>
    </nav>
  );
}
