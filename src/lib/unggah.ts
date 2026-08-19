import { del, put } from "@vercel/blob";
import { periksaBerkas, type JenisBerkas } from "./berkas";

type AksesBlob = "public" | "private";

function tokenBlob(akses: AksesBlob): string | null {
  const token =
    akses === "private"
      ? process.env.BLOB_PRIVATE_READ_WRITE_TOKEN
      : process.env.BLOB_READ_WRITE_TOKEN;

  return token?.trim() || null;
}

export async function unggahBerkas(
  data: FormData,
  nama: string,
  folder: string,
  jenis: JenisBerkas,
  akses: AksesBlob = "public",
  namaObjek?: string,
): Promise<{ url: string | null; galat: string | null }> {
  const berkas = data.get(nama);
  if (!(berkas instanceof File) || berkas.size === 0) return { url: null, galat: null };

  const galat = periksaBerkas(berkas, jenis);
  if (galat) return { url: null, galat };

  const token = tokenBlob(akses);
  if (!token) {
    return {
      url: null,
      galat: "Penyimpanan berkas belum dikonfigurasi. Coba lagi tanpa lampiran.",
    };
  }

  try {
    const hasil = await put(`${folder}/${namaObjek ?? berkas.name}`, berkas, {
      access: akses,
      token,
      addRandomSuffix: true,
      contentType: berkas.type,
    });

    return { url: hasil.url, galat: null };
  } catch {
    return { url: null, galat: "Unggah berkas gagal. Periksa koneksi lalu coba lagi." };
  }
}

/** Menghapus aset publik tanpa membiarkan kegagalan Blob menggagalkan mutation DB. */
export async function hapusBerkasPublik(urls: string[]): Promise<boolean> {
  const aset = urls.filter((url) => {
    try {
      const parsed = new URL(url);
      return parsed.protocol === "https:" && parsed.hostname.endsWith(".public.blob.vercel-storage.com");
    } catch {
      return false;
    }
  });
  if (aset.length === 0) return true;

  const token = tokenBlob("public");
  if (!token) return false;

  try {
    await del(aset, { token });
    return true;
  } catch {
    return false;
  }
}
