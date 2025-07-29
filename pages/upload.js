export default function Upload() {
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    const buffer = await file.arrayBuffer();
    const base64File = Buffer.from(buffer).toString('base64');
    
    try {
      const response = await fetch('/api/vechain/notarize', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({ file: base64File })
      });
      
      const result = await response.json();
      
      if (result.success) {
        alert(`Document notarized! TXID: ${result.txId}`);
      } else {
        alert(`Error: ${result.error}`);
      }
    } catch (error) {
      alert('Network error. Please try again.');
    }
  };

  return (
    <div>
      <input type="file" onChange={handleUpload} />
      <p>Upload a document to notarize on VeChain</p>
    </div>
  );
}
