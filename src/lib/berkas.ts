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

/**
 * MIME pada multipart request dapat dipalsukan oleh client. Gallery memanggil
 * pemeriksaan signature ini setelah `periksaBerkas` agar file yang disimpan
 * benar-benar memiliki header JPEG, PNG, atau WEBP yang sesuai.
 */
export async function periksaIsiGambar(berkas: File): Promise<string | null> {
  const bytes = new Uint8Array(await berkas.slice(0, 12).arrayBuffer());
  const sama = (mulai: number, nilai: number[]) => nilai.every((byte, i) => bytes[mulai + i] === byte);

  const jpeg = sama(0, [0xff, 0xd8, 0xff]);
  const png = sama(0, [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
  const webp = sama(0, [0x52, 0x49, 0x46, 0x46]) && sama(8, [0x57, 0x45, 0x42, 0x50]);

  if ((berkas.type === "image/jpeg" && jpeg) || (berkas.type === "image/png" && png) || (berkas.type === "image/webp" && webp)) {
    return null;
  }

  return "Isi berkas gambar tidak valid.";
}
