import React from 'react';
import './OfferCard.css';

const OfferCard = ({ offer }) => {
  const formatDate = (timestamp) => {
    if (!timestamp) return 'Date non disponible';
    const date = new Date(timestamp);
    return date.toLocaleDateString('fr-FR');
  };

  // Fonction pour parser les compétences JSON
  const getCompetencesList = () => {
    try {
      if (offer.competencesRequises) {
        return JSON.parse(offer.competencesRequises);
      }
    } catch (e) {
      console.error('Erreur parsing competences:', e);
    }
    return [];
  };

  const competencesList = getCompetencesList();

  return (
    <div className="offer-card">
      <div className="offer-header">
        <h3 className="offer-title">{offer.titre}</h3>
        <div className="offer-type">{offer.typeOffre}</div>
      </div>
      
      <div className="offer-details">
        <div className="company-info">
          <span className="company-name">Entreprise #{offer.companyId}</span>
          <span className="location">{offer.localisation || 'Non spécifié'}</span>
        </div>
        
        <div className="offer-meta">
          <span className="publication-date">
            Publié le: {formatDate(offer.datePublication)}
          </span>
        </div>
      </div>
      
      <p className="offer-description">
        {offer.description && offer.description.length > 150 
          ? `${offer.description.substring(0, 150)}...` 
          : offer.description || 'Aucune description disponible'}
      </p>
      
      <div className="skills-container">
        {competencesList.map((skill, index) => (
          <span key={index} className="skill-badge">{skill}</span>
        ))}
        {competencesList.length === 0 && (
          <span className="skill-badge">Aucune compétence spécifiée</span>
        )}
      </div>
      
      <div className="offer-actions">
        <button className="apply-btn">Postuler</button>
        <button className="details-btn">Voir détails</button>
      </div>
    </div>
  );
};

export default OfferCard;