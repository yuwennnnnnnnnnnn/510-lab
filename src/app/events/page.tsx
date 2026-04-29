"use client";

import { useState, useEffect, useCallback } from "react";
import type { GixEvent, EventCategory } from "@/lib/types";
import CategoryFilter from "@/components/CategoryFilter";
import EventCard from "@/components/EventCard";

export default function EventsPage() {
  const [events, setEvents] = useState<GixEvent[]>([]);
  const [category, setCategory] = useState<EventCategory | "all">("all");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchEvents = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const url = category === "all" ? "/api/events" : `/api/events?category=${category}`;
      const res = await fetch(url);
      if (!res.ok) {
        const json = await res.json();
        setError(json.error ?? "Failed to load events.");
        return;
      }
      const data = await res.json();
      setEvents(data);
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  }, [category]);

  useEffect(() => {
    fetchEvents();
  }, [fetchEvents]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-uw-purple mb-1">GIX Events</h1>
        <p className="text-sm text-gray-500">Browse upcoming guest lectures, workshops, career panels, and social events.</p>
      </div>

      <div className="mb-5">
        <CategoryFilter selected={category} onChange={setCategory} />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-100 text-red-700 text-sm rounded-lg px-4 py-3 mb-4">
          {error}
        </div>
      )}

      {loading ? (
        <div className="text-sm text-gray-400 py-12 text-center">Loading events...</div>
      ) : events.length === 0 ? (
        <div className="bg-white border border-gray-200 rounded-lg p-12 text-center text-gray-400 text-sm">
          No events found{category !== "all" ? ` in the "${category}" category` : ""}.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.map((event) => (
            <EventCard key={event.id} event={event} />
          ))}
        </div>
      )}
    </div>
  );
}
