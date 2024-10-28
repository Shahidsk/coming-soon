import React, { useEffect, useState } from 'react';
import { account } from '../appwrite';
import { useNavigate, Link } from 'react-router-dom';
import StudentForm from './StudentForm';
import { motion } from 'framer-motion';
import { UserCircleIcon, LogoutIcon, AcademicCapIcon, UserGroupIcon } from '@heroicons/react/outline';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = async () => {
      try {
        const currentUser = await account.get();
        setUser(currentUser);
      } catch (error) {
        navigate('/');
      }
    };
    checkUser();
  }, [navigate]);

  const handleLogout = async () => {
    await account.deleteSession('current');
    navigate('/');
  };

  if (!user) {
    return (
      <div className="flex items-center justify-center h-screen bg-gradient-to-r from-blue-500 to-indigo-600">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-white"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <Link to="/" className="flex-shrink-0">
                <h1 className="text-2xl font-bold text-indigo-600">ATC</h1>
              </Link>
              <div className="hidden sm:ml-6 sm:flex sm:space-x-8">
                <Link to="/dashboard" className="text-gray-900 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out flex items-center">
                  <AcademicCapIcon className="h-5 w-5 mr-1" />
                  Dashboard
                </Link>
                <Link to="/students" className="text-gray-500 hover:text-indigo-600 px-3 py-2 rounded-md text-sm font-medium transition duration-150 ease-in-out flex items-center">
                  <UserGroupIcon className="h-5 w-5 mr-1" />
                  Student List
                </Link>
              </div>
            </div>
            <div className="flex items-center">
              <button
                onClick={handleLogout}
                className="ml-3 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ease-in-out"
              >
                <LogoutIcon className="h-5 w-5 mr-1" />
                Logout
              </button>
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
            <div className="flex items-center">
              <UserCircleIcon className="h-12 w-12 text-indigo-600 mr-4" />
              <h1 className="text-3xl font-extrabold text-gray-900">
                Welcome, {user.name}
              </h1>
            </div>
          </div>
        </header>
        <main className="mt-10">
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="bg-white shadow-lg rounded-lg overflow-hidden"
            >
              <div className="p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-4">Add New Student</h2>
                <StudentForm onStudentAdded={() => {}} />
              </div>
            </motion.div>
          </div>
        </main>
      </motion.div>
    </div>
  );
};

export default Dashboard;
