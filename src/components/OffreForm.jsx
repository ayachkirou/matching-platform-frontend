import React, { useEffect, useState } from 'react';
import { offreService } from '../services/offreService';

const OffreForm = ({ offre, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    titre: '',
    description: '',
    competencesRequises: '',
    typeOffre: 'stage',
    localisation: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (offre) {
      setFormData({
        titre: offre.titre || '',
        description: offre.description || '',
        competencesRequises: offre.competencesRequises || '',
        typeOffre: offre.typeOffre || 'stage',
        localisation: offre.localisation || ''
      });
    }
  }, [offre]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      const offreData = {
        ...formData,
        companyId: 1,
      };

      if (offre) {
        await offreService.update(offre.id, offreData);
      } else {
        await offreService.create(offreData);
      }
      
      onSave();
    } catch (error) {
      alert(offre ? 'Erreur lors de la modification' : 'Erreur lors de la création');
      console.error('Erreur:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="form-container">
      <div className="form-backdrop" onClick={onCancel}></div>
      
      <div className="form-card">
        {/* Header blanc avec texte vert */}
        <div className="form-header">
          <div className="header-content">
            <div className="header-text">
              <h2>{offre ? 'Modifier l\'offre' : 'Nouvelle Offre'}</h2>
              <p>{offre ? 'Actualisez les détails de votre offre' : 'Complétez les informations pour publier une nouvelle offre'}</p>
            </div>
          </div>
          <button className="close-btn" onClick={onCancel}>
            <i className="fas fa-times"></i>
          </button>
        </div>

        {/* Formulaire design glassmorphism */}
        <form onSubmit={handleSubmit} className="modern-form">
          <div className="form-sections">
            {/* Section Informations de base */}
            <div className="form-section">
              <div className="section-header">
                <div className="section-icon">
                  <i className="fas fa-info-circle"></i>
                </div>
                <h3>Informations principales</h3>
              </div>
              
              <div className="form-grid">
                <div className="form-group">
                  <div className="input-container">
                    <i className="input-icon fas fa-heading"></i>
                    <input
                      type="text"
                      name="titre"
                      value={formData.titre}
                      onChange={handleChange}
                      required
                      className="modern-input"
                      placeholder="Titre de l'offre *"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <div className="input-container">
                    <i className="input-icon fas fa-tag"></i>
                    <select
                      name="typeOffre"
                      value={formData.typeOffre}
                      onChange={handleChange}
                      required
                      className="modern-select"
                    >
                      <option value="stage">Stage</option>
                      <option value="CDI">CDI</option>
                      <option value="CDD">CDD</option>
                      <option value="alternance">Alternance</option>
                    </select>
                    <i className="select-arrow fas fa-chevron-down"></i>
                  </div>
                </div>

                <div className="form-group">
                  <div className="input-container">
                    <i className="input-icon fas fa-map-marker-alt"></i>
                    <input
                      type="text"
                      name="localisation"
                      value={formData.localisation}
                      onChange={handleChange}
                      className="modern-input"
                      placeholder="Localisation"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Section Description */}
            <div className="form-section">
              <div className="section-header">
                <div className="section-icon">
                  <i className="fas fa-file-alt"></i>
                </div>
                <h3>Description détaillée</h3>
              </div>
              
              <div className="form-group">
                <div className="textarea-container">
                  <i className="textarea-icon fas fa-align-left"></i>
                  <textarea
                    name="description"
                    value={formData.description}
                    onChange={handleChange}
                    required
                    rows={5}
                    className="modern-textarea"
                    placeholder="Décrivez les missions, responsabilités et avantages du poste... *"
                  />
                </div>
              </div>
            </div>

            {/* Section Compétences */}
            <div className="form-section">
              <div className="section-header">
                <div className="section-icon">
                  <i className="fas fa-tools"></i>
                </div>
                <h3>Compétences requises</h3>
              </div>
              
              <div className="form-group">
                <div className="textarea-container">
                  <i className="textarea-icon fas fa-code"></i>
                  <textarea
                    name="competencesRequises"
                    value={formData.competencesRequises}
                    onChange={handleChange}
                    rows={3}
                    className="modern-textarea"
                    placeholder="Java, React, Spring Boot, PostgreSQL... (séparées par des virgules)"
                  />
                </div>
                <div className="input-hint">
                  <i className="fas fa-lightbulb"></i>
                  Séparez les compétences par des virgules pour une meilleure lisibilité
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="form-actions">
            <div className="action-buttons">
              <button 
                type="button" 
                onClick={onCancel} 
                className="btn btn-outline"
                disabled={isSubmitting}
              >
                <i className="fas fa-arrow-left"></i>
                Retour
              </button>
              <button 
                type="submit" 
                className="btn btn-primary"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <div className="btn-spinner"></div>
                    {offre ? 'Enregistrement...' : 'Publication...'}
                  </>
                ) : (
                  <>
                    <i className={`fas ${offre ? 'fa-check' : 'fa-paper-plane'}`}></i>
                    {offre ? 'Mettre à jour' : 'Publier l\'offre'}
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>

      <style jsx>{`
        .form-container {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          padding: 20px;
        }
        
        .form-backdrop {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
          backdrop-filter: blur(8px);
          animation: backdropEnter 0.4s ease;
        }
        
        .form-card {
          background: white;
          border-radius: 20px;
          box-shadow: 
            0 25px 50px rgba(0, 0, 0, 0.15),
            0 10px 30px rgba(57, 118, 39, 0.1);
          width: 100%;
          max-width: 900px;
          max-height: 95vh;
          overflow: hidden;
          position: relative;
          animation: cardEnter 0.5s cubic-bezier(0.4, 0, 0.2, 1);
          border: 1px solid rgba(57, 118, 39, 0.1);
        }
        
        .form-header {
          padding: 30px 40px;
          background: white;
          border-bottom: 1px solid rgba(57, 118, 39, 0.1);
          position: relative;
        }
        
        .header-content {
          display: flex;
          align-items: center;
          gap: 20px;
        }
        
        .header-text h2 {
          margin: 0 0 8px 0;
          font-size: 1.8rem;
          font-weight: 700;
          color: #397627;
          background: linear-gradient(135deg, #397627 0%, #2c5e1e 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        
        .header-text p {
          margin: 0;
          color: #636e72;
          font-size: 1rem;
          opacity: 0.8;
        }
        
        .close-btn {
          position: absolute;
          top: 25px;
          right: 25px;
          background: #f8f9fa;
          border: 1px solid #e9ecef;
          border-radius: 10px;
          width: 40px;
          height: 40px;
          color: #636e72;
          cursor: pointer;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }
        
        .close-btn:hover {
          background: #397627;
          color: white;
          border-color: #397627;
          transform: rotate(90deg);
        }
        
        .modern-form {
          padding: 0;
          max-height: calc(95vh - 120px);
          overflow-y: auto;
          background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
        }
        
        .form-sections {
          padding: 40px;
        }
        
        .form-section {
          margin-bottom: 30px;
          padding: 30px;
          background: white;
          border-radius: 16px;
          border: 1px solid rgba(57, 118, 39, 0.1);
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
          transition: all 0.3s ease;
        }
        
        .form-section:hover {
          box-shadow: 0 8px 25px rgba(57, 118, 39, 0.1);
          transform: translateY(-2px);
        }
        
        .section-header {
          display: flex;
          align-items: center;
          gap: 15px;
          margin-bottom: 25px;
          padding-bottom: 15px;
          border-bottom: 2px solid rgba(57, 118, 39, 0.1);
        }
        
        .section-icon {
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: linear-gradient(135deg, #397627 0%, #2c5e1e 100%);
          border-radius: 10px;
          color: white;
          font-size: 1rem;
        }
        
        .section-header h3 {
          margin: 0;
          font-size: 1.3rem;
          color: #2d3436;
          font-weight: 600;
        }
        
        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
        }
        
        .form-group {
          margin-bottom: 0;
        }
        
        .input-container, .textarea-container {
          position: relative;
        }
        
        .input-icon, .textarea-icon {
          position: absolute;
          left: 15px;
          top: 50%;
          transform: translateY(-50%);
          color: #397627;
          z-index: 2;
          font-size: 1rem;
        }
        
        .textarea-icon {
          top: 20px;
          transform: none;
        }
        
        .modern-input, .modern-select, .modern-textarea {
          width: 100%;
          padding: 15px 15px 15px 45px;
          border: 2px solid #e9ecef;
          border-radius: 12px;
          font-size: 1rem;
          background: #f8f9fa;
          transition: all 0.3s ease;
          color: #2d3436;
          font-family: inherit;
        }
        
        .modern-textarea {
          padding-top: 20px;
          min-height: 120px;
          resize: vertical;
          line-height: 1.5;
        }
        
        .modern-input:focus, .modern-select:focus, .modern-textarea:focus {
          outline: none;
          border-color: #397627;
          background: white;
          box-shadow: 0 0 0 3px rgba(57, 118, 39, 0.1);
          transform: translateY(-2px);
        }
        
        .modern-input::placeholder, .modern-textarea::placeholder {
          color: #636e72;
          opacity: 0.7;
        }
        
        .select-arrow {
          position: absolute;
          right: 15px;
          top: 50%;
          transform: translateY(-50%);
          color: #636e72;
          pointer-events: none;
          z-index: 2;
        }
        
        .modern-select {
          appearance: none;
          cursor: pointer;
        }
        
        .input-hint {
          font-size: 0.85rem;
          color: #636e72;
          margin-top: 10px;
          display: flex;
          align-items: center;
          gap: 8px;
          font-style: italic;
        }
        
        .form-actions {
          padding: 30px 40px;
          background: white;
          border-top: 1px solid rgba(57, 118, 39, 0.1);
        }
        
        .action-buttons {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .btn {
          padding: 14px 32px;
          border-radius: 12px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          border: none;
          font-size: 1rem;
          display: inline-flex;
          align-items: center;
          gap: 10px;
          min-width: 160px;
          justify-content: center;
        }
        
        .btn:disabled {
          opacity: 0.6;
          cursor: not-allowed;
          transform: none !important;
        }
        
        .btn-primary {
          background: linear-gradient(135deg, #397627 0%, #2c5e1e 100%);
          color: white;
          box-shadow: 0 8px 20px rgba(57, 118, 39, 0.3);
        }
        
        .btn-primary:hover:not(:disabled) {
          transform: translateY(-3px);
          box-shadow: 0 15px 30px rgba(57, 118, 39, 0.4);
        }
        
        .btn-outline {
          background: transparent;
          color: #636e72;
          border: 2px solid #e9ecef;
        }
        
        .btn-outline:hover:not(:disabled) {
          background: #f8f9fa;
          color: #2d3436;
          border-color: #397627;
          transform: translateY(-2px);
        }
        
        .btn-spinner {
          width: 18px;
          height: 18px;
          border: 2px solid transparent;
          border-top: 2px solid white;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        
        @keyframes backdropEnter {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes cardEnter {
          from { 
            opacity: 0;
            transform: translateY(50px) scale(0.9);
          }
          to { 
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @media (max-width: 768px) {
          .form-container {
            padding: 10px;
          }
          
          .form-card {
            max-height: 98vh;
          }
          
          .form-header {
            padding: 25px;
          }
          
          .header-content {
            flex-direction: column;
            text-align: center;
            gap: 15px;
          }
          
          .form-sections {
            padding: 25px;
          }
          
          .form-section {
            padding: 20px;
          }
          
          .form-grid {
            grid-template-columns: 1fr;
            gap: 15px;
          }
          
          .form-actions {
            padding: 25px;
          }
          
          .action-buttons {
            flex-direction: column-reverse;
            gap: 15px;
          }
          
          .btn {
            width: 100%;
          }
        }
        
        @media (max-width: 480px) {
          .form-header {
            padding: 20px;
          }
          
          .header-text h2 {
            font-size: 1.4rem;
          }
          
          .form-sections {
            padding: 20px;
          }
          
          .form-section {
            padding: 15px;
          }
        }
      `}</style>
    </div>
  );
};

export default OffreForm;