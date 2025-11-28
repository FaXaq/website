import { NextResponse } from "next/server";

import { getColor } from "../utils";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ color: string }> }
) {
  const { color } = await params;
  try {
    const data = getColor(color);
    return NextResponse.json(data);
  } catch (e) {
    const error = e as Error;
    if (error.message === "Color not found") {
      return NextResponse.json({ error: "Color not found" }, { status: 404 });
    }
  }
}