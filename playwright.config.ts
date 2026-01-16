import { defineConfig, devices } from '@playwright/test';

/**
 * Configuración de Playwright para ejecutar pruebas en Chromium
 * @see https://playwright.dev/docs/test-configuration
 */
export default defineConfig({
  testDir: './tests',
  /* Ejecutar pruebas en paralelo */
  fullyParallel: true,
  /* No hacer commit si no pasa el build */
  forbidOnly: !!process.env.CI,
  /* Reintentar en CI si falla */
  retries: process.env.CI ? 2 : 0,
  /* Número de workers en paralelo */
  workers: process.env.CI ? 1 : undefined,
  /* Configuración del reporter */
  reporter: 'html',
  /* Configuraciones compartidas para todos los proyectos */
  use: {
    /* URL base para las pruebas */
    baseURL: 'https://demo.playwright.dev/todomvc',
    /* Recopilar trace cuando se reintenta un test fallido */
    trace: 'on-first-retry',
    /* Screenshot cuando falla */
    screenshot: 'only-on-failure',
  },

  /* Configurar proyectos para cada navegador - solo Chromium como se solicita */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],
});
