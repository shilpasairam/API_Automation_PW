const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  testDir: './tests',
  timeout: 30000,
  fullyParallel: false,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: {
    baseURL: process.env.BASE_URL || 'https://petstore3.swagger.io/api/v3',
    extraHTTPHeaders: {
      Accept: 'application/json'
    }
  }
});

