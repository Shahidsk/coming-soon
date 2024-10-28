import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XIcon } from '@heroicons/react/outline';

const StudentDetailsModal = ({ isOpen, onClose, student }) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  if (!isOpen || !student) return null;

  const stopPropagation = (e) => e.stopPropagation();

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          onClick={stopPropagation}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-lg w-full overflow-hidden relative"
        >
          <div className="p-6 sm:p-8">
            <button
              onClick={onClose}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <XIcon className="h-6 w-6" />
            </button>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">Student Details</h3>
            <div className="space-y-6">
              {Object.entries(student).map(([key, value]) => (
                !['$id', '$createdAt', '$updatedAt', '$permissions', '$collectionId', '$databaseId'].includes(key) && (
                  <div key={key} className="flex flex-col sm:flex-row sm:justify-between">
                    <dt className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1 sm:mb-0">{key}</dt>
                    <dd className="text-sm text-gray-900 dark:text-gray-200 font-semibold">{value}</dd>
                  </div>
                )
              ))}
            </div>
          </div>
          <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 sm:px-8 sm:py-6">
            <button
              type="button"
              className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default StudentDetailsModal;
