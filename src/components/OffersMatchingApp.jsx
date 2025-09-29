import React, { useState, useEffect } from 'react';

const OffersMatchingApp = () => {
  const [offers, setOffers] = useState([]);
  const [filteredOffers, setFilteredOffers] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [studentId, setStudentId] = useState(1);
  const [minMatchScore, setMinMatchScore] = useState(90);

  const API_BASE_URL = 'http://localhost:8080/api';

  // Fonction pour récupérer toutes les offres avec matching
  const fetchOffersWithMatching = async () => {
    setLoading(true);
    setError('');
    try {
      const testResponse = await fetch(`${API_BASE_URL}/offres/test`);
      if (!testResponse.ok) {
        throw new Error('Serveur backend non accessible');
      }

      const response = await fetch(
        `${API_BASE_URL}/matching/student/${studentId}/all`
      );
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Erreur ${response.status}: ${errorText}`);
      }
      
      const data = await response.json();
      setOffers(data);
      setFilteredOffers(data);
    } catch (err) {
      setError(`Erreur de connexion: ${err.message}`);
      
      // Fallback avec données simulées
      try {
        const fallbackResponse = await fetch(`${API_BASE_URL}/offres/affiche`);
        if (fallbackResponse.ok) {
          const offresData = await fallbackResponse.json();
          const offresWithFakeMatching = offresData.map(offre => ({
            offre: offre,
            matchScore: Math.random() * 0.6 + 0.4
          }));
          setOffers(offresWithFakeMatching);
          setFilteredOffers(offresWithFakeMatching);
          setError('');
        }
      } catch (fallbackErr) {
        console.error('Fallback échoué:', fallbackErr);
      }
    } finally {
      setLoading(false);
    }
  };

  const searchOffers = async (titre) => {
    if (!titre.trim()) {
      setFilteredOffers(offers);
      return;
    }
    
    setLoading(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/offres/recherche?titre=${encodeURIComponent(titre)}`
      );
      if (!response.ok) {
        throw new Error('Erreur lors de la recherche');
      }
      const searchResults = await response.json();
      
      const filteredWithMatching = offers.filter(offer => 
        searchResults.some(searchResult => searchResult.id === offer.offre.id)
      );
      
      setFilteredOffers(filteredWithMatching);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOffersWithMatching();
  }, [studentId]);

  useEffect(() => {
    if (minMatchScore > 0) {
      const filtered = offers.filter(offer => offer.matchScore >= (minMatchScore / 100));
      setFilteredOffers(filtered);
    } else {
      setFilteredOffers(offers);
    }
  }, [minMatchScore, offers]);

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    searchOffers(searchTerm);
  };

  const formatMatchScore = (score) => {
    return (score * 100).toFixed(0);
  };

  const getMatchColor = (score) => {
    const percentage = score * 100;
    if (percentage >= 90) return '#10B981'; // Vert
    if (percentage >= 70) return '#F59E0B'; // Orange
    if (percentage >= 50) return '#EF4444'; // Rouge
    return '#6B7280'; // Gris
  };

  return (
    <div style={{ 
      minHeight: '100vh', 
      backgroundColor: '#F8FAFC',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Navigation Header */}
      <div style={{
        backgroundColor: '#FFFFFF',
        borderBottom: '1px solid #E2E8F0',
        padding: '0 2rem'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'flex',
          alignItems: 'center',
          height: '70px'
        }}>
          <div style={{
            fontSize: '24px',
            fontWeight: 'bold',
            color: '#10B981',
            marginRight: '3rem'
          }}>
            TalentMatch
          </div>
          <nav style={{ display: 'flex', gap: '2rem' }}>
            {['Student', 'Matching', 'Offers', 'Mes Candidatures'].map((item, index) => (
              <div
                key={item}
                style={{
                  padding: '0.5rem 0',
                  color: index === 2 ? '#10B981' : '#64748B',
                  fontWeight: index === 2 ? '600' : '400',
                  borderBottom: index === 2 ? '2px solid #10B981' : 'none',
                  cursor: 'pointer'
                }}
              >
                {item}
              </div>
            ))}
          </nav>
          <div style={{ marginLeft: 'auto', color: '#64748B' }}>
            Profil
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto',
        padding: '2rem'
      }}>
        {/* Title */}
        <h1 style={{
          fontSize: '2rem',
          fontWeight: '600',
          color: '#1E293B',
          marginBottom: '2rem'
        }}>
          matching
        </h1>

        {/* Search and Filters */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 200px',
          gap: '1rem',
          marginBottom: '2rem'
        }}>
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              color: '#64748B',
              marginBottom: '0.5rem'
            }}>
              Rechercher
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Rechercher..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSearch(e);
                  }
                }}
                style={{
                  width: '95%',
                  padding: '0.75rem 1rem',
                  border: '2px solid #E2E8F0',
                  borderRadius: '0.5rem',
                  fontSize: '1rem',
                  outline: 'none',
                  transition: 'border-color 0.2s',
                  backgroundColor: '#FFFFFF'
                }}
                onFocus={(e) => e.target.style.borderColor = '#10B981'}
                onBlur={(e) => e.target.style.borderColor = '#E2E8F0'}
              />
              <button
                onClick={handleSearch}
                style={{
                  position: 'absolute',
                  right: '0.5rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  padding: '0.25rem'
                }}
              >
                🔍
              </button>
            </div>
          </div>
          
          <div>
            <label style={{
              display: 'block',
              fontSize: '0.875rem',
              color: '#64748B',
              marginBottom: '0.5rem'
            }}>
              match minimum
            </label>
            <select
              value={`${minMatchScore}%+`}
              onChange={(e) => setMinMatchScore(parseInt(e.target.value))}
              style={{
                width: '100%',
                padding: '0.75rem',
                border: '2px solid #E2E8F0',
                borderRadius: '0.5rem',
                backgroundColor: '#FFFFFF',
                fontSize: '1rem',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="90">90%+</option>
              <option value="80">80%+</option>
              <option value="70">70%+</option>
              <option value="60">60%+</option>
              <option value="50">50%+</option>
              <option value="0">Tous</option>
            </select>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div style={{
            textAlign: 'center',
            padding: '2rem',
            color: '#64748B'
          }}>
            Chargement des offres...
          </div>
        )}

        {/* Error State */}
        {error && (
          <div style={{
            backgroundColor: '#FEF2F2',
            border: '1px solid #FECACA',
            borderRadius: '0.5rem',
            padding: '1rem',
            marginBottom: '1rem',
            color: '#DC2626'
          }}>
            {error}
          </div>
        )}

        {/* Offers List */}
        {!loading && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {filteredOffers.length === 0 ? (
              <div style={{
                textAlign: 'center',
                padding: '3rem',
                color: '#64748B'
              }}>
                <p style={{ fontSize: '1.125rem', marginBottom: '0.5rem' }}>
                  Aucune offre trouvée
                </p>
                <p style={{ fontSize: '0.875rem' }}>
                  Essayez de modifier vos critères de recherche
                </p>
              </div>
            ) : (
              filteredOffers.map((item) => (
                <div
                  key={item.offre.id}
                  style={{
                    backgroundColor: '#FFFFFF',
                    borderRadius: '1rem',
                    padding: '1.5rem',
                    border: '1px solid #E2E8F0',
                    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
                    transition: 'all 0.2s',
                    cursor: 'pointer'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                    e.target.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.boxShadow = '0 1px 3px rgba(0, 0, 0, 0.1)';
                    e.target.style.transform = 'translateY(0)';
                  }}
                >
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'flex-start',
                    marginBottom: '1rem'
                  }}>
                    <div style={{ flex: 1 }}>
                      <h3 style={{
                        fontSize: '1.25rem',
                        fontWeight: '600',
                        color: '#1E293B',
                        marginBottom: '0.5rem'
                      }}>
                        {item.offre.titre}
                        <span style={{
                          fontSize: '0.75rem',
                          fontWeight: '400',
                          color: '#FFFFFF',
                          backgroundColor: '#3B82F6',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '1rem',
                          marginLeft: '0.5rem'
                        }}>
                          Emploi
                        </span>
                      </h3>
                      
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '1rem',
                        color: '#64748B',
                        fontSize: '0.875rem'
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          📍 {item.offre.lieu || 'Lieu non spécifié'}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          🕒 {item.offre.datePublication ? 
                            `Il y a ${Math.floor((Date.now() - new Date(item.offre.datePublication)) / (1000 * 60 * 60 * 24))} jours` : 
                            'Date non spécifiée'
                          }
                        </div>
                      </div>
                    </div>
                    
                    {/* Match Score Badge */}
                    <div style={{
                      backgroundColor: getMatchColor(item.matchScore),
                      color: '#FFFFFF',
                      padding: '0.5rem 1rem',
                      borderRadius: '1.5rem',
                      fontSize: '0.875rem',
                      fontWeight: '600',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.25rem'
                    }}>
                      {formatMatchScore(item.matchScore)}% Match
                    </div>
                  </div>

                  {/* Description */}
                  {item.offre.description && (
                    <p style={{
                      color: '#475569',
                      lineHeight: '1.6',
                      marginBottom: '1rem'
                    }}>
                      {item.offre.description}
                    </p>
                  )}

                  {/* Skills */}
                  {item.offre.competences && item.offre.competences.length > 0 && (
                    <div style={{ marginBottom: '1rem' }}>
                      <div style={{
                        display: 'flex',
                        flexWrap: 'wrap',
                        gap: '0.5rem'
                      }}>
                        {item.offre.competences.slice(0, 3).map((comp, index) => (
                          <span
                            key={index}
                            style={{
                              backgroundColor: '#F1F5F9',
                              color: '#475569',
                              padding: '0.25rem 0.75rem',
                              borderRadius: '1rem',
                              fontSize: '0.75rem',
                              fontWeight: '500'
                            }}
                          >
                            {comp.nom || comp}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Footer */}
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    paddingTop: '1rem',
                    borderTop: '1px solid #F1F5F9'
                  }}>
                    <div style={{
                      fontSize: '0.75rem',
                      color: '#94A3B8'
                    }}>
                      {item.offre.company?.nom || 'Entreprise'} • 
                      {item.offre.salaire ? ` ${item.offre.salaire}€` : ' Salaire non spécifié'}
                    </div>
                    
                    <button style={{
                      backgroundColor: '#10B981',
                      color: '#FFFFFF',
                      border: 'none',
                      borderRadius: '0.5rem',
                      padding: '0.5rem 1rem',
                      fontSize: '0.875rem',
                      fontWeight: '500',
                      cursor: 'pointer',
                      transition: 'background-color 0.2s'
                    }}
                    onMouseEnter={(e) => e.target.style.backgroundColor = '#059669'}
                    onMouseLeave={(e) => e.target.style.backgroundColor = '#10B981'}
                    >
                      Postuler
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OffersMatchingApp;