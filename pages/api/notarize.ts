import { Transaction, secp256k1 } from '@vechain/sdk-core';
import { HttpClient } from '@vechain/sdk-network';
import { NextApiRequest, NextApiResponse } from 'next';
import crypto from 'crypto';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  // 1. Get document buffer (from frontend upload)
  const documentBuffer = Buffer.from(req.body.file, 'base64');

  // 2. Generate hash (your existing logic)
  const hash = crypto.createHash('sha256')
    .update(documentBuffer)
    .digest('hex');

  // 3. VeChain testnet TX
  const tx = new Transaction.Builder()
    .addComment(`DOC_HASH:${hash}`)
    .build();

  // 4. Sign with testnet private key (use .env)
  const signedTx = secp256k1.sign(
    tx, 
    process.env.TESTNET_PRIVATE_KEY!
  );

  // 5. Send to testnet (free)
  const httpClient = new HttpClient('https://testnet.vechain.org');
  const txId = await httpClient.sendTransaction(signedTx);

  res.status(200).json({ txId, hash });
}
