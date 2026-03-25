// Dashboard (route: "/dashboard") — Client Component.
// Demonstrates useState + useEffect loading public API data (Open-Meteo, no API key).

"use client";

import { useEffect, useState } from "react";

type DailyForecast = {
  time: string[];
  temperature_2m_max: number[];
};

export default function DashboardPage() {
  const [daily, setDaily] = useState<DailyForecast | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const params = new URLSearchParams({
      latitude: "47.61",
      longitude: "-122.33",
      daily: "temperature_2m_max",
      temperature_unit: "fahrenheit",
      timezone: "America/Los_Angeles",
    });
    const url = `https://api.open-meteo.com/v1/forecast?${params}`;

    fetch(url)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then((json: { daily?: DailyForecast }) => {
        setDaily(json.daily ?? null);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Failed to load weather");
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-2">
          Sample data from Open-Meteo (Seattle area, no API key). Loaded with{" "}
          <code className="text-sm bg-gray-100 px-1 rounded">useEffect</code> after
          the first render.
        </p>
      </div>

      {loading && (
        <p className="text-gray-500">Loading forecast…</p>
      )}
      {error && (
        <p className="text-red-600 bg-red-50 border border-red-100 rounded-lg p-4">
          {error}
        </p>
      )}
      {!loading && !error && daily && daily.time.length > 0 && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">
            Next 7 days — daily high (°F)
          </h2>
          <ul className="divide-y divide-gray-100">
            {daily.time.map((date, i) => (
              <li
                key={date}
                className="flex justify-between py-2 text-gray-700"
              >
                <span>{date}</span>
                <span className="font-medium tabular-nums">
                  {daily.temperature_2m_max[i]?.toFixed(0) ?? "—"}°F
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
