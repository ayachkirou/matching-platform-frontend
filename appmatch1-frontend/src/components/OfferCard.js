import React from 'react';

const OfferCard = ({ offer, toggleSave }) => {
  const {
    companyInitials,
    title,
    company,
    type,
    salary,
    location,
    time,
    description,
    skills,
    saved
  } = offer;

  return (
    <div className="offer-card">
      <div className="card-header">
        <div className="company-info">
          <div className="company-logo">{companyInitials}</div>
          <div className="company-text">
            <h3>{title}</h3>
            <p>{company}</p>
          </div>
        </div>
        <button 
          className={`save-btn ${saved ? 'saved' : ''}`}
          onClick={() => toggleSave(offer.id)}
        >
          <i className={saved ? 'fas fa-heart' : 'far fa-heart'}></i>
        </button>
      </div>
      
      <div className="offer-details">
        <span className="offer-badge badge-primary">{type}</span>
        <span className="offer-badge badge-secondary">{salary}</span>
      </div>
      
      <div className="offer-meta">
        <div className="meta-item">
          <i className="fas fa-map-marker-alt"></i>
          <span>{location}</span>
        </div>
        <div className="meta-item">
          <i className="far fa-clock"></i>
          <span>{time}</span>
        </div>
      </div>
      
      <p className="offer-description">
        {description}
      </p>
      
      <div className="skills">
        {skills.map((skill, index) => (
          <span key={index} className="skill">{skill}</span>
        ))}
      </div>
      
      <div className="card-actions">
        <button className="btn btn-outline">Détails</button>
        <button className="btn btn-primary">Postuler</button>
      </div>
    </div>
  );
};

export default OfferCard;