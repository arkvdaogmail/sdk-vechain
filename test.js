const { Connex } = require('@vechain/sdk-core');

// Connect to testnet (no keys needed)
const connex = new Connex({
  node: 'https://testnet.vechain.org',
  network: 'test'
});

// Test connection
async function test() {
  const block = await connex.thor.block(0).get();
  console.log('First VeChain block:', block);
  
  const status = await connex.thor.status();
  console.log('Network status:', status);
}

test().catch(console.error);
