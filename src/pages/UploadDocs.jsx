// UploadDocs.jsx
import React from "react";
import { useDropzone } from "react-dropzone";

function UploadDocs() {
  const onDrop = (acceptedFiles) => {
    console.log(acceptedFiles);
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: "image/*,application/pdf",
  });

  return (
    <div className="flex-1 p-6">
      <div className="max-w-lg mx-auto">
        <h2 className="text-2xl font-bold text-center mb-6">
          Upload Your Documents
        </h2>
        <div
          {...getRootProps()}
          className={`border-dashed border-4 rounded-lg p-8 transition duration-300 
            ${isDragActive ? "border-blue-500 bg-blue-50" : "border-gray-300"}
            hover:border-blue-500 hover:bg-blue-50`}
        >
          <input {...getInputProps()} />
          <p className="text-center text-gray-600">
            {isDragActive
              ? "Drop the files here ..."
              : "Drag 'n' drop some files here, or click to select files"}
          </p>
        </div>
      </div>
    </div>
  );
}

export default UploadDocs;
