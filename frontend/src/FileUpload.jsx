import React, { useState } from "react";
import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000", // Your backend URL
  withCredentials: true, // Include cookies if needed
});

const FileUpload = () => {
  const [file, setFile] = useState(null);
  const [message, setMessage] = useState("");
  const [uploadedImageUrl, setUploadedImageUrl] = useState(""); // State for storing uploaded image URL

  const handleFileChange = (e) => {
    setFile(e.target.files[0]); // Select the first file
  };

  const handleFileUpload = async (e) => {
    e.preventDefault();

    if (!file) {
      setMessage("Please select a file first!");
      return;
    }

    const formData = new FormData();
    formData.append("photo", file);

    try {
      const res = await axiosInstance.post("/upload", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      setMessage(res.data.message); // Display the success message
      setUploadedImageUrl(res.data.filePath); // Set the uploaded image URL
    } catch (err) {
      console.error(err);
      setMessage(err.response?.data?.error || "Something went wrong!");
    }
  };

  return (
    <div>
      <h1>File Upload</h1>
      <form onSubmit={handleFileUpload}>
        <input type="file" onChange={handleFileChange} />
        <button type="submit">Upload</button>
      </form>
      {message && <p>{message}</p>}
      {uploadedImageUrl && (
        <div>
          <h2>Uploaded Image:</h2>
          <img
            src={uploadedImageUrl}
            alt="Uploaded File"
            style={{ maxWidth: "100%", height: "auto" }}
          />
        </div>
      )}
    </div>
  );
};

export default FileUpload;
