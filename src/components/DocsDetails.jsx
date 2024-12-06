import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getDatabase, ref, get } from "firebase/database";
import { 
  getFirestore, 
  doc, 
  getDoc, 
  updateDoc 
} from "firebase/firestore";
import app from "../Firebase";

const DocDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [document, setDocument] = useState(null);
  const [loading, setLoading] = useState(true);
  const [verificationStatus, setVerificationStatus] = useState({});

  useEffect(() => {
    const fetchDocumentDetails = async () => {
      try {
        const firestore = getFirestore(app);
        const realtimeDb = getDatabase(app);

        // Fetch document data from Firestore
        const docRef = doc(firestore, "usersDocs", id);
        const docSnapshot = await getDoc(docRef);
        const docData = docSnapshot.exists() ? docSnapshot.data() : null;

        // Fetch user data from Realtime Database
        const userRef = ref(realtimeDb, `users/${id}`);
        const userSnapshot = await get(userRef);
        const userData = userSnapshot.exists() ? userSnapshot.val() : {};

        // Initialize verification status for each document type
        const initialVerificationStatus = {};
        if (docData) {
          Object.keys(docData).forEach(key => {
            if (key !== 'other_docs') {
              initialVerificationStatus[key] = docData[key]?.status || 1;
            } else if (Array.isArray(docData[key])) {
              initialVerificationStatus[key] = docData[key].map(doc => doc.status || 1);
            }
          });
        }

        // Combine the data
        setDocument({
          id,
          ...docData,
          name: userData.fullName || "Unknown",
          email: userData.email || "No Email Provided",
        });
        setVerificationStatus(initialVerificationStatus);
      } catch (error) {
        console.error("Error fetching document details:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDocumentDetails();
  }, [id]);

  const updateDocumentStatus = async (docType, status, index = null) => {
    try {
      const firestore = getFirestore(app);
      const docRef = doc(firestore, "usersDocs", id);

      // Create a copy of the current document data
      const currentDoc = { ...document };
      
      // Update status for single document types
      if (index === null) {
        currentDoc[docType] = {
          ...currentDoc[docType],
          status: status
        };
        verificationStatus[docType] = status;
      } else {
        // Update status for other_docs array
        currentDoc.other_docs[index].status = status;
        verificationStatus.other_docs[index] = status;
      }

      // Update Firestore document
      await updateDoc(docRef, currentDoc);

      // Update local state
      setDocument(currentDoc);
      setVerificationStatus({ ...verificationStatus });

      alert(`Document ${docType} status updated to ${status}`);
    } catch (error) {
      console.error("Error updating document status:", error);
      alert("Failed to update document status");
    }
  };

  const renderDocumentStatus = (docType, status, index = null) => {
    // Status meanings:
    // 1: Pending
    // 2: Approved
    // 3: Rejected
    const statusLabels = {
      1: "Pending",
      2: "Approved",
      3: "Rejected"
    };

    const statusColors = {
      1: "text-yellow-600",
      2: "text-green-600",
      3: "text-red-600"
    };

    return (
      <div className="flex items-center space-x-2">
        <span className={`font-medium ${statusColors[status]}`}>
          {statusLabels[status]}
        </span>
        <div className="flex space-x-2">
          <button 
            className="bg-green-500 text-white px-2 py-1 rounded text-sm"
            onClick={() => updateDocumentStatus(docType, 2, index)}
            disabled={status === 2}
          >
            Approve
          </button>
          <button 
            className="bg-red-500 text-white px-2 py-1 rounded text-sm"
            onClick={() => updateDocumentStatus(docType, 3, index)}
            disabled={status === 3}
          >
            Reject
          </button>
        </div>
      </div>
    );
  };

  const renderDocuments = () => {
    return Object.keys(document)
      .filter(key => 
        key !== 'id' && 
        key !== 'name' && 
        key !== 'email' && 
        document[key]
      )
      .map(docType => {
        // Handle single document types
        if (docType !== 'other_docs' && typeof document[docType] === 'object') {
          return (
            <div key={docType} className="mb-4 p-4 bg-gray-100 rounded-lg">
              <h3 className="text-lg font-semibold mb-2 capitalize">
                {docType.replace(/_/g, ' ')}
              </h3>
              <div className="flex justify-between items-center">
                <a 
                  href={document[docType].url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  View Document
                </a>
                {renderDocumentStatus(docType, verificationStatus[docType])}
              </div>
            </div>
          );
        }
        
        // Handle other_docs array
        if (docType === 'other_docs' && Array.isArray(document[docType])) {
          return document[docType].map((otherDoc, index) => (
            <div key={index} className="mb-4 p-4 bg-gray-100 rounded-lg">
              <h3 className="text-lg font-semibold mb-2">
                Other Document {index + 1}
              </h3>
              <div className="flex justify-between items-center">
                <a 
                  href={otherDoc.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline"
                >
                  View Document
                </a>
                {renderDocumentStatus('other_docs', otherDoc.status, index)}
              </div>
            </div>
          ));
        }
        
        return null;
      });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600 text-lg">Loading...</p>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="flex items-center justify-center h-screen">
        <p className="text-gray-600 text-lg">Document not found</p>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="mb-6">
        <button
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center"
          onClick={() => navigate(-1)}
        >
          &larr; Back
        </button>
      </div>

      <div className="bg-white shadow-lg rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4 text-blue-600">
          Document Details
        </h1>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <p className="text-lg font-semibold text-gray-700">
              <strong>UID:</strong> {document.id}
            </p>
            <p className="text-lg font-semibold text-gray-700">
              <strong>Name:</strong> {document.name}
            </p>
          </div>
          <p className="text-lg font-semibold text-gray-700">
            <strong>Email:</strong> {document.email}
          </p>
          
          <h2 className="mt-6 text-xl font-bold text-gray-700">
            Uploaded Documents:
          </h2>
          {renderDocuments()}
        </div>
      </div>
    </div>
  );
};

export default DocDetails;