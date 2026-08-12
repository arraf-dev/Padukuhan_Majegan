import { get } from "@vercel/blob";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sesiSaatIni } from "@/lib/sesi";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Mengalirkan lampiran pengaduan privat tanpa pernah memberikan URL Blob ke
 * browser. Akses hanya untuk pengguna yang sudah masuk ke panel admin.
 */
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const sesi = await sesiSaatIni();
  if (!sesi) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const pengaduan = await db.pengaduan.findUnique({
    where: { id },
    select: { lampiranUrl: true },
  });

  if (!pengaduan?.lampiranUrl) {
    return NextResponse.json({ error: "Lampiran tidak ditemukan" }, { status: 404 });
  }

  try {
    const hasil = await get(pengaduan.lampiranUrl, { access: "private" });
    if (!hasil || hasil.statusCode !== 200) {
      return new NextResponse("Lampiran tidak ditemukan", { status: 404 });
    }

    return new NextResponse(hasil.stream, {
      headers: {
        "Content-Type": hasil.blob.contentType ?? "application/octet-stream",
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    // Blob publik lama tidak boleh diloloskan lewat endpoint baru. Unggah ulang
    // bila masih perlu dipakai, sehingga semua lampiran berikutnya privat.
    return new NextResponse("Lampiran tidak ditemukan", { status: 404 });
  }
}
