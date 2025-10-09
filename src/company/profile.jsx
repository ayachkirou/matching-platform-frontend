import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { companyService } from '../services/companyService';
import logo from '../assets/logo.png';

function CompanyProfile() {
  const navigate = useNavigate();
  const { user, getToken, logout, isAuthenticated } = useAuth();
  const [company, setCompany] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('info');
  const [formData, setFormData] = useState({
    nomEntreprise: '',
    telephone: '',
    adresse: '',
    siteWeb: '',
    registreCommerce: '',
    ice: '',
    secteurActivite: '',
    description: ''
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [uploading, setUploading] = useState({ logo: false });
  const [showLogoMenu, setShowLogoMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const logoInputRef = useRef(null);
  const logoMenuRef = useRef(null);

  // Rediriger vers login si non authentifié
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }
  }, [isAuthenticated, navigate]);

  // Récupérer les données de l'entreprise
  useEffect(() => {
    const fetchCompanyData = async () => {
      if (!user || user.role !== 'COMPANY') {
        navigate('/login');
        return;
      }

      try {
        const token = getToken();
        const companyData = await companyService.getCompanyProfile(user.email, token);
        
        setCompany(companyData);
        
        setFormData({
          nomEntreprise: companyData.nomEntreprise || '',
          telephone: companyData.telephone || '',
          adresse: companyData.adresse || '',
          siteWeb: companyData.siteWeb || '',
          registreCommerce: companyData.registreCommerce || '',
          ice: companyData.ice || '',
          secteurActivite: companyData.secteurActivite || '',
          description: companyData.description || ''
        });
      } catch (error) {
        console.error('Erreur:', error);
        if (error.message.includes('401') || error.message.includes('403')) {
          logout();
          navigate('/login');
        }
      } finally {
        setLoading(false);
      }
    };

    if (user) {
      fetchCompanyData();
    }
  }, [user, getToken, navigate, logout]);

  // Fermer le menu logo en cliquant à l'extérieur
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (logoMenuRef.current && !logoMenuRef.current.contains(event.target)) {
        setShowLogoMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Fonctions pour la gestion du logo
  const handleLogoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    console.log('Fichier sélectionné:', file.name, file.type, file.size);

    // Vérifier le type de fichier
    if (!file.type.startsWith('image/')) {
      setErrors({ submit: 'Veuillez sélectionner une image (JPG, PNG, etc.)' });
      return;
    }

    // Vérifier la taille du fichier (2MB max)
    if (file.size > 2 * 1024 * 1024) {
      setErrors({ submit: 'L\'image ne doit pas dépasser 2MB' });
      return;
    }

    setUploading(prev => ({ ...prev, logo: true }));
    setShowLogoMenu(false);
    
    try {
      const token = getToken();
      console.log('Envoi du logo...');
      const result = await companyService.uploadLogo(user.email, file, token);
      
      setCompany(prev => ({ ...prev, logo: result.logoFilename }));
      setSuccessMessage('Logo mis à jour avec succès!');
      setTimeout(() => setSuccessMessage(''), 5000);
      
      // Réinitialiser l'input file
      if (logoInputRef.current) {
        logoInputRef.current.value = '';
      }
    } catch (error) {
      console.error('Erreur upload logo:', error);
      setErrors({ submit: error.message || 'Erreur lors du téléchargement du logo' });
    } finally {
      setUploading(prev => ({ ...prev, logo: false }));
    }
  };

  const handleDeleteLogo = async () => {
    try {
      const token = getToken();
      await companyService.deleteLogo(user.email, token);
      
      setCompany(prev => ({ ...prev, logo: null }));
      setSuccessMessage('Logo supprimé avec succès!');
      setTimeout(() => setSuccessMessage(''), 5000);
      setShowLogoMenu(false);
      setShowDeleteConfirm(false);
    } catch (error) {
      setErrors({ submit: error.message || 'Erreur lors de la suppression du logo' });
    }
  };

  const triggerLogoInput = () => {
    console.log('Déclenchement input file...');
    if (logoInputRef.current) {
      logoInputRef.current.click();
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.telephone.trim()) newErrors.telephone = 'Le téléphone est obligatoire';
    if (!formData.adresse.trim()) newErrors.adresse = 'L\'adresse est obligatoire';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    
    setSaving(true);
    try {
      const token = getToken();
      const result = await companyService.updateCompanyProfile(user.email, formData, token);
      
      setCompany(result.company);
      setIsEditing(false);
      setSuccessMessage('Profil mis à jour avec succès!');
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (error) {
      setErrors({ submit: error.message || 'Erreur lors de la mise à jour du profil' });
      if (error.message.includes('401') || error.message.includes('403')) {
        logout();
        navigate('/login');
      }
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    setFormData({
      nomEntreprise: company.nomEntreprise || '',
      telephone: company.telephone || '',
      adresse: company.adresse || '',
      siteWeb: company.siteWeb || '',
      registreCommerce: company.registreCommerce || '',
      ice: company.ice || '',
      secteurActivite: company.secteurActivite || '',
      description: company.description || ''
    });
    setIsEditing(false);
    setErrors({});
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleDownloadDocument = (filename) => {
    if (filename) {
      window.open(`http://localhost:8080/api/files/${filename}`, '_blank');
    }
  };

  const getVerificationBadge = (status) => {
    const statusConfig = {
      'VERIFIED': { label: 'Vérifiée', color: 'emerald', icon: 'check-circle' },
      'PENDING': { label: 'En attente', color: 'yellow', icon: 'clock' },
      'REJECTED': { label: 'Rejetée', color: 'red', icon: 'times-circle' }
    };
    
    const config = statusConfig[status] || statusConfig.PENDING;
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-${config.color}-100 text-${config.color}-800`}>
        <i className={`fas fa-${config.icon} mr-1`}></i>
        {config.label}
      </span>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement de votre profil...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Input file POUR LE LOGO */}
      <input
        type="file"
        ref={logoInputRef}
        onChange={handleLogoUpload}
        accept="image/*"
        className="hidden"
      />

      {/* Navigation principale */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo */}
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => navigate('/')}>
                <div className="h-14 rounded-lg flex items-center justify-center">
                  <img
                    src={logo}
                    alt="TalentMatch Logo"
                    className="w-14 h-14 rounded"
                  />
                </div>
                <span className="text-xl font-bold text-gray-900">TalentMatch</span>
              </div>
            </div>

            {/* Navigation desktop  */}
            <div className="hidden md:flex md:items-center md:space-x-1 md:absolute md:left-1/2 md:transform md:-translate-x-1/2 md:mt-3"  >
              <button className="inline-flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-500 hover:text-emerald-600 hover:bg-gray-50 transition-colors">
                <i className="fas fa-home mr-2"></i>
                Tableau de bord
              </button>
              <button className="inline-flex items-center px-3 py-2 rounded-md text-sm font-medium bg-emerald-100 text-emerald-700">
                <i className="fas fa-user mr-2"></i>
                Mon Profil
              </button>
              <button className="inline-flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-500 hover:text-emerald-600 hover:bg-gray-50 transition-colors">
                <i className="fas fa-briefcase mr-2"></i>
                Offres
              </button>
              <button className="inline-flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-500 hover:text-emerald-600 hover:bg-gray-50 transition-colors">
                <i className="fas fa-users mr-2"></i>
                Candidats
              </button>
              <button 
                className="inline-flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-500 hover:text-emerald-600 hover:bg-gray-50 transition-colors"
                onClick={() => navigate('/student/messages')}
              >
                <i className="fas fa-comments mr-2"></i>
                Messages
              </button>
            </div>

            {/* Menu mobile */}
            <div className="md:hidden flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-emerald-500"
              >
                <i className={`fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'} text-lg`}></i>
              </button>
            </div>
            
            {/* Section utilisateur */}
            <div className="flex items-center space-x-3">
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-3 p-1 rounded-full hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-2">
                    <div className="flex-shrink-0">
                      {company?.logo ? (
                        <img 
                          className="h-8 w-8 rounded-full object-cover border border-gray-200" 
                          src={`http://localhost:8080/api/files/${company.logo}`} 
                          alt="Logo" 
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center border border-gray-200">
                          <i className="fas fa-building text-emerald-600 text-sm"></i>
                        </div>
                      )}
                    </div>
                    <div className="hidden sm:block text-left">
                      <div className="text-sm font-medium text-gray-900">{company?.nomEntreprise}</div>
                      <div className="text-xs text-gray-500">Entreprise</div>
                    </div>
                    <i className={`fas fa-chevron-down text-gray-400 text-xs transition-transform ${userMenuOpen ? 'rotate-180' : ''}`}></i>
                  </div>
                </button>

                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50 py-1">
                    <button
                      onClick={() => {
                        handleLogout();
                        setUserMenuOpen(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center"
                    >
                      <i className="fas fa-sign-out-alt mr-2"></i>
                      Déconnexion
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Menu mobile responsive */}
          {mobileMenuOpen && (
            <div className="md:hidden py-2 border-t border-gray-200">
              <div className="flex flex-col space-y-1">
                <button className="flex items-center px-3 py-2 text-base font-medium text-gray-500 hover:text-emerald-600 hover:bg-gray-50 transition-colors">
                  <i className="fas fa-home mr-3"></i>
                  Tableau de bord
                </button>
                <button className="flex items-center px-3 py-2 text-base font-medium bg-emerald-100 text-emerald-700">
                  <i className="fas fa-user mr-3"></i>
                  Mon Profil
                </button>
                <button className="flex items-center px-3 py-2 text-base font-medium text-gray-500 hover:text-emerald-600 hover:bg-gray-50 transition-colors">
                  <i className="fas fa-briefcase mr-3"></i>
                  Offres
                </button>
                <button className="flex items-center px-3 py-2 text-base font-medium text-gray-500 hover:text-emerald-600 hover:bg-gray-50 transition-colors">
                  <i className="fas fa-users mr-3"></i>
                  Candidats
                </button>
                <button className="flex items-center px-3 py-2 text-base font-medium text-gray-500 hover:text-emerald-600 hover:bg-gray-50 transition-colors">
                  <i className="fas fa-comments mr-3"></i>
                  Messages
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Modal de confirmation de suppression */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <div className="flex items-center mb-4">
              <div className="flex-shrink-0 w-10 h-10 bg-red-100 rounded-full flex items-center justify-center">
                <i className="fas fa-exclamation-triangle text-red-600"></i>
              </div>
              <div className="ml-4">
                <h3 className="text-lg font-medium text-gray-900">Supprimer le logo</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Êtes-vous sûr de vouloir supprimer votre logo ? Cette action est irréversible.
                </p>
              </div>
            </div>
            <div className="flex justify-end space-x-3 mt-6">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
              >
                Annuler
              </button>
              <button
                onClick={handleDeleteLogo}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 transition-colors"
              >
                Supprimer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Contenu principal */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header du profil */}
        <div className="bg-white shadow-sm rounded-lg mb-6">
          <div className="px-4 sm:px-6 py-6 sm:py-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
                <div className="relative self-start sm:self-auto">
                  {company?.logo ? (
                    <img 
                      className="h-20 w-20 sm:h-24 sm:w-24 rounded-full object-cover border-4 border-white shadow-lg" 
                      src={`http://localhost:8080/api/files/${company.logo}`} 
                      alt="Logo" 
                    />
                  ) : (
                    <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-emerald-100 flex items-center justify-center border-4 border-white shadow-lg">
                      <i className="fas fa-building text-emerald-600 text-2xl sm:text-3xl"></i>
                    </div>
                  )}
                  
                  {/* BOUTON CAMERA */}
                  <div className="relative" ref={logoMenuRef}>
                    <button 
                      className="absolute -bottom-1 -right-1 h-7 w-7 sm:h-8 sm:w-8 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-emerald-600 transition-colors z-10"
                      onClick={() => setShowLogoMenu(!showLogoMenu)}
                      disabled={uploading.logo}
                    >
                      {uploading.logo ? (
                        <i className="fas fa-spinner fa-spin text-xs sm:text-sm"></i>
                      ) : (
                        <i className="fas fa-camera text-xs sm:text-sm"></i>
                      )}
                    </button>

                    {/* Menu logo */}
                    {showLogoMenu && (
                      <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-200 z-50 py-1">
                        <button
                          onClick={() => {
                            triggerLogoInput();
                            setShowLogoMenu(false);
                          }}
                          className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center transition-colors"
                        >
                          <i className="fas fa-upload mr-3 text-gray-400"></i>
                          Changer le logo
                        </button>
                        {company?.logo && (
                          <button
                            onClick={() => {
                              setShowDeleteConfirm(true);
                              setShowLogoMenu(false);
                            }}
                            className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center transition-colors"
                          >
                            <i className="fas fa-trash mr-3 text-red-400"></i>
                            Supprimer le logo
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
                <div className="text-center sm:text-left">
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{company?.nomEntreprise}</h1>
                  <p className="text-gray-600 mt-1 text-sm sm:text-base">{company?.secteurActivite}</p>
                  <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
                    {getVerificationBadge(company?.statusVerification)}
                  </div>
                </div>
              </div>
              
              <div className="mt-6 lg:mt-0 flex justify-center sm:justify-start">
                {!isEditing ? (
                  <button 
                    className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors"
                    onClick={() => setIsEditing(true)}
                  >
                    <i className="fas fa-edit mr-2"></i>
                    Modifier le profil
                  </button>
                ) : (
                  <div className="flex space-x-3">
                    <button 
                      className="inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors"
                      onClick={handleCancel}
                      disabled={saving}
                    >
                      Annuler
                    </button>
                    <button 
                      className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 transition-colors disabled:opacity-50"
                      onClick={handleSave}
                      disabled={saving}
                    >
                      {saving ? (
                        <>
                          <i className="fas fa-spinner fa-spin mr-2"></i>
                          Enregistrement...
                        </>
                      ) : (
                        <>
                          <i className="fas fa-save mr-2"></i>
                          Enregistrer
                        </>
                      )}
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        
        {/* Messages d'alerte */}
        {successMessage && (
          <div className="mb-6 bg-emerald-50 border border-emerald-200 rounded-lg p-4">
            <div className="flex items-center">
              <i className="fas fa-check-circle text-emerald-500 mr-2"></i>
              <span className="text-emerald-800">{successMessage}</span>
            </div>
          </div>
        )}

        {errors.submit && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <i className="fas fa-exclamation-circle text-red-500 mr-2"></i>
              <span className="text-red-800">{errors.submit}</span>
            </div>
          </div>
        )}

        <div className="bg-white shadow-sm rounded-lg overflow-hidden">
          {/* Navigation des onglets */}
          <div className="border-b border-gray-200">
            <nav className="flex overflow-x-auto -mb-px">
              {[
                { id: 'info', name: 'Informations', icon: 'info-circle', fullName: 'Informations entreprise' },
                { id: 'contact', name: 'Contact', icon: 'envelope', fullName: 'Coordonnées' },
                { id: 'legal', name: 'Juridique', icon: 'balance-scale', fullName: 'Informations juridiques' },
                { id: 'documents', name: 'Documents', icon: 'file', fullName: 'Documents justificatifs' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  className={`flex-shrink-0 flex items-center py-4 px-4 sm:px-6 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-emerald-500 text-emerald-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <i className={`fas fa-${tab.icon} mr-2`}></i>
                  <span className="hidden sm:inline">{tab.fullName}</span>
                  <span className="sm:hidden">{tab.name}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Contenu des onglets */}
          <div className="p-4 sm:p-6">
            {/* Onglet Informations entreprise */}
            {activeTab === 'info' && (
              <div>
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">Informations de l'entreprise</h2>
                  <p className="text-gray-600">Informations principales de votre entreprise (lecture seule)</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nom de l'entreprise</label>
                    <input
                      name="nomEntreprise"
                      type="text"
                      value={formData.nomEntreprise}
                      disabled={true}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm bg-gray-50 text-gray-500 cursor-not-allowed"
                      placeholder="Nom officiel de votre entreprise"
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Le nom de l'entreprise ne peut pas être modifié après l'inscription
                    </p>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Secteur d'activité</label>
                    <input
                      name="secteurActivite"
                      type="text"
                      value={formData.secteurActivite}
                      disabled={true}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm bg-gray-50 text-gray-500 cursor-not-allowed"
                      placeholder="Informatique, Conseil, Santé, etc."
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Le secteur d'activité ne peut pas être modifié après l'inscription
                    </p>
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                      name="description"
                      value={formData.description}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      rows="4"
                      className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                        !isEditing ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : 'border-gray-300'
                      }`}
                      placeholder="Décrivez votre entreprise, ses valeurs, ses activités principales..."
                    />
                    <p className="mt-1 text-xs text-gray-500">
                      Vous pouvez modifier la description de votre entreprise
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Onglet Coordonnées */}
            {activeTab === 'contact' && (
              <div>
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">Coordonnées</h2>
                  <p className="text-gray-600">Informations de contact de votre entreprise</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Téléphone *</label>
                    <input
                      name="telephone"
                      type="tel"
                      value={formData.telephone}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                        errors.telephone ? 'border-red-300' : 'border-gray-300'
                      } ${!isEditing ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : ''}`}
                      placeholder="+33 1 23 45 67 89"
                    />
                    {errors.telephone && <p className="mt-1 text-sm text-red-600">{errors.telephone}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Site web</label>
                    <input
                      name="siteWeb"
                      type="url"
                      value={formData.siteWeb}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                        !isEditing ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : 'border-gray-300'
                      }`}
                      placeholder="https://www.votre-entreprise.com"
                    />
                  </div>

                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-2">Adresse *</label>
                    <textarea
                      name="adresse"
                      value={formData.adresse}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      rows="3"
                      className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                        errors.adresse ? 'border-red-300' : 'border-gray-300'
                      } ${!isEditing ? 'bg-gray-50 text-gray-500 cursor-not-allowed' : ''}`}
                      placeholder="Adresse complète de votre entreprise"
                    />
                    {errors.adresse && <p className="mt-1 text-sm text-red-600">{errors.adresse}</p>}
                  </div>
                </div>
              </div>
            )}

            {/* Onglet Informations juridiques */}
            {activeTab === 'legal' && (
              <div>
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">Informations juridiques</h2>
                  <p className="text-gray-600">Informations légales de votre entreprise (lecture seule)</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Registre de commerce</label>
                    <input
                      type="text"
                      value={formData.registreCommerce || ''}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm bg-gray-50 text-gray-500 cursor-not-allowed"
                      placeholder="Non renseigné"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">ICE</label>
                    <input
                      type="text"
                      value={formData.ice || ''}
                      disabled
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm bg-gray-50 text-gray-500 cursor-not-allowed"
                      placeholder="Non renseigné"
                    />
                  </div>
                </div>
                
                <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
                  <div className="flex items-center">
                    <i className="fas fa-info-circle text-blue-500 mr-2"></i>
                    <p className="text-sm text-blue-700">
                      Les informations juridiques ne peuvent pas être modifiées après l'inscription. 
                      Contactez le support pour toute modification.
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Nouvel onglet Documents justificatifs */}
            {activeTab === 'documents' && (
              <div>
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">Documents justificatifs</h2>
                  <p className="text-gray-600">Documents soumis lors de l'inscription (lecture seule)</p>
                </div>
                
                <div className="space-y-6">
                  {/* Document justificatif */}
                  <div className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                          <i className="fas fa-file-pdf text-red-600 text-xl"></i>
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">Document justificatif</h3>
                          <p className="text-sm text-gray-500 mt-1">
                            {company?.documentJustificatif ? 'Document téléchargé' : 'Aucun document'}
                          </p>
                          {company?.documentJustificatif && (
                            <span className="text-xs text-gray-400">PDF</span>
                          )}
                        </div>
                      </div>
                      <div>
                        {company?.documentJustificatif ? (
                          <button 
                            className="inline-flex items-center px-4 py-2 border border-emerald-300 text-sm font-medium rounded-md text-emerald-700 bg-white hover:bg-emerald-50 transition-colors"
                            onClick={() => handleDownloadDocument(company.documentJustificatif)}
                          >
                            <i className="fas fa-download mr-2"></i>
                            Télécharger
                          </button>
                        ) : (
                          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            Non fourni
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="mt-4 text-xs text-gray-500">
                      <p>• Document officiel prouvant l'existence de votre entreprise</p>
                      <p>• Format : PDF</p>
                    </div>
                  </div>

                  {/* Information sur les documents */}
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <div className="flex items-center">
                      <i className="fas fa-exclamation-triangle text-yellow-500 mr-2"></i>
                      <div>
                        <p className="text-sm text-yellow-700 font-medium">Documents en lecture seule</p>
                        <p className="text-sm text-yellow-600 mt-1">
                          Les documents justificatifs ne peuvent pas être modifiés après l'inscription. 
                          Pour toute modification, veuillez contacter notre support.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Fermer les menus déroulants en cliquant à l'extérieur */}
      {(userMenuOpen || showLogoMenu) && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => {
            setUserMenuOpen(false);
            setShowLogoMenu(false);
          }}
        ></div>
      )}
    </div>
  );
}

export default CompanyProfile;