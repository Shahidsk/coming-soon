import React, { useState } from 'react';
import { databases, ID } from '../appwrite';
import SuccessModal from './SuccessModal';
import { motion } from 'framer-motion';

const StudentForm = ({ onStudentAdded }) => {
  const [name, setName] = useState('');
  
  const [courseName, setCourseName] = useState('');
  const [courseDuration, setCourseDuration] = useState('');
  
  const [fathersName, setFathersName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [age, setAge] = useState(0);
  const [idNumber, setIdNumber] = useState('');
  const [address, setAddress] = useState('');
  const [nidNumber, setNidNumber] = useState('');
  const [admissionDate, setAdmissionDate] = useState('');
  const [showModal, setShowModal] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await databases.createDocument(
        '6712ba950038c0ce021e',
        '6712baa70033ebb43466',
        ID.unique(),
        {
          name,
          courseName,
          courseDuration,
          Fathers_Name: fathersName,
          PhoneNumber: phoneNumber,
          Age: parseInt(age, 10), // Convert age to integer
          IdNumber: idNumber,
          Address: address,
          NidNumber: nidNumber,
          AdmissionDate: admissionDate,
        }
      );
      onStudentAdded(response);
      setShowModal(true);
      // Reset form
      setName('');
     
      setCourseName('');
      setCourseDuration('');
     
      setFathersName('');
      setPhoneNumber('');
      setAge(0);
      setIdNumber('');
      setAddress('');
      setNidNumber('');
      setAdmissionDate('');
    } catch (error) {
      console.error('Error adding student', error);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white shadow-lg rounded-lg overflow-hidden"
    >
      <div className="px-6 py-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">Add New Student</h3>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 gap-y-6 gap-x-4 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label htmlFor="fathersName" className="block text-sm font-medium text-gray-700">
                Father's Name
              </label>
              <input
                type="text"
                name="fathersName"
                id="fathersName"
                value={fathersName}
                onChange={(e) => setFathersName(e.target.value)}
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="tel"
                name="phoneNumber"
                id="phoneNumber"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label htmlFor="age" className="block text-sm font-medium text-gray-700">
                Age
              </label>
              <input
                type="number"
                name="age"
                id="age"
                min="0"
                value={age}
                onChange={(e) => setAge(parseInt(e.target.value) || 0)}
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label htmlFor="idNumber" className="block text-sm font-medium text-gray-700">
                ID Number
              </label>
              <input
                type="text"
                name="idNumber"
                id="idNumber"
                value={idNumber}
                onChange={(e) => setIdNumber(e.target.value)}
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <input
                type="text"
                name="address"
                id="address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label htmlFor="nidNumber" className="block text-sm font-medium text-gray-700">
                NID Number
              </label>
              <input
                type="text"
                name="nidNumber"
                id="nidNumber"
                value={nidNumber}
                onChange={(e) => setNidNumber(e.target.value)}
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label htmlFor="admissionDate" className="block text-sm font-medium text-gray-700">
                Admission Date
              </label>
              <input
                type="date"
                name="admissionDate"
                id="admissionDate"
                value={admissionDate}
                onChange={(e) => setAdmissionDate(e.target.value)}
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              />
            </div>
         
            <div>
              <label htmlFor="courseName" className="block text-sm font-medium text-gray-700">
                Course Name
              </label>
              <input
                type="text"
                name="courseName"
                id="courseName"
                value={courseName}
                onChange={(e) => setCourseName(e.target.value)}
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label htmlFor="courseDuration" className="block text-sm font-medium text-gray-700">
                Course Duration
              </label>
              <input
                type="text"
                name="courseDuration"
                id="courseDuration"
                value={courseDuration}
                onChange={(e) => setCourseDuration(e.target.value)}
                className="mt-1 focus:ring-indigo-500 focus:border-indigo-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
              />
            </div>
           
          </div>
          <div className="flex justify-end">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
            >
              Add Student
            </motion.button>
          </div>
        </form>
      </div>
      <SuccessModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        message="Student added successfully!"
      />
    </motion.div>
  );
};

export default StudentForm;
