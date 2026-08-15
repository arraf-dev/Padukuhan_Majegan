import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const headerTanpaCache = { "Cache-Control": "no-store" };

/** Pemeriksaan ringan untuk uptime monitor; tidak mengekspos secret atau detail database. */
export async function GET() {
  try {
    await db.$queryRaw`SELECT 1`;
    return NextResponse.json({ status: "ok", database: "ok" }, { headers: headerTanpaCache });
  } catch {
    return NextResponse.json(
      { status: "error", database: "unavailable" },
      { status: 503, headers: headerTanpaCache },
    );
  }
}
