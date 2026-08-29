import path from "node:path";
import { test, expect } from "@playwright/test";
import { perlu, paksaMasuk, tandai, UNGGAN } from "./helpers";

test("superadmin membuat berita, berita tampil publik, lalu dihapus", async ({ page }) => {
  await paksaMasuk(page, perlu("E2E_SUPERADMIN_EMAIL"), perlu("E2E_SUPERADMIN_SANDI"));
  const judul = tandai("Uji E2E Berita");

  await page.goto("/admin/berita/baru");
  await page.fill("#judul", judul);
  if (UNGGAN) {
    await page.setInputFiles(
      'input[name="gambarSampulBerkas"]',
      path.join(__dirname, "fixtures", "sampul.png"),
    );
  }
  await page.fill("#lokasi", "Balai Padukuhan");
  await page.fill(
    "#konten",
    "Konten otomatis untuk uji akhir: memverifikasi alur tayang, tampilan publik, dan penghapusan. Kalau Anda membaca ini di website, berarti ada yang terhapus belum bersih.",
  );
  await page.getByRole("button", { name: "Kegiatan", exact: true }).click();
  await page.getByRole("button", { name: "Tayangkan Sekarang" }).click();
  await expect(page.getByRole("status")).toContainText("Berita ditayangkan");

  // Muncul di daftar publik dan detailnya dapat dibuka.
  await page.goto("/berita");
  const tautan = page.getByRole("link", { name: judul });
  await expect(tautan).toBeVisible();
  await tautan.click();
  await expect(page.getByRole("heading", { name: judul })).toBeVisible();

  // Bersihkan: hapus dari kelola berita.
  await page.goto("/admin/berita");
  const baris = page.locator("li", { hasText: judul });
  await baris.getByRole("link", { name: "Hapus" }).click();
  await page.getByRole("button", { name: "Ya, hapus" }).click();
  await expect(page.getByRole("status")).toContainText("Berita dihapus.");
});
