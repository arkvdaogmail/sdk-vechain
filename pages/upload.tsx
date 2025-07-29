export default function Upload() {
  const [result, setResult] = useState<{txId?: string, hash?: string}>();

  const handleUpload = async (file: File) => {
    const buffer = await file.arrayBuffer();
    const base64File = Buffer.from(buffer).toString('base64');
    
    const response = await fetch('/api/notarize', {
      method: 'POST',
      body: JSON.stringify({ file: base64File }),
    });
    
    setResult(await response.json());
  };

  return (
    <div>
      <input type="file" onChange={(e) => handleUpload(e.target.files![0])} />
      {result && (
        <div>
          <p>TXID: <a href={`https://explore-testnet.vechain.org/transactions/${result.txId}`}>{result.txId}</a></p>
          <p>Hash: <code>{result.hash}</code></p>
        </div>
      )}
    </div>
  );
}
