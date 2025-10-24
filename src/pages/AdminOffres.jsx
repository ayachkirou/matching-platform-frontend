import React, { useState, useEffect } from 'react';

const AdminOffres = () => {
    const [offres, setOffres] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [searchTerm, setSearchTerm] = useState('');
    const [filterType, setFilterType] = useState('all');
    const [selectedOffre, setSelectedOffre] = useState(null);
    const [showDetailsModal, setShowDetailsModal] = useState(false);

    // Fonction pour récupérer les offres depuis l'API Spring Boot
    const fetchOffres = async () => {
        try {
            setLoading(true);
            setError('');
            
            console.log('🔄 Connexion à l API Spring Boot...');
            
            // Essayer différentes URLs d'API possibles
            const apiUrls = [
                'http://localhost:8080/api/admin/offres',
                'http://localhost:8080/api/offres',
                'http://localhost:8080/offres'
            ];
            
            let response;
            let lastError;
            
            for (const url of apiUrls) {
                try {
                    console.log(`📡 Tentative: ${url}`);
                    response = await fetch(url, {
                        method: 'GET',
                        headers: {
                            'Accept': 'application/json',
                            'Content-Type': 'application/json',
                        },
                    });
                    
                    if (response.ok) {
                        console.log(`✅ Succès avec: ${url}`);
                        break;
                    }
                } catch (err) {
                    lastError = err;
                    console.log(`❌ Échec avec: ${url}`, err.message);
                }
            }
            
            if (!response || !response.ok) {
                throw new Error(lastError?.message || 'Aucune API disponible');
            }
            
            const data = await response.json();
            console.log('📊 Données reçues:', data);
            
            // Adapter selon la structure de votre API Spring Boot
            let offresData = [];
            
            if (data.offres) {
                offresData = data.offres;
            } else if (data.content) {
                offresData = data.content;
            } else if (Array.isArray(data)) {
                offresData = data;
            } else {
                offresData = [data];
            }
            
            console.log(`✅ ${offresData.length} offres chargées depuis la base de données`);
            setOffres(offresData);
            
        } catch (err) {
            console.error('❌ Erreur critique:', err);
            setError(`Impossible de charger les offres depuis la base de données: ${err.message}`);
            setOffres([]);
        } finally {
            setLoading(false);
        }
    };

    // Récupérer les données au chargement du composant
    useEffect(() => {
        fetchOffres();
    }, []);

    // Fonction pour rafraîchir les données
    const handleRefresh = () => {
        fetchOffres();
    };

    // FONCTION DE SUPPRESSION CORRIGÉE
    const handleDelete = async (offreId, offreTitre) => {
        if (!window.confirm(`Êtes-vous sûr de vouloir supprimer définitivement l'offre "${offreTitre}" ?\n\nCette action est irréversible.`)) {
            return;
        }

        try {
            console.log(`🗑️ Tentative de suppression de l'offre ID: ${offreId}`);
            
            // Essayer plusieurs endpoints de suppression
            const deleteEndpoints = [
                `http://localhost:8080/api/admin/offres/${offreId}`,
                `http://localhost:8080/api/offres/${offreId}`,
                `http://localhost:8080/offres/${offreId}`
            ];
            
            let deleteSuccessful = false;
            let lastErrorMessage = '';
            
            for (const endpoint of deleteEndpoints) {
                try {
                    console.log(`📡 Tentative DELETE: ${endpoint}`);
                    
                    const response = await fetch(endpoint, {
                        method: 'DELETE',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                    });
                    
                    console.log(`📡 Réponse DELETE: ${response.status} ${response.statusText}`);
                    
                    if (response.ok) {
                        console.log(`✅ Suppression réussie avec: ${endpoint}`);
                        deleteSuccessful = true;
                        break;
                    } else {
                        const errorText = await response.text();
                        console.log(`❌ Erreur ${response.status}: ${errorText}`);
                        lastErrorMessage = `Erreur ${response.status}: ${errorText || 'Suppression échouée'}`;
                    }
                } catch (err) {
                    console.log(`❌ Erreur réseau avec ${endpoint}:`, err.message);
                    lastErrorMessage = err.message;
                }
            }
            
            if (deleteSuccessful) {
                // SUPPRESSION IMMÉDIATE de la liste locale
                setOffres(prevOffres => {
                    const nouvellesOffres = prevOffres.filter(offre => offre.id !== offreId);
                    console.log(`✅ Liste mise à jour: ${nouvellesOffres.length} offres restantes`);
                    return nouvellesOffres;
                });
                
                setError(`✅ Offre "${offreTitre}" supprimée avec succès`);
                setTimeout(() => setError(''), 3000);
                
            } else {
                // Si l'API DELETE ne fonctionne pas, essayer PUT pour désactiver
                console.log('🔄 Tentative de désactivation via PUT...');
                try {
                    const putResponse = await fetch(`http://localhost:8080/api/offres/${offreId}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({ active: false })
                    });
                    
                    if (putResponse.ok) {
                        console.log('✅ Offre désactivée avec succès');
                        setOffres(prevOffres => prevOffres.filter(offre => offre.id !== offreId));
                        setError(`✅ Offre "${offreTitre}" désactivée avec succès`);
                        setTimeout(() => setError(''), 3000);
                    } else {
                        throw new Error('Désactivation échouée');
                    }
                } catch {
                    // Si tout échoue, supprimer localement
                    console.log('⚠️ Suppression locale uniquement');
                    setOffres(prevOffres => prevOffres.filter(offre => offre.id !== offreId));
                    setError(`⚠️ Offre "${offreTitre}" supprimée localement (API non disponible)`);
                    setTimeout(() => setError(''), 3000);
                }
            }
            
        } catch (err) {
            console.error('❌ Erreur lors de la suppression:', err);
            setError(`❌ Erreur lors de la suppression: ${err.message}`);
        }
    };

    // Fonction pour afficher les détails d'une offre
    const handleViewDetails = (offre) => {
        setSelectedOffre(offre);
        setShowDetailsModal(true);
    };

    // Fermer le modal des détails
    const closeDetailsModal = () => {
        setShowDetailsModal(false);
        setSelectedOffre(null);
    };

    // Filtrer les offres selon la recherche et le type
    const filteredOffres = offres.filter(offre => {
        const matchesSearch = searchTerm === '' || 
                            offre.titre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            offre.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            offre.localisation?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                            offre.competencesRequises?.toLowerCase().includes(searchTerm.toLowerCase());
        
        const matchesType = filterType === 'all' || offre.typeOffre === filterType;
        
        return matchesSearch && matchesType;
    });

    // Formater la date
    const formatDate = (dateString) => {
        if (!dateString) return 'Non spécifiée';
        try {
            return new Date(dateString).toLocaleDateString('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });
        } catch (error) {
            return 'Date invalide';
        }
    };

    return (
        <div className="admin-container">
            <div className="admin-header">
                <h1>🎯 Gestion des Offres - Admin</h1>
                <p>Offres chargées directement depuis la base de données PostgreSQL</p>
            </div>

            {/* Message d'erreur ou succès */}
            {error && (
                <div className={`message ${error.includes('✅') ? 'success-message' : error.includes('⚠️') ? 'warning-message' : 'error-message'}`}>
                    {error}
                </div>
            )}

            <div className="admin-content">
                {/* Filtres et recherche */}
                <div className="admin-filters-section">
                    <div className="filters-container">
                        <div className="search-box">
                            <span className="search-icon">🔍</span>
                            <input 
                                type="text" 
                                placeholder="Rechercher par titre, description, localisation..." 
                                className="search-input"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            {searchTerm && (
                                <button 
                                    className="clear-search"
                                    onClick={() => setSearchTerm('')}
                                    title="Effacer la recherche"
                                >
                                    ✕
                                </button>
                            )}
                        </div>
                        
                        <div className="filter-group">
                            <div className="filter-item">
                                <span className="filter-icon">📊</span>
                                <select 
                                    className="filter-select"
                                    value={filterType}
                                    onChange={(e) => setFilterType(e.target.value)}
                                >
                                    <option value="all">Tous les types</option>
                                    <option value="stage">🎓 Stages</option>
                                    <option value="emploi">💼 Emplois</option>
                                </select>
                            </div>
                        </div>

                        <button 
                            className="refresh-btn" 
                            onClick={handleRefresh}
                            disabled={loading}
                        >
                            <span className="refresh-icon">🔄</span>
                            {loading ? 'Chargement...' : 'Actualiser'}
                        </button>
                    </div>

                    <div className="results-info">
                        <span className="results-count">
                            {filteredOffres.length} offre(s) sur {offres.length} au total
                        </span>
                        {searchTerm && (
                            <span className="search-info">
                                • Recherche: "{searchTerm}"
                            </span>
                        )}
                        {filterType !== 'all' && (
                            <span className="filter-info">
                                • Filtre: {filterType === 'emploi' ? 'Emplois' : 'Stages'}
                            </span>
                        )}
                    </div>
                </div>

                {/* Tableau des offres */}
                <div className="admin-table-container">
                    {loading ? (
                        <div className="loading-container">
                            <div className="loading-spinner"></div>
                            <p>Connexion à la base de données...</p>
                            <small>Chargement des offres depuis PostgreSQL</small>
                        </div>
                    ) : filteredOffres.length === 0 ? (
                        <div className="empty-state">
                            <div className="empty-icon">📭</div>
                            <h3>Aucune offre trouvée</h3>
                            <p>
                                {offres.length === 0 
                                    ? "La base de données ne contient aucune offre pour le moment."
                                    : "Aucune offre ne correspond à vos critères de recherche."
                                }
                            </p>
                            {offres.length === 0 && (
                                <button className="btn-primary" onClick={handleRefresh}>
                                    🔄 Vérifier à nouveau
                                </button>
                            )}
                        </div>
                    ) : (
                        <div className="table-wrapper">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>Titre de l'offre</th>
                                        <th>Entreprise</th>
                                        <th>Type</th>
                                        <th>Localisation</th>
                                        <th>Date Publication</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredOffres.map((offre) => (
                                        <tr key={offre.id} className="table-row">
                                            <td>
                                                <div className="offre-title">
                                                    <strong>{offre.titre}</strong>
                                                    <div className="offre-description">
                                                        {offre.description?.substring(0, 80)}...
                                                    </div>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="entreprise-info">
                                                    <span className="entreprise-icon">🏢</span>
                                                    ID: {offre.companyId}
                                                </div>
                                            </td>
                                            <td>
                                                <span className={`badge ${offre.typeOffre === 'emploi' ? 'badge-emploi' : 'badge-stage'}`}>
                                                    {offre.typeOffre === 'emploi' ? '💼 Emploi' : '🎓 Stage'}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="localisation">
                                                    <span className="location-icon">📍</span>
                                                    {offre.localisation || 'Non spécifiée'}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="date-publication">
                                                    {formatDate(offre.datePublication)}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="actions-buttons">
                                                    <button 
                                                        className="btn-view"
                                                        onClick={() => handleViewDetails(offre)}
                                                        title="Voir les détails complets"
                                                    >
                                                        <span className="btn-icon">👁️</span>
                                                        Détails
                                                    </button>
                                                    <button 
                                                        className="btn-delete"
                                                        onClick={() => handleDelete(offre.id, offre.titre)}
                                                        title="Supprimer définitivement de la base de données"
                                                    >
                                                        <span className="btn-icon">🗑️</span>
                                                        Supprimer
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>

            {/* Modal des détails de l'offre */}
            {showDetailsModal && selectedOffre && (
                <div className="modal-overlay" onClick={closeDetailsModal}>
                    <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                        <div className="modal-header">
                            <h2>📋 Détails de l'Offre</h2>
                            <button className="modal-close" onClick={closeDetailsModal}>
                                ✕
                            </button>
                        </div>
                        
                        <div className="modal-body">
                            <div className="detail-section">
                                <h3>🏷️ Informations Générales</h3>
                                <div className="detail-grid">
                                    <div className="detail-item">
                                        <label>Titre:</label>
                                        <span>{selectedOffre.titre}</span>
                                    </div>
                                    <div className="detail-item">
                                        <label>Type:</label>
                                        <span className={`badge ${selectedOffre.typeOffre === 'emploi' ? 'badge-emploi' : 'badge-stage'}`}>
                                            {selectedOffre.typeOffre === 'emploi' ? '💼 Emploi' : '🎓 Stage'}
                                        </span>
                                    </div>
                                    <div className="detail-item">
                                        <label>Entreprise ID:</label>
                                        <span>🏢 {selectedOffre.companyId}</span>
                                    </div>
                                    <div className="detail-item">
                                        <label>Localisation:</label>
                                        <span>📍 {selectedOffre.localisation || 'Non spécifiée'}</span>
                                    </div>
                                    <div className="detail-item">
                                        <label>Date de publication:</label>
                                        <span>📅 {formatDate(selectedOffre.datePublication)}</span>
                                    </div>
                                </div>
                            </div>

                            <div className="detail-section">
                                <h3>📝 Description</h3>
                                <div className="description-content">
                                    {selectedOffre.description || 'Aucune description disponible'}
                                </div>
                            </div>

                            {selectedOffre.competencesRequises && (
                                <div className="detail-section">
                                    <h3>🛠️ Compétences Requises</h3>
                                    <div className="competences-content">
                                        {selectedOffre.competencesRequises}
                                    </div>
                                </div>
                            )}
                        </div>
                        
                        <div className="modal-footer">
                            <button className="btn-secondary" onClick={closeDetailsModal}>
                                Fermer
                            </button>
                            <button 
                                className="btn-delete"
                                onClick={() => {
                                    closeDetailsModal();
                                    setTimeout(() => {
                                        handleDelete(selectedOffre.id, selectedOffre.titre);
                                    }, 300);
                                }}
                            >
                                🗑️ Supprimer cette offre
                            </button>
                        </div>
                    </div>
                </div>
            )}

            <style jsx>{`
                .admin-container {
                    padding: 2rem;
                    max-width: 1400px;
                    margin: 0 auto;
                    background: var(--background);
                    min-height: 100vh;
                }

                .admin-header {
                    text-align: center;
                    margin-bottom: 2rem;
                }

                .admin-header h1 {
                    color: var(--primary-color);
                    margin-bottom: 0.5rem;
                    font-size: 2.5rem;
                }

                .admin-header p {
                    color: var(--text-light);
                    font-size: 1.1rem;
                }

                .message {
                    padding: 1rem 1.5rem;
                    border-radius: var(--radius);
                    margin-bottom: 1.5rem;
                    font-weight: 500;
                }

                .error-message {
                    background: #ffebee;
                    color: #c62828;
                    border-left: 4px solid #c62828;
                }

                .success-message {
                    background: #e8f5e8;
                    color: var(--primary-dark);
                    border-left: 4px solid var(--primary-color);
                }

                .warning-message {
                    background: #fff3e0;
                    color: #e65100;
                    border-left: 4px solid #e65100;
                }

                /* Modal Styles */
                .modal-overlay {
                    position: fixed;
                    top: 0;
                    left: 0;
                    right: 0;
                    bottom: 0;
                    background: rgba(0, 0, 0, 0.6);
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    z-index: 1000;
                    padding: 1rem;
                }

                .modal-content {
                    background: var(--white);
                    border-radius: var(--radius);
                    box-shadow: var(--shadow-hover);
                    max-width: 700px;
                    width: 100%;
                    max-height: 90vh;
                    overflow-y: auto;
                }

                .modal-header {
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                    padding: 1.5rem;
                    border-bottom: 1px solid var(--gray);
                    background: var(--primary-light);
                }

                .modal-header h2 {
                    color: var(--primary-color);
                    margin: 0;
                }

                .modal-close {
                    background: none;
                    border: none;
                    font-size: 1.5rem;
                    cursor: pointer;
                    color: var(--text-light);
                    padding: 0.5rem;
                }

                .modal-close:hover {
                    color: var(--primary-color);
                }

                .modal-body {
                    padding: 1.5rem;
                }

                .detail-section {
                    margin-bottom: 2rem;
                }

                .detail-section h3 {
                    color: var(--primary-color);
                    margin-bottom: 1rem;
                    font-size: 1.1rem;
                }

                .detail-grid {
                    display: grid;
                    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                    gap: 1rem;
                }

                .detail-item {
                    display: flex;
                    flex-direction: column;
                    gap: 0.25rem;
                }

                .detail-item label {
                    font-weight: 600;
                    color: var(--text-light);
                    font-size: 0.9rem;
                }

                .detail-item span {
                    color: var(--text-color);
                }

                .description-content, .competences-content {
                    background: var(--gray-light);
                    padding: 1rem;
                    border-radius: var(--radius);
                    line-height: 1.5;
                    white-space: pre-wrap;
                }

                .modal-footer {
                    display: flex;
                    justify-content: space-between;
                    padding: 1.5rem;
                    border-top: 1px solid var(--gray);
                    gap: 1rem;
                }

                .btn-secondary {
                    padding: 0.75rem 1.5rem;
                    background: var(--gray-light);
                    color: var(--text-color);
                    border: none;
                    border-radius: var(--radius);
                    cursor: pointer;
                    transition: var(--transition);
                }

                .btn-secondary:hover {
                    background: var(--gray-dark);
                }

                /* Le reste du CSS reste identique */
                .admin-filters-section {
                    background: var(--white);
                    padding: 1.5rem;
                    border-radius: var(--radius);
                    box-shadow: var(--shadow);
                    margin-bottom: 2rem;
                }

                .filters-container {
                    display: flex;
                    gap: 1rem;
                    align-items: center;
                    flex-wrap: wrap;
                    margin-bottom: 1rem;
                }

                .search-box {
                    position: relative;
                    flex: 1;
                    min-width: 300px;
                }

                .search-icon {
                    position: absolute;
                    left: 12px;
                    top: 50%;
                    transform: translateY(-50%);
                    color: var(--text-lighter);
                }

                .search-input {
                    width: 100%;
                    padding: 0.75rem 1rem 0.75rem 2.5rem;
                    border: 1px solid var(--gray);
                    border-radius: var(--radius);
                    font-size: 0.9rem;
                    transition: var(--transition);
                }

                .clear-search {
                    position: absolute;
                    right: 10px;
                    top: 50%;
                    transform: translateY(-50%);
                    background: none;
                    border: none;
                    cursor: pointer;
                    color: var(--text-lighter);
                }

                .search-input:focus {
                    outline: none;
                    border-color: var(--primary-color);
                    box-shadow: 0 0 0 2px var(--primary-light);
                }

                .filter-group {
                    display: flex;
                    gap: 1rem;
                }

                .filter-item {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                }

                .filter-icon {
                    color: var(--text-light);
                }

                .filter-select {
                    padding: 0.75rem 1rem;
                    border: 1px solid var(--gray);
                    border-radius: var(--radius);
                    background: var(--white);
                    font-size: 0.9rem;
                    cursor: pointer;
                    transition: var(--transition);
                }

                .filter-select:focus {
                    outline: none;
                    border-color: var(--primary-color);
                }

                .refresh-btn {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    padding: 0.75rem 1.5rem;
                    background: var(--primary-color);
                    color: var(--white);
                    border: none;
                    border-radius: var(--radius);
                    cursor: pointer;
                    transition: var(--transition);
                    font-size: 0.9rem;
                }

                .refresh-btn:hover:not(:disabled) {
                    background: var(--primary-dark);
                    transform: translateY(-1px);
                }

                .refresh-btn:disabled {
                    opacity: 0.6;
                    cursor: not-allowed;
                }

                .results-info {
                    display: flex;
                    gap: 1rem;
                    flex-wrap: wrap;
                    color: var(--text-light);
                    font-size: 0.9rem;
                }

                .search-info, .filter-info {
                    background: var(--primary-light);
                    padding: 0.2rem 0.5rem;
                    border-radius: 12px;
                    font-size: 0.8rem;
                }

                .admin-table-container {
                    background: var(--white);
                    border-radius: var(--radius);
                    box-shadow: var(--shadow);
                    overflow: hidden;
                }

                .loading-container {
                    padding: 3rem;
                    text-align: center;
                    color: var(--text-light);
                }

                .loading-spinner {
                    width: 40px;
                    height: 40px;
                    border: 3px solid var(--gray-light);
                    border-top: 3px solid var(--primary-color);
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                    margin: 0 auto 1rem;
                }

                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }

                .empty-state {
                    padding: 3rem;
                    text-align: center;
                    color: var(--text-light);
                }

                .empty-icon {
                    font-size: 3rem;
                    margin-bottom: 1rem;
                }

                .btn-primary {
                    background: var(--primary-color);
                    color: white;
                    border: none;
                    padding: 0.75rem 1.5rem;
                    border-radius: var(--radius);
                    cursor: pointer;
                    margin-top: 1rem;
                }

                .table-wrapper {
                    overflow-x: auto;
                }

                .admin-table {
                    width: 100%;
                    border-collapse: collapse;
                }

                .admin-table th {
                    background: var(--primary-color);
                    color: var(--white);
                    padding: 1.2rem 1rem;
                    text-align: left;
                    font-weight: 600;
                    font-size: 0.9rem;
                }

                .admin-table td {
                    padding: 1.2rem 1rem;
                    border-bottom: 1px solid var(--gray-light);
                }

                .table-row:hover {
                    background: var(--primary-light);
                }

                .offre-title strong {
                    color: var(--text-color);
                    display: block;
                    margin-bottom: 0.25rem;
                }

                .offre-description {
                    color: var(--text-light);
                    font-size: 0.8rem;
                    line-height: 1.3;
                }

                .entreprise-info, .localisation {
                    display: flex;
                    align-items: center;
                    gap: 0.5rem;
                    color: var(--text-light);
                }

                .badge {
                    padding: 0.4rem 0.8rem;
                    border-radius: 20px;
                    font-size: 0.8rem;
                    font-weight: 600;
                    display: inline-block;
                }

                .badge-emploi {
                    background: var(--primary-light);
                    color: var(--primary-dark);
                }

                .badge-stage {
                    background: #e3f2fd;
                    color: #1565c0;
                }

                .date-publication {
                    color: var(--text-light);
                    font-size: 0.9rem;
                }

                .actions-buttons {
                    display: flex;
                    gap: 0.5rem;
                }

                .btn-view, .btn-delete {
                    display: flex;
                    align-items: center;
                    gap: 0.3rem;
                    padding: 0.5rem 0.8rem;
                    border: none;
                    border-radius: var(--radius);
                    cursor: pointer;
                    font-size: 0.8rem;
                    transition: var(--transition);
                }

                .btn-view {
                    background: var(--primary-light);
                    color: var(--primary-dark);
                }

                .btn-view:hover {
                    background: var(--primary-color);
                    color: var(--white);
                }

                .btn-delete {
                    background: #ffebee;
                    color: #c62828;
                }

                .btn-delete:hover {
                    background: #c62828;
                    color: var(--white);
                }

                @media (max-width: 768px) {
                    .admin-container {
                        padding: 1rem;
                    }

                    .filters-container {
                        flex-direction: column;
                        align-items: stretch;
                    }

                    .search-box {
                        min-width: auto;
                    }

                    .actions-buttons {
                        flex-direction: column;
                    }

                    .admin-table {
                        font-size: 0.8rem;
                    }

                    .admin-table th,
                    .admin-table td {
                        padding: 0.8rem 0.5rem;
                    }

                    .modal-content {
                        margin: 1rem;
                    }

                    .modal-footer {
                        flex-direction: column;
                    }

                    .detail-grid {
                        grid-template-columns: 1fr;
                    }
                }
            `}</style>
        </div>
    );
};

export default AdminOffres;