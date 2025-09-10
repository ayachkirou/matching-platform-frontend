import React from 'react';

const Hero = () => {
  return (
    <section className="hero">
      <div className="container">
        <h1>Trouvez votre opportunité idéale</h1>
        <p>Découvrez des stages et emplois qui correspondent parfaitement à vos compétences et ambitions</p>
        
        <div className="search-container">
          <i className="fas fa-search search-icon"></i>
          <input type="text" className="search-input" placeholder="Rechercher par titre, entreprise ou compétences..." />
        </div>
        
        <div className="filters">
          <div className="filter-select">
            <i className="fas fa-filter"></i>
            <span>Tous types</span>
            <i className="fas fa-chevron-down"></i>
          </div>
          
          <div className="filter-select">
            <i className="fas fa-map-marker-alt"></i>
            <span>Toutes villes</span>
            <i className="fas fa-chevron-down"></i>
          </div>
          
          <div className="filter-select">
            <i className="fas fa-graduation-cap"></i>
            <span>Tous niveaux</span>
            <i className="fas fa-chevron-down"></i>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;