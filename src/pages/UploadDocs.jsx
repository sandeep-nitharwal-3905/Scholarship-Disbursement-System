// UploadDocs.jsx
import React, { useState } from "react";
import { useDropzone } from "react-dropzone";

function UploadDocs() {
  const [selectedDocType, setSelectedDocType] = useState("aadhar_card");
  const [uploadedFiles, setUploadedFiles] = useState([]);

  const onDrop = (acceptedFiles) => {
    const filesWithType = acceptedFiles.map((file) => ({
      file,
      type: selectedDocType,
    }));
    setUploadedFiles((prev) => [...prev, ...filesWithType]);
    console.log(filesWithType);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [],
      "application/pdf": [],
    },
  });

  const handleDocTypeChange = (e) => {
    setSelectedDocType(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-100 to-purple-100 flex items-center justify-center p-6">
      <div className="bg-white shadow-lg rounded-lg p-8 w-full max-w-lg">
        <h2 className="text-3xl font-bold text-center text-indigo-600 mb-6">
          Upload Your Documents
        </h2>

        {/* Document Type Selection */}
        <div className="mb-6">
          <label
            htmlFor="docType"
            className="block text-gray-700 font-semibold mb-2"
          >
            Select Document Type
          </label>
          <select
            id="docType"
            value={selectedDocType}
            onChange={handleDocTypeChange}
            className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="aadhar_card">Aadhar Card</option>
            <option value="voter_card">Voter Card</option>
            <option value="pan_card">PAN Card</option>
            <option value="dob_certificate">DOB Certificate</option>
            <option value="school_marksheet">School Marksheet</option>
            <option value="driving_licence">Driving Licence</option>
            <option value="passing_certificate">Passing Certificate</option>
            <option value="medical_fitness_certificate">Medical Fitness Certificate</option>
            <option value="other">Other Document</option>
          </select>
        </div>

        {/* Dropzone Area */}
        <div
          {...getRootProps()}
          className={`border-dashed border-4 rounded-lg p-8 transition duration-300 
            ${
              isDragActive
                ? "border-blue-500 bg-blue-50"
                : "border-gray-300 bg-gray-50"
            }
            hover:border-indigo-500 hover:bg-indigo-50 cursor-pointer`}
        >
          <input {...getInputProps()} />
          <p className="text-center text-gray-600">
            {isDragActive
              ? "Drop the files here ..."
              : "Drag & drop some files here, or click to select files"}
          </p>
          <p className="text-center text-sm text-gray-500 mt-2">
            Supported formats: Images, PDF
          </p>
        </div>

        {/* Uploaded Files List */}
        {uploadedFiles.length > 0 && (
          <div className="mt-6">
            <h3 className="text-xl font-semibold text-gray-700 mb-4">
              Uploaded Documents
            </h3>
            <ul className="space-y-2">
              {uploadedFiles.map((fileObj, index) => (
                <li
                  key={index}
                  className="flex items-center justify-between p-4 bg-gray-100 rounded-md"
                >
                  <div className="flex items-center">
                    {fileObj.file.type.startsWith("image/") ? (
                      <img
                        src={URL.createObjectURL(fileObj.file)}
                        alt={fileObj.file.name}
                        className="w-12 h-12 object-cover rounded-md mr-4"
                      />
                    ) : (
                      <div className="w-12 h-12 flex items-center justify-center bg-gray-200 rounded-md mr-4">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-gray-600"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M12 4v16m8-8H4"
                          />
                        </svg>
                      </div>
                    )}
                    <div>
                      <p className="text-gray-800 font-medium">
                        {fileObj.file.name}
                      </p>
                      <p className="text-gray-500 text-sm capitalize">
                        {formatDocType(fileObj.type)}
                      </p>
                    </div>
                  </div>
                  {/* Optional: Add remove functionality */}
                  <button
                    className="text-red-500 hover:text-red-700"
                    onClick={() => removeFile(index)}
                    aria-label="Remove file"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Upload Button */}
        <button
          type="button"
          className={`mt-6 w-full bg-indigo-600 text-white font-semibold py-2 px-4 rounded-md hover:bg-indigo-700 transition duration-200 ${
            uploadedFiles.length === 0 ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={handleUpload}
          disabled={uploadedFiles.length === 0}
        >
          Upload Files
        </button>
      </div>
    </div>
  );

  // Helper function to format document type labels
  function formatDocType(docType) {
    switch (docType) {
      case "aadhar_card":
        return "Aadhar Card";
      case "voter_card":
        return "Voter Card";
      case "pan_card":
        return "PAN Card";
      case "dob_certificate":
        return "DOB Certificate";
      case "school_marksheet":
        return "School Marksheet";
      case "driving_licence":
        return "Driving Licence";
      case "passing_certificate":
        return "Passing Certificate";
      case "medical_fitness_certificate":
        return "Medical Fitness Certificate";
      case "other":
        return "Other Document";
      default:
        return docType.replace(/_/g, " ");
    }
  }

  // Handler to remove a file from the list
  function removeFile(index) {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  }

  // Handler for upload button click
  function handleUpload() {
    // Implement your upload logic here.
    // This could involve sending the files to a server via an API.
    // For demonstration, we'll just log the files and reset the state.

    uploadedFiles.forEach((fileObj) => {
      console.log(`Uploading ${fileObj.file.name} as ${fileObj.type}`);
      // Example: FormData and fetch/Axios to upload
    });

    alert("Files uploaded successfully!");
    setUploadedFiles([]);
  }
}

export default UploadDocs;
