import { put } from "@vercel/blob";
import { periksaBerkas, type JenisBerkas } from "./berkas";

export async function unggahBerkas(
  data: FormData,
  nama: string,
  folder: string,
  jenis: JenisBerkas,
): Promise<{ url: string | null; galat: string | null }> {
  const berkas = data.get(nama);
  if (!(berkas instanceof File) || berkas.size === 0) return { url: null, galat: null };

  const galat = periksaBerkas(berkas, jenis);
  if (galat) return { url: null, galat };

  const hasil = await put(`${folder}/${berkas.name}`, berkas, {
    access: "public",
    addRandomSuffix: true,
    contentType: berkas.type,
  });

  return { url: hasil.url, galat: null };
}
