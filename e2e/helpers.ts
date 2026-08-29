import { expect, type Page } from "@playwright/test";

/** Unik per eksekusi supaya data uji bisa dibedakan dari data asli. */
export function tandai(prefix: string): string {
  return `${prefix} E2E ${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

/** Ambil nilai dari env dengan error yang jelas bila belum diisikan. */
export function perlu(nama: string): string {
  const nilai = process.env[nama]?.trim();
  if (!nilai) throw new Error(`${nama} belum diisi di .env.e2e`);
  return nilai;
}

/** Upload ikut diuji? Mati bila R2 production belum dikonfigurasi. */
export const UNGGAN = process.env.E2E_UJI_UNGGAN === "true";

/** Login lewat UI, bukan cookie manual, agar alur masuk yang riil ikut teruji. */
export async function paksaMasuk(page: Page, email: string, sandi: string) {
  await page.goto("/admin/masuk");
  await page.fill("#email", email);
  await page.fill("#sandi", sandi);
  await page.getByRole("button", { name: "Masuk" }).click();
  await expect(page).toHaveURL(/\/admin$/);
}
