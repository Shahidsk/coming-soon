import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import StudentSearch from './components/StudentSearch';
import StudentListPage from './components/StudentListPage';

function App() {
  return (
    <Router>
      <Routes basename='https://ashuganjtrainingcenter.com/'>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/verify" element={<StudentSearch />} />
        <Route path="/students" element={<StudentListPage />} />
      </Routes>
    </Router>
  );
}

export default App;
