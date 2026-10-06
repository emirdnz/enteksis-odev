import { defineConfig, devices } from "@playwright/test";

// İki kip:
// - Yerel (varsayılan): üretim derlemesi 3217 portunda açılır. Veritabanı adresi bilerek
//   ulaşılamaz bir adrese çevrilir; e2e testleri gerçek veritabanına asla yazmaz.
// - Canlı: CANLI_URL=https://... verilirse yalnız tests/e2e/canli.spec.ts o adrese karşı çalışır.
const CANLI_URL = process.env.CANLI_URL;
const YEREL_PORT = 3217;

export default defineConfig({
  testDir: "tests/e2e",
  testMatch: CANLI_URL ? "canli.spec.ts" : "*.spec.ts",
  testIgnore: CANLI_URL ? undefined : "canli.spec.ts",
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 1 : 0,
  reporter: [["list"]],
  use: {
    baseURL: CANLI_URL ?? `http://localhost:${YEREL_PORT}`,
    locale: "tr-TR",
    trace: "retain-on-failure",
  },
  projects: [
    {
      name: "mobil",
      use: {
        ...devices["Desktop Chrome"],
        viewport: { width: 390, height: 844 },
        isMobile: true,
        hasTouch: true,
      },
    },
    { name: "masaustu", use: { ...devices["Desktop Chrome"], viewport: { width: 1280, height: 800 } } },
  ],
  webServer: CANLI_URL
    ? undefined
    : {
        command: `npm run build && npx next start -p ${YEREL_PORT}`,
        url: `http://localhost:${YEREL_PORT}`,
        // Portta başka bir uygulama varsa onu test etmemek için her zaman yeni sunucu.
        reuseExistingServer: false,
        timeout: 180_000,
        env: { DATABASE_URL: "postgresql://e2e:e2e@db.invalid/e2e" },
      },
});
