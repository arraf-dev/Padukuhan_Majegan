"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { wajibMasuk } from "@/lib/sesi";

const STATUS = ["TERKIRIM", "DIPROSES", "SELESAI"] as const;

/** ADM-4 — ubah status pengaduan dan/atau tulis tanggapan untuk pelapor. */
export async function tanggapiPengaduan(data: FormData) {
  await wajibMasuk();

  const id = String(data.get("id") ?? "");
  const status = STATUS.find((s) => s === data.get("status"));
  const tanggapan = String(data.get("tanggapan") ?? "").trim();

  if (!id || !status) redirect("/admin/pengaduan");

  // Laporan tidak boleh ditutup tanpa penjelasan agar arsip tindak lanjut
  // perangkat dusun tetap lengkap.
  if (status === "SELESAI" && !tanggapan) redirect(`/admin/pengaduan/${id}?galat=tanggapan`);

  await db.pengaduan.update({
    where: { id },
    data: { status, tanggapan: tanggapan || null },
  });

  revalidatePath("/admin/pengaduan");
  revalidatePath("/admin");
  redirect(`/admin/pengaduan/${id}?tersimpan=1`);
}
