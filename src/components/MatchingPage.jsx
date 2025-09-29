import React, { useState, useEffect } from 'react';
import './MatchingPage.css';

const MatchingPage = () => {
    const [offers, setOffers] = useState([]);
    const [filteredOffers, setFilteredOffers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [minMatch, setMinMatch] = useState('90%+');
    const [loading, setLoading] = useState(false);
    
    // ID de l'étudiant connecté (
    // à adapter selon votre système d'auth)
    const studentId = 1;

    useEffect(() => {
        fetchMatchingOffers();
    }, [minMatch]);

    useEffect(() => {
        filterOffers();
    }, [searchTerm, offers]);

    const fetchMatchingOffers = async () => {
        setLoading(true);
        try {
            const minMatchValue = parseInt(minMatch.replace('%+', ''));
            const response = await fetch(
                `http://localhost:8080/api/matching/student/${studentId}?minMatch=${minMatchValue}`
            );
            
            if (response.ok) {
                const data = await response.json();
                setOffers(data);
                setFilteredOffers(data);
            } else {
                console.error('Erreur lors de la récupération des offres');
                setOffers([]);
                setFilteredOffers([]);
            }
        } catch (error) {
            console.error('Erreur réseau:', error);
            setOffers([]);
            setFilteredOffers([]);
        } finally {
            setLoading(false);
        }
    };

    const filterOffers = () => {
        if (!searchTerm.trim()) {
            setFilteredOffers(offers);
            return;
        }

        const filtered = offers.filter(offerMatch => {
            const offer = offerMatch.offre;
            return (
                offer.titre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                offer.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                offer.localisation.toLowerCase().includes(searchTerm.toLowerCase()) ||
                offer.competencesList.some(comp => 
                    comp.toLowerCase().includes(searchTerm.toLowerCase())
                )
            );
        });

        setFilteredOffers(filtered);
    };

    const handleApply = (offerId) => {
        // Logique pour postuler à l'offre
        console.log(`Postuler à l'offre ${offerId}`);
        alert('Candidature envoyée avec succès !');
    };

    const formatDate = (timestamp) => {
        if (!timestamp) return 'N/A';
        return new Date(timestamp).toLocaleDateString('fr-FR');
    };

    return (
        <div className="matching-container">
            {/* Header */}
            <div className="header">
                <div className="logo">
                    <span className="logo-text">TalentMatch</span>
                </div>
                <nav className="nav-menu">
                    <a href="#" className="nav-item">Student</a>
                    <a href="#" className="nav-item active">Matching</a>
                    <a href="#" className="nav-item">Offres</a>
                    <a href="#" className="nav-item">Mes Candidatures</a>
                    <a href="#" className="nav-item">Profil</a>
                </nav>
            </div>

            {/* Main Content */}
            <div className="main-content">
                <h1 className="page-title">matching</h1>

                {/* Search and Filter */}
                <div className="search-section">
                    <div className="search-container">
                        <label htmlFor="search">Rechercher</label>
                        <input
                            id="search"
                            type="text"
                            placeholder="Rechercher..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="search-input"
                        />
                    </div>

                    <div className="filter-container">
                        <label htmlFor="match-filter">match minimum</label>
                        <select
                            id="match-filter"
                            value={minMatch}
                            onChange={(e) => setMinMatch(e.target.value)}
                            className="match-filter"
                        >
                            <option value="90%+">90%+</option>
                            <option value="80%+">80%+</option>
                            <option value="70%+">70%+</option>
                            <option value="60%+">60%+</option>
                            <option value="50%+">50%+</option>
                        </select>
                    </div>
                </div>

                {/* Offers List */}
                <div className="offers-section">
                    {loading ? (
                        <div className="loading">Chargement des offres correspondantes...</div>
                    ) : filteredOffers.length === 0 ? (
                        <div className="no-offers">
                            Aucune offre correspondante trouvée avec un match minimum de {minMatch}
                        </div>
                    ) : (
                        filteredOffers.map((offerMatch, index) => (
                            <div key={offerMatch.offre.id || index} className="offer-card">
                                <div className="offer-header">
                                    <div className="offer-title-section">
                                        <h3 className="offer-title">{offerMatch.offre.titre}</h3>
                                        <span className="offer-badge">Emploi</span>
                                        <div className="match-score">{offerMatch.matchPercentage} Match</div>
                                    </div>
                                    <button 
                                        onClick={() => handleApply(offerMatch.offre.id)}
                                        className="apply-btn"
                                    >
                                        Postuler
                                    </button>
                                </div>

                                <div className="offer-details">
                                    <div className="offer-info">
                                        <span className="location">📍 {offerMatch.offre.localisation}</span>
                                        <span className="date">🗓 Il y a {formatDate(offerMatch.offre.datePublication)}</span>
                                    </div>
                                    
                                    <div className="offer-description">
                                        <p>{offerMatch.offre.description}</p>
                                    </div>

                                    <div className="offer-skills">
                                        {offerMatch.offre.competencesList && offerMatch.offre.competencesList.map((competence, idx) => (
                                            <span key={idx} className="skill-tag">
                                                {competence}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default MatchingPage;