import path from "node:path";
import { test, expect } from "@playwright/test";
import { perlu, paksaMasuk, tandai, UNGGAN } from "./helpers";

test("warga mengirim pengaduan beridentitas dan SuperAdmin membacanya", async ({ page }) => {
  const tanda = tandai("laporan");

  await page.goto("/pengaduan");
  await page.getByRole("radio", { name: "Infrastruktur", exact: true }).check();
  await page.fill("#lokasi", "RT 03 uji akhir");
  await page.fill("#isi", `Laporan uji akhir E2E: ${tanda}. Mohon dicek alur pengaduannya.`);
  if (UNGGAN) {
    await page.setInputFiles(
      'input[name="lampiranBerkas"]',
      path.join(__dirname, "fixtures", "sampul.png"),
    );
  }
  await page.fill("#nama", "Pejuang Uji E2E");
  await page.fill("#kontak", "081234567890");
  await page.getByRole("button", { name: "Kirim Pengaduan" }).click();
  await expect(page).toHaveURL("/pengaduan/terkirim");

  // SuperAdmin melihat laporan terbaru beserta identitas pelapor.
  await paksaMasuk(page, perlu("E2E_SUPERADMIN_EMAIL"), perlu("E2E_SUPERADMIN_SANDI"));
  await page.goto("/admin/pengaduan");
  const kartu = page.locator("li", { hasText: tanda });
  await expect(kartu).toBeVisible();
  await kartu.locator("a").first().click();

  await expect(page.getByText(tanda)).toBeVisible();
  await expect(page.getByText("Pejuang Uji E2E")).toBeVisible();
  await expect(page.getByText("081234567890")).toBeVisible();

  if (UNGGAN) {
    const href = await page
      .getByRole("link", { name: "Buka lampiran foto" })
      .getAttribute("href");
    const r = await page.request.get(new URL(href!, page.url()).toString());
    expect(r.status()).toBe(200);
    expect(r.headers()["content-type"] ?? "").toContain("image");
  }

  await page.getByRole("button", { name: "Tandai Sudah Dibaca" }).click();
  await expect(page.getByRole("status")).toContainText("Pengaduan sudah ditandai dibaca");

  // Filter "Dibaca" menampilkan laporan ini.
  await page.goto("/admin/pengaduan?baca=sudah");
  await expect(page.getByText(tanda)).toBeVisible();
});
