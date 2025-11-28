import { NextResponse } from "next/server";

import { getColorCombination } from "../../utils";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ color: string, combination: string }> }
) {
  const { color, combination } = await params;
  try {
    const data = getColorCombination(color, parseInt(combination));
    return NextResponse.json(data);
  } catch (e) {
    const error = e as Error;
    if (error.message === "Color not found") {
      return NextResponse.json({ error: "Color not found" }, { status: 404 });
    }
  }
}