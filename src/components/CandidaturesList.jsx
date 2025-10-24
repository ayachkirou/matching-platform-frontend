import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import candidatureService from '../services/candidatureService'; // Import modifié
import './CandidaturesList.css';

const CandidaturesList = () => {
    const { id: offreId } = useParams();
    const navigate = useNavigate();
    const [candidatures, setCandidatures] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        loadCandidatures();
    }, [offreId]);

    const loadCandidatures = async () => {
        try {
            setLoading(true);
            setError(null);
            // Utilisez la méthode de votre service
            const data = await candidatureService.getCandidaturesByOffre(offreId);
            setCandidatures(data);
        } catch (err) {
            setError('Erreur lors du chargement des candidatures. Vérifiez que le backend est démarré.');
            console.error('Erreur détaillée:', err);
        } finally {
            setLoading(false);
        }
    };

    const updateStatut = async (candidatureId, nouveauStatut) => {
        try {
            // Utilisez la méthode de votre service
            await candidatureService.updateStatut(candidatureId, nouveauStatut);
            // Recharger la liste après mise à jour
            await loadCandidatures();
        } catch (err) {
            setError('Erreur lors de la mise à jour du statut');
            console.error('Erreur détaillée:', err);
        }
    };

    const getStatutBadgeClass = (statut) => {
        const statutMap = {
            'EN_ATTENTE': 'statut-en_attente',
            'EN_COURS_ETUDE': 'statut-en_cours_etude',
            'ACCEPTEE': 'statut-acceptee',
            'REFUSEE': 'statut-refusee'
        };
        return statutMap[statut] || 'statut-en_attente';
    };

    const getStatutDisplayName = (statut) => {
        const displayMap = {
            'EN_ATTENTE': 'En attente',
            'EN_COURS_ETUDE': 'En cours d\'étude',
            'ACCEPTEE': 'Acceptée',
            'REFUSEE': 'Refusée'
        };
        return displayMap[statut] || statut;
    };

    if (loading) {
        return (
            <div className="candidatures-container">
                <div className="loading">
                    <div className="spinner"></div>
                    <p>Chargement des candidatures...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="candidatures-container">
                <div className="error-message">
                    <i className="fas fa-exclamation-triangle"></i>
                    <h3>{error}</h3>
                    <p>Assurez-vous que le serveur backend est démarré sur le port 8080.</p>
                    <button onClick={loadCandidatures} className="btn btn-retry">
                        Réessayer
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="candidatures-container">
            <div className="candidatures-header">
                <button 
                    onClick={() => navigate(-1)} 
                    className="btn btn-back"
                >
                    <i className="fas fa-arrow-left"></i>
                    Retour aux offres
                </button>
                <div className="header-content">
                    <h1>Candidatures pour l'offre #{offreId}</h1>
                    <div className="candidatures-count">
                        {candidatures.length} candidature(s)
                    </div>
                </div>
                <button onClick={loadCandidatures} className="btn btn-refresh">
                    <i className="fas fa-sync-alt"></i>
                    Actualiser
                </button>
            </div>

            {candidatures.length === 0 ? (
                <div className="no-candidatures">
                    <i className="fas fa-users-slash"></i>
                    <h3>Aucune candidature pour cette offre</h3>
                    <p>Les candidatures des étudiants apparaîtront ici lorsqu'ils postuleront.</p>
                </div>
            ) : (
                <div className="candidatures-list">
                    {candidatures.map((candidature) => (
                        <div key={candidature.id} className="candidature-card">
                            <div className="candidature-header">
                                <div className="student-info">
                                    <h3>{candidature.prenom} {candidature.nom}</h3>
                                    <p className="student-email">
                                        <i className="fas fa-envelope"></i>
                                        {candidature.email}
                                    </p>
                                    <p className="student-diplome">
                                        <i className="fas fa-graduation-cap"></i>
                                        <strong>Diplôme:</strong> {candidature.diplome} - {candidature.etablissement}
                                    </p>
                                </div>
                                <div className="candidature-meta">
                                    <span className={`statut-badge ${getStatutBadgeClass(candidature.statut)}`}>
                                        {getStatutDisplayName(candidature.statut)}
                                    </span>
                                    <span className="date-candidature">
                                        <i className="fas fa-calendar"></i>
                                        Postulé le: {new Date(candidature.dateCandidature).toLocaleDateString('fr-FR')}
                                    </span>
                                </div>
                            </div>

                            <div className="candidature-content">
                                <div className="competences-section">
                                    <h4>
                                        <i className="fas fa-tools"></i>
                                        Compétences
                                    </h4>
                                    <p>{candidature.competences || 'Aucune compétence spécifiée'}</p>
                                </div>
                                
                                {candidature.cv && (
                                    <div className="cv-section">
                                        <h4>
                                            <i className="fas fa-file-pdf"></i>
                                            CV
                                        </h4>
                                        <a 
                                            href={`http://localhost:8080/uploads/${candidature.cv}`} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="cv-link"
                                        >
                                            <i className="fas fa-download"></i>
                                            Télécharger le CV
                                        </a>
                                    </div>
                                )}
                            </div>

                            <div className="candidature-actions">
                                <div className="statut-control">
                                    <label>Statut:</label>
                                    <select 
                                        value={candidature.statut}
                                        onChange={(e) => updateStatut(candidature.id, e.target.value)}
                                        className="statut-select"
                                    >
                                        <option value="EN_ATTENTE">En attente</option>
                                        <option value="EN_COURS_ETUDE">En cours d'étude</option>
                                        <option value="ACCEPTEE">Acceptée</option>
                                        <option value="REFUSEE">Refusée</option>
                                    </select>
                                </div>

                                <div className="action-buttons">
                                    <button className="btn btn-contact">
                                        <i className="fas fa-envelope"></i>
                                        Contacter
                                    </button>
                                    <button className="btn btn-profile">
                                        <i className="fas fa-eye"></i>
                                        Voir profil
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CandidaturesList;