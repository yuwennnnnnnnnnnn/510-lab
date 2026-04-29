import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const data = searchParams.get("data");

  if (!data?.trim()) {
    return NextResponse.json({ error: "data param is required" }, { status: 400 });
  }

  try {
    const url = `https://api.qrserver.com/v1/create-qr-code/?size=72x72&margin=2&data=${encodeURIComponent(data)}`;
    const res = await fetch(url);

    if (!res.ok) {
      return NextResponse.json({ error: "QR service unavailable" }, { status: 502 });
    }

    const buffer = await res.arrayBuffer();
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=86400",
      },
    });
  } catch {
    return NextResponse.json({ error: "Failed to generate QR code" }, { status: 500 });
  }
}
