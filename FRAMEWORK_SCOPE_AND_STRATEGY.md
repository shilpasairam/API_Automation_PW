# API Automation Framework Scope, Strategy, and Approach

## Scope
This framework is designed for API test automation using Playwright with JavaScript. It targets reusable validation of HTTP endpoints, especially REST APIs like the Petstore service, and focuses on:

- Request execution for GET, POST, and other API methods
- Response status validation
- Response header validation
- Response payload validation
- Data-driven execution using external JSON files
- JSON schema validation for request/response contract checks
- Reusable setup through Playwright fixtures and hooks

## Strategy
The framework follows a modular structure to keep test logic maintainable and scalable:

1. API Client Layer
   - Encapsulates request creation and response handling.
   - Centralizes base URL, method, headers, and payload logic.

2. Data Layer
   - Stores scenarios and test data in JSON files.
   - Enables data-driven testing without modifying the test logic.

3. Validation Layer
   - Performs assertions for status codes, headers, payload fields, and schema correctness.
   - Reuses validation logic across all tests for consistency.

4. Test Layer
   - Contains scenario-based tests that define intent and expected behavior.
   - Can be expanded with positive, negative, boundary, and security cases.

5. Fixtures and Hooks
   - Reuse common setup across tests.
   - Initialize API clients and attach logging behavior without duplicate code.

## Approach
The implementation follows a practical, maintainable API automation approach:

- Start with the real API contract as the source of truth.
- Use Playwright request API for direct HTTP interactions.
- Keep business validations separate from technical request code.
- Externalize test data in JSON for easy parameterization.
- Validate both structure and content of API responses.
- Prefer reusable helper methods instead of repeating assertions in each test.
- Treat the framework as extensible for future CRUD operations, authentication, and negative scenarios.

## Architecture

```
.
├── package.json                   # Dependencies and test runner scripts
├── playwright.config.js           # Playwright execution and reporter settings
├── data/                          # Test data and JSON schemas
│   ├── getPetCases.json           # Parameterized GET scenario data
│   ├── testCases.json             # Generic API test scenarios
│   └── schemas/                   # JSON Schema contract definitions
│       └── pet.schema.json        # Pet object JSON schema
├── src/                           # Core framework modules
│   ├── api/                       # API client layer
│   │   └── client.js              # Reusable Playwright request client
│   └── utils/                     # Utility modules
│       ├── dataLoader.js          # Utility to load JSON datasets
│       └── validators.js          # Assertions for status, headers, payload & schema
└── tests/                         # Test suites and execution layers
    ├── api/                       # API test specs
    │   ├── petstore.spec.js       # Data-driven test spec
    │   └── petstoreParam.spec.js  # Parameterized spec with fixtures
    └── fixtures/                  # Test fixtures and lifecycle hooks
        └── apiFixtures.js         # Shared Playwright fixtures and hooks
```

## Current Coverage in this Project
The current sample implementation covers:

- GET request validation
- Parameterized data-driven GET scenarios
- Response status checks
- Response header checks
- Body field assertions
- JSON schema validation using Ajv
- Reusable Playwright fixtures and hooks

## Future Extension
This foundation can be extended to include:

- POST, PUT, DELETE workflows
- Token-based authentication and authorization scenarios
- Boundary and invalid input tests
- CI/CD execution with HTML reporting
- Environment-specific configuration management
