import test, { expect } from "@playwright/test";

const accessToken =
  "ya29.a0AfB_byBUXuVk3drK8pr9HI2TvZDE8uPy-Yc4zr7npDHw8GYnYl1MvcaIxmYSMex7oGsFKXw47l9VCvuU6AjVJn0WSt6l2tBdL2qOg7sszaUPpRnCMzJ5a8HP47DOapVpIb_9aRTDGKwG7BTk4kJFBsW8uxsdTw6-FQaCgYKAbcSARMSFQGOcNnCevvBrInRM1LPkcEwIIV0Ng0169";

test("Renders sheets as per response", async ({ page }) => {
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
  await page.goto(
    `http://localhost:3000/dashboard/select-file#state=state_parameter_passthrough_value&access_token=${accessToken}`
  );

  await page.waitForURL("http://localhost:3000/dashboard/select-file");

  await expect(
    await page.getByRole("button", { name: "continue with google" })
  ).toBeHidden();

  await expect(
    await page.getByRole("heading", { name: "Your files", exact: true })
  ).toBeVisible();

  await expect(await page.getByText("patient_db_test")).toBeVisible();
  await expect(await page.getByText("Timesheet")).toBeHidden();
});

test("Renders select page on sheet select", async ({ page }) => {
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

  await expect(
    await page.getByRole("button", { name: "continue with google" })
  ).toBeHidden();

  await expect(
    await page.getByRole("heading", { name: "Your files", exact: true })
  ).toBeVisible();

  await expect(await page.getByText("Timesheet")).toBeHidden();
  await page.getByText("patient_db_test").click();
  await expect(await page.getByText("your selected sheet")).toBeVisible();
});

test("Renders not compatible if page is not compatible ", async ({ page }) => {
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
            "appointmentID",
            "patientID",
            "physicianID",
            "start_dt_time",
            "next_dt_time",
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
  await expect(await page.getByText("Sheet is not compatible")).toBeVisible();
});

test("Renders sheet is  compatible if page is  compatible ", async ({
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
  await page.screenshot({ path: "screenshot.png" });
});

test("Renders filtered files as per search string", async ({ page }) => {
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
          {
            kind: "drive#file",
            mimeType: "application/vnd.google-apps.spreadsheet",
            id: "14a1u09giKEIYbXjW2scBob38v5Rt-6KS1JwhIO9p5Xw",
            name: "TimeSheet",
          },
          {
            kind: "drive#file",
            mimeType: "application/vnd.google-apps.spreadsheet",
            id: "15jJNEcmvzLVbyShpHfOwfx5-Hrop0Qy9zOhTFhFkJLY",
            name: "BUG LIST CHECKED",
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

  await page.getByPlaceholder("Search file").fill("patient");

  await expect(await page.getByText("patient_db_test")).toBeVisible();
  await expect(await page.getByText("BUG LIST CHECKED")).toBeHidden();
  await page.screenshot({ path: "screenshot.png" });
});
