import { expect, test } from "@playwright/test";

test("visual utama Potensi menampilkan gambar utuh tanpa overflow di mobile", async ({ page }) => {
  await page.goto("/potensi");

  const visual = page.locator('[data-potensi-visual="pariwisata"] img');
  await expect(visual).toBeVisible();
  await expect(visual).toHaveCSS("object-fit", "contain");

  await page.setViewportSize({ width: 320, height: 568 });
  const meluber = await page
    .locator("#pariwisata")
    .evaluate((elemen) => elemen.scrollWidth > elemen.clientWidth);
  expect(meluber).toBe(false);
});
