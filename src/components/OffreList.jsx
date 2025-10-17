import React, { useState, useEffect } from 'react';

const OffreList = ({ offres, loading, onEdit, onDelete, onView }) => {
  // États pour la recherche et le filtrage
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filteredOffres, setFilteredOffres] = useState(offres);

  // Filtrage automatique quand offres ou critères changent
  useEffect(() => {
    let result = offres;
    
    // Filtre par recherche
    if (searchTerm.trim()) {
      result = result.filter(offre =>
        offre.titre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        offre.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        offre.localisation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        offre.competencesRequises?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // Filtre par type
    if (filterType !== 'all') {
      result = result.filter(offre => offre.typeOffre === filterType);
    }
    
    setFilteredOffres(result);
  }, [offres, searchTerm, filterType]);

  // Fonction de recherche
  const handleSearch = (keyword) => {
    setSearchTerm(keyword);
  };

  // Fonction de filtrage par type
  const handleFilterByType = (type) => {
    setFilterType(type);
  };

  // Formatage de la date
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'N/A';
      
      return date.toLocaleDateString('fr-FR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch (error) {
      console.error('Erreur format date:', error);
      return 'N/A';
    }
  };

  // Classes et icônes pour les badges
  const getTypeBadgeClass = (type) => {
    return type === 'stage' ? 'badge-stage' : 'badge-emploi';
  };

  const getTypeIcon = (type) => {
    return type === 'stage' ? 'graduation-cap' : 'briefcase';
  };

  // Truncate text for display
  const truncateText = (text, maxLength) => {
    if (!text) return 'Non spécifié';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  if (loading) {
    return (
      <div className="card">
        <div className="text-center py-8">
          <div className="loading-spinner"></div>
          <p className="text-primary mt-4">Chargement des offres...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="offre-container">
      {/* En-tête avec recherche et filtres */}
      <div className="card filter-card">
        <div className="filter-header">
          <h2><i className="fas fa-filter"></i> Filtres et Recherche</h2>
        </div>
        <div className="filter-content">
          <div className="search-box">
            <i className="search-icon fas fa-search"></i>
            <input
              type="text"
              placeholder="Rechercher par titre, description, localisation ou compétences..."
              value={searchTerm}
              onChange={(e) => handleSearch(e.target.value)}
              className="search-input"
            />
          </div>
          
          <div className="filter-options">
            <div className="filter-group">
              <span className="filter-label"><i className="fas fa-tag"></i> Filtrer par type :</span>
              <div className="filter-buttons">
                <button 
                  className={`filter-btn ${filterType === 'all' ? 'active' : ''}`}
                  onClick={() => handleFilterByType('all')}
                >
                  <i className="fas fa-layer-group"></i> Toutes
                </button>
                <button 
                  className={`filter-btn ${filterType === 'CDI' ? 'active' : ''}`}
                  onClick={() => handleFilterByType('CDI')}
                >
                  <i className="fas fa-briefcase"></i> CDI
                </button>
                <button 
                  className={`filter-btn ${filterType === 'CDD' ? 'active' : ''}`}
                  onClick={() => handleFilterByType('CDD')}
                >
                  <i className="fas fa-file-contract"></i> CDD
                </button>
                <button 
                  className={`filter-btn ${filterType === 'stage' ? 'active' : ''}`}
                  onClick={() => handleFilterByType('stage')}
                >
                  <i className="fas fa-graduation-cap"></i> Stages
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Liste des offres */}
      <div className="card">
        <div className="card-header">
          <h2 className="card-title">
            <i className="fas fa-list"></i> {filteredOffres.length} offre(s) trouvée(s)
          </h2>
        </div>
        
        <div className="table-container">
          <table className="modern-table">
            <thead>
              <tr>
                <th>Titre</th>
                <th>Type</th>
                <th>Localisation</th>
                <th>Compétences</th>
                <th>Date publication</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredOffres.map((offre) => (
                <tr key={offre.id} className="table-row">
                  <td>
                    <div className="offre-title">
                      <strong>{offre.titre || 'Sans titre'}</strong>
                      <p className="offre-desc">{truncateText(offre.description, 60)}</p>
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${getTypeBadgeClass(offre.typeOffre)}`}>
                      <i className={`fas fa-${getTypeIcon(offre.typeOffre)}`}></i> 
                      {offre.typeOffre?.toUpperCase() || 'N/A'}
                    </span>
                  </td>
                  <td>
                    <span className="location">
                      <i className="fas fa-map-marker-alt"></i> {offre.localisation || 'Non spécifié'}
                    </span>
                  </td>
                  <td>
                    <div className="competences">
                      <span className="competences-text">
                        {truncateText(offre.competencesRequises, 50)}
                      </span>
                    </div>
                  </td>
                  <td>
                    <span className="date">
                      <i className="fas fa-calendar-alt"></i> 
                      {formatDate(offre.datePublication)}
                    </span>
                  </td>
                  <td>
                    <div className="action-buttons">
                      <button
                        onClick={() => onView(offre)}
                        className="btn btn-secondary btn-sm"
                        title="Voir les détails"
                      >
                        <i className="fas fa-eye"></i> Voir
                      </button>
                      <button
                        onClick={() => onEdit(offre)}
                        className="btn btn-primary btn-sm"
                        title="Modifier"
                      >
                        <i className="fas fa-edit"></i> Modifier
                      </button>
                      <button
                        onClick={() => onDelete(offre.id)}
                        className="btn btn-danger btn-sm"
                        title="Supprimer"
                      >
                        <i className="fas fa-trash"></i> Supprimer
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {filteredOffres.length === 0 && !loading && (
            <div className="empty-state">
              <div className="empty-icon"><i className="fas fa-inbox"></i></div>
              <h3>Aucune offre trouvée</h3>
              <p>
                {searchTerm || filterType !== 'all' 
                  ? 'Aucune offre ne correspond à vos critères de recherche' 
                  : 'Aucune offre disponible pour le moment'
                }
              </p>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        :root {
          --primary-color: #397627;
          --primary-light: #e9f5e5;
          --primary-dark: #2c5e1e;
          --text-color: #333;
          --text-light: #666;
          --border-color: #e0e0e0;
          --bg-light: #f9f9f9;
          --shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
        }
        
        .offre-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 20px;
        }
        
        .card {
          background: white;
          border-radius: 12px;
          box-shadow: var(--shadow);
          overflow: hidden;
          margin-bottom: 24px;
        }
        
        .filter-card {
          margin-bottom: 30px;
        }
        
        .filter-header {
          padding: 16px 24px;
          border-bottom: 1px solid var(--border-color);
          background-color: var(--primary-light);
        }
        
        .filter-header h2 {
          font-size: 1.25rem;
          font-weight: 600;
          color: var(--primary-dark);
          margin: 0;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .filter-content {
          padding: 20px 24px;
        }
        
        .search-box {
          position: relative;
          margin-bottom: 20px;
        }
        
        .search-icon {
          position: absolute;
          left: 16px;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-light);
        }
        
        .search-input {
          width: 100%;
          padding: 12px 16px 12px 48px;
          border: 1px solid var(--border-color);
          border-radius: 8px;
          font-size: 1rem;
          transition: border-color 0.2s;
        }
        
        .search-input:focus {
          outline: none;
          border-color: var(--primary-color);
          box-shadow: 0 0 0 3px rgba(57, 118, 39, 0.1);
        }
        
        .filter-options {
          display: flex;
          flex-wrap: wrap;
          gap: 20px;
        }
        
        .filter-group {
          display: flex;
          align-items: center;
          gap: 12px;
        }
        
        .filter-label {
          font-weight: 500;
          color: var(--text-color);
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .filter-buttons {
          display: flex;
          gap: 8px;
        }
        
        .filter-btn {
          padding: 8px 16px;
          border: 1px solid var(--border-color);
          border-radius: 6px;
          background: white;
          color: var(--text-light);
          font-size: 0.9rem;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          gap: 8px;
        }
        
        .filter-btn:hover {
          border-color: var(--primary-color);
          color: var(--primary-color);
        }
        
        .filter-btn.active {
          background-color: var(--primary-color);
          border-color: var(--primary-color);
          color: white;
        }
        
        .card-header {
          padding: 20px 24px;
          border-bottom: 1px solid var(--border-color);
          background-color: var(--primary-light);
        }
        
        .card-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: var(--primary-color);
          margin: 0;
          display: flex;
          align-items: center;
          gap: 10px;
        }
        
        .loading-spinner {
          width: 48px;
          height: 48px;
          border: 4px solid var(--primary-light);
          border-top: 4px solid var(--primary-color);
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        .text-center {
          text-align: center;
        }
        
        .py-8 {
          padding-top: 32px;
          padding-bottom: 32px;
        }
        
        .table-container {
          overflow-x: auto;
        }
        
        .modern-table {
          width: 100%;
          border-collapse: collapse;
        }
        
        .modern-table th {
          background-color: var(--primary-light);
          color: var(--primary-dark);
          font-weight: 600;
          text-align: left;
          padding: 16px;
          font-size: 0.9rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .modern-table td {
          padding: 16px;
          border-bottom: 1px solid var(--border-color);
        }
        
        .table-row:hover {
          background-color: var(--primary-light);
          transition: background-color 0.2s ease;
        }
        
        .offre-title strong {
          color: var(--text-color);
          font-size: 1.05rem;
          display: block;
          margin-bottom: 4px;
        }
        
        .offre-desc {
          color: var(--text-light);
          font-size: 0.9rem;
          line-height: 1.4;
        }
        
        .badge {
          display: inline-flex;
          align-items: center;
          padding: 6px 12px;
          border-radius: 50px;
          font-size: 0.8rem;
          font-weight: 500;
          gap: 6px;
          white-space: nowrap;
        }
        
        .badge-stage {
          background-color: #e6f4ea;
          color: #137333;
        }
        
        .badge-emploi {
          background-color: #e8f0fe;
          color: #1967d2;
        }
        
        .location, .date {
          font-size: 0.9rem;
          color: var(--text-light);
          display: flex;
          align-items: center;
          gap: 6px;
          white-space: nowrap;
        }
        
        .competences {
          max-width: 200px;
        }
        
        .competences-text {
          font-size: 0.9rem;
          color: var(--text-light);
          line-height: 1.4;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        
        .action-buttons {
          display: flex;
          gap: 8px;
        }
        
        .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 8px 12px;
          border: none;
          border-radius: 6px;
          font-size: 0.85rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          gap: 6px;
          white-space: nowrap;
        }
        
        .btn-sm {
          padding: 6px 10px;
          font-size: 0.8rem;
        }
        
        .btn-primary {
          background-color: var(--primary-color);
          color: white;
        }
        
        .btn-primary:hover {
          background-color: var(--primary-dark);
        }
        
        .btn-secondary {
          background-color: #f1f3f4;
          color: var(--text-color);
        }
        
        .btn-secondary:hover {
          background-color: #e8eaed;
        }
        
        .btn-danger {
          background-color: #fce8e6;
          color: #c5221f;
        }
        
        .btn-danger:hover {
          background-color: #fad2cf;
        }
        
        .empty-state {
          text-align: center;
          padding: 48px 24px;
        }
        
        .empty-icon {
          font-size: 3rem;
          margin-bottom: 16px;
          color: var(--text-light);
        }
        
        .empty-state h3 {
          font-size: 1.25rem;
          margin-bottom: 8px;
          color: var(--text-light);
        }
        
        .empty-state p {
          color: var(--text-light);
        }
        
        /* Responsive */
        @media (max-width: 768px) {
          .offre-container {
            padding: 10px;
          }
          
          .filter-group {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }
          
          .filter-buttons {
            width: 100%;
            flex-wrap: wrap;
          }
          
          .filter-btn {
            flex: 1;
            min-width: 120px;
            text-align: center;
            justify-content: center;
          }
          
          .modern-table {
            display: block;
          }
          
          .modern-table thead {
            display: none;
          }
          
          .modern-table tbody, .modern-table tr, .modern-table td {
            display: block;
            width: 100%;
          }
          
          .modern-table tr {
            margin-bottom: 16px;
            border: 1px solid var(--border-color);
            border-radius: 8px;
            padding: 12px;
          }
          
          .modern-table td {
            padding: 12px;
            border: none;
            position: relative;
            padding-left: 40%;
          }
          
          .modern-table td:before {
            content: attr(data-label);
            position: absolute;
            left: 12px;
            width: 40%;
            padding-right: 12px;
            font-weight: 600;
            text-align: left;
            color: var(--text-color);
          }
          
          .action-buttons {
            flex-wrap: wrap;
            justify-content: center;
          }
          
          .btn {
            flex: 1;
            min-width: 80px;
          }
        }
      `}</style>
    </div>
  );
};

export default OffreList;