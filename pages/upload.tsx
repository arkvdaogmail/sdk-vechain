export default function Upload() {
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    const base64File = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(',')[1]);
    });

    const response = await fetch('/api/notarize', {
      method: 'POST',
      body: JSON.stringify({ file: base64File }),
    });
    const result = await response.json();
    alert(`Notarized! TXID: ${result.txId}`);
  };

  return <input type="file" onChange={handleUpload} />;
}
