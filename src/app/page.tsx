// Home page (route: "/") — Server Component (no "use client").
// PRIMM MODIFY: change the heading below to include your name.

import Link from "next/link";

export default function HomePage() {
  return (
    <div className="space-y-8">
      <section className="text-center py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Welcome to Your App
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto mb-8">
          This is the Week 5 lab starter. File location maps to the URL:{" "}
          <code className="bg-gray-100 px-1 rounded text-sm">src/app/page.tsx</code>{" "}
          → <code className="bg-gray-100 px-1 rounded text-sm">/</code>
        </p>
        <Link
          href="/dashboard"
          className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Go to Dashboard
        </Link>
      </section>
    </div>
  );
}
