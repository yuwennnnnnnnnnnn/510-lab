"use client";

import { useEffect, useState, useCallback } from "react";
import WeatherCard from "@/components/WeatherCard";
import ItemForm from "@/components/ItemForm";
import ItemList from "@/components/ItemList";
import type { Item, WeatherData } from "@/lib/types";

export default function DashboardPage() {
  const [items, setItems] = useState<Item[]>([]);
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [itemsLoading, setItemsLoading] = useState(true);
  const [weatherLoading, setWeatherLoading] = useState(true);
  const [itemsError, setItemsError] = useState<string | null>(null);
  const [weatherError, setWeatherError] = useState<string | null>(null);

  const fetchItems = useCallback(async () => {
    setItemsLoading(true);
    setItemsError(null);
    try {
      const res = await fetch("/api/items");
      if (!res.ok) {
        const json = await res.json();
        setItemsError(json.error ?? "Failed to load items.");
        return;
      }
      const data: Item[] = await res.json();
      setItems(data);
    } catch {
      setItemsError("Network error. Could not load items.");
    } finally {
      setItemsLoading(false);
    }
  }, []);

  const fetchWeather = useCallback(async () => {
    setWeatherLoading(true);
    setWeatherError(null);
    try {
      const res = await fetch("/api/weather");
      if (!res.ok) {
        const json = await res.json();
        setWeatherError(json.error ?? "Failed to load weather.");
        return;
      }
      const raw = await res.json();
      const weatherData: WeatherData = {
        daily: (raw.daily.time as string[]).map((date: string, i: number) => ({
          date,
          tempMax: raw.daily.temperature_2m_max[i] as number,
          tempMin: raw.daily.temperature_2m_min[i] as number,
          precipitation: (raw.daily.precipitation_sum[i] as number) ?? 0,
        })),
      };
      setWeather(weatherData);
    } catch {
      setWeatherError("Network error. Could not load weather.");
    } finally {
      setWeatherLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchItems();
    fetchWeather();
  }, [fetchItems, fetchWeather]);

  return (
    <div className="max-w-5xl mx-auto px-4 py-6 flex flex-col gap-6">
      <h1 className="text-2xl font-bold text-gray-900">
        Equipment Return Dashboard
      </h1>

      {/* Weather */}
      {weatherLoading ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm text-gray-400 animate-pulse">
          Loading weather...
        </div>
      ) : weatherError ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-600">
          Weather unavailable: {weatherError}
        </div>
      ) : weather ? (
        <WeatherCard data={weather} />
      ) : null}

      {/* Add item form */}
      <ItemForm onAdded={fetchItems} />

      {/* Items list */}
      {itemsLoading ? (
        <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-sm text-gray-400 animate-pulse">
          Loading items...
        </div>
      ) : itemsError ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 text-sm text-red-600">
          Could not load items: {itemsError}
        </div>
      ) : (
        <ItemList items={items} onRefresh={fetchItems} />
      )}
    </div>
  );
}
