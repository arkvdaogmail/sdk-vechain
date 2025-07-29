// Update the handleUpload function
const handleUpload = async (e) => {
  try {
    const file = e.target.files[0];
    if (!file) return;
    
    const buffer = await file.arrayBuffer();
    const base64File = Buffer.from(buffer).toString('base64');
    
    const response = await fetch('/api/notarize', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({ file: base64File })
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    alert(`Document notarized! TXID: ${result.txId}`);
  } catch (error) {
    console.error('Upload failed:', error);
    alert(`Error: ${error.message}`);
  }
};
