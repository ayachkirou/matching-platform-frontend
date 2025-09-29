import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import OffersPage from './pages/OffersPage';
import StudentProfile from './pages/StudentProfile';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<OffersPage />} />
          <Route path="/offers" element={<OffersPage />} />
          <Route path="/profile" element={<StudentProfile />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;