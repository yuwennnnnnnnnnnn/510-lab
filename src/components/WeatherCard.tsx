import type { WeatherData } from "@/lib/types";

function weatherEmoji(precipitation: number): string {
  if (precipitation === 0) return "☀️";
  if (precipitation < 5) return "🌦";
  return "🌧";
}

function formatDate(dateStr: string): string {
  const date = new Date(dateStr + "T00:00:00");
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
}

export default function WeatherCard({ data }: { data: WeatherData }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4">
      <h2 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">
        Redmond, WA — 7-Day Forecast
      </h2>
      <div className="flex gap-2 overflow-x-auto pb-1">
        {data.daily.map((day) => (
          <div
            key={day.date}
            className="flex flex-col items-center min-w-[68px] bg-gray-50 rounded-lg p-2 text-center shrink-0"
          >
            <span className="text-xs text-gray-400 leading-tight">
              {formatDate(day.date)}
            </span>
            <span className="text-2xl my-1">{weatherEmoji(day.precipitation)}</span>
            <span className="text-sm font-semibold text-gray-800">
              {Math.round(day.tempMax)}°
            </span>
            <span className="text-xs text-gray-400">{Math.round(day.tempMin)}°</span>
            {day.precipitation > 0 && (
              <span className="text-xs text-blue-400 mt-0.5">
                {day.precipitation.toFixed(1)}&quot;
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
