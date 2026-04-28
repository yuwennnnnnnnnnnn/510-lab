import { NextResponse } from "next/server";

export async function GET() {
  try {
    const url =
      "https://api.open-meteo.com/v1/forecast" +
      "?latitude=47.65&longitude=-122.30" +
      "&daily=temperature_2m_max,temperature_2m_min,precipitation_sum" +
      "&temperature_unit=fahrenheit" +
      "&timezone=America%2FLos_Angeles" +
      "&forecast_days=7";

    const res = await fetch(url, { next: { revalidate: 3600 } });

    if (!res.ok) {
      return NextResponse.json(
        { error: "Weather service unavailable" },
        { status: 502 }
      );
    }

    const data = await res.json();

    // Assert: response must contain "daily" with an array of dates
    if (!data.daily || !Array.isArray(data.daily.time)) {
      return NextResponse.json(
        { error: "Unexpected weather data format from Open-Meteo" },
        { status: 502 }
      );
    }

    // Assert: required forecast arrays must be present
    if (
      !Array.isArray(data.daily.temperature_2m_max) ||
      !Array.isArray(data.daily.temperature_2m_min)
    ) {
      return NextResponse.json(
        { error: "Missing temperature fields in weather response" },
        { status: 502 }
      );
    }

    return NextResponse.json(data);
  } catch {
    return NextResponse.json(
      { error: "Failed to reach weather service" },
      { status: 500 }
    );
  }
}
