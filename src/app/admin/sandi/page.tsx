import { redirect } from "next/navigation";

/** Halaman lama dipertahankan sebagai redirect agar bookmark perangkat tidak mati. */
export default function GantiSandi() {
  redirect("/admin/akun");
}
