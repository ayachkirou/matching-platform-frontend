import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Hero = ({ onSearch, onFilterChange }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filters, setFilters] = useState({
    type: 'all',
    location: 'all',
    skills: 'all'
  });
  
  const [openDropdown, setOpenDropdown] = useState(null);
  const [villes, setVilles] = useState([]);
  const [competences, setCompetences] = useState([]);
  const [types, setTypes] = useState([]);
  const [loading, setLoading] = useState(false);

  // Récupération des données depuis l'API
  const fetchFilterData = async () => {
    try {
      setLoading(true);
      
      // Récupérer les localisations
      const localisationsResponse = await axios.get('http://localhost:8080/api/filters/localisations');
      const localisationsData = localisationsResponse.data.map(localisation => ({
        value: localisation,
        label: localisation
      }));
      setVilles([{ value: 'all', label: 'Toutes villes' }, ...localisationsData]);
      
      // Récupérer les types
      const typesResponse = await axios.get('http://localhost:8080/api/filters/types');
      const typesData = typesResponse.data.map(type => ({
        value: type,
        label: type
      }));
      setTypes([{ value: 'all', label: 'Tous types' }, ...typesData]);
      
      // Récupérer les compétences
      const competencesResponse = await axios.get('http://localhost:8080/api/filters/competences');
      const competencesData = competencesResponse.data.map(competence => ({
        value: competence,
        label: competence
      }));
      setCompetences([{ value: 'all', label: 'Toutes compétences' }, ...competencesData]);
      
    } catch (error) {
      console.error('Erreur lors du chargement des filtres:', error);
      // Fallback vers des données statiques
      setVilles([{ value: 'all', label: 'Toutes villes' }]);
      setTypes([{ value: 'all', label: 'Tous types' }]);
      setCompetences([{ value: 'all', label: 'Toutes compétences' }]);
    } finally {
      setLoading(false);
    }
  };

  // Chargement des données au montage du composant
  useEffect(() => {
    fetchFilterData();
  }, []);

  // Gestion de la recherche
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setSearchTerm(value);
    onSearch(value);
  };

  // Gestion des filtres
  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...filters, [filterType]: value };
    setFilters(newFilters);
    onFilterChange(newFilters);
    setOpenDropdown(null);
  };

  // Fermer les dropdowns quand on clique ailleurs
  useEffect(() => {
    const handleClickOutside = () => {
      setOpenDropdown(null);
    };

    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  }, []);

  return (
    <section className="hero">
      <div className="container">
        <h1>Trouvez votre opportunité idéale</h1>
        <p>Découvrez des stages et emplois qui correspondent parfaitement à vos compétences et ambitions</p>
        
        {/* Barre de recherche */}
        <div className="search-container">
          <i className="fas fa-search search-icon"></i>
          <input 
            type="text" 
            className="search-input" 
            placeholder="Rechercher par titre, entreprise ou compétences..."
            value={searchTerm}
            onChange={handleSearchChange}
          />
        </div>
        
        {/* Filtres */}
        <div className="filters">
          {/* Filtre Type */}
          <div className="filter-select" onClick={(e) => {
            e.stopPropagation();
            setOpenDropdown(openDropdown === 'type' ? null : 'type');
          }}>
            <i className="fas fa-filter"></i>
            <span>{(types.find(opt => opt.value === filters.type) || { label: 'Tous types' }).label}</span>
            <i className="fas fa-chevron-down"></i>
            
            {openDropdown === 'type' && (
              <div className="dropdown-menu">
                {types.map(type => (
                  <div 
                    key={type.value} 
                    className={`dropdown-item ${filters.type === type.value ? 'active' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFilterChange('type', type.value);
                    }}
                  >
                    {type.label}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Filtre Localisation */}
          <div className="filter-select" onClick={(e) => {
            e.stopPropagation();
            setOpenDropdown(openDropdown === 'location' ? null : 'location');
          }}>
            <i className="fas fa-map-marker-alt"></i>
            <span>{(villes.find(opt => opt.value === filters.location) || { label: 'Toutes villes' }).label}</span>
            <i className="fas fa-chevron-down"></i>
            
            {openDropdown === 'location' && (
              <div className="dropdown-menu">
                {villes.map(ville => (
                  <div 
                    key={ville.value} 
                    className={`dropdown-item ${filters.location === ville.value ? 'active' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFilterChange('location', ville.value);
                    }}
                  >
                    {ville.label}
                  </div>
                ))}
              </div>
            )}
          </div>
          
          {/* Filtre Compétences */}
          <div className="filter-select" onClick={(e) => {
            e.stopPropagation();
            setOpenDropdown(openDropdown === 'skills' ? null : 'skills');
          }}>
            <i className="fas fa-graduation-cap"></i>
            <span>{(competences.find(opt => opt.value === filters.skills) || { label: 'Toutes compétences' }).label}</span>
            <i className="fas fa-chevron-down"></i>
            
            {openDropdown === 'skills' && (
              <div className="dropdown-menu">
                {competences.map(competence => (
                  <div 
                    key={competence.value} 
                    className={`dropdown-item ${filters.skills === competence.value ? 'active' : ''}`}
                    onClick={(e) => {
                      e.stopPropagation();
                      handleFilterChange('skills', competence.value);
                    }}
                  >
                    {competence.label}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {loading && (
          <div className="loading-indicator">
            <p>Chargement des filtres...</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default Hero;