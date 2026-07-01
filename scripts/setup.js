#!/usr/bin/env node
/**
 * Cross-platform setup script (replaces `make setup` on Windows).
 * Requires: Node.js 20+, Docker Desktop running.
 */

const { execSync, spawnSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');

function run(cmd, cwd = ROOT) {
  console.log(`\n→ ${cmd}`);
  const result = spawnSync(cmd, { cwd, shell: true, stdio: 'inherit' });
  if (result.status !== 0) {
    console.error(`\nError running: ${cmd}`);
    process.exit(result.status ?? 1);
  }
}

function waitForDb(retries = 30) {
  console.log('\n→ Waiting for database to be ready...');
  for (let i = 0; i < retries; i++) {
    const result = spawnSync(
      'docker compose exec db pg_isready -U postgres',
      { cwd: ROOT, shell: true, stdio: 'pipe' },
    );
    if (result.status === 0) {
      console.log('  Database is ready.');
      return;
    }
    process.stdout.write('.');
    Atomics.wait(new Int32Array(new SharedArrayBuffer(4)), 0, 0, 1000);
  }
  console.error('\nDatabase did not become ready in time.');
  process.exit(1);
}

console.log('=== Financial Control — Setup ===\n');

run('git submodule update --init --recursive');
run('docker compose up -d db');
waitForDb();
run('npm install', path.join(ROOT, 'api'));
run('npm install', path.join(ROOT, 'web'));
run('npm install');

const envFile = path.join(ROOT, 'api', '.env');
const envExample = path.join(ROOT, 'api', '.env.example');
if (!fs.existsSync(envFile) && fs.existsSync(envExample)) {
  fs.copyFileSync(envExample, envFile);
  console.log('\n→ api/.env created from .env.example');
}

run('npm run prisma:deploy', path.join(ROOT, 'api'));
run('npm run prisma:seed', path.join(ROOT, 'api'));

console.log('\n\x1b[32m✓ Setup complete! Run "npm run dev" (or "make dev") to start.\x1b[0m\n');
