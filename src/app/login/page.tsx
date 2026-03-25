// Login (route: "/login") — Client Component with useState only.
// Real Supabase auth is introduced in Week 6 starter and Week 5 Level 2 (your own wiring).

"use client";

import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [note, setNote] = useState<string | null>(null);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setNote(
      "Placeholder only — connect Supabase Auth in Level 2 or use the Week 6 starter for full login flow."
    );
  }

  return (
    <div className="max-w-md mx-auto mt-8">
      <div className="bg-white rounded-lg border border-gray-200 p-8 shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
          Login (placeholder)
        </h1>
        <p className="text-gray-600 text-center text-sm mb-6">
          Practice form state with <code className="bg-gray-100 px-1 rounded">useState</code>.
        </p>

        {note && (
          <p className="text-sm text-amber-800 bg-amber-50 border border-amber-100 rounded-md p-3 mb-4">
            {note}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="you@example.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="••••••••"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Sign in (demo)
          </button>
        </form>
      </div>
    </div>
  );
}
