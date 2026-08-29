import { test, expect } from "@playwright/test";
import { perlu, paksaMasuk } from "./helpers";

test.describe("Autentikasi admin", () => {
  test("sandi salah menampilkan peringatan tanpa masuk", async ({ page }) => {
    await page.goto("/admin/masuk");
    await page.fill("#email", perlu("E2E_SUPERADMIN_EMAIL"));
    await page.fill("#sandi", "sandi-sengaja-salah-e2e");
    await page.getByRole("button", { name: "Masuk" }).click();
    await expect(page.getByRole("alert")).toContainText("Email atau kata sandi salah");
    await expect(page).toHaveURL(/\/admin\/masuk/);
  });

  test("superadmin masuk dan melihat dashboard", async ({ page }) => {
    await paksaMasuk(page, perlu("E2E_SUPERADMIN_EMAIL"), perlu("E2E_SUPERADMIN_SANDI"));
    await expect(page.getByRole("heading", { name: /Selamat datang/ })).toBeVisible();
  });

  test("superadmin dapat membuat akun Admin atau skip bila sudah ada", async ({ page }) => {
    await paksaMasuk(page, perlu("E2E_SUPERADMIN_EMAIL"), perlu("E2E_SUPERADMIN_SANDI"));
    const email = perlu("E2E_ADMIN_EMAIL");

    await page.goto("/admin/akun");
    if ((await page.getByText(email, { exact: false }).count()) === 0) {
      await page.fill("#nama-baru", "Admin Uji E2E");
      await page.fill("#email-baru", email);
      await page.fill("#jabatan-baru", perlu("E2E_ADMIN_JABATAN"));
      await page.selectOption("#peran-baru", "admin");
      await page.fill("#sandi-baru", perlu("E2E_ADMIN_SANDI"));
      await page.getByRole("button", { name: /Tambah/ }).click();
      await expect(page.getByText(email, { exact: false })).toBeVisible();
    }
  });

  test("role Admin hanya melihat halaman Akun Saya", async ({ page }) => {
    test.skip(
      !(process.env.E2E_ADMIN_EMAIL && process.env.E2E_ADMIN_SANDI),
      "kredensial admin uji belum diisi",
    );
    await paksaMasuk(page, perlu("E2E_ADMIN_EMAIL"), perlu("E2E_ADMIN_SANDI"));
    await page.goto("/admin/akun");
    await expect(page.getByRole("heading", { name: "Akun Saya" })).toBeVisible();
  });
});
