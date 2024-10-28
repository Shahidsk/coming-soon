import React, { useEffect, useState } from 'react';
import { databases,storage } from '../appwrite';
import { Query } from 'appwrite';
import { motion } from 'framer-motion';
import { EyeIcon, TrashIcon, PencilIcon, DocumentIcon, EyeOffIcon, DocumentTextIcon, UserCircleIcon } from '@heroicons/react/outline';
import StudentDetailsModal from './StudentDetailsModal';

import ConfirmationModal from './ConfirmationModal';
import CertificateGenerator from './CertificateGenerator';
import EditStudentModal from './EditStudentModal';


const StudentList = ({ searchName }) => {
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [studentToGenerateCertificate, setStudentToGenerateCertificate] = useState(null);
  const [isGeneratingCertificate, setIsGeneratingCertificate] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [studentToEdit, setStudentToEdit] = useState(null);
  const [generatingCertificates, setGeneratingCertificates] = useState({});

  useEffect(() => {
    fetchStudents();
  }, [searchName]);

  const fetchStudents = async () => {
    try {
      let queries = [];
      if (searchName) {
        queries.push(Query.search('name', searchName));
      }
      const response = await databases.listDocuments(
        '6712ba950038c0ce021e',
        '6712baa70033ebb43466',
        queries
      );
      setStudents(response.documents);
    } catch (error) {
      console.error('Error fetching students', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await databases.deleteDocument('6712ba950038c0ce021e', '6712baa70033ebb43466', id);
      setStudents(students.filter(student => student.$id !== id));
    } catch (error) {
      console.error('Error deleting student', error);
    }
  };

  const handleViewDetails = (student) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  const handleEditStudent = (student) => {
    setStudentToEdit(student);
    setIsEditModalOpen(true);
  };

  const handleGenerateCertificate = async (student) => {
    setGeneratingCertificates(prev => ({ ...prev, [student.$id]: true }));
    try {
      if (student.certificateFileId) {
        try {
          await storage.deleteFile('6712c9920009f390ec55', student.certificateFileId);
        } catch (error) {
          console.error('Error deleting existing certificate', error);
        }
      }
      
      const generator = new CertificateGenerator({
        student,
        onCertificateGenerated: (fileId) => {
          setStudents(prevStudents =>
            prevStudents.map(s =>
              s.$id === student.$id ? { ...s, certificateFileId: fileId } : s
            )
          );
        }
      });
      
      await generator.generateAndSaveCertificate();
    } catch (error) {
      console.error('Error generating certificate', error);
    } finally {
      setGeneratingCertificates(prev => ({ ...prev, [student.$id]: false }));
    }
  };

  const confirmGenerateCertificate = () => {
    setIsConfirmationModalOpen(false);
    
    console.log('Generate certificate for:', studentToGenerateCertificate);
  };

  const handleViewCertificate = async (student) => {
    try {
      const fileUrl = await storage.getFileView('6712c9920009f390ec55', student.certificateFileId);
      window.open(fileUrl, '_blank');
    } catch (error) {
      console.error('Error viewing certificate', error);
    }
  };

  const handleStudentUpdate = (updatedStudent) => {
    setStudents(prevStudents =>
      prevStudents.map(s =>
        s.$id === updatedStudent.$id ? updatedStudent : s
      )
    );
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone Number</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Course Name</th>
            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {students.map((student) => (
            <motion.tr
              key={student.$id}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm font-medium text-gray-900">{student.name}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">{student.PhoneNumber}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-500">{student.courseName}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => handleViewDetails(student)}
                  className="text-indigo-600 hover:text-indigo-900 mr-2"
                  title="View Student Details"
                >
                  <UserCircleIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => handleEditStudent(student)}
                  className="text-green-600 hover:text-green-900 mr-2"
                  title="Edit Student"
                >
                  <PencilIcon className="h-5 w-5" />
                </button>
                {student.certificateFileId ? (
                  <>
                    <button
                      onClick={() => handleViewCertificate(student)}
                      className="text-blue-600 hover:text-blue-900 mr-2"
                      title="View Certificate"
                    >
                      <DocumentTextIcon className="h-5 w-5" />
                    </button>
                    <button
                      onClick={() => handleGenerateCertificate(student)}
                      className="text-yellow-600 hover:text-yellow-900 mr-2"
                      disabled={generatingCertificates[student.$id]}
                      title="Re-generate Certificate"
                    >
                      {generatingCertificates[student.$id] ? (
                        <svg className="animate-spin h-5 w-5 text-yellow-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                      )}
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => handleGenerateCertificate(student)}
                    className="text-yellow-600 hover:text-yellow-900 mr-2"
                    disabled={generatingCertificates[student.$id]}
                    title="Generate Certificate"
                  >
                    {generatingCertificates[student.$id] ? (
                      <svg className="animate-spin h-5 w-5 text-yellow-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                    ) : (
                      <DocumentIcon className="h-5 w-5" />
                    )}
                  </button>
                )}
                <button
                  onClick={() => handleDelete(student.$id)}
                  className="text-red-600 hover:text-red-900"
                  title="Delete Student"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </td>
            </motion.tr>
          ))}
        </tbody>
      </table>

      <StudentDetailsModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        student={selectedStudent}
      />

      <ConfirmationModal
        isOpen={isConfirmationModalOpen}
        onClose={() => setIsConfirmationModalOpen(false)}
        onConfirm={confirmGenerateCertificate}
        title="Generate Certificate"
        message={`Are you sure you want to generate a certificate for ${studentToGenerateCertificate?.name}?`}
      />

      <EditStudentModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        student={studentToEdit}
        onUpdate={handleStudentUpdate}
      />
    </div>
  );
};

export default StudentList;
