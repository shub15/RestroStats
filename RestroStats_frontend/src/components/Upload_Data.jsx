import { useState, useRef } from "react";
import axios from "axios";
import { useTheme } from "./ThemeProvider";

const baseURL = import.meta.env.VITE_BASE_URL;

export default function Upload_Data() {
  const { darkTheme } = useTheme();
  const [formData, setFormData] = useState({
    item_name: "",
    item_type: "",
    day_of_week: "",
    time_of_day: "",
    received_by: "",
    item_price: ""
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [predictionResult, setPredictionResult] = useState(null);
  const [fileName, setFileName] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef(null);

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
  };

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const droppedFile = e.dataTransfer.files[0];
      if (droppedFile.type === "text/csv" || droppedFile.name.endsWith('.csv')) {
        setFile(droppedFile);
        setFileName(droppedFile.name);
      } else {
        alert("Please upload a CSV file only");
      }
    }
  };

  const onButtonClick = () => {
    inputRef.current.click();
  };

  const handlePrediction = async () => {
    const token = localStorage.getItem("restaurantToken");
    if (!token) return alert("No token found. Please log in again.");

    try {
      setLoading(true);
      setPredictionResult(null);

      const response = await axios.post(
        `${baseURL}/predict`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      setPredictionResult(response.data.prediction);
    } catch (error) {
      setPredictionResult("Error");
      console.error("Prediction error:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async () => {
    if (!file) return;
    const token = localStorage.getItem("restaurantToken");
    if (!token) return alert("No token found. Please log in again.");

    try {
      setLoading(true);
      setUploadSuccess(false);

      const uploadData = new FormData();
      uploadData.append("file", file);

      await axios.post(`${baseURL}/api/load-data`, uploadData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`
        }
      });

      setUploadSuccess(true);
      setFileName("");
      setFile(null);
    } catch (error) {
      alert("Error uploading file");
      console.error("Upload error:", error);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className={`min-h-screen ${darkTheme ? "bg-gray-900 text-white" : "bg-gray-50 text-gray-800"} py-12 px-4 sm:px-6 lg:px-8`}>
      <div className={`max-w-lvh mx-auto ${darkTheme ? "bg-gray-800" : "bg-white"} rounded-xl shadow-lg overflow-hidden`}>
        {/* Header with gradient */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-8 text-white">
          <h1 className="text-3xl font-bold">Sales Prediction</h1>
          <p className="mt-2 opacity-80">Upload data or make instant predictions</p>
        </div>
        
        <div className="p-6">
          {/* Prediction Section (commented out) */}
          
          {/* File Upload Section */}
          <div className={`${darkTheme ? "bg-gray-700" : "bg-gray-50"} p-4 rounded-lg`}>
            <h2 className={`text-lg font-medium ${darkTheme ? "text-white" : "text-gray-900"} mb-4`}>Upload CSV Data</h2>
            
            <div 
              className={`mt-2 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md transition-colors
                ${darkTheme ? "border-gray-600" : "border-gray-300"}
                ${dragActive ? (darkTheme ? "border-blue-400 bg-blue-900 bg-opacity-20" : "border-blue-400 bg-blue-50") : ""}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <div className="space-y-1 text-center">
                <svg
                  className={`mx-auto h-12 w-12 ${darkTheme ? "text-gray-500" : "text-gray-400"}`}
                  stroke="currentColor"
                  fill="none"
                  viewBox="0 0 48 48"
                  aria-hidden="true"
                >
                  <path
                    d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <div className={`flex text-sm ${darkTheme ? "text-gray-300" : "text-gray-600"}`}>
                  <button
                    type="button"
                    onClick={onButtonClick}
                    className={`relative cursor-pointer px-3 py-2 rounded-md font-medium text-blue-500 hover:text-blue-400 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500
                      ${darkTheme ? "bg-gray-600" : "bg-white"} hover:${darkTheme ? "bg-gray-500" : "bg-gray-50"}`}
                  >
                    <span>Upload a file</span>
                  </button>
                  <input 
                    ref={inputRef}
                    id="file-upload" 
                    name="file-upload" 
                    type="file" 
                    className="sr-only" 
                    onChange={handleFileChange}
                    accept=".csv"
                  />
                  <p className="pl-1 m-auto">or drag and drop</p>
                </div>
                <p className={`text-xs ${darkTheme ? "text-gray-400" : "text-gray-500"}`}>CSV files only</p>
              </div>
            </div>
            
            {fileName && (
              <div className={`mt-3 flex items-center text-sm ${darkTheme ? "text-gray-300" : "text-gray-500"}`}>
                <svg className={`flex-shrink-0 mr-1.5 h-5 w-5 ${darkTheme ? "text-gray-500" : "text-gray-400"}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M8 4a3 3 0 00-3 3v4a5 5 0 0010 0V7a3 3 0 00-3-3H8zm6 8a3 3 0 01-6 0V7a1 1 0 012 0v5a1 1 0 102 0V7a3 3 0 00-3-3H7a3 3 0 00-3 3v5a5 5 0 0010 0V7a1 1 0 112 0v5z" clipRule="evenodd" />
                </svg>
                <span>{fileName}</span>
              </div>
            )}
            
            <button 
              onClick={handleUpload} 
              disabled={!file || loading}
              className={`mt-4 w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-white ${darkTheme ? "bg-green-700 hover:bg-green-800" : "bg-green-600 hover:bg-green-700"} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors`}
            >
              {loading ? 'Uploading...' : 'Upload File'}
            </button>
            
            {uploadSuccess && (
              <div className={`mt-3 p-3 ${darkTheme ? "bg-green-900 border-green-800" : "bg-green-50 border-green-200"} border rounded-md`}>
                <p className={`text-sm ${darkTheme ? "text-green-200" : "text-green-800"} flex items-center`}>
                  <svg className={`h-5 w-5 ${darkTheme ? "text-green-500" : "text-green-400"} mr-2`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                  File uploaded successfully
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}