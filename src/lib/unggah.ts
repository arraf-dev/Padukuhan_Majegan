import { put } from "@vercel/blob";
import { periksaBerkas, type JenisBerkas } from "./berkas";

type AksesBlob = "public" | "private";

export async function unggahBerkas(
  data: FormData,
  nama: string,
  folder: string,
  jenis: JenisBerkas,
  akses: AksesBlob = "public",
): Promise<{ url: string | null; galat: string | null }> {
  const berkas = data.get(nama);
  if (!(berkas instanceof File) || berkas.size === 0) return { url: null, galat: null };

  const galat = periksaBerkas(berkas, jenis);
  if (galat) return { url: null, galat };

  if (!process.env.BLOB_READ_WRITE_TOKEN?.trim()) {
    return {
      url: null,
      galat: "Penyimpanan berkas belum dikonfigurasi. Coba lagi tanpa lampiran.",
    };
  }

  const hasil = await put(`${folder}/${berkas.name}`, berkas, {
    access: akses,
    addRandomSuffix: true,
    contentType: berkas.type,
  });

  return { url: hasil.url, galat: null };
}
