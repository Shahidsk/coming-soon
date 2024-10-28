import React, { useState } from 'react';
import { databases, storage } from '../appwrite';
import { Query } from 'appwrite';
import { motion, AnimatePresence } from 'framer-motion';
import { SearchIcon, DocumentTextIcon } from '@heroicons/react/outline';

const StudentSearch = () => {
  const [searchName, setSearchName] = useState('');
  const [student, setStudent] = useState(null);
  const [error, setError] = useState('');

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!searchName.trim()) {
      setError('Please enter a student name');
      return;
    }
    try {
      const response = await databases.listDocuments(
        '6712ba950038c0ce021e',
        '6712baa70033ebb43466',
        [Query.search('name', searchName)]
      );
      if (response.documents.length > 0) {
        setStudent(response.documents[0]);
        setError('');
      } else {
        setStudent(null);
        setError('No student found with this name');
      }
    } catch (error) {
      console.error('Error searching for student', error);
      setError('An error occurred while searching');
    }
  };

  const handleViewCertificate = async (student) => {
    try {
      const fileUrl = await storage.getFileView('6712c9920009f390ec55', student.certificateFileId);
      window.open(fileUrl, '_blank');
    } catch (error) {
      console.error('Error viewing certificate', error);
      setError('Error viewing certificate');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900">Search Student</h2>
          <p className="mt-2 text-sm text-gray-600">
            Enter student name to view their details
          </p>
        </div>

        <form onSubmit={handleSearch} className="mb-8">
          <div className="relative rounded-md shadow-sm">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <SearchIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </div>
            <input
              type="text"
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              placeholder="Enter student name"
              className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 pr-12 sm:text-sm border-gray-300 rounded-lg h-12"
            />
          </div>
          <button
            type="submit"
            className="mt-4 w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Search
          </button>
        </form>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="rounded-md bg-red-50 p-4 mb-4"
          >
            <p className="text-sm text-red-700">{error}</p>
          </motion.div>
        )}

        <AnimatePresence>
          {student && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="bg-white rounded-2xl shadow-xl overflow-hidden"
            >
              <div className="px-6 py-5 border-b border-gray-200">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-semibold text-gray-900">Student Information</h3>
                  {student.certificateFileId && (
                    <button
                      onClick={() => handleViewCertificate(student)}
                      className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      <DocumentTextIcon className="h-5 w-5 mr-2" />
                      View Certificate
                    </button>
                  )}
                </div>
              </div>
              <div className="px-6 py-6">
                <div className="space-y-6">
                  {Object.entries(student).map(([key, value]) => (
                    !['$id', '$createdAt', '$updatedAt', '$permissions', '$collectionId', '$databaseId', 'certificateFileId'].includes(key) && (
                      <div key={key} className="flex flex-col sm:flex-row sm:justify-between border-b border-gray-100 pb-4">
                        <dt className="text-sm font-medium text-gray-500 capitalize">{key.replace(/([A-Z])/g, ' $1').trim()}</dt>
                        <dd className="mt-1 text-sm text-gray-900 font-semibold sm:mt-0">{value}</dd>
                      </div>
                    )
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default StudentSearch;
