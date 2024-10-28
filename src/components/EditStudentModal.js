import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { XIcon } from '@heroicons/react/outline';
import { databases } from '../appwrite';

const EditStudentModal = ({ isOpen, onClose, student, onUpdate }) => {
  const [formData, setFormData] = useState({
    name: '',
    courseName: '',
    courseDuration: '',
    Fathers_Name: '',
    PhoneNumber: '',
    Age: 0,
    IdNumber: '',
    Address: '',
    NidNumber: '',
    AdmissionDate: ''
  });

  useEffect(() => {
    if (student) {
      setFormData({
        name: student.name || '',
        courseName: student.courseName || '',
        courseDuration: student.courseDuration || '',
        Fathers_Name: student.Fathers_Name || '',
        PhoneNumber: student.PhoneNumber || '',
        Age: student.Age || 0,
        IdNumber: student.IdNumber || '',
        Address: student.Address || '',
        NidNumber: student.NidNumber || '',
        AdmissionDate: student.AdmissionDate || ''
      });
    }
  }, [student]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'Age' ? parseInt(value) || 0 : value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await databases.updateDocument(
        '6712ba950038c0ce021e',
        '6712baa70033ebb43466',
        student.$id,
        formData
      );
      onUpdate({ ...student, ...formData });
      onClose();
    } catch (error) {
      console.error('Error updating student:', error);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4"
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl max-w-2xl w-full overflow-hidden"
        >
          <div className="p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Edit Student Information</h2>
              <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <XIcon className="h-6 w-6" />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(formData).map(([key, value]) => (
                <div key={key} className="flex flex-col">
                  <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    {key.replace(/_/g, ' ')}
                  </label>
                  {key === 'AdmissionDate' ? (
                    <input
                      type="date"
                      name={key}
                      value={value}
                      onChange={handleChange}
                      className="form-input rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  ) : key === 'Age' ? (
                    <input
                      type="number"
                      name={key}
                      value={value}
                      onChange={handleChange}
                      className="form-input rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  ) : (
                    <input
                      type="text"
                      name={key}
                      value={value}
                      onChange={handleChange}
                      className="form-input rounded-lg border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                    />
                  )}
                </div>
              ))}
              
              <div className="col-span-full flex justify-end gap-4 mt-6">
                <button
                  type="button"
                  onClick={onClose}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EditStudentModal;