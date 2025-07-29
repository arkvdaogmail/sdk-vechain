import { HttpClient } from '@vechain/sdk-network';

export default async function handler(req, res) {
  try {
    // Initialize HTTP client
    const httpClient = new HttpClient('https://mainnet.vechain.org');
    
    // Test connection by fetching latest block
    const block = await httpClient.getBlock('best');
    
    // Success response
    res.status(200).json({
      status: 'success',
      message: 'Successfully connected to VeChain network',
      network: 'mainnet',
      blockNumber: block.number,
      blockTimestamp: new Date(block.timestamp * 1000).toISOString(),
      sdkVersion: require('@vechain/sdk-core/package.json').version
    });
  } catch (error) {
    // Error response with detailed diagnostics
    res.status(500).json({
      status: 'error',
      message: 'Connection to VeChain failed',
      error: error.message,
      stack: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      suggestion: 'Check network connection and VeChain node status'
    });
  }
}
