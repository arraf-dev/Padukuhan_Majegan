import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { bacaR2, keKunciPrivat } from "@/lib/r2";
import { sesiSaatIni } from "@/lib/sesi";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

/**
 * Mengalirkan lampiran pengaduan privat tanpa pernah memberikan URL bucket ke
 * browser. Akses hanya untuk pengguna yang sudah masuk ke panel admin.
 * `lampiranUrl` menyimpan *object key* R2 (mis. `pengaduan/foo.jpg`).
 */
export async function GET(_request: Request, { params }: { params: Promise<{ id: string }> }) {
  const sesi = await sesiSaatIni();
  if (!sesi) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await params;
  const pengaduan = await db.pengaduan.findUnique({
    where: { id },
    select: { lampiranUrl: true },
  });

  const referensi = pengaduan?.lampiranUrl;
  const kunci = referensi ? keKunciPrivat(referensi) : null;
  if (!kunci) {
    return NextResponse.json({ error: "Lampiran tidak ditemukan" }, { status: 404 });
  }

  // Hanya beri akses ke objek di bawah prefix lampiran privat pengaduan.
  if (!kunci.startsWith("pengaduan/")) {
    return NextResponse.json({ error: "Lampiran tidak ditemukan" }, { status: 404 });
  }

  try {
    const objek = await bacaR2("private", kunci);
    return new NextResponse(objek.stream as unknown as BodyInit, {
      headers: {
        "Content-Type": objek.contentType,
        "Cache-Control": "private, no-store",
        "X-Content-Type-Options": "nosniff",
      },
    });
  } catch {
    // Referensi Blob publik lama tidak diloloskan lewat endpoint baru — unggah
    // ulang bila masih diperlukan supaya semua lampiran berikutnya privat.
    return new NextResponse("Lampiran tidak ditemukan", { status: 404 });
  }
}
