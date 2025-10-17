import React from 'react';

const Navigation = ({ activeMenu, onMenuChange, icons }) => {
  return (
    <nav className="navigation">
      <ul className="nav-list">
        <li className="nav-item">
          <a 
            href="#offers" 
            className={`nav-link ${activeMenu === 'offers' ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              onMenuChange('offers');
            }}
          >
            {icons.briefcase}
            <span>Offres</span>
          </a>
        </li>
        <li className="nav-item">
          <a 
            href="#dashboard" 
            className={`nav-link ${activeMenu === 'dashboard' ? 'active' : ''}`}
            onClick={(e) => {
              e.preventDefault();
              onMenuChange('dashboard');
            }}
          >
            {icons.dashboard}
            <span>Tableau de bord</span>
          </a>
        </li>
      </ul>
    </nav>
  );
};

export default Navigation;