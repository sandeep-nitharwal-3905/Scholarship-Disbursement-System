import React, { useState, useEffect } from 'react';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../../Firebase';
import { 
  FileText, 
  User, 
  Mail, 
  GraduationCap, 
  Building, 
  Phone, 
  FileSpreadsheet 
} from 'lucide-react';

const AdminDashboard = () => {
  const [applications, setApplications] = useState([]);
  const [selectedApplication, setSelectedApplication] = useState(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "scholarshipApplications"));
        const applicationsList = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        }));
        setApplications(applicationsList);
      } catch (error) {
        console.error("Error fetching applications:", error);
      }
    };

    fetchApplications();
  }, []);
  console.log(applications);
  const renderDocumentThumbnail = (base64) => {
    return (
      <div className="w-40 h-40 border-2 border-gray-300 rounded-lg overflow-hidden shadow-md hover:shadow-xl transition-all duration-300">
        <img
          src={base64}
          alt="Document"
          className="w-full h-full object-cover hover:scale-110 transition-transform"
        />
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="container mx-auto bg-white shadow-2xl rounded-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-6">
          <h1 className="text-4xl font-extrabold text-white flex items-center">
            <GraduationCap className="mr-4" size={40} />
            Scholarship Applications
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-6">
          {/* Applications List */}
          <div className="col-span-1 bg-gray-100 rounded-xl shadow-inner p-4 overflow-y-auto max-h-[75vh]">
            <h2 className="text-xl font-semibold mb-4 text-gray-700 border-b pb-2">
              Applicant List
            </h2>
            {applications.map(app => (
              <div
                key={app.id}
                onClick={() => setSelectedApplication(app)}
                className="cursor-pointer hover:bg-blue-100 p-4 rounded-lg transition-colors duration-200 mb-2 flex items-center border-b last:border-b-0"
              >
                <div className="mr-4">
                  <User className="text-blue-500" />
                </div>
                <div>
                  <p className="font-bold text-gray-800">{app.name}</p>
                  <p className="text-sm text-gray-600 flex items-center">
                    <Mail className="mr-2 w-4 h-4" />
                    {app.email}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Application Details */}
          {selectedApplication && (
            <div className="col-span-2 bg-white shadow-lg rounded-2xl p-8">
              <h2 className="text-3xl font-bold mb-6 text-gray-800 border-b pb-4 flex items-center">
                <FileText className="mr-4 text-blue-600" size={32} />
                Application Details: {selectedApplication.name}
              </h2>

              <div className="grid grid-cols-2 gap-6">
                <div className="bg-gray-50 p-6 rounded-xl">
                  <h3 className="font-semibold text-xl mb-4 text-blue-700 border-b pb-2">
                    Personal Information
                  </h3>
                  <div className="space-y-3">
                    <p className="flex items-center">
                      <Mail className="mr-3 w-5 h-5 text-blue-500" />
                      <span>{selectedApplication.email}</span>
                    </p>
                    <p className="flex items-center">
                      <FileSpreadsheet className="mr-3 w-5 h-5 text-blue-500" />
                      Roll Number: {selectedApplication.rollNumber}
                    </p>
                    <p className="flex items-center">
                      <Building className="mr-3 w-5 h-5 text-blue-500" />
                      School: {selectedApplication.schoolName}
                    </p>
                    <p className="flex items-center">
                      <GraduationCap className="mr-3 w-5 h-5 text-blue-500" />
                      GPA: {selectedApplication.gpa}
                    </p>
                    <p className="flex items-center">
                      <FileText className="mr-3 w-5 h-5 text-blue-500" />
                      Course: {selectedApplication.courseOfStudy}
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 p-6 rounded-xl">
                  <h3 className="font-semibold text-xl mb-4 text-blue-700 border-b pb-2">
                    Contact Details
                  </h3>
                  <div className="space-y-3">
                    <p className="flex items-center">
                      <Building className="mr-3 w-5 h-5 text-blue-500" />
                      Address: {selectedApplication.address}
                    </p>
                    <p className="flex items-center">
                      <Phone className="mr-3 w-5 h-5 text-blue-500" />
                      Contact Number: {selectedApplication.contactNumber}
                    </p>
                    <p className="flex items-center">
                      <FileSpreadsheet className="mr-3 w-5 h-5 text-blue-500" />
                      Annual Income: ${selectedApplication.annualIncome}
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8">
                <h3 className="font-semibold text-xl mb-6 text-blue-700 border-b pb-2">
                  Uploaded Documents
                </h3>
                <div className="grid grid-cols-3 gap-6">
                  {Object.entries(selectedApplication.documents).map(([docName, base64]) => (
                    <div key={docName} className="text-center">
                      {renderDocumentThumbnail(base64)}
                      <p className="mt-3 text-sm font-medium text-gray-700">{docName}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;