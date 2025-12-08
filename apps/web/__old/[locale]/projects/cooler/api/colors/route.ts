import { NextResponse } from "next/server";

import { COLORS } from "./const";

export async function GET() {
    return NextResponse.json(COLORS);
}