import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-[calc(100vh-48px)] flex items-center justify-center bg-uw-purple-light">
      <div className="max-w-2xl mx-auto px-6 py-20 text-center">
        <div className="inline-block bg-uw-purple text-white text-xs font-semibold px-3 py-1 rounded-full uppercase tracking-widest mb-6">
          GIX IT Department
        </div>
        <h1 className="text-4xl font-bold text-uw-purple mb-4">
          Equipment Return Tracker
        </h1>
        <p className="text-gray-600 text-lg mb-10 leading-relaxed">
          Streamline the annual equipment return process for GIX IT staff.
          Track items, assign asset tags, and manage return status in one place.
        </p>
        <div className="flex justify-center">
          <Link
            href="/dashboard"
            className="bg-uw-purple text-white px-7 py-3 rounded-lg font-medium hover:bg-uw-purple-dark transition-colors text-sm"
          >
            Open Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
