import { Transaction, secp256k1 } from '@vechain/sdk-core';
import { HttpClient } from '@vechain/sdk-network';

export default async function handler(req, res) {
  // 1. Get document from frontend
  const documentBuffer = Buffer.from(req.body.file, 'base64');

  // 2. Generate SHA-256 hash
  const hash = require('crypto').createHash('sha256')
    .update(documentBuffer)
    .digest('hex');

  // 3. Build VeChain TX
  const tx = new Transaction.Builder()
    .addComment(`DOC_HASH:${hash}`)
    .build();

  // 4. Sign with testnet key (from GitHub Secrets)
  const signedTx = secp256k1.sign(tx, process.env.TESTNET_PRIVATE_KEY);

  // 5. Send to VeChain testnet
  const httpClient = new HttpClient('https://testnet.vechain.org');
  const txId = await httpClient.sendTransaction(signedTx);

  res.status(200).json({ txId, hash });
}
