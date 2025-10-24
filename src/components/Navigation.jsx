import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

const Navigation = ({ activeMenu, onMenuChange, icons, onSearch }) => {
  const [localSearch, setLocalSearch] = useState('');
  const navigate = useNavigate();
  const location = useLocation();

  const handleSearchChange = (e) => {
    const value = e.target.value;
    setLocalSearch(value);
    onSearch(value);
  };

  const handleMenuClick = (menu) => {
    onMenuChange(menu);
    // Navigation vers la route correspondante
    if (menu === 'offers') {
      navigate('/offres');
    } else if (menu === 'dashboard') {
      navigate('/tableau-de-bord');
    }
  };

  return (
    <nav className="main-navigation">
      <div className="nav-items">
        <button 
          className={`nav-item ${activeMenu === 'offers' ? 'active' : ''}`}
          onClick={() => handleMenuClick('offers')}
        >
          📋 Offres d'emploi
        </button>
        
        <button 
          className={`nav-item ${activeMenu === 'dashboard' ? 'active' : ''}`}
          onClick={() => handleMenuClick('dashboard')}
        >
          📊 Tableau de bord
        </button>
      </div>
      
      <div className="nav-search">
        <input
          type="text"
          placeholder="Rechercher..."
          value={localSearch}
          onChange={handleSearchChange}
          className="search-input"
        />
      </div>
    </nav>
  );
};

export default Navigation;