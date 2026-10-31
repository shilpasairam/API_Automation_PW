const path = require('path');
const { expect } = require('@playwright/test');
const { apiFixtures, registerApiHooks } = require('../fixtures/apiFixtures');
const { loadJsonFile } = require('../../src/utils/dataLoader');
const { validateStatusCode, validateHeaders, validatePayload, validateSchema } = require('../../src/utils/validators');

registerApiHooks(apiFixtures);

const getCases = loadJsonFile(path.join(__dirname, '..', '..', 'data', 'getPetCases.json'));

for (const scenario of getCases) {
  apiFixtures(scenario.name, async ({ apiClient }) => {
    const response = await apiClient.send({
      method: scenario.method,
      path: scenario.path,
      headers: scenario.headers,
      data: scenario.payload
    });

    validateStatusCode(response, scenario.expectedStatus);
    if (scenario.expectedHeaders) {
      validateHeaders(response.headers, scenario.expectedHeaders);
    }
    if (scenario.expectedResponse) {
      validatePayload(response.json, scenario.expectedResponse);
    }
    if (scenario.schema && response.json && response.status < 500) {
      const schema = loadJsonFile(path.join(__dirname, '..', '..', scenario.schema));
      validateSchema(response.json, schema);
    }

    if (response.status >= 400) {
      expect([400, 404, 500]).toContain(response.status);
    } else {
      expect(response.ok).toBeTruthy();
    }
  });
}
