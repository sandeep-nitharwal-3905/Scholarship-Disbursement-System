import React, { useState } from "react";
import axios from "axios";

// Cloudinary configuration (only the cloud name is needed for client-side)
const cloudName = "dmqzrmtsf"; // replace with your cloud name

const CloudinaryUpload = () => {
  const [file, setFile] = useState(null);
  const [fileUrl, setFileUrl] = useState(null);
  const [loading, setLoading] = useState(false);

  // Handle file selection
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  // Upload file to backend
  const handleUpload = async () => {
    if (!file) {
      alert("Please select a file first!");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);

    try {
      setLoading(true);
      const response = await axios.post(
        "http://localhost:5000/upload", // Endpoint to your backend
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
        }
      );

      const uploadedUrl = response.data.file.url;
      console.log("File uploaded successfully:", uploadedUrl);
      setFileUrl(uploadedUrl);
    } catch (error) {
      console.error("Error uploading file:", error);
      alert("Upload failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Cloudinary File Upload</h2>
      <input type="file" onChange={handleFileChange} accept=".pdf" />
      <button onClick={handleUpload} disabled={loading}>
        {loading ? "Uploading..." : "Upload"}
      </button>

      {fileUrl && (
        <div>
          <h3>Uploaded File URL:</h3>
          <a href={fileUrl} target="_blank" rel="noopener noreferrer">
            {fileUrl}
          </a>
        </div>
      )}
    </div>
  );
};

export default CloudinaryUpload;
