export type JenisBerkas = "gambar" | "dokumen";

export const UKURAN_BERKAS_MAKS = 4 * 1024 * 1024;

const TIPE_GAMBAR = ["image/jpeg", "image/png", "image/webp"];
const TIPE_DOKUMEN = [...TIPE_GAMBAR, "application/pdf"];

export function periksaBerkas(berkas: File, jenis: JenisBerkas): string | null {
  const tipe = jenis === "gambar" ? TIPE_GAMBAR : TIPE_DOKUMEN;

  if (berkas.size === 0) return "Berkas tidak boleh kosong.";
  if (!tipe.includes(berkas.type)) {
    return jenis === "gambar"
      ? "Format harus JPG, PNG, atau WEBP."
      : "Format harus PDF, JPG, PNG, atau WEBP.";
  }
  if (berkas.size > UKURAN_BERKAS_MAKS) return "Ukuran maksimal 4 MB.";

  return null;
}
