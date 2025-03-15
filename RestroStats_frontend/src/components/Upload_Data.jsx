import { useState } from "react";
import axios from "axios";
import { useTheme } from "./ThemeProvider";
// import.meta.env.VITE_token

export default function Upload_Data() {
  const {darkTheme, toggleTheme} = useTheme()
  const [formData, setFormData] = useState({
    item_name:"",
    item_type:"",
    day_of_week: "",
    time_of_day:"",
    received_by: "",
    item_price: ""
  });
  const [token, setToken] = useState("");
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [predictionResult, setPredictionResult] = useState(null);
  const [fileName, setFileName] = useState("");
  const [uploadSuccess, setUploadSuccess] = useState(false);
  
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
  
  const handlePrediction = async () => {
    try {
      setLoading(true);
      setPredictionResult(null);
      
      const response = await axios.post(
        "http://localhost:5000/predict", 
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      setPredictionResult(response.data.prediction);
    } catch (error) {
      setPredictionResult("Error");
    } finally {
      setLoading(false);
    }
  };
  
  const handleUpload = async () => {
    if (!file) return;
    
    try {
      setLoading(true);
      setUploadSuccess(false);
      
      const formData = new FormData();
      formData.append("file", file);
      
      await axios.post("http://localhost:5000/api/load-data", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
      });
      
      setUploadSuccess(true);
      setFileName("");
      setFile(null);
    } catch (error) {
      alert("Error uploading file");
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
      {/* Prediction Section */}
      <div className={`${darkTheme ? "bg-gray-700" : "bg-gray-50"} p-4 rounded-lg mb-6`}>
        <h2 className={`text-lg font-medium ${darkTheme ? "text-white" : "text-gray-900"} mb-4`}>Make a Prediction</h2>
        <div className="space-y-4">
          {Object.keys(formData).map((key) => (
            <div key={key}>
              <label className={`block text-sm font-medium ${darkTheme ? "text-gray-300" : "text-gray-700"} mb-1 capitalize`}>
                {key.replace(/_/g, " ")}
              </label>
              <input
                type="text"
                name={key}
                value={formData[key]}
                onChange={handleInputChange}
                className={`focus:ring-blue-500 focus:border-blue-500 block w-full px-4 py-3 border ${darkTheme ? "bg-gray-600 border-gray-600 text-white placeholder-gray-400" : "bg-white border-gray-300 text-gray-900"} rounded-md`}
                placeholder={`Enter ${key.replace(/_/g, " ")}`}
              />
            </div>
          ))}
          
          <button 
            onClick={handlePrediction} 
            disabled={loading}
            className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-white ${darkTheme ? "bg-blue-700 hover:bg-blue-800" : "bg-blue-600 hover:bg-blue-700"} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors ${loading ? 'opacity-70 cursor-not-allowed' : ''}`}
          >
            {loading ? 'Processing...' : 'Generate Prediction'}
          </button>
          
          {predictionResult !== null && (
            <div className={`mt-3 p-4 ${darkTheme ? "bg-blue-900 border-blue-800" : "bg-blue-50 border-blue-200"} border rounded-md`}>
              <p className={`text-sm ${darkTheme ? "text-blue-200" : "text-blue-800"}`}>
                <span className="font-medium">Prediction Result:</span> {predictionResult}
              </p>
            </div>
          )}
        </div>
      </div>
      
      {/* File Upload Section */}
      <div className={`${darkTheme ? "bg-gray-700" : "bg-gray-50"} p-4 rounded-lg`}>
        <h2 className={`text-lg font-medium ${darkTheme ? "text-white" : "text-gray-900"} mb-4`}>Upload CSV Data</h2>
        
        <div className={`mt-2 flex justify-center px-6 pt-5 pb-6 border-2 ${darkTheme ? "border-gray-600" : "border-gray-300"} border-dashed rounded-md`}>
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
              <label
                htmlFor="file-upload"
                className={`relative cursor-pointer ${darkTheme ? "bg-gray-600" : "bg-white"} rounded-md font-medium text-blue-500 hover:text-blue-400 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-blue-500`}
              >
                <span>Upload a file</span>
                <input id="file-upload" name="file-upload" type="file" className="sr-only" onChange={handleFileChange} />
              </label>
              <p className="pl-1">or drag and drop</p>
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