import { expect, test } from "@playwright/test";

test("home page displays hero heading", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "The Thrill of Guessing Games in Real-Time" })).toBeVisible();
});
