import React from 'react';
import {
  Download,
  Award,
  FileText,
  Calendar,
  Target,
  CheckCircle,
  Menu,
  Home,
  School,
  Phone
} from 'lucide-react';

const AboutPMSSS = () => {
  const downloadGuidelines = () => {
    // Placeholder for download functionality
    alert('Downloading PMSSS Guidelines...');
  };

  const toggleSidebar = () => {
    // Placeholder for sidebar toggle functionality
    alert('Sidebar toggled!');
  };

  return (
    <div>
      <header className="bg-gradient-to-b from-[#0d121d] to-[#0d121d] text-white">
        {/* Navigation Bar 1 */}
        <div className="flex justify-between items-center px-6 py-4">
          <div className="text-xl font-bold text-center flex-1">
            Scholarship Disbursement System
          </div>
          <img
            src="src/assets/1.png"
            alt="Logo"
            className="h-12 w-12 rounded-full object-cover border-2 border-white"
          />
        </div>

        {/* Navigation Bar 2 */}
        <nav className="bg-[#111827] py-5">
          <div className="container mx-auto flex justify-between items-center sm:justify-center sm:space-x-6 flex-wrap">
            {/* Mobile Hamburger Menu */}
            <div className="sm:hidden flex items-center">
              <button className="text-white" onClick={toggleSidebar}>
                <Menu size={24} />
              </button>
            </div>

            {/* Desktop Navigation Links */}
            <div className="hidden sm:flex space-x-7">
              <a
                href="/"
                className="flex items-center text-white hover:text-[#008000] mb-2 sm:mb-0"
              >
                <Home className="mr-2" size={20} />
                Home
              </a>
              <a
                href="/about"
                className="flex items-center text-white hover:text-[#008000] mb-2 sm:mb-0"
              >
                <School className="mr-2" size={20} />
                About PMSSS
              </a>
              <a
                href="#"
                className="flex items-center text-white hover:text-[#008000] mb-2 sm:mb-0"
              >
                <FileText className="mr-2" size={20} />
                How to Apply
              </a>
              <a
                href="#"
                className="flex items-center text-white hover:text-[#008000] mb-2 sm:mb-0"
              >
                <Phone className="mr-2" size={20} />
                Contact Us
              </a>
            </div>
          </div>
        </nav>
      </header>

      <div className="container mx-auto px-4 py-8 max-w-4xl">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          <div className="p-6">
            <h1 className="text-3xl font-bold text-blue-800 mb-6 border-b-2 border-blue-200 pb-3">
              Prime Minister's Special Scholarship Scheme (PMSSS)
            </h1>

            <section className="mb-6">
              <p className="text-gray-700 leading-relaxed">
                The <strong>Prime Minister's Special Scholarship Scheme (PMSSS)</strong> is a flagship initiative aimed at providing quality education opportunities to students. It enables students, particularly from underserved regions, to access higher education and contribute to the development of the nation.
              </p>
            </section>

            <section className="mb-6">
              <h2 className="text-2xl font-semibold text-blue-700 mb-4 flex items-center">
                <Target className="mr-3 text-blue-500" /> Objective of PMSSS
              </h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Facilitate education for economically weaker sections.</li>
                <li>Promote regional diversity in higher education institutions.</li>
                <li>Support students through financial assistance for tuition fees, living expenses, and other associated costs.</li>
              </ul>
            </section>

            <section className="mb-6">
              <h2 className="text-2xl font-semibold text-blue-700 mb-4 flex items-center">
                <Calendar className="mr-3 text-blue-500" /> Milestones in PMSSS Development
              </h2>
              <div className="space-y-2">
                <div className="flex items-center">
                  <span className="font-bold mr-2 text-blue-600">2010:</span>
                  <span>Launch of PMSSS to support students from specific regions</span>
                </div>
                <div className="flex items-center">
                  <span className="font-bold mr-2 text-blue-600">2015:</span>
                  <span>Expanded focus on digital applications and transparency</span>
                </div>
                <div className="flex items-center">
                  <span className="font-bold mr-2 text-blue-600">2020:</span>
                  <span>Introduction of online document verification to streamline the process</span>
                </div>
              </div>
            </section>

            <section className="mb-6">
              <h2 className="text-2xl font-semibold text-blue-700 mb-4 flex items-center">
                <Award className="mr-3 text-blue-500" /> Key Features
              </h2>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2 text-blue-600">Eligibility Criteria</h3>
                  <p className="text-gray-700">Students from eligible regions with specified academic and income qualifications</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h3 className="font-semibold mb-2 text-blue-600">Financial Support</h3>
                  <p className="text-gray-700">Comprehensive scholarships covering tuition, hostel fees, and incidental charges</p>
                </div>
                <div className="bg-blue-50 p-4 rounded-lg col-span-full">
                  <h3 className="font-semibold mb-2 text-blue-600">Online Application System</h3>
                  <p className="text-gray-700">Ensures transparency and ease of access</p>
                </div>
              </div>
            </section>

            <section className="mb-6">
              <h2 className="text-2xl font-semibold text-blue-700 mb-4 flex items-center">
                <CheckCircle className="mr-3 text-blue-500" /> Impact of PMSSS
              </h2>
              <ul className="list-disc pl-6 space-y-2 text-gray-700">
                <li>Empowered thousands of students to pursue higher education</li>
                <li>Fostered socio-economic upliftment through education</li>
                <li>Enhanced diversity in top educational institutions across India</li>
              </ul>
            </section>

            <section className="mb-6">
              <h2 className="text-2xl font-semibold text-blue-700 mb-4 flex items-center">
                <FileText className="mr-3 text-blue-500" /> Application Process
              </h2>
              <ol className="list-decimal pl-6 space-y-2 text-gray-700">
                <li><strong>Registration:</strong> Students register on the official PMSSS portal</li>
                <li><strong>Verification:</strong> Documents are verified online to ensure authenticity</li>
                <li><strong>Selection:</strong> Scholarships are granted based on merit and eligibility</li>
              </ol>
            </section>

            <section className="bg-blue-100 p-4 rounded-lg flex items-center justify-between">
              <div className="flex items-center">
                <Download className="mr-3 text-blue-700" />
                <span className="font-semibold text-blue-900">
                  Download PMSSS Guidelines
                </span>
              </div>
              <button 
                onClick={downloadGuidelines}
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-300"
              >
                Download
              </button>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPMSSS;
