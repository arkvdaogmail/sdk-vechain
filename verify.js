// verify.js
try {
  require('@vechain/sdk-core');
  require('@vechain/sdk-network');
  console.log('✅ VeChain SDK packages installed correctly');
} catch (e) {
  console.error('❌ VeChain SDK not found:', e);
  process.exit(1);
}
