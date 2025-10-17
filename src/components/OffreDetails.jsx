import React from 'react';

const OffreDetails = ({ offre, onBack, onEdit, onDelete }) => {
  if (!offre) {
    return (
      <div className="card">
        <div className="empty-state">
          <div className="empty-icon">
            <i className="fas fa-file-alt"></i>
          </div>
          <h3>Aucune offre sélectionnée</h3>
          <p>Veuillez sélectionner une offre à afficher</p>
        </div>
      </div>
    );
  }

  const formatDate = (dateString) => {
    if (!dateString) return 'Non spécifiée';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Date invalide';
      
      return date.toLocaleDateString('fr-FR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch (error) {
      console.error('Erreur format date:', error);
      return 'N/A';
    }
  };

  const getTypeBadgeClass = (type) => {
    const typeMap = {
      'stage': 'badge-stage',
      'CDI': 'badge-cdi',
      'CDD': 'badge-cdd',
      'alternance': 'badge-alternance'
    };
    return typeMap[type] || 'badge-emploi';
  };

  const getTypeIcon = (type) => {
    const iconMap = {
      'stage': 'graduation-cap',
      'CDI': 'briefcase',
      'CDD': 'file-contract',
      'alternance': 'user-graduate'
    };
    return iconMap[type] || 'briefcase';
  };

  return (
    <div className="offre-details-container">
      {/* Header avec boutons d'action */}
      <div className="details-header">
        <button onClick={onBack} className="btn btn-back">
          <i className="fas fa-arrow-left"></i>
          Retour à la liste
        </button>
        <div className="action-buttons">
          <button onClick={() => onEdit(offre)} className="btn btn-edit">
            <i className="fas fa-edit"></i>
            Modifier
          </button>
          <button onClick={() => onDelete(offre.id)} className="btn btn-delete">
            <i className="fas fa-trash"></i>
            Supprimer
          </button>
        </div>
      </div>

      {/* Carte principale des détails */}
      <div className="details-card">
        {/* En-tête avec titre et métadonnées */}
        <div className="card-header">
          <div className="title-section">
            <div className="title-content">
              <h1>{offre.titre}</h1>
              <span className={`badge ${getTypeBadgeClass(offre.typeOffre)}`}>
                <i className={`fas fa-${getTypeIcon(offre.typeOffre)}`}></i>
                {offre.typeOffre?.toUpperCase() || 'N/A'}
              </span>
            </div>
          </div>
          
          <div className="meta-grid">
            <div className="meta-item">
              <div className="meta-icon">
                <i className="fas fa-map-marker-alt"></i>
              </div>
              <div className="meta-content">
                <span className="meta-label">Localisation</span>
                <span className="meta-value">{offre.localisation || 'Non spécifiée'}</span>
              </div>
            </div>
            
            <div className="meta-item">
              <div className="meta-icon">
                <i className="fas fa-calendar-plus"></i>
              </div>
              <div className="meta-content">
                <span className="meta-label">Publiée le</span>
                <span className="meta-value">{formatDate(offre.datePublication)}</span>
              </div>
            </div>
            
            <div className="meta-item">
              <div className="meta-icon">
                <i className="fas fa-calendar-check"></i>
              </div>
              <div className="meta-content">
                <span className="meta-label">Modifiée le</span>
                <span className="meta-value">{formatDate(offre.dateModification)}</span>
              </div>
            </div>
            
            <div className="meta-item">
              <div className="meta-icon">
                <i className="fas fa-building"></i>
              </div>
              <div className="meta-content">
                <span className="meta-label">Entreprise</span>
                <span className="meta-value">ID: {offre.companyId}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Contenu détaillé */}
        <div className="card-content">
          {/* Section Description */}
          <div className="content-section">
            <div className="section-header">
              <div className="section-icon">
                <i className="fas fa-file-alt"></i>
              </div>
              <h2>Description du poste</h2>
            </div>
            <div className="section-content">
              <p className="description-text">{offre.description}</p>
            </div>
          </div>

          {/* Section Compétences Requises */}
          <div className="content-section">
            <div className="section-header">
              <div className="section-icon">
                <i className="fas fa-tools"></i>
              </div>
              <h2>Compétences Requises</h2>
            </div>
            <div className="section-content">
              {offre.competencesRequises ? (
                <div className="competences-grid">
                  {offre.competencesRequises.split(',').map((competence, index) => (
                    <span key={index} className="competence-tag">
                      <i className="fas fa-check"></i>
                      {competence.trim()}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="no-data">Aucune compétence spécifiée</p>
              )}
            </div>
          </div>

          {/* Section Informations de Publication */}
          <div className="content-section highlight">
            <div className="section-header">
              <div className="section-icon">
                <i className="fas fa-info-circle"></i>
              </div>
              <h2>Informations de Publication</h2>
            </div>
            <div className="section-content">
              <div className="info-grid">
                <div className="info-item">
                  <div className="info-label">
                    <i className="fas fa-calendar-plus"></i>
                    Date de publication
                  </div>
                  <div className="info-value">{formatDate(offre.datePublication)}</div>
                </div>
                <div className="info-item">
                  <div className="info-label">
                    <i className="fas fa-calendar-check"></i>
                    Dernière modification
                  </div>
                  <div className="info-value">{formatDate(offre.dateModification)}</div>
                </div>
                <div className="info-item">
                  <div className="info-label">
                    <i className="fas fa-tag"></i>
                    Type d'offre
                  </div>
                  <div className="info-value">
                    <span className={`type-badge ${getTypeBadgeClass(offre.typeOffre)}`}>
                      {offre.typeOffre?.toUpperCase() || 'N/A'}
                    </span>
                  </div>
                </div>
                <div className="info-item">
                  <div className="info-label">
                    <i className="fas fa-map-marker-alt"></i>
                    Localisation
                  </div>
                  <div className="info-value">{offre.localisation || 'Non spécifiée'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .offre-details-container {
          max-width: 1000px;
          margin: 0 auto;
          padding: 24px;
        }
        
        .details-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 32px;
          gap: 20px;
        }
        
        .btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          padding: 12px 24px;
          border: none;
          border-radius: 12px;
          font-size: 0.95rem;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          gap: 10px;
          text-decoration: none;
          box-shadow: 0 4px 14px rgba(0, 0, 0, 0.1);
        }
        
        .btn-back {
          background:white;
          color: rgba(57, 118, 39, 1);
        }
        
        .btn-back:hover {
          background:#397627;
          color: white;
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(57, 118, 39, 1);
        }
        
        .btn-edit {
          background: linear-gradient(135deg, #397627 0%, #2c5e1e 100%);
          color: white;
        }
        
        .btn-edit:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(57, 118, 39, 0.4);
        }
        
        .btn-delete {
          background: linear-gradient(135deg, #ff6b6b 0%, #ee5a52 100%);
          color: white;
        }
        
        .btn-delete:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 25px rgba(255, 107, 107, 0.4);
        }
        
        .action-buttons {
          display: flex;
          gap: 12px;
        }
        
        .details-card {
          background: white;
          border-radius: 20px;
          box-shadow: 
            0 10px 40px rgba(0, 0, 0, 0.08),
            0 1px 3px rgba(0, 0, 0, 0.05);
          overflow: hidden;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
        
        .card-header {
          padding: 40px;
          background: linear-gradient(135deg, #f8f9ff 0%, #f0f2ff 100%);
          border-bottom: 1px solid rgba(0, 0, 0, 0.05);
          position: relative;
        }
        
        .card-header::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(135deg, #397627 0%, #2c5e1e 100%);
        }
        
        .title-section {
          margin-bottom: 30px;
        }
        
        .title-content {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          gap: 20px;
          flex-wrap: wrap;
        }
        
        .title-content h1 {
          font-size: 2.5rem;
          color: #1a1a1a;
          margin: 0;
          font-weight: 700;
          line-height: 1.2;
          flex: 1;
          min-width: 300px;
          background: linear-gradient(135deg, #1a1a1a 0%, #2d3436 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .badge {
          display: inline-flex;
          align-items: center;
          padding: 12px 20px;
          border-radius: 50px;
          font-size: 0.85rem;
          font-weight: 700;
          gap: 8px;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.1);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }
        
        .badge-stage {
          background: linear-gradient(135deg, #00b894 0%, #00a085 100%);
          color: white;
        }
        
        .badge-cdi {
          background: linear-gradient(135deg, #0984e3 0%, #0767c1 100%);
          color: white;
        }
        
        .badge-cdd {
          background: linear-gradient(135deg, #fd79a8 0%, #e84393 100%);
          color: white;
        }
        
        .badge-alternance {
          background: linear-gradient(135deg, #fdcb6e 0%, #f39c12 100%);
          color: white;
        }
        
        .badge-emploi {
          background: linear-gradient(135deg, #636e72 0%, #2d3436 100%);
          color: white;
        }
        
        .meta-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 20px;
        }
        
        .meta-item {
          display: flex;
          align-items: center;
          gap: 15px;
          padding: 16px;
          background: rgba(255, 255, 255, 0.7);
          border-radius: 12px;
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.3);
        }
        
        .meta-icon {
          width: 44px;
          height: 44px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #397627 0%, #2c5e1e 100%);
          border-radius: 12px;
          color: white;
          font-size: 1.1rem;
        }
        
        .meta-content {
          display: flex;
          flex-direction: column;
        }
        
        .meta-label {
          font-size: 0.8rem;
          color: #636e72;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          margin-bottom: 4px;
        }
        
        .meta-value {
          font-size: 0.95rem;
          color: #2d3436;
          font-weight: 500;
        }
        
        .card-content {
          padding: 40px;
        }
        
        .content-section {
          margin-bottom: 32px;
          padding: 24px;
          background: white;
          border-radius: 16px;
          border: 1px solid rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
        }
        
        .content-section:hover {
          border-color: #397627;
          box-shadow: 0 8px 25px rgba(57, 118, 39, 0.1);
          transform: translateY(-2px);
        }
        
        .content-section.highlight {
          background: linear-gradient(135deg, #f8fff8 0%, #f0f8f0 100%);
          border-left: 4px solid #397627;
        }
        
        .section-header {
          display: flex;
          align-items: center;
          gap: 16px;
          margin-bottom: 20px;
          padding-bottom: 16px;
          border-bottom: 2px solid rgba(57, 118, 39, 0.1);
        }
        
        .section-icon {
          width: 48px;
          height: 48px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #397627 0%, #2c5e1e 100%);
          border-radius: 12px;
          color: white;
          font-size: 1.2rem;
        }
        
        .section-header h2 {
          font-size: 1.5rem;
          color: #1a1a1a;
          margin: 0;
          font-weight: 600;
          background: linear-gradient(135deg, #1a1a1a 0%, #2d3436 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .section-content {
          line-height: 1.7;
        }
        
        .description-text {
          font-size: 1.1rem;
          color: #2d3436;
          line-height: 1.8;
          margin: 0;
        }
        
        .competences-grid {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }
        
        .competence-tag {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          background: linear-gradient(135deg, #397627 0%, #2c5e1e 100%);
          color: white;
          padding: 10px 16px;
          border-radius: 25px;
          font-size: 0.9rem;
          font-weight: 500;
          box-shadow: 0 4px 12px rgba(57, 118, 39, 0.3);
          transition: all 0.3s ease;
        }
        
        .competence-tag:hover {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(57, 118, 39, 0.4);
        }
        
        .no-data {
          color: #b2bec3;
          font-style: italic;
          margin: 0;
        }
        
        .info-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
          gap: 20px;
        }
        
        .info-item {
          display: flex;
          flex-direction: column;
          gap: 8px;
          padding: 16px;
          background: rgba(255, 255, 255, 0.8);
          border-radius: 12px;
          border: 1px solid rgba(57, 118, 39, 0.1);
        }
        
        .info-label {
          display: flex;
          align-items: center;
          gap: 8px;
          font-size: 0.9rem;
          color: #636e72;
          font-weight: 600;
        }
        
        .info-value {
          font-size: 1rem;
          color: #2d3436;
          font-weight: 500;
        }
        
        .type-badge {
          display: inline-block;
          padding: 6px 12px;
          border-radius: 20px;
          font-size: 0.8rem;
          font-weight: 600;
          text-transform: uppercase;
        }
        
        .empty-state {
          text-align: center;
          padding: 80px 24px;
        }
        
        .empty-icon {
          font-size: 4rem;
          margin-bottom: 24px;
          color: #b2bec3;
        }
        
        .empty-state h3 {
          font-size: 1.5rem;
          margin-bottom: 12px;
          color: #636e72;
          font-weight: 500;
        }
        
        .empty-state p {
          color: #b2bec3;
          font-size: 1.1rem;
        }
        
        /* Responsive */
        @media (max-width: 768px) {
          .offre-details-container {
            padding: 16px;
          }
          
          .details-header {
            flex-direction: column;
            align-items: stretch;
            gap: 16px;
          }
          
          .action-buttons {
            display: flex;
            gap: 10px;
          }
          
          .btn {
            flex: 1;
            justify-content: center;
          }
          
          .card-header, .card-content {
            padding: 24px;
          }
          
          .title-content {
            flex-direction: column;
            align-items: flex-start;
          }
          
          .title-content h1 {
            font-size: 2rem;
            min-width: auto;
          }
          
          .meta-grid {
            grid-template-columns: 1fr;
          }
          
          .info-grid {
            grid-template-columns: 1fr;
          }
        }
        
        @media (max-width: 480px) {
          .action-buttons {
                flex-direction: column;
          }
          
          .title-content h1 {
            font-size: 1.6rem;
          }
          
          .content-section {
            padding: 20px;
          }
          
          .competences-grid {
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
};

export default OffreDetails;