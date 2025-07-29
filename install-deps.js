// install-deps.js
const { execSync } = require('child_process');

try {
  console.log('Installing dependencies with legacy peer-deps...');
  execSync('npm install --legacy-peer-deps', { stdio: 'inherit' });
  console.log('Dependencies installed successfully!');
} catch (error) {
  console.error('Dependency installation failed:', error);
  process.exit(1);
}
