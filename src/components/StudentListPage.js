import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import StudentList from './StudentList';
import { motion } from 'framer-motion';

import { SearchIcon } from '@heroicons/react/outline';

const StudentListPage = () => {
  const [searchName, setSearchName] = useState('');

  const handleSearch = (e) => {
    setSearchName(e.target.value);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-purple-100">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-indigo-600">ATC</h1>
              </Link>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link to="/dashboard" className="text-gray-500 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out">
                  Dashboard
                </Link>
                <Link to="/students" className="text-indigo-600 hover:text-indigo-700 px-3 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out">
                  Student List
                </Link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="py-10"
      >
        <header>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h1 className="text-4xl font-extrabold text-gray-900 mb-4">
              Student Directory
            </h1>
            <p className="text-xl text-gray-600">
              Search and manage your student records efficiently.
            </p>
          </div>
        </header>
        <main className="mt-10">
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="mb-8">
              <div className="relative rounded-md shadow-sm">
                <input
                  type="text"
                  value={searchName}
                  onChange={handleSearch}
                  placeholder="Search by student name"
                  className="focus:ring-indigo-500 focus:border-indigo-500 block w-full pl-10 pr-12 sm:text-sm border-gray-300 rounded-lg h-12"
                />
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <SearchIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
                </div>
              </div>
            </div>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="bg-white shadow-lg rounded-lg overflow-hidden"
            >
              <StudentList searchName={searchName} />
            </motion.div>
          </div>
        </main>
      </motion.div>
    </div>
  );
};

export default StudentListPage;
