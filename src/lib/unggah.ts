import { periksaBerkas, periksaIsiGambar, type JenisBerkas } from "./berkas.ts";
import { keKunciPrivat, kunciObjek, unggahR2, hapusR2, type AksesStorage } from "./r2.ts";

/**
 * Unggah berkas ke Cloudflare R2.
 *
 * - `akses = "public"`: mengembalikan `url` publik R2 yang disimpan di database
 *   dan dipakai langsung oleh `next/image`/`<img>`.
 * - `akses = "private"`: mengembalikan *object key* (mis. `pengaduan/foo.jpg`) ke
 *   database; browser tidak pernah menerima URL bucket privat.
 */
export async function unggahBerkas(
  data: FormData,
  nama: string,
  folder: string,
  jenis: JenisBerkas,
  akses: AksesStorage = "public",
  namaObjek?: string,
): Promise<{ url: string | null; galat: string | null }> {
  const berkas = data.get(nama);
  if (!(berkas instanceof File) || berkas.size === 0) return { url: null, galat: null };

  const galat = periksaBerkas(berkas, jenis);
  if (galat) return { url: null, galat };

  // MIME multipart dapat dipalsukan; validasi signature semua gambar agar tidak
  // ada file non-gambar yang tersimpan. Galeri memanggil pemeriksaan ini secara
  // eksplisit, tetapi pintu lainnya memakai penjaga terpusat ini.
  if (jenis === "gambar") {
    const isiGalat = await periksaIsiGambar(berkas);
    if (isiGalat) return { url: null, galat: isiGalat };
  }

  try {
    const kunci = namaObjek ? `${folder}/${namaObjek}` : kunciObjek(folder, berkas.name);
    const buffer = new Uint8Array(await berkas.arrayBuffer());
    const hasil = await unggahR2(akses, kunci, buffer, berkas.type);
    // Publik: simpan URL publik penuh (dipakai langsung oleh <img>/next/image).
    // Privat: simpan object key (tidak pernah diekspos ke browser).
    return { url: hasil.url ?? hasil.objectKey, galat: null };
  } catch {
    return { url: null, galat: "Unggah berkas gagal. Periksa koneksi lalu coba lagi." };
  }
}

/** Selesaikan referensi tabel DB menjadi kunci R2 untuk operasi hapus. */
function referensiKeKunci(referensi: string): string | null {
  return keKunciPrivat(referensi);
}

/** Menghapus aset publik dari R2 tanpa membiarkan kegagalan menggagalkan mutation DB. */
export async function hapusBerkasPublik(referensi: string[]): Promise<boolean> {
  const kunci = referensi.map(referensiKeKunci).filter((k): k is string => Boolean(k));
  if (kunci.length === 0) return true;

  try {
    await Promise.all(kunci.map((k) => hapusR2("public", k)));
    return true;
  } catch {
    return false;
  }
}

/** Menghapus satu objek privat (lampiran pengaduan). */
export async function hapusBerkasPrivat(referensi: string): Promise<boolean> {
  const kunci = referensiKeKunci(referensi);
  if (!kunci) return true;
  try {
    await hapusR2("private", kunci);
    return true;
  } catch {
    return false;
  }
}
