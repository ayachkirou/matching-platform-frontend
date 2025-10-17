import React, { useState } from 'react';
import Navigation from './components/Navigation';
import Logo from './components/Logo';
import OffersPage from './pages/OffersPage';

import './App.css';

const icons = {
  notification: '🔔',
  user: '👤'
};

function App() {
  const [activeMenu, setActiveMenu] = useState('offers');

  const handleMenuChange = (menu) => {
    setActiveMenu(menu);
  };

  const handleSearch = (keyword) => {
    // La recherche est maintenant gérée dans les pages individuelles
    console.log('Recherche globale:', keyword);
  };

  // Fonction pour rendre le contenu principal selon le menu actif
  const renderMainContent = () => {
    switch (activeMenu) {
      case 'offers':
        return <OffersPage />;
      
      default:
        return <OffersPage />;
    }
  };

  return (
    <div className="app-container">
      {/* En-tête de l'application */}
      <header className="app-header ae-tech-header">
        <div className="header-main">
          <div className="logo-nav-container">
            <Logo />
            <Navigation 
              activeMenu={activeMenu} 
              onMenuChange={handleMenuChange} 
              icons={icons}
              onSearch={handleSearch}
            />
          </div>
          
          {/* Actions utilisateur */}
          <div className="header-actions">
            <button className="notification-btn">
              {icons.notification}
            </button>
            
            <div className="user-profile">
              <span className="user-avatar">{icons.user}</span>
              <span className="user-name">Admin</span>
            </div>
          </div>
        </div>
      </header>

      {/* Contenu principal */}
      <main className="app-main">
        <div className="main-content">
          {renderMainContent()}
        </div>
      </main>

      {/* Pied de page */}
      <footer className="app-footer">
        <p>© 2024 TalentMatch Platform - Tous droits réservés</p>
      </footer>
    </div>
  );
}

export default App;