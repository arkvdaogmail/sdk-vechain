// verify.js
try {
  require('@vechain/sdk-core');
  require('@vechain/sdk-network');
 console.log("✅ VeChain SDK dependency verification passed");
process.exit(0);
} catch (e) {
  console.error('❌ VeChain SDK not found:', e);
  process.exit(1);
}
