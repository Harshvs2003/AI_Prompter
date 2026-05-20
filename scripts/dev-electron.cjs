const { spawn } = require('child_process');
const waitOn = require('wait-on');
const electronBinary = require('electron');

async function run() {
  await waitOn({ resources: ['tcp:5173'], timeout: 120000 });

  const env = { ...process.env, VITE_DEV_SERVER_URL: 'http://localhost:5173' };
  delete env.ELECTRON_RUN_AS_NODE;

  const child = spawn(electronBinary, ['.'], {
    stdio: 'inherit',
    env,
    shell: false
  });

  child.on('exit', (code) => process.exit(code || 0));
  child.on('error', (err) => {
    console.error('Failed to launch Electron in dev mode:', err);
    process.exit(1);
  });
}

run().catch((err) => {
  console.error('Dev launcher failed:', err);
  process.exit(1);
});