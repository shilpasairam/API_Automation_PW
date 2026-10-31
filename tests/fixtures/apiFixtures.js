const { test } = require('@playwright/test');
const { createApiClient } = require('../../src/api/client');

const defaultBaseUrl = process.env.BASE_URL || 'https://petstore3.swagger.io/api/v3';

const apiFixtures = test.extend({
  baseURL: [defaultBaseUrl, { option: true }],

  apiClient: async ({ request, baseURL }, use) => {
    const client = createApiClient(request, baseURL);
    await use(client);
  }
});

function registerApiHooks(testInstance = apiFixtures) {
  testInstance.beforeEach(async ({ apiClient }, testInfo) => {
    console.log(`Running API test: ${testInfo.title}`);
    testInfo.annotations.push({ type: 'api', description: `Base URL: ${defaultBaseUrl}` });
    if (apiClient && typeof apiClient.send === 'function') {
      console.log('API client initialized successfully');
    }
  });

  testInstance.afterEach(async ({ apiClient }, testInfo) => {
    console.log(`Completed API test: ${testInfo.title}`);
  });
}

module.exports = { apiFixtures, registerApiHooks };
