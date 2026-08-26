import { GetObjectCommand, PutObjectCommand, DeleteObjectCommand, S3Client } from "@aws-sdk/client-s3";

/*
 * Klien S3-compatible untuk Cloudflare R2. Semua objek privat disimpan sebagai
 * *object key* (mis. `pengaduan/xxx.jpg`) di database, bukan URL publik, sehingga
 * browser tidak pernah menerima tautan langsung ke bucket privat.
 *
 * `@aws-sdk/client-s3` dipakai langsung (bukan `@vercel/blob`) agar kredensial dan
 * endpoint R2 dapat dikonfigurasi sepenuhnya via environment.
 */

/** Akses objek publik vs privat. Dipetakan ke bucket R2 yang terpisah. */
export type AksesStorage = "public" | "private";

function klienAkses(akses: AksesStorage): { klien: S3Client; bucket: string } {
  const account = process.env.R2_ACCOUNT_ID?.trim();
  const key = process.env.R2_ACCESS_KEY_ID?.trim();
  const rahasia = process.env.R2_SECRET_ACCESS_KEY?.trim();
  const bucket =
    akses === "private"
      ? process.env.R2_BUCKET_PRIVAT?.trim()
      : process.env.R2_BUCKET_PUBLIK?.trim();

  if (!account || !key || !rahasia || !bucket) {
    throw new Error("Konfigurasi R2 belum lengkap (account, key, secret, bucket).");
  }

  const klien = new S3Client({
    region: "auto",
    endpoint: `https://${account}.r2.cloudflarestorage.com`,
    credentials: { accessKeyId: key, secretAccessKey: rahasia },
  });

  return { klien, bucket };
}

/** Menghasilkan object key unik dan aman: <folder>/<slug>-<acak>.<ekstensi>. */
export function kunciObjek(folder: string, namaBerkas: string): string {
  const aman =
    (namaBerkas || "berkas")
      .normalize("NFKD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/%/g, "")
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "")
      .slice(0, 80) || "berkas";

  const acak = Math.random().toString(36).slice(2, 10);
  return `${folder}/${aman}-${acak}`;
}

/** Unggah stream/body ke R2 dan kembalikan object key (untuk privat) atau URL publik. */
export async function unggahR2(
  akses: AksesStorage,
  kunci: string,
  body: Buffer | Uint8Array | string,
  contentType: string,
): Promise<{ objectKey: string; url: string | null }> {
  const { klien, bucket } = klienAkses(akses);

  await klien.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: kunci,
      Body: body,
      ContentType: contentType,
      CacheControl: akses === "public" ? "public, max-age=31536000, immutable" : undefined,
    }),
  );

  if (akses === "public") {
    const basis = process.env.R2_PUBLIC_URL?.trim().replace(/\/+$/, "");
    return { objectKey: kunci, url: basis ? `${basis}/${kunci}` : null };
  }

  return { objectKey: kunci, url: null };
}

/** Ambil stream + metadata objek privat. Hanya dipakai di route lampiran admin. */
export async function bacaR2(akses: AksesStorage, kunci: string) {
  const { klien, bucket } = klienAkses(akses);
  const hasil = await klien.send(new GetObjectCommand({ Bucket: bucket, Key: kunci }));
  return {
    stream: hasil.Body as ReadableStream,
    contentType: hasil.ContentType ?? "application/octet-stream",
  };
}

/** Hapus satu objek. Kegagalan dilempar agar pemanggil memutuskan strategi. */
export async function hapusR2(akses: AksesStorage, kunci: string): Promise<void> {
  const { klien, bucket } = klienAkses(akses);
  await klien.send(new DeleteObjectCommand({ Bucket: bucket, Key: kunci }));
}

/** Ekstrak object key dari referensi yang mungkin berupa URL publik atau key. */
export function keKunciPrivat(simbol: string): string | null {
  const nilai = simbol.trim();
  if (!nilai) return null;

  // Key privat disimpan tanpa skema — kembalikan langsung.
  if (!/^https?:\/\//i.test(nilai)) return nilai;

  try {
    const url = new URL(nilai);
    // Hanya turunkan key untuk host R2 yang kita kenali. Host Blob lama tidak
    // boleh dianggap sebagai objek bucket kita (data itu harus diunggah ulang).
    const r2 = /(\.r2\.dev|\.r2\.cloudflarestorage\.com)$/i;
    if (!r2.test(url.hostname)) return null;
    return decodeURIComponent(url.pathname.replace(/^\/+/, ""));
  } catch {
    return null;
  }
}
