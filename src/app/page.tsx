import Link from "next/link";

export default function Home() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-20 text-center">
      <h1 className="text-3xl font-bold text-gray-900 mb-4">
        GIX Return Tracker
      </h1>
      <p className="text-gray-500 text-lg mb-10 leading-relaxed">
        A tool for GIX IT staff to manage equipment returned by student teams
        after poster sessions and live demos.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link
          href="/dashboard"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors text-sm"
        >
          Open Dashboard
        </Link>
        <Link
          href="/events"
          className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-medium hover:bg-gray-100 transition-colors text-sm"
        >
          Browse Events
        </Link>
      </div>
    </div>
  );
}
