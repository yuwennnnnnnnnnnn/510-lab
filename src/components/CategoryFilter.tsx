"use client";

import type { EventCategory } from "@/lib/types";

const CATEGORIES: { label: string; value: EventCategory | "all" }[] = [
  { label: "All", value: "all" },
  { label: "Lecture", value: "lecture" },
  { label: "Workshop", value: "workshop" },
  { label: "Career", value: "career" },
  { label: "Social", value: "social" },
];

export default function CategoryFilter({
  selected,
  onChange,
}: {
  selected: EventCategory | "all";
  onChange: (value: EventCategory | "all") => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {CATEGORIES.map(({ label, value }) => (
        <button
          key={value}
          onClick={() => onChange(value)}
          className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${
            selected === value
              ? "bg-uw-purple text-white"
              : "bg-white border border-gray-200 text-gray-600 hover:border-uw-purple hover:text-uw-purple"
          }`}
        >
          {label}
        </button>
      ))}
    </div>
  );
}
