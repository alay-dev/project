import test, { expect } from "@playwright/test";

const accessToken =
  "ya29.a0AfB_byBUXuVk3drK8pr9HI2TvZDE8uPy-Yc4zr7npDHw8GYnYl1MvcaIxmYSMex7oGsFKXw47l9VCvuU6AjVJn0WSt6l2tBdL2qOg7sszaUPpRnCMzJ5a8HP47DOapVpIb_9aRTDGKwG7BTk4kJFBsW8uxsdTw6-FQaCgYKAbcSARMSFQGOcNnCevvBrInRM1LPkcEwIIV0Ng0169";

test("Renders google login on first render", async ({ page }) => {
  await page.goto("http://localhost:3000");

  await expect(
    await page.getByRole("button", { name: "continue with google" })
  ).toBeVisible();
  await expect(
    await page.getByRole("heading", { name: "Patients", exact: true })
  ).toBeHidden();
});

test("Redirects to select page on google auth", async ({ page }) => {
  await page.goto(
    `http://localhost:3000/dashboard/select-file#state=state_parameter_passthrough_value&access_token=${accessToken}`
  );

  await page.screenshot({ path: "screenshot.png" });

  await expect(
    await page.getByRole("button", { name: "continue with google" })
  ).toBeHidden();
  await expect(
    await page.getByRole("heading", { name: "Your files", exact: true })
  ).toBeVisible();
});

test("Renders sheet content in table after page selection", async ({
  page,
}) => {
  await page.route(
    "https://www.googleapis.com/drive/v3/files*",
    async (route) => {
      const json = {
        files: [
          {
            kind: "drive#file",
            mimeType: "application/vnd.google-apps.spreadsheet",
            id: "1lZlX0Kc7enn88WNEWdw4yNByQNABLVYAKZrMXQ3fvUk",
            name: "patient_db_test",
          },
        ],
      };
      await route.fulfill({ json });
    }
  );

  await page.route(
    "https://sheets.googleapis.com/v4/spreadsheets/*/values/*",
    async (route) => {
      const json = {
        values: [
          [
            "id",
            "first_name",
            "last_name",
            "address",
            "email",
            "phone",
            "physician_id",
            "physician_first_name",
            "physician_last_name",
            "physician_phone",
            "bill",
            "prescription",
            "dose",
            "visit_date",
            "next_visit",
          ],
          [
            "a12kj345",
            "Rupesh",
            "Patel",
            "",
            "",
            "9812345678",
            "",
            "Ramesh",
            "shah",
          ],
        ],
      };
      await route.fulfill({ json });
    }
  );

  await page.route(
    "https://sheets.googleapis.com/v4/spreadsheets/*",
    async (route) => {
      const json = {
        sheets: [
          {
            properties: {
              sheetId: 0,
              title: "appointment",
              index: 0,
              sheetType: "GRID",
              gridProperties: {
                rowCount: 1000,
                columnCount: 27,
              },
            },
          },
        ],
      };
      await route.fulfill({ json });
    }
  );

  await page.goto(
    `http://localhost:3000/dashboard/select-file#state=state_parameter_passthrough_value&access_token=${accessToken}`
  );

  await page.waitForURL("http://localhost:3000/dashboard/select-file");

  await page.screenshot({ path: "screenshot.png" });

  await page.getByText("patient_db_test").click();
  await expect(await page.getByText("Sheet is compatible")).toBeVisible();
  await page.getByRole("button", { name: "Continue" }).click();

  await page.waitForURL("*/**/dashboard");
  await expect(await page.getByText("Ramesh shah")).toBeVisible();
  await expect(await page.getByText("Rupesh Patel")).toBeVisible();
  await expect(await page.getByText("Rupesh shah")).toBeHidden();
  await page.screenshot({ path: "screenshot.png" });
});

test("Renders add patient on clicking add patient button", async ({ page }) => {
  await page.route(
    "https://www.googleapis.com/drive/v3/files*",
    async (route) => {
      const json = {
        files: [
          {
            kind: "drive#file",
            mimeType: "application/vnd.google-apps.spreadsheet",
            id: "1lZlX0Kc7enn88WNEWdw4yNByQNABLVYAKZrMXQ3fvUk",
            name: "patient_db_test",
          },
        ],
      };
      await route.fulfill({ json });
    }
  );

  await page.route(
    "https://sheets.googleapis.com/v4/spreadsheets/*/values/*",
    async (route) => {
      const json = {
        values: [
          [
            "id",
            "first_name",
            "last_name",
            "address",
            "email",
            "phone",
            "physician_id",
            "physician_first_name",
            "physician_last_name",
            "physician_phone",
            "bill",
            "prescription",
            "dose",
            "visit_date",
            "next_visit",
          ],
          [
            "a12kj345",
            "Rupesh",
            "Patel",
            "",
            "",
            "9812345678",
            "",
            "Ramesh",
            "shah",
          ],
        ],
      };
      await route.fulfill({ json });
    }
  );

  await page.route(
    "https://sheets.googleapis.com/v4/spreadsheets/*",
    async (route) => {
      const json = {
        sheets: [
          {
            properties: {
              sheetId: 0,
              title: "appointment",
              index: 0,
              sheetType: "GRID",
              gridProperties: {
                rowCount: 1000,
                columnCount: 27,
              },
            },
          },
        ],
      };
      await route.fulfill({ json });
    }
  );

  await page.goto(
    `http://localhost:3000/dashboard/select-file#state=state_parameter_passthrough_value&access_token=${accessToken}`
  );

  await page.waitForURL("http://localhost:3000/dashboard/select-file");

  await page.getByText("patient_db_test").click();
  await expect(await page.getByText("Sheet is compatible")).toBeVisible();
  await page.getByRole("button", { name: "Continue" }).click();

  await page.waitForURL("*/**/dashboard");
  await page.getByRole("button", { name: "Add patient" }).click();
  await expect(await page.getByText("Add patient")).toBeVisible();

  await expect(await page.getByText("Patients")).toBeHidden();
});
