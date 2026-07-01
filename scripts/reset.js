#!/usr/bin/env node
/**
 * Cross-platform reset script: destroys the database volume and runs setup.
 */

const { spawnSync } = require('child_process');
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

console.log('=== Financial Control — Reset ===');
console.log('This will destroy all database data and start fresh.\n');

run('docker compose down -v');
require('./setup.js');
