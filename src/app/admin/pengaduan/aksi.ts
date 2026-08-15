"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { wajibMasuk } from "@/lib/sesi";

/** Menyimpan waktu pertama laporan ditandai dibaca; panggilan ulang tidak mengubahnya. */
export async function tandaiDibaca(data: FormData) {
  await wajibMasuk();

  const id = String(data.get("id") ?? "").trim();
  if (!id) redirect("/admin/pengaduan");

  await db.pengaduan.updateMany({
    where: { id, dibacaPada: null },
    data: { dibacaPada: new Date() },
  });

  revalidatePath("/admin");
  revalidatePath("/admin/pengaduan");
  revalidatePath(`/admin/pengaduan/${id}`);
  redirect(`/admin/pengaduan/${id}?tersimpan=dibaca`);
}
