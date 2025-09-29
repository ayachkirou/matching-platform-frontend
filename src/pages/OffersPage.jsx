import React, { useState, useEffect } from 'react';
import OfferCard from '../components/OfferCard';
import SearchBar from '../components/SearchBar';
import FilterPanel from '../components/FilterPanel';
import { offreService } from '../services/api';
// import './OffersPage.css';

const OffersPage = () => {
  const [offers, setOffers] = useState([]);
  const [filteredOffers, setFilteredOffers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [minMatch, setMinMatch] = useState(0);
  const [sortBy, setSortBy] = useState('date');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOffers = async () => {
      try {
        setLoading(true);
        const response = await offreService.getAllOffres();
        setOffers(response.data);
        setFilteredOffers(response.data);
      } catch (err) {
        setError('Erreur lors du chargement des offres');
        console.error('Erreur API:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchOffers();
  }, []);

  useEffect(() => {
    let result = offers;
    
    // Filtrer par terme de recherche
    if (searchTerm) {
      result = result.filter(offer => 
        offer.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (offer.description && offer.description.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (offer.localisation && offer.localisation.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }
    
    // Trier les résultats
    result = [...result].sort((a, b) => {
      if (sortBy === 'date' && a.datePublication && b.datePublication) {
        return new Date(b.datePublication) - new Date(a.datePublication);
      } else if (sortBy === 'titre') {
        return a.titre.localeCompare(b.titre);
      }
      return 0;
    });
    
    setFilteredOffers(result);
  }, [offers, searchTerm, sortBy]);

  const handleSearch = async (query) => {
    try {
      setLoading(true);
      const response = await offreService.searchOffres(query);
      setOffers(response.data);
      setFilteredOffers(response.data);
    } catch (err) {
      setError('Erreur lors de la recherche');
      console.error('Erreur recherche:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div className="loading">Chargement des offres...</div>;
  }

  if (error) {
    return <div className="error">{error}</div>;
  }

  return (
    <div className="offers-page">
      <h1>Offres d'emploi et de stage</h1>
      
      <div className="controls-container">
        <SearchBar 
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          onSearchSubmit={handleSearch}
          placeholder="Rechercher par titre, description ou localisation..."
        />
        
        <FilterPanel 
          minMatch={minMatch}
          onMinMatchChange={setMinMatch}
          sortBy={sortBy}
          onSortChange={setSortBy}
        />
      </div>
      
      <div className="results-info">
        {filteredOffers.length} offre(s) trouvée(s)
      </div>
      
      <div className="offers-list">
        {filteredOffers.length > 0 ? (
          filteredOffers.map(offer => (
            <OfferCard key={offer.id} offer={offer} />
          ))
        ) : (
          <div className="no-results">
            Aucune offre ne correspond à vos critères de recherche.
          </div>
        )}
      </div>
    </div>
  );
};

export default OffersPage;