import { StartedDockerComposeEnvironment } from '@testcontainers/compose';
import { unlinkSync, existsSync } from 'fs';
import path from 'path';

const STATE_FILE = path.join(__dirname, '.testcontainers-state.json');

async function globalTeardown(): Promise<void> {
  const shouldCleanup = process.env.E2E_CLEANUP !== 'false';
  
  if (!shouldCleanup) {
    console.log('\n📦 Keeping docker-compose services running (E2E_CLEANUP=false)\n');
    return;
  }

  console.log('\n🧹 Cleaning up E2E test environment...\n');
  
  try {
    const environment = (globalThis as any).__TESTCONTAINERS_ENV__ as StartedDockerComposeEnvironment;
    
    if (environment) {
      await environment.down({ removeVolumes: true });
      console.log('✅ Docker containers stopped and removed\n');
    }
    
    // Clean up state file
    if (existsSync(STATE_FILE)) {
      unlinkSync(STATE_FILE);
    }
  } catch (error) {
    console.error('Warning: Failed to clean up docker-compose:', error);
  }
}

export default globalTeardown;
