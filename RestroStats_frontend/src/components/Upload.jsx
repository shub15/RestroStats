import { useState } from "react";
import axios from "axios";
// import.meta.env.VITE_token

export default function Upload() {
  const [formData, setFormData] = useState({
    hour_of_day: "",
    day_of_week: "",
    item_price: "",
  });
  const [token, setToken] = useState("");
  const [file, setFile] = useState(null);
  
  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };
  
  const handlePrediction = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/predict", 
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert(`Prediction: ${response.data.prediction}`);
    } catch (error) {
      alert("Error making prediction");
    }
  };
  
  const handleUpload = async () => {
    if (!file) return alert("Please select a file");
    const formData = new FormData();
    formData.append("file", file);
    try {
      await axios.post("http://localhost:5000/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      alert("File uploaded successfully");
    } catch (error) {
      alert("Error uploading file");
    }
  };
  
  return (
    <div className="p-6 max-w-lg mx-auto bg-white shadow-md rounded-lg">
      <h1 className="text-2xl font-bold mb-4">Sales Prediction</h1>
      <input
        type="text"
        placeholder="JWT Token"
        value={token}
        onChange={(e) => setToken(e.target.value)}
        className="w-full p-2 border rounded mb-4"
      />
      <div className="grid grid-cols-2 gap-4">
        {Object.keys(formData).map((key) => (
          <input
            key={key}
            type="number"
            name={key}
            placeholder={key.replace("_", " ")}
            value={formData[key]}
            onChange={handleInputChange}
            className="p-2 border rounded"
          />
        ))}
      </div>
      <button onClick={handlePrediction} className="mt-4 w-full bg-blue-500 text-white p-2 rounded">
        Predict
      </button>
      <h2 className="text-xl font-bold mt-6">Upload CSV</h2>
      <input type="file" onChange={handleFileChange} className="w-full p-2 border rounded" />
      <button onClick={handleUpload} className="mt-4 w-full bg-green-500 text-white p-2 rounded">
        Upload File
      </button>
    </div>
  );
}
