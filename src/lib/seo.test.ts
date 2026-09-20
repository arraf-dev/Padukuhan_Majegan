import assert from "node:assert/strict";
import test from "node:test";
import { desa } from "../content/majegan.ts";

test("data situs memakai Instagram resmi Majegan", () => {
  assert.equal(
    desa.instagramUrl,
    "https://www.instagram.com/majegansleman?stkn=NDdncDdsajQ1bWx4",
  );
});
