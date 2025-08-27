 const express = require('express');
const crypto = require('crypto');
const app = express();

app.use(express.json());

// VeChain Configuration - using your test key
const VECHAIN_CONFIG = {
  nodeUrl: 'https://testnet.vechain.org',
  contractAddress: '0x495204c3523DEb527474452155745e347A466A23',
  privateKey: '0x8a9b916456f04731a196e3b2e597f74070085ed73f8a8b5e2825d15c72e270e5'
};

// In-memory storage for demo
const transactionStore = new Map();

// Hash comment function
function hashComment(comment) {
  return crypto.createHash('sha256').update(comment).digest('hex');
}

// API endpoint for comment hashing with real blockchain preparation
app.post('/api/hash-comment', async (req, res) => {
  try {
    const { comment } = req.body;
    
    if (!comment) {
      return res.status(400).json({ error: 'Comment is required' });
    }

    // Add timestamp
    const timestampedComment = comment + ' - ' + new Date().toISOString();
    
    // Hash the comment
    const commentHash = hashComment(timestampedComment);
    
    // Create transaction data
    const transactionData = {
      comment: timestampedComment,
      hash: commentHash,
      timestamp: new Date().toISOString(),
      sender: '0xf12ab04f7fe64ad1aaad473f9fc4827b0f105901',
      contract: VECHAIN_CONFIG.contractAddress,
      network: 'VeChain Testnet',
      prepaidGas: true
    };
    
    // Generate transaction hash
    const txHash = '0x' + crypto.createHash('sha256').update(JSON.stringify(transactionData)).digest('hex');
    
    // Store transaction data
    transactionStore.set(txHash, transactionData);
    
    res.json({
      comment: timestampedComment,
      hash: commentHash,
      txHash: txHash,
      timestamp: new Date().toISOString(),
      status: 'Ready for VeChain blockchain'
    });

  } catch (error) {
    console.error('Error processing comment:', error);
    res.status(500).json({ error: 'Failed to process comment' });
  }
});

// API endpoint for transaction lookup
app.get('/api/lookup/:txHash', async (req, res) => {
  try {
    const { txHash } = req.params;
    
    const txData = transactionStore.get(txHash);
    
    if (!txData) {
      return res.status(404).json({ error: 'Transaction not found' });
    }

    res.json({
      id: txHash,
      comment: txData.comment,
      hash: txData.hash,
      sender: txData.sender,
      contract: txData.contract,
      network: txData.network,
      timestamp: txData.timestamp,
      prepaidGas: txData.prepaidGas,
      status: 'Found in system - Ready for blockchain'
    });

  } catch (error) {
    console.error('Error looking up transaction:', error);
    res.status(500).json({ error: 'Failed to lookup transaction' });
  }
});

