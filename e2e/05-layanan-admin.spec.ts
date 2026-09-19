import { test, expect } from "@playwright/test";
import { paksaMasuk, perlu, tandai } from "./helpers";

test("superadmin mengisi, mengurutkan, dan menerbitkan daftar layanan", async ({ page }) => {
  await paksaMasuk(page, perlu("E2E_SUPERADMIN_EMAIL"), perlu("E2E_SUPERADMIN_SANDI"));
  const nama = tandai("Uji E2E Layanan");
  let tersimpan = false;

  try {
    await page.goto("/admin/layanan/baru");

    await expect(page.getByLabel("Syarat 1", { exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "Tambah syarat" })).toBeVisible();
    await expect(page.getByLabel("JUDUL LANGKAH 1", { exact: true })).toBeVisible();
    await expect(page.getByLabel("DETAIL LANGKAH 1 (OPSIONAL)", { exact: true })).toBeVisible();
    await expect(page.getByRole("button", { name: "Tambah langkah" })).toBeVisible();

    await page.fill("#nama", nama);
    await page.fill("#deskripsi", "Layanan khusus untuk menguji editor daftar.");
    await page.getByLabel("Syarat 1", { exact: true }).fill("Fotokopi **KTP**");
    await page.getByRole("button", { name: "Tambah syarat" }).click();
    await page.getByLabel("Syarat 2", { exact: true }).fill("Fotokopi Kartu Keluarga");
    await page.getByRole("button", { name: "Naikkan syarat 2" }).click();
    await expect(page.getByLabel("Syarat 1", { exact: true })).toHaveValue("Fotokopi Kartu Keluarga");

    await page.getByLabel("JUDUL LANGKAH 1", { exact: true }).fill("Siapkan berkas");
    await page.getByLabel("DETAIL LANGKAH 1 (OPSIONAL)", { exact: true }).fill("Bawa dokumen asli.");
    await page.getByRole("button", { name: "Tambah langkah" }).click();
    await page.getByLabel("JUDUL LANGKAH 2", { exact: true }).fill("Datang ke balai dusun");
    await page.getByRole("button", { name: "Naikkan langkah 2" }).click();
    await expect(page.getByLabel("JUDUL LANGKAH 1", { exact: true })).toHaveValue("Datang ke balai dusun");

    await page.getByRole("button", { name: "Simpan Layanan" }).click();
    await expect(page.getByRole("status")).toContainText("Layanan baru tersimpan");
    tersimpan = true;

    await page.goto("/layanan");
    await page.getByRole("link", { name: nama, exact: false }).click();
    await expect(page.getByRole("heading", { name: nama })).toBeVisible();
    const syarat = page
      .locator("section")
      .filter({ has: page.getByRole("heading", { name: "Persyaratan" }) })
      .getByRole("listitem");
    await expect(syarat.nth(0)).toContainText("Fotokopi Kartu Keluarga");
    await expect(syarat.nth(1)).toContainText("Fotokopi KTP");
    await expect(page.getByText("Datang ke balai dusun", { exact: true })).toBeVisible();
    await expect(page.getByText("Siapkan berkas", { exact: true })).toBeVisible();
  } finally {
    if (tersimpan) {
      await page.goto("/admin/layanan");
      const baris = page.locator("li", { hasText: nama });
      if (await baris.count()) {
        await baris.first().getByRole("link", { name: "Hapus" }).click();
        await page.getByRole("button", { name: "Ya, hapus" }).click();
        await expect(page.getByRole("status")).toContainText("Layanan dihapus.");
      }
    }
  }
});
