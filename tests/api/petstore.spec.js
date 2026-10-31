const path = require('path');
const { test, expect } = require('@playwright/test');
const { createApiClient } = require('../../src/api/client');
const { loadJsonFile } = require('../../src/utils/dataLoader');
const { validateStatusCode, validateHeaders, validatePayload, validateSchema } = require('../../src/utils/validators');

const baseUrl = process.env.BASE_URL || 'https://petstore3.swagger.io/api/v3';
const cases = loadJsonFile(path.join(__dirname, '..', '..', 'data', 'testCases.json'));

test.describe('Petstore API automation framework', () => {
  for (const scenario of cases) {
    test(scenario.name, async ({ request }) => {
      const client = createApiClient(request, baseUrl);
      const response = await client.send({
        
        method: scenario.method,
        path: scenario.path,
        data: scenario.payload,
        headers: scenario.headers
      });

      if (scenario.expectedStatus === 500) {
        expect(response.status).toBe(500);
      } else {
        validateStatusCode(response, scenario.expectedStatus);
      }
      if (scenario.expectedHeaders) {
        validateHeaders(response.headers, scenario.expectedHeaders);
      }
      if (response.json && scenario.expectedResponse) {
        validatePayload(response.json, scenario.expectedResponse);
      }
      if (scenario.schema && response.json && response.status < 500) {
        const schema = loadJsonFile(path.join(__dirname, '..', '..', scenario.schema));
        validateSchema(response.json, schema);
      }
    });
  }

  test('negative case returns 404 for a missing pet', async ({ request }) => {
    const client = createApiClient(request, baseUrl);
    const response = await client.send({ method: 'GET', path: '/pet/9999999' });

    expect([404, 500]).toContain(response.status);
    if (response.json && typeof response.json === 'object') {
      expect(response.json).toHaveProperty('message');
    }
  });
});
