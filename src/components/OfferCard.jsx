import React, { useState } from 'react';
import axios from 'axios';

const OfferCard = ({ offer, onApply, studentId, onFavoriChange }) => {
  const [imageError, setImageError] = useState(false);
  const [isFavori, setIsFavori] = useState(offer.favori || offer.saved || false);
  const [loading, setLoading] = useState(false);

  // 🔹 Extraction sécurisée des données
  const {
    id,
    titre = 'Titre non spécifié',
    typeOffre = 'CDI',
    salaire = 'Salaire non précisé',
    localisation = 'Non précisé',
    description = 'Aucune description disponible.',
    competencesRequises,
    companyName = 'Entreprise inconnue',
    companyLogo,
    datePublication,
  } = offer;

  // 🔹 Conversion compétences
  const getSkillsArray = () => {
    try {
      if (!competencesRequises) return [];
      if (Array.isArray(competencesRequises)) return competencesRequises;
      if (typeof competencesRequises === 'string') {
        const parsed = JSON.parse(competencesRequises);
        return Array.isArray(parsed) ? parsed : [parsed];
      }
      return [];
    } catch {
      return [];
    }
  };
  const skillsArray = getSkillsArray();

  // 🔹 Gestion image logo
  const handleImageError = () => setImageError(true);
  const getInitials = (name) =>
    name
      .split(' ')
      .map((word) => word.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);

  // 🔹 Format date
  const formatDate = () => {
    if (!datePublication) return 'Publié récemment';
    const date = new Date(datePublication);
    return `Le ${date.toLocaleDateString('fr-FR')}`;
  };

  // ❤️ Gestion favoris avec API
  const handleSaveClick = async () => {
    if (!studentId) {
      alert('Veuillez vous connecter pour ajouter aux favoris.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.post('/api/favoris/toggle', null, {
        params: { studentId, offerId: id },
      });

      if (response.data.success) {
        setIsFavori(response.data.isFavori);
        if (onFavoriChange) {
          onFavoriChange(id, response.data.isFavori);
        }
      }
    } catch (error) {
      console.error('Erreur lors de la mise à jour du favori :', error);
      alert('Erreur réseau, réessayez plus tard.');
    } finally {
      setLoading(false);
    }
  };

  // 🟢 Postuler
  const handlePostulerClick = () => {
    if (onApply) onApply(offer);
  };

  return (
    <div className="offer-card">
      {/* En-tête */}
      <div className="card-header">
        <div className="company-info">
          <div className="company-logo">
            {companyLogo && !imageError ? (
              <img
                src={companyLogo}
                alt={companyName}
                className="company-logo-img"
                onError={handleImageError}
              />
            ) : (
              <div className="company-logo-fallback">{getInitials(companyName)}</div>
            )}
          </div>

          <div className="company-text">
            <h3>{titre}</h3>
            <p>{companyName}</p>
          </div>
        </div>

        {/* ❤️ Bouton favori */}
        <button
          className={`save-btn ${isFavori ? 'saved' : ''}`}
          onClick={handleSaveClick}
          disabled={loading}
          aria-label={isFavori ? 'Retirer des favoris' : 'Ajouter aux favoris'}
        >
          <i className={isFavori ? 'fas fa-heart' : 'far fa-heart'}></i>
        </button>
      </div>

      {/* Détails de l'offre */}
      <div className="offer-details">
        <span className="offer-badge badge-primary">{typeOffre}</span>
        {salaire && salaire !== 'Salaire non précisé' && (
          <span className="offer-badge badge-secondary">{salaire}</span>
        )}
      </div>

      <div className="offer-meta">
        <div className="meta-item">
          <i className="fas fa-map-marker-alt"></i>
          <span>{localisation}</span>
        </div>
        <div className="meta-item">
          <i className="far fa-clock"></i>
          <span>{formatDate()}</span>
        </div>
      </div>

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

      {/* Boutons */}
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
