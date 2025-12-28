import { DockerComposeEnvironment, StartedDockerComposeEnvironment, Wait } from '@testcontainers/compose';
import path from 'path';
import { writeFileSync, existsSync, mkdirSync } from 'fs';

const STATE_FILE = path.join(__dirname, '.testcontainers-state.json');

interface TestcontainersState {
  backendHost: string;
  backendPort: number;
  frontendHost: string;
  frontendPort: number;
}

async function globalSetup(): Promise<void> {
  console.log('\n🚀 Starting E2E test environment with Testcontainers...\n');
  
  const rootDir = path.resolve(__dirname, '..');
  
  const environment = await new DockerComposeEnvironment(rootDir, 'docker-compose.yml')
    .withBuild()
    .withWaitStrategy('backend-1', Wait.forHealthCheck())
    .withWaitStrategy('postgres-1', Wait.forHealthCheck())
    .withStartupTimeout(120000)
    .up();

  // Get the mapped ports
  const backendContainer = environment.getContainer('backend-1');
  const frontendContainer = environment.getContainer('frontend-1');
  
  const state: TestcontainersState = {
    backendHost: backendContainer.getHost(),
    backendPort: backendContainer.getMappedPort(8080),
    frontendHost: frontendContainer.getHost(),
    frontendPort: frontendContainer.getMappedPort(5173),
  };

  // Store state for tests and teardown
  writeFileSync(STATE_FILE, JSON.stringify(state, null, 2));
  
  // Set environment variables for Playwright
  process.env.BASE_URL = `http://${state.frontendHost}:${state.frontendPort}`;
  process.env.BACKEND_URL = `http://${state.backendHost}:${state.backendPort}`;

  console.log(`\n✅ Backend available at: http://${state.backendHost}:${state.backendPort}`);
  console.log(`✅ Frontend available at: http://${state.frontendHost}:${state.frontendPort}\n`);
  
  // Store the environment instance globally for teardown
  (globalThis as any).__TESTCONTAINERS_ENV__ = environment;
}

export default globalSetup;
