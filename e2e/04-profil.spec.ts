import { expect, test } from "@playwright/test";

test("profil menampilkan sejarah resmi, dua figur, dan sumber", async ({ page }) => {
  await page.goto("/profil#sejarah");
  const sejarah = page.locator("#sejarah");

  await expect(sejarah.getByText("JEJAK AWAL MAJEGAN")).toBeVisible();
  await expect(sejarah.getByText("Peta wilayah Majegan tahun 1933")).toBeVisible();
  await expect(
    sejarah.getByText("Joglo Kademangan, peninggalan pemerintahan lama Majegan"),
  ).toBeVisible();
  await expect(sejarah.locator("figure")).toHaveCount(2);
  await expect(sejarah.getByRole("heading", { name: "Sumber sejarah" })).toBeVisible();
  await expect(sejarah.getByRole("link", { name: /Bangunan Warisan Budaya/ })).toHaveAttribute(
    "href",
    "https://pandowoharjosid.slemankab.go.id",
  );
});

test("bagian sejarah tetap berada dalam viewport 320 piksel", async ({ page }) => {
  await page.setViewportSize({ width: 320, height: 568 });
  await page.goto("/profil#sejarah");

  const meluber = await page.locator("#sejarah").evaluate(
    (elemen) => elemen.scrollWidth > elemen.clientWidth,
  );
  expect(meluber).toBe(false);
});
