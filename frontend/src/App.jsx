import { useState } from "react";
import "./App.css";

function App() {
  const [file, setFile] = useState(null);
  const [weights, setWeights] = useState("");
  const [impacts, setImpacts] = useState("");
  const [downloadLink, setDownloadLink] = useState("");
  const [status, setStatus] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("Processing...");
    setDownloadLink("");

    const formData = new FormData();
    formData.append("file", file);
    formData.append("weights", weights);
    formData.append("impacts", impacts);

    try {
      const res = await fetch("http://localhost:5000/calculate", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (data.success) {
        setDownloadLink(`http://localhost:5000/download/${data.file}`);
        setStatus("TOPSIS calculation completed successfully!");
      } else {
        setStatus("Error while running TOPSIS.");
      }
    } catch (err) {
      console.error(err);
      setStatus("Server error. Is backend running?");
    }
  };

  return (
    <div className="container">
      <h1>TOPSIS WEB SERVICE</h1>
      <p>Multi-Criteria Decision Analysis Tool</p>

      <form onSubmit={handleSubmit}>
        <input
          type="file"
          onChange={(e) => setFile(e.target.files[0])}
          required
        />

        <input
          type="text"
          placeholder="Weights (e.g. 1,1,1,2)"
          value={weights}
          onChange={(e) => setWeights(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Impacts (e.g. +,+,-,+)"
          value={impacts}
          onChange={(e) => setImpacts(e.target.value)}
          required
        />

        <button type="submit">CALCULATE TOPSIS</button>
      </form>

      {status && <p>{status}</p>}

      {downloadLink && (
        <div>
          <h3>Result Ready</h3>
          <a href={downloadLink} target="_blank" rel="noreferrer">
            Download Result CSV
          </a>
        </div>
      )}
    </div>
  );
}

export default App;
