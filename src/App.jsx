import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import OffersSection from './components/OffersSection'; // PAS besoin d'importer Hero ici
import './index.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        {/* Hero est déjà inclus dans OffersSection */}
        <Route path="/" element={<OffersSection />} />
      </Routes>
    </Router>
  );
}

export default App;
