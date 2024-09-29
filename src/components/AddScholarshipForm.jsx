import React, { useState } from 'react';
import { Plus } from 'lucide-react'; // Importing the Plus icon
import { useFirebase } from '../context/Firebase';

const AddScholarshipForm = () => {
    const Firebase = useFirebase();
    const [scholarship, setScholarship] = useState({
        name: '',
        eligibility: '',
        requiredDocuments: [''], // Initially one empty document field
        applicants: ['None']
    });

    // Handle input changes for other fields
    const handleChange = (e) => {
        setScholarship({
            ...scholarship,
            [e.target.name]: e.target.value
        });
    };

    // Handle changes for the required documents array
    const handleDocumentChange = (index, value) => {
        const updatedDocs = [...scholarship.requiredDocuments];
        updatedDocs[index] = value;
        setScholarship({ ...scholarship, requiredDocuments: updatedDocs });
    };

    // Add a new empty document field
    const addDocumentField = () => {
        setScholarship({
            ...scholarship,
            requiredDocuments: [...scholarship.requiredDocuments, '']
        });
    };

    // Handle form submission
    const handleSubmit = (e) => {
        e.preventDefault();
        Firebase.createScholarship(scholarship);
        // Here you can handle the form submission, e.g., call Firebase
        console.log('Scholarship Data:', scholarship);
        // Reset the form after submission
        setScholarship({
            name: '',
            eligibility: '',
            requiredDocuments: ['']
        });
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">Add Scholarship</h2>

            {/* Scholarship Name */}
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

            {/* Eligibility */}
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

            {/* Dynamic Required Documents */}
            <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                    Required Documents
                </label>

                {scholarship.requiredDocuments.map((doc, index) => (
                    <div key={index} className="flex items-center mb-2">
                        <input
                            type="text"
                            value={doc}
                            onChange={(e) => handleDocumentChange(index, e.target.value)}
                            placeholder={`Document ${index + 1}`}
                            required
                            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500"
                        />
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

            {/* Submit Button */}
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
