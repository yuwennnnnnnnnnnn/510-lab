import type { GixEvent } from "@/lib/types";

const categoryColors: Record<string, string> = {
  lecture: "bg-blue-100 text-blue-800",
  workshop: "bg-uw-purple-light text-uw-purple",
  career: "bg-uw-gold-light text-amber-800",
  social: "bg-green-100 text-green-800",
};

export default function EventCard({ event }: { event: GixEvent }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between gap-2 mb-2">
        <h3 className="font-semibold text-gray-800 text-sm leading-snug">{event.title}</h3>
        <span
          className={`shrink-0 px-2 py-0.5 rounded-full text-xs font-medium ${
            categoryColors[event.category] ?? "bg-gray-100 text-gray-600"
          }`}
        >
          {event.category}
        </span>
      </div>
      <div className="text-xs text-gray-500 space-y-0.5">
        <div>
          {new Date(event.date + "T00:00:00").toLocaleDateString("en-US", {
            weekday: "short",
            month: "short",
            day: "numeric",
          })}
          {event.time && <span className="ml-1">· {event.time}</span>}
        </div>
        {event.location && <div>{event.location}</div>}
      </div>
      {event.description && (
        <p className="mt-2 text-xs text-gray-600 leading-relaxed">{event.description}</p>
      )}
    </div>
  );
}
