import React, { useState } from "react";
import { FirebaseProvider, useFirebase } from "../../firebase/FirebaseContext";

import { Plus } from "lucide-react";

const AddScholarshipForm = () => {
  const Firebase = useFirebase();
  const [scholarship, setScholarship] = useState({
    name: "",
    eligibility: "",
    requiredDocuments: [""],
  });

  const predefinedDocuments = [
    "Passport",
    "Birth Certificate",
    "12th Transcript",
    "10th Transcript",
    "Recommendation Letter",
    "Aadhar Card",
    "PAN Card",
  ];

  const handleChange = (e) => {
    setScholarship({
      ...scholarship,
      [e.target.name]: e.target.value,
    });
  };

  const handleDocumentChange = (index, value) => {
    const updatedDocs = [...scholarship.requiredDocuments];
    if (updatedDocs[index] === "Other" && value !== "Other") {
      updatedDocs[index] = "";
    }
    updatedDocs[index] = value;
    setScholarship({ ...scholarship, requiredDocuments: updatedDocs });
  };

  const handleCustomDocumentChange = (index, value) => {
    const updatedDocs = [...scholarship.requiredDocuments];
    updatedDocs[index] = value;
    setScholarship({ ...scholarship, requiredDocuments: updatedDocs });
  };

  const addDocumentField = () => {
    setScholarship({
      ...scholarship,
      requiredDocuments: [...scholarship.requiredDocuments, ""],
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    Firebase.createScholarship(scholarship);
    setScholarship({
      name: "",
      eligibility: "",
      requiredDocuments: [""],
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg"
    >
      <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
        Add Scholarship
      </h2>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Scholarship Name
        </label>
        <input
          type="text"
          name="name"
          value={scholarship.name}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Eligibility
        </label>
        <textarea
          name="eligibility"
          value={scholarship.eligibility}
          onChange={handleChange}
          required
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
        />
      </div>

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Required Documents
        </label>

        {scholarship.requiredDocuments.map((doc, index) => (
          <div key={index} className="flex items-center mb-2 space-x-2">
            <select
              value={doc}
              onChange={(e) => handleDocumentChange(index, e.target.value)}
              className="w-2/3 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
            >
              <option value="" disabled>
                Select a document
              </option>
              {predefinedDocuments.map((option, i) => (
                <option key={i} value={option}>
                  {option}
                </option>
              ))}
            </select>

            {doc === "Other" && (
              <input
                type="text"
                placeholder="Specify document"
                value={doc === "Other" ? "" : doc}
                className="w-1/3 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                onChange={(e) => handleCustomDocumentChange(index, e.target.value)}
              />
            )}
          </div>
        ))}

        <button
          type="button"
          onClick={addDocumentField}
          className="mt-2 flex items-center text-indigo-600 hover:text-indigo-900 focus:outline-none"
        >
          <Plus className="w-5 h-5 mr-1" />
          Add another document
        </button>
      </div>

      <button
        type="submit"
        className="w-full bg-indigo-600 text-white py-2 px-4 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-opacity-50"
      >
        Add Scholarship
      </button>
    </form>
  );
};

export default AddScholarshipForm;