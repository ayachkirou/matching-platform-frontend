import React, { useState, useEffect } from 'react';
import axios from 'axios';
import OfferCard from './OfferCard';
import Postulation from './Postulation';
import Hero from './Hero';

const OffersSection = () => {
  // États existants
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOffer, setSelectedOffer] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // NOUVEAUX états pour le filtrage
  const [allOffers, setAllOffers] = useState([]);
  const [filteredOffers, setFilteredOffers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeFilters, setActiveFilters] = useState({
    type: 'all',
    location: 'all',
    skills: 'all'
  });

  // ✅ État pour l'ID de l'étudiant
  const [studentId, setStudentId] = useState(9);

  // Chargement initial
  useEffect(() => {
    axios.get("/api/offers/with-company")
      .then(response => {
        console.log('Offres chargées:', response.data);
        setAllOffers(response.data);
        setOffers(response.data);
        setFilteredOffers(response.data);
        setLoading(false);
      })
      .catch(error => {
        console.error("Erreur lors du chargement des offres :", error);
        setError("Une erreur est survenue lors du chargement des offres.");
        setLoading(false);
      });
  }, []);

  // Appliquer les filtres
  useEffect(() => {
    applyFilters();
  }, [searchTerm, activeFilters, allOffers]);

  const applyFilters = () => {
    let filtered = [...allOffers];

    // Filtre par recherche textuelle
    if (searchTerm.trim()) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(offer => 
        offer.titre.toLowerCase().includes(search) ||
        (offer.companyName && offer.companyName.toLowerCase().includes(search)) ||
        offer.description.toLowerCase().includes(search) ||
        (offer.competencesRequises && offer.competencesRequises.toLowerCase().includes(search)) ||
        offer.localisation.toLowerCase().includes(search)
      );
    }

    // Filtre par type
    if (activeFilters.type !== 'all') {
      filtered = filtered.filter(offer => offer.typeOffre === activeFilters.type);
    }

    // Filtre par localisation
    if (activeFilters.location !== 'all') {
      filtered = filtered.filter(offer => 
        offer.localisation.toLowerCase().includes(activeFilters.location.toLowerCase())
      );
    }

    // Filtre par compétences
    if (activeFilters.skills !== 'all') {
      filtered = filtered.filter(offer => {
        try {
          const skills = JSON.parse(offer.competencesRequises || '[]');
          return skills.some(skill => 
            skill.toLowerCase().includes(activeFilters.skills.toLowerCase())
          );
        } catch (e) {
          return offer.competencesRequises && 
                 offer.competencesRequises.toLowerCase().includes(activeFilters.skills.toLowerCase());
        }
      });
    }

    setFilteredOffers(filtered);
    setOffers(filtered);
  };

  // Gestion recherche et filtres
  const handleSearch = (term) => {
    setSearchTerm(term);
  };

  const handleFilterChange = (filters) => {
    setActiveFilters(filters);
  };

  // Fonctions existantes
  const handleApply = (offer) => {
    setSelectedOffer(offer);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedOffer(null);
  };

  if (loading) {
    return <div>Chargement des offres...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <Hero onSearch={handleSearch} onFilterChange={handleFilterChange} />
      
      <section className="offers-section">
        <div className="container">
          <div className="section-header">
            <h2 className="section-title">
              {filteredOffers.length} offres trouvées
              {searchTerm && (
                <span style={{ 
                  fontSize: '1rem', 
                  color: '#666',
                  background: '#e9ecef',
                  padding: '0.3rem 0.8rem',
                  borderRadius: '15px',
                  marginLeft: '1rem'
                }}>
                  pour "{searchTerm}"
                </span>
              )}
            </h2>
          </div>
          
          <div className="offers-grid">
            {filteredOffers.map(offer => (
              <OfferCard 
                key={offer.id}
                offer={offer}
                onApply={handleApply}
                studentId={studentId}
              />
            ))}
          </div>

          {filteredOffers.length === 0 && (
            <div style={{
              textAlign: 'center',
              padding: '3rem',
              background: 'white',
              borderRadius: '8px',
              boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
            }}>
              <div style={{ fontSize: '3rem', marginBottom: '1rem', color: '#6c757d' }}>
  <i className="fas fa-search-minus"></i>
</div>
              <h3 style={{ color: '#666', marginBottom: '0.5rem' }}>Aucune offre trouvée</h3>
              <p style={{ color: '#999' }}>
                Essayez de modifier vos critères de recherche ou vos filtres.
              </p>
            </div>
          )}

          {isModalOpen && selectedOffer && (
            <Postulation 
              offer={selectedOffer} 
              onClose={handleCloseModal} 
            />
          )}
        </div>
      </section>
    </div>
  );
};

export default OffersSection;