import React, { useState } from 'react';

const OfferCard = ({ offer, toggleSave, onApply }) => {
  const [imageError, setImageError] = useState(false);

  // Extraction des données avec valeurs par défaut
  const {
    id,
    titre = 'Titre non spécifié',
    entrepriseId,
    companyId = entrepriseId,
    typeOffre = 'CDI',
    salaire = 'Salaire non précisé',
    localisation = 'Non précisé',
    description = 'Aucune description disponible.',
    competencesRequises,
    nomEntreprise,
    companyName = nomEntreprise,
    logoEntreprise,
    companyLogo = logoEntreprise,
    datePublication,
    createdAt,
    dateCreation = datePublication || createdAt
  } = offer;

  // 🔄 Conversion sécurisée des compétences
  const getSkillsArray = () => {
    try {
      if (!competencesRequises) return [];
      
      if (Array.isArray(competencesRequises)) {
        return competencesRequises;
      }
      
      if (typeof competencesRequises === 'string') {
        const parsed = JSON.parse(competencesRequises);
        return Array.isArray(parsed) ? parsed : [parsed];
      }
      
      return [];
    } catch (error) {
      console.error('Erreur parsing compétences:', error);
      return [];
    }
  };

  const skillsArray = getSkillsArray();

  // 🏢 Nom de l'entreprise
  const getCompanyName = () => {
    if (companyName && companyName.trim() !== '') return companyName;
    if (nomEntreprise && nomEntreprise.trim() !== '') return nomEntreprise;
    return `Entreprise #${companyId || 'N/A'}`;
  };

  const displayCompanyName = getCompanyName();

  // 🖼️ Logo de l'entreprise
  const getCompanyLogo = () => {
    if (companyLogo && companyLogo.trim() !== '') return companyLogo;
    if (logoEntreprise && logoEntreprise.trim() !== '') return logoEntreprise;
    return null;
  };

  const companyLogoUrl = getCompanyLogo();

  // 📅 Date de publication formatée
  const formatPublicationDate = () => {
    const dateString = dateCreation;
    if (!dateString) return 'Publié récemment';

    try {
      const date = new Date(dateString);
      const now = new Date();
      const diffTime = Math.abs(now - date);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      const diffHours = Math.ceil(diffTime / (1000 * 60 * 60));
      const diffMinutes = Math.ceil(diffTime / (1000 * 60));

      if (diffMinutes < 60) return 'À l\'instant';
      if (diffHours < 24) return `Il y a ${diffHours}h`;
      if (diffDays === 1) return 'Hier';
      if (diffDays < 7) return `Il y a ${diffDays}j`;
      if (diffDays < 30) return `Il y a ${Math.floor(diffDays/7)}sem`;
      
      return `Le ${date.toLocaleDateString('fr-FR')}`;
    } catch (error) {
      return 'Publié récemment';
    }
  };

  // 🅰️ Initiales pour le fallback du logo
  const getCompanyInitials = () => {
    return displayCompanyName
      .split(' ')
      .map(word => word.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  const handlePostulerClick = () => {
    if (onApply) {
      onApply(offer);
    }
  };

  const handleSaveClick = () => {
    if (toggleSave) {
      toggleSave(id);
    }
  };

  return (
    <div className="offer-card">
      <div className="card-header">
        <div className="company-info">
          {/* Logo entreprise */}
          <div className="company-logo">
            {companyLogoUrl && !imageError ? (
              <img 
                src={companyLogoUrl} 
                alt={`Logo ${displayCompanyName}`}
                className="company-logo-img"
                onError={handleImageError}
              />
            ) : (
              <div className="company-logo-fallback">
                {getCompanyInitials()}
              </div>
            )}
          </div>

          {/* Nom entreprise et titre */}
          <div className="company-text">
            <h3>{titre}</h3>
            <p>{displayCompanyName}</p>
          </div>
        </div>

        {/* Bouton favori */}
        <button 
          className={`save-btn ${offer.saved ? 'saved' : ''}`}
          onClick={handleSaveClick}
          aria-label={offer.saved ? 'Retirer des favoris' : 'Ajouter aux favoris'}
        >
          <i className={offer.saved ? 'fas fa-heart' : 'far fa-heart'}></i>
        </button>
      </div>

      {/* Badges type et salaire */}
      <div className="offer-details">
        <span className="offer-badge badge-primary">{typeOffre}</span>
        {salaire && salaire !== 'Salaire non précisé' && (
          <span className="offer-badge badge-secondary">{salaire}</span>
        )}
      </div>

      {/* Métadonnées */}
      <div className="offer-meta">
        <div className="meta-item">
          <i className="fas fa-map-marker-alt"></i>
          <span>{localisation}</span>
        </div>
        <div className="meta-item">
          <i className="far fa-clock"></i>
          <span>{formatPublicationDate()}</span>
        </div>
      </div>

      {/* Description */}
      <p className="offer-description">
        {description.length > 120 ? `${description.substring(0, 120)}...` : description}
      </p>

      {/* Compétences */}
      {skillsArray.length > 0 && (
        <div className="skills">
          {skillsArray.slice(0, 4).map((skill, index) => (
            <span key={index} className="skill">
              {skill}
            </span>
          ))}
          {skillsArray.length > 4 && (
            <span className="skill">+{skillsArray.length - 4}</span>
          )}
        </div>
      )}

      {/* Actions */}
      <div className="card-actions">
        <button className="btn btn-outline">Détails</button>
        <button className="btn btn-primary" onClick={handlePostulerClick}>
          Postuler
        </button>
      </div>
    </div>
  );
};

export default OfferCard;