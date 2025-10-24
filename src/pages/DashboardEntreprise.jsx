import React from 'react';

const DashboardEntreprise = () => {
  return (
    <div className="dashboard-entreprise">
      <div className="page-header">
        <h1>Tableau de Bord Entreprise</h1>
        <p>Supervisez vos offres et candidatures</p>
      </div>

      <div className="coming-soon">
        <i className="fas fa-chart-line"></i>
        <h2>Tableau de bord en construction</h2>
        <p>Cette fonctionnalité sera bientôt disponible avec des statistiques avancées.</p>
        
        <div className="features-list">
          <div className="feature-item">
            <i className="fas fa-users"></i>
            <span>Gestion des candidatures</span>
          </div>
          <div className="feature-item">
            <i className="fas fa-chart-pie"></i>
            <span>Statistiques détaillées</span>
          </div>
          <div className="feature-item">
            <i className="fas fa-bell"></i>
            <span>Notifications en temps réel</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardEntreprise;