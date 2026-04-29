"use client";

import { useState } from "react";
import type { Item, ItemStatus } from "@/lib/types";

const statusColors: Record<ItemStatus, string> = {
  pending: "bg-yellow-100 text-yellow-800",
  returned: "bg-blue-100 text-blue-800",
  labeled: "bg-green-100 text-green-800",
};

const categoryColors: Record<string, string> = {
  it: "bg-uw-purple-light text-uw-purple",
  makerspace: "bg-uw-gold-light text-amber-800",
  discard: "bg-gray-100 text-gray-500",
};

function nextStatus(status: ItemStatus): ItemStatus | null {
  if (status === "pending") return "returned";
  if (status === "returned") return "labeled";
  return null;
}

function nextLabel(status: ItemStatus): string {
  if (status === "pending") return "Mark Returned";
  if (status === "returned") return "Mark Labeled";
  return "";
}

export default function ItemList({
  items,
  onRefresh,
}: {
  items: Item[];
  onRefresh: () => void;
}) {
  const [assetTagInputs, setAssetTagInputs] = useState<Record<number, string>>({});
  const [loadingId, setLoadingId] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function handleStatusAdvance(item: Item) {
    const next = nextStatus(item.status);
    if (!next) return;

    if (next === "labeled" && !assetTagInputs[item.id]?.trim()) {
      setError(`Enter an asset tag for "${item.item_name}" before marking as labeled.`);
      return;
    }

    setError(null);
    setLoadingId(item.id);

    try {
      const body: Record<string, string | number> = { id: item.id, status: next };
      if (next === "labeled") {
        body.asset_tag = assetTagInputs[item.id].trim();
      }

      const res = await fetch("/api/items", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      if (!res.ok) {
        const json = await res.json();
        setError(json.error ?? "Failed to update item.");
        return;
      }

      setAssetTagInputs((prev) => {
        const updated = { ...prev };
        delete updated[item.id];
        return updated;
      });
      onRefresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoadingId(null);
    }
  }

  async function handleDelete(id: number) {
    setError(null);
    setLoadingId(id);

    try {
      const res = await fetch(`/api/items?id=${id}`, { method: "DELETE" });

      if (!res.ok) {
        const json = await res.json();
        setError(json.error ?? "Failed to delete item.");
        return;
      }

      onRefresh();
    } catch {
      setError("Network error. Please try again.");
    } finally {
      setLoadingId(null);
    }
  }

  if (items.length === 0) {
    return (
      <div className="bg-white border border-gray-200 rounded-lg p-8 text-center text-gray-400 text-sm">
        No items yet. Add the first returned item using the form above.
      </div>
    );
  }

  return (
    <div className="bg-white border border-uw-purple-light rounded-lg overflow-hidden shadow-sm">
      <div className="bg-uw-purple px-4 py-2 flex items-center justify-between">
        <h2 className="text-xs font-semibold text-white uppercase tracking-wider">
          Returned Items
        </h2>
        <span className="text-xs text-white/70">{items.length} item{items.length !== 1 ? "s" : ""}</span>
      </div>
      {error && (
        <div className="px-4 py-2 bg-red-50 text-red-700 text-sm border-b border-red-100">
          {error}
        </div>
      )}
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 text-gray-400 text-xs uppercase tracking-wider">
            <tr>
              <th className="px-4 py-2 text-left font-medium">Item</th>
              <th className="px-4 py-2 text-left font-medium">Team</th>
              <th className="px-4 py-2 text-left font-medium">Category</th>
              <th className="px-4 py-2 text-left font-medium">Status</th>
              <th className="px-4 py-2 text-left font-medium">Asset Tag</th>
              <th className="px-4 py-2 text-left font-medium">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {items.map((item) => (
              <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-4 py-3 font-medium text-gray-800 max-w-[180px]">
                  <span title={item.description ?? undefined}>{item.item_name}</span>
                </td>
                <td className="px-4 py-3 text-gray-600 whitespace-nowrap">
                  {item.team_name}
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                      categoryColors[item.category] ?? "bg-gray-100 text-gray-600"
                    }`}
                  >
                    {item.category}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`px-2 py-0.5 rounded-full text-xs font-medium ${statusColors[item.status]}`}
                  >
                    {item.status}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-500 font-mono text-xs">
                  {item.status === "returned" ? (
                    <input
                      type="text"
                      placeholder="8-digit tag"
                      value={assetTagInputs[item.id] ?? ""}
                      onChange={(e) =>
                        setAssetTagInputs((prev) => ({
                          ...prev,
                          [item.id]: e.target.value,
                        }))
                      }
                      className="border border-gray-300 rounded px-2 py-1 w-28 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  ) : item.status === "labeled" && item.asset_tag ? (
                    <div className="flex flex-col items-start gap-1">
                      <span>{item.asset_tag}</span>
                      <img
                        src={`/api/qrcode?data=${encodeURIComponent(item.asset_tag)}`}
                        alt={`QR code for ${item.asset_tag}`}
                        width={72}
                        height={72}
                        className="rounded"
                      />
                    </div>
                  ) : (
                    item.asset_tag ?? "—"
                  )}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-3 items-center">
                    {nextStatus(item.status) && (
                      <button
                        onClick={() => handleStatusAdvance(item)}
                        disabled={loadingId === item.id}
                        className="text-xs text-uw-purple hover:text-uw-purple-dark font-medium disabled:opacity-40 whitespace-nowrap"
                      >
                        {loadingId === item.id ? "..." : nextLabel(item.status)}
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(item.id)}
                      disabled={loadingId === item.id}
                      className="text-xs text-gray-400 hover:text-red-600 disabled:opacity-40"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
