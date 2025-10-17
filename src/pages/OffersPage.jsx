import React, { useState, useEffect } from 'react';
import OffreList from '../components/OffreList';
import OffreForm from '../components/OffreForm';
import OffreDetails from '../components/OffreDetails';
import { offreService } from '../services/offreService';

const icons = {
  plus: '➕',
  close: '❌'
};

function OffersPage() {
  const [offres, setOffres] = useState([]);
  const [filteredOffres, setFilteredOffres] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedOffre, setSelectedOffre] = useState(null);
  const [view, setView] = useState('list');
  const [activeOffre, setActiveOffre] = useState(null);
  const [error, setError] = useState(null);

  // Chargement initial
  useEffect(() => {
    loadOffres();
  }, []);

  // Chargement des offres
  const loadOffres = async () => {
    setLoading(true);
    setError(null);
    
    try {
      console.log('🔄 Chargement des offres depuis le backend...');
      const response = await offreService.getAll();
      const offresData = response.data || [];
      console.log('✅ Données reçues:', offresData);
      
      setOffres(offresData);
      setFilteredOffres(offresData);
      
    } catch (error) {
      console.error('❌ Erreur lors du chargement:', error);
      setError('Impossible de charger les offres depuis le serveur');
      setOffres([]);
      setFilteredOffres([]);
    } finally {
      setLoading(false);
    }
  };

  // CRUD Operations
  const handleCreate = () => {
    setSelectedOffre(null);
    setIsModalOpen(true);
  };

  const handleEdit = (offre) => {
    setSelectedOffre(offre);
    setIsModalOpen(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Êtes-vous sûr de vouloir supprimer cette offre ?')) return;

    try {
      await offreService.delete(id);
      alert('✅ Offre supprimée avec succès');
      await loadOffres();
      
      if (view === 'details' && activeOffre?.id === id) {
        setView('list');
        setActiveOffre(null);
      }
    } catch (error) {
      console.error('❌ Erreur suppression:', error);
      alert('Erreur lors de la suppression');
    }
  };

  const handleSaveSuccess = async () => {
    setIsModalOpen(false);
    setSelectedOffre(null);
    await loadOffres();
    alert(selectedOffre ? '✅ Offre modifiée avec succès' : '✅ Offre créée avec succès');
  };

  const handleViewDetails = (offre) => {
    setActiveOffre(offre);
    setView('details');
  };

  const handleBackToList = () => {
    setView('list');
    setActiveOffre(null);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedOffre(null);
  };

  return (
    <div className="offers-page">
      <div className="content-header">
        <h2>Gestion des offres</h2>
        <button onClick={handleCreate} className="btn btn-primary">
          {icons.plus} Nouvelle Offre
        </button>
      </div>

      {error && (
        <div className="error-banner">
          <h3>❌ Erreur</h3>
          <p>{error}</p>
          <button onClick={loadOffres} className="btn btn-secondary">
            🔄 Réessayer
          </button>
        </div>
      )}

      {view === 'list' ? (
        <OffreList
          offres={filteredOffres}
          loading={loading}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onView={handleViewDetails}
        />
      ) : (
        <OffreDetails
          offre={activeOffre}
          onBack={handleBackToList}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      {/* Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-container">
            <div className="modal-header">
              <h2>{selectedOffre ? "Modifier l'offre" : "Créer une nouvelle offre"}</h2>
              <button className="modal-close" onClick={handleModalClose}>
                {icons.close}
              </button>
            </div>
            <div className="modal-content">
              <OffreForm 
                offre={selectedOffre} 
                onSave={handleSaveSuccess} 
                onCancel={handleModalClose} 
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default OffersPage;