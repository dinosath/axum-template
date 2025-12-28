# E2E Tests

End-to-end tests for the full stack application using Playwright and Testcontainers.

## Setup

```bash
cd e2e
npm install
npx playwright install chromium
```

## Running Tests

```bash
# Run all tests (auto-starts docker-compose via Testcontainers)
npm test

# Run with UI mode
npm run test:ui

# Run in headed browser mode
npm run test:headed

# Run with debug (keeps containers running after tests)
npm run test:debug
```

## Configuration

### Environment Variables

- `BASE_URL` - Frontend URL (auto-configured by Testcontainers)
- `BACKEND_URL` - Backend URL (auto-configured by Testcontainers)
- `ADMIN_PASSWORD` - Admin password for authentication tests (default: `testpassword`)
- `E2E_CLEANUP` - Set to `false` to keep containers running after tests

### Example

```bash
E2E_CLEANUP=false npm test  # Keep containers running after tests
```

## Testcontainers

The tests use [Testcontainers](https://testcontainers.com/) to manage Docker containers:

1. **Auto port mapping** - Containers use random available ports to avoid conflicts
2. **Health checks** - Waits for containers to be healthy before running tests
3. **Automatic cleanup** - Containers are removed after tests complete
4. **Parallel-safe** - Multiple test runs can execute simultaneously

## Test Reports

After running tests, view the HTML report:

```bash
npm run report
```
