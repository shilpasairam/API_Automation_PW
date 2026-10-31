const Ajv = require('ajv/dist/2020').default;
const { expect } = require('@playwright/test');

function validateStatusCode(response, expectedStatus) {
  const allowedStatuses = Array.isArray(expectedStatus) ? expectedStatus : [expectedStatus];
  expect(allowedStatuses, `Expected status to be one of ${allowedStatuses} but got ${response.status}`).toContain(response.status);
}

function validateHeaders(headers, expectedHeaders) {
  for (const [key, value] of Object.entries(expectedHeaders)) {
    const normalizedKey = key.toLowerCase();
    const actual = headers[normalizedKey];
    expect(actual, `Expected header ${key} to be present`).toBeTruthy();
    if (typeof value === 'string') {
      expect(actual.toLowerCase()).toContain(value.toLowerCase());
    }
  }
}

function validatePayload(actual, expectedSubset) {
  expect(actual, 'Response payload should be an object').toBeTruthy();
  for (const [key, value] of Object.entries(expectedSubset)) {
    if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
      expect(actual[key], `Expected object property ${key}`).toBeTruthy();
      validatePayload(actual[key], value);
    } else {
      expect(actual[key], `Expected property ${key} to exist`).toBeDefined();
      if (Array.isArray(value)) {
        expect(actual[key]).toEqual(expect.arrayContaining(value));
      } else {
        expect(actual[key]).toBe(value);
      }
    }
  }
}

function validateSchema(payload, schema) {
  const ajv = new Ajv({ allErrors: true, strict: false });
  const validate = ajv.compile(schema);
  const valid = validate(payload);
  if (!valid) {
    throw new Error(JSON.stringify(validate.errors, null, 2));
  }
}

module.exports = { validateStatusCode, validateHeaders, validatePayload, validateSchema };
