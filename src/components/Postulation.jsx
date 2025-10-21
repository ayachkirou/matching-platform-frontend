import React, { useState, useEffect } from 'react';
import './Postulation.css';

const Postulation = ({ offer, onClose }) => {
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    adresse: '',
    niveau_etudes: '',
    experience: '',
    competences: '',
    date_debut: '',
    pretention_salariale: ''
  });
  
  const [cvFile, setCvFile] = useState(null);
  const [lettreMotivationFile, setLettreMotivationFile] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [testMode] = useState(true);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  const showNotification = (message, type = 'info') => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 6000);
  };

  useEffect(() => {
    console.log('Mode test activé - Authentification désactivée');
    console.log('Offre reçue:', offer);
  }, [offer]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleFileChange = (e, setFileFunction) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== 'application/pdf') {
        showNotification('Veuillez sélectionner uniquement des fichiers PDF', 'error');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        showNotification('Le fichier ne doit pas dépasser 5MB', 'error');
        return;
      }
      setFileFunction(file);
      showNotification(`Fichier "${file.name}" sélectionné avec succès`, 'success');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const testStudentId = 9;

    setIsSubmitting(true);
    setError('');
    
    try {
      const submissionData = new FormData();
      
      Object.keys(formData).forEach(key => {
        submissionData.append(key, formData[key]);
      });
      
      if (cvFile) submissionData.append('cv', cvFile);
      if (lettreMotivationFile) submissionData.append('lettreMotivation', lettreMotivationFile);
      
      submissionData.append('offre_id', offer.id);
      submissionData.append('student_id', testStudentId);
      
      console.log('Données envoyées:');
      for (let [key, value] of submissionData.entries()) {
        console.log(key + ': ' + value);
      }
      
      const response = await fetch('http://localhost:8080/api/candidatures', {
        method: 'POST',
        body: submissionData,
      });
      
      if (response.ok) {
        const result = await response.json();
        console.log('Candidature envoyée avec succès:', result);
        showNotification('Votre candidature a été envoyée avec succès !', 'success');
        setTimeout(() => {
          onClose();
        }, 2000);
      } else {
        const errorText = await response.text();
        console.error('Erreur serveur:', response.status, errorText);
        
        // Gestion spécifique des erreurs
        let errorMessage = 'Une erreur est survenue lors de l\'envoi de votre candidature';
        
        if (errorText.includes('duplicate key value violates unique constraint')) {
          errorMessage = 'Vous avez déjà postulé à cette offre. Vous ne pouvez soumettre qu\'une seule candidature par offre.';
        } else if (errorText.includes('foreign key constraint')) {
          errorMessage = 'Erreur de validation des données. Veuillez vérifier les informations saisies.';
        } else if (response.status === 500) {
          errorMessage = 'Erreur serveur temporaire. Veuillez réessayer dans quelques instants.';
        } else if (response.status === 400) {
          errorMessage = 'Données invalides. Veuillez vérifier tous les champs obligatoires.';
        }
        
        throw new Error(errorMessage);
      }
    } catch (error) {
      console.error('Erreur:', error);
      showNotification(error.message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="postulation-modal-overlay" onClick={onClose}>
      {/* Notification personnalisée */}
      {notification.show && (
        <div className={`notification ${notification.type}`}>
          <div className="notification-content">
            <div className="notification-icon-wrapper">
              {notification.type === 'success' ? (
                <svg className="notification-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/>
                </svg>
              ) : notification.type === 'error' ? (
                <svg className="notification-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
                </svg>
              ) : (
                <svg className="notification-icon" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
                </svg>
              )}
            </div>
            <div className="notification-text">
              <div className="notification-title">
                {notification.type === 'success' ? 'Succès' : 
                 notification.type === 'error' ? 'Erreur' : 'Information'}
              </div>
              <div className="notification-message">{notification.message}</div>
            </div>
            <button 
              className="notification-close"
              onClick={() => setNotification({ show: false, message: '', type: '' })}
              aria-label="Fermer"
            >
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
              </svg>
            </button>
          </div>
          <div className="notification-progress"></div>
        </div>
      )}

      <div className="postulation-container" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="postulation-header">
          <button className="back-button" onClick={onClose}>
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
              <path fillRule="evenodd" d="M15 8a.5.5 0 0 0-.5-.5H2.707l3.147-3.146a.5.5 0 1 0-.708-.708l-4 4a.5.5 0 0 0 0 .708l4 4a.5.5 0 0 0 .708-.708L2.707 8.5H14.5A.5.5 0 0 0 15 8z"/>
            </svg>
            Retour
          </button>
          <div className="postulation-title-section">
            <h1 className="postulation-title">Postuler pour ce poste</h1>
          </div>
        </div>

        {/* Le reste de votre code reste inchangé */}
        <div className="offre-card">
          <div className="company-info">
            <div className="company-logo">
              {offer.companyLogo ? (
                <img src={offer.companyLogo} alt="Logo" className="company-logo-img" />
              ) : (
                offer.companyName ? offer.companyName.substring(0, 2).toUpperCase() : `C${offer.companyId}`
              )}
            </div>
            <div className="company-details">
              <h2 className="job-title">{offer.titre}</h2>
              <p className="company-name">{offer.companyName || `Entreprise #${offer.companyId}`}</p>
              <p className="publication-date">ID de l'offre: {offer.id}</p>
            </div>
          </div>

          <div className="job-meta">
            <span className="location">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" viewBox="0 0 16 16">
                <path d="M8 16s6-5.686 6-10A6 6 0 0 0 2 6c0 4.314 6 10 6 10zm0-7a3 3 0 1 1 0-6 3 3 0 0 1 0 6z"/>
              </svg>
              {offer.localisation}
            </span>
            <span className="employment-type">{offer.typeOffre}</span>
          </div>

          <div className="competences-section">
            <h3>Compétences requises :</h3>
            <div className="competences-list">
              {(() => {
                try {
                  const skills = offer.competencesRequises ? JSON.parse(offer.competencesRequises) : [];
                  return skills.map((skill, index) => (
                    <span key={index} className="competence-tag">{skill}</span>
                  ));
                } catch (e) {
                  return <span>Aucune compétence spécifiée</span>;
                }
              })()}
            </div>
          </div>

          <div className="prerequis-section">
            <h3>Description :</h3>
            <p>{offer.description}</p>
          </div>
        </div>

        {/* Formulaire de candidature */}
        <div className="application-form">
          <h2 className="form-title">Formulaire de candidature</h2>
          
          <form onSubmit={handleSubmit}>
            <div className="form-grid">
              <div className="form-group">
                <label htmlFor="nom">Nom *</label>
                <input
                  type="text"
                  id="nom"
                  name="nom"
                  value={formData.nom}
                  onChange={handleInputChange}
                  placeholder="Votre nom"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="prenom">Prénom *</label>
                <input
                  type="text"
                  id="prenom"
                  name="prenom"
                  value={formData.prenom}
                  onChange={handleInputChange}
                  placeholder="Votre prénom"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="email">Email *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="votre.email@exemple.com"
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="telephone">Téléphone *</label>
                <input
                  type="tel"
                  id="telephone"
                  name="telephone"
                  value={formData.telephone}
                  onChange={handleInputChange}
                  placeholder="Votre numéro de téléphone"
                  required
                />
              </div>
              
              <div className="form-group full-width">
                <label htmlFor="adresse">Adresse *</label>
                <textarea
                  id="adresse"
                  name="adresse"
                  value={formData.adresse}
                  onChange={handleInputChange}
                  placeholder="Votre adresse complète"
                  required
                ></textarea>
              </div>
              
              <div className="form-group">
                <label htmlFor="niveau_etudes">Niveau d'études *</label>
                <select
                  id="niveau_etudes"
                  name="niveau_etudes"
                  value={formData.niveau_etudes}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Sélectionnez...</option>
                  <option value="bac">Bac</option>
                  <option value="bac+2">Bac+2 (BTS, DUT)</option>
                  <option value="licence">Licence (Bac+3)</option>
                  <option value="master">Master (Bac+5)</option>
                  <option value="doctorat">Doctorat (Bac+8)</option>
                </select>
              </div>
              
              <div className="form-group">
                <label htmlFor="experience">Années d'expérience *</label>
                <select
                  id="experience"
                  name="experience"
                  value={formData.experience}
                  onChange={handleInputChange}
                  required
                >
                  <option value="">Sélectionnez...</option>
                  <option value="0">Aucune</option>
                  <option value="1">1 an</option>
                  <option value="2">2 ans</option>
                  <option value="3">3 ans</option>
                  <option value="4">4 ans</option>
                  <option value="5">5 ans et plus</option>
                </select>
              </div>
              
              <div className="form-group full-width">
                <label htmlFor="competences">Compétences techniques *</label>
                <textarea
                  id="competences"
                  name="competences"
                  value={formData.competences}
                  onChange={handleInputChange}
                  placeholder="Listez vos compétences techniques séparées par des virgules"
                  required
                ></textarea>
              </div>
              
              <div className="form-group">
                <label htmlFor="cv">CV (PDF) *</label>
                <div className="file-upload">
                  <div className="file-upload-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
                      <path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708l3-3z"/>
                    </svg>
                    {cvFile ? cvFile.name : 'Télécharger votre CV'}
                  </div>
                  <input
                    type="file"
                    id="cv"
                    accept=".pdf"
                    onChange={(e) => handleFileChange(e, setCvFile)}
                    required
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="lettre_motivation">Lettre de motivation (PDF)</label>
                <div className="file-upload">
                  <div className="file-upload-btn">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                      <path d="M.5 9.9a.5.5 0 0 1 .5.5v2.5a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1v-2.5a.5.5 0 0 1 1 0v2.5a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2v-2.5a.5.5 0 0 1 .5-.5z"/>
                      <path d="M7.646 1.146a.5.5 0 0 1 .708 0l3 3a.5.5 0 0 1-.708.708L8.5 2.707V11.5a.5.5 0 0 1-1 0V2.707L5.354 4.854a.5.5 0 1 1-.708-.708l3-3z"/>
                    </svg>
                    {lettreMotivationFile ? lettreMotivationFile.name : 'Télécharger votre lettre'}
                  </div>
                  <input
                    type="file"
                    id="lettre_motivation"
                    accept=".pdf"
                    onChange={(e) => handleFileChange(e, setLettreMotivationFile)}
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label htmlFor="date_debut">Date de début souhaitée *</label>
                <input
                  type="date"
                  id="date_debut"
                  name="date_debut"
                  value={formData.date_debut}
                  onChange={handleInputChange}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
              
              <div className="form-group">
                <label htmlFor="pretention_salariale">Prétention salariale (MAD)</label>
                <input
                  type="number"
                  id="pretention_salariale"
                  name="pretention_salariale"
                  value={formData.pretention_salariale}
                  onChange={handleInputChange}
                  placeholder="Montant en MAD"
                  min="0"
                />
              </div>
            </div>
            
            <button type="submit" className="submit-btn" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <span className="spinner"></span>
                  Envoi en cours...
                </>
              ) : (
                'Envoyer ma candidature'
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Postulation;