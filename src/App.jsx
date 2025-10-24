import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Navigation from './components/Navigation';
import Logo from './components/Logo';
import OffersPage from './pages/OffersPage';
import DashboardEntreprise from './pages/DashboardEntreprise';
import CandidaturesList from './components/CandidaturesList';
import AdminOffres from './pages/AdminOffres';
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
    console.log('Recherche globale:', keyword);
  };

  return (
    <Router>
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

        {/* Contenu principal avec routes */}
        <main className="app-main">
          <div className="main-content">
            <Routes>
              {/* Route pour la page des offres */}
              <Route 
                path="/offres" 
                element={<OffersPage />} 
              />
              
              {/* Route pour la gestion des offres admin */}
              <Route 
                path="/admin/offres" 
                element={<AdminOffres />} 
              />
              
              {/* Route pour le tableau de bord entreprise */}
              <Route 
                path="/tableau-de-bord" 
                element={<DashboardEntreprise />} 
              />
              
              {/* Route pour les détails d'une offre */}
              <Route 
                path="/offre/:id" 
                element={<OffreDetailsWrapper />} 
              />
              
              {/* Route pour les candidatures d'une offre */}
              <Route 
                path="/offre/:id/candidatures" 
                element={<CandidaturesList />} 
              />
              
              {/* Route par défaut - redirection vers les offres */}
              <Route 
                path="/" 
                element={<Navigate to="/offres" replace />} 
              />
              
              {/* Route de fallback */}
              <Route 
                path="*" 
                element={<NotFoundPage />} 
              />
            </Routes>
          </div>
        </main>

        {/* Pied de page */}
        <footer className="app-footer">
          <p>© 2024 TalentMatch Platform - Tous droits réservés</p>
        </footer>
      </div>
    </Router>
  );
}

// Composants wrappers pour les routes

const OffreDetailsWrapper = () => {
  return (
    <div className="page-container">
      <div className="page-header">
        <button 
          onClick={() => window.history.back()} 
          className="btn btn-back"
        >
          ← Retour
        </button>
        <h1>Détails de l'offre</h1>
      </div>
      <div className="coming-soon">
        <i className="fas fa-tools"></i>
        <h2>Fonctionnalité en cours de développement</h2>
        <p>La page de détails d'offre sera disponible prochainement.</p>
      </div>
    </div>
  );
};

const NotFoundPage = () => {
  return (
    <div className="not-found-container">
      <div className="not-found-content">
        <div className="error-icon">404</div>
        <h1>Page non trouvée</h1>
        <p>La page que vous recherchez n'existe pas ou a été déplacée.</p>
        <button 
          onClick={() => window.location.href = '/offres'}
          className="btn btn-primary"
        >
          <i className="fas fa-home"></i>
          Retour aux offres
        </button>
      </div>
    </div>
  );
};

export default App;