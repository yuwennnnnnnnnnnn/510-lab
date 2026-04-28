export type ItemCategory = "it" | "makerspace" | "discard";
export type ItemStatus = "pending" | "returned" | "labeled";

export type EventCategory = "lecture" | "workshop" | "career" | "social";

export interface Item {
  id: number;
  created_at: string;
  item_name: string;
  team_name: string;
  category: ItemCategory;
  status: ItemStatus;
  asset_tag: string | null;
  description: string | null;
}

export interface GixEvent {
  id: number;
  created_at: string;
  title: string;
  category: EventCategory;
  date: string;
  time: string | null;
  location: string | null;
  description: string | null;
}

export interface WeatherDay {
  date: string;
  tempMax: number;
  tempMin: number;
  precipitation: number;
}

export interface WeatherData {
  daily: WeatherDay[];
}

export interface Database {
  public: {
    Tables: {
      items: {
        Row: Item;
        Insert: Omit<Item, "id" | "created_at">;
        Update: Partial<Omit<Item, "id" | "created_at">>;
      };
      events: {
        Row: GixEvent;
        Insert: Omit<GixEvent, "id" | "created_at">;
        Update: Partial<Omit<GixEvent, "id" | "created_at">>;
      };
    };
  };
}