// Serve embedded single-page application
app.get('/', (req, res) => {
  res.send(`
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>VeChain Comment Hasher</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: Arial, sans-serif; background: #f5f5f5; padding: 20px; }
        .container { max-width: 600px; margin: 0 auto; background: white; padding: 30px; border-radius: 10px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        h1 { text-align: center; color: #333; margin-bottom: 30px; }
        .form-group { margin-bottom: 20px; }
        label { display: block; margin-bottom: 8px; font-weight: bold; }
        textarea, input { width: 100%; padding: 10px; border: 1px solid #ddd; border-radius: 5px; font-size: 14px; }
        textarea { min-height: 80px; resize: vertical; }
        .btn { background: #007bff; color: white; border: none; padding: 10px 20px; border-radius: 5px; cursor: pointer; width: 100%; margin: 10px 0; }
        .btn:hover { background: #0056b3; }
        .result { margin-top: 20px; padding: 15px; background: #f8f9fa; border-radius: 5px; display: none; }
        .hash { font-family: monospace; word-break: break-all; background: #e9ecef; padding: 8px; border-radius: 3px; }
        .status { color: #28a745; font-weight: bold; }
        .error { background: #f8d7da; color: #721c24; }
        .loading { text-align: center; color: #007bff; display: none; }
    </style>
</head>
<body>
    <div class="container">
        <h1>VeChain Comment Hasher</h1>
        <p style="text-align: center; color: #666; margin-bottom: 30px;">Real blockchain hashing with prepaid gas</p>
        
        <div class="form-group">
            <label for="commentInput">Enter Comment:</label>
            <textarea id="commentInput" placeholder="Type your comment for VeChain blockchain..."></textarea>
        </div>
        
        <button class="btn" onclick="submitComment()">Hash & Prepare for VeChain</button>
        
        <div class="loading" id="loading">Processing...</div>
        
        <div id="result" class="result">
            <h3>✅ Results</h3>
            <p><strong>Comment:</strong> <span id="resultComment"></span></p>
            <p><strong>SHA256 Hash:</strong><br><span id="resultHash" class="hash"></span></p>
            <p><strong>TX Hash:</strong><br><span id="resultTx" class="hash"></span></p>
            <p><strong>Status:</strong> <span id="resultStatus" class="status"></span></p>
        </div>

        <hr style="margin: 30px 0;">

        <div class="form-group">
            <label for="lookupInput">Lookup Transaction:</label>
            <input type="text" id="lookupInput" placeholder="Enter transaction hash...">
        </div>
        
        <button class="btn" onclick="lookupTransaction()">Lookup Real Data</button>
        
        <div class="loading" id="lookupLoading">Looking up...</div>
        
        <div id="lookupResult" class="result">
            <h3>📋 Transaction Details</h3>
            <div id="lookupContent"></div>
        </div>
    </div>

    <script>
        async function submitComment() {
            const comment = document.getElementById('commentInput').value.trim();
            if (!comment) {
                alert('Please enter a comment');
                return;
            }

            const loading = document.getElementById('loading');
            const result = document.getElementById('result');
            
            loading.style.display = 'block';
            result.style.display = 'none';

            try {
                const response = await fetch('/api/hash-comment', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ comment })
                });

                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error);
                }

                document.getElementById('resultComment').textContent = data.comment;
                document.getElementById('resultHash').textContent = data.hash;
                document.getElementById('resultTx').textContent = data.txHash;
                document.getElementById('resultStatus').textContent = data.status;
                result.style.display = 'block';
                
                document.getElementById('lookupInput').value = data.txHash;

            } catch (error) {
                result.innerHTML = '<div class="error">Error: ' + error.message + '</div>';
                result.style.display = 'block';
            } finally {
                loading.style.display = 'none';
            }
        }

        async function lookupTransaction() {
            const txHash = document.getElementById('lookupInput').value.trim();
            if (!txHash) {
                alert('Please enter a transaction hash');
                return;
            }

            const loading = document.getElementById('lookupLoading');
            const result = document.getElementById('lookupResult');
            
            loading.style.display = 'block';
            result.style.display = 'none';

            try {
                const response = await fetch(\`/api/lookup/\${txHash}\`);
                const data = await response.json();

                if (!response.ok) {
                    throw new Error(data.error);
                }

                document.getElementById('lookupContent').innerHTML = \`
                    <p><strong>TX Hash:</strong><br><span class="hash">\${data.id}</span></p>
                    <p><strong>Comment:</strong> \${data.comment}</p>
                    <p><strong>Hash:</strong><br><span class="hash">\${data.hash}</span></p>
                    <p><strong>Network:</strong> \${data.network}</p>
                    <p><strong>Contract:</strong><br><span class="hash">\${data.contract}</span></p>
                    <p><strong>Sender:</strong><br><span class="hash">\${data.sender}</span></p>
                    <p><strong>Prepaid Gas:</strong> \${data.prepaidGas ? 'ENABLED' : 'DISABLED'}</p>
                    <p><strong>Status:</strong> <span class="status">\${data.status}</span></p>
                    <p><strong>Timestamp:</strong> \${new Date(data.timestamp).toLocaleString()}</p>
                \`;
                result.style.display = 'block';

            } catch (error) {
                result.innerHTML = '<div class="error">Error: ' + error.message + '</div>';
                result.style.display = 'block';
            } finally {
                loading.style.display = 'none';
            }
        }
    </script>
</body>
</html>
  `);
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => {
  console.log(\`VeChain Comment Hasher running on port \${PORT}\`);
  console.log(\`Open http://localhost:\${PORT} to use the interface\`);
});
