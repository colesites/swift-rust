import { expect, test } from "@playwright/test";

test("home page renders", async ({ page }) => {
  await page.goto("/");
  await expect(page).toHaveTitle(/Swift Rust/);
  await expect(page.locator("h1")).toBeVisible();
});
