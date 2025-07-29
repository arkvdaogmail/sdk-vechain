import { HttpClient } from '@vechain/sdk-network';

export default async function handler(req, res) {
  try {
    const NODE_URL = 'https://mainnet.vechain.org';
    const httpClient = new HttpClient(NODE_URL);
    
    // Test connection with a simple block query
    const block = await httpClient.getBlock('best');
    
    // Get SDK version dynamically
    const sdkCore = await import('@vechain/sdk-core');
    const sdkVersion = sdkCore.VERSION;
    
    res.status(200).json({
      status: 'connected',
      nodeUrl: NODE_URL,
      blockNumber: block.number,
      blockTimestamp: new Date(block.timestamp * 1000),
      sdkVersion: sdkVersion,
      network: 'mainnet'
    });
  } catch (error) {
    res.status(500).json({
      status: 'connection_failed',
      error: error.message,
      suggestion: 'Check network access or try again later'
    });
  }
}
