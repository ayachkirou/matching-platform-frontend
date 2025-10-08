import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { authService } from '../services/authService';
import logo from '../assets/logo.png';

function StudentProfile() {
  const navigate = useNavigate();
  const { user, getToken, logout, isAuthenticated } = useAuth();
  const [student, setStudent] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [activeTab, setActiveTab] = useState('personal');
  const [formData, setFormData] = useState({
    nom: '',
    prenom: '',
    email: '',
    telephone: '',
    adresse: '',
    diplome: '',
    specialite: '',
    etablissement: '',
    anneeObtention: new Date().getFullYear(),
    competences: '',
    experiences: '',
    statut: 'AUTRE'
  });
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState('');
  const [completionPercentage, setCompletionPercentage] = useState(0);
  const [uploading, setUploading] = useState({ cv: false, photo: false });
  const [showPhotoMenu, setShowPhotoMenu] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const fileInputRef = useRef(null);
  const photoInputRef = useRef(null);

  // Fonction pour calculer le pourcentage de complétion du profil
  const calculateCompletionPercentage = (studentData) => {
    if (!studentData) return 0;

    const fields = [
      'nom', 'prenom', 'email', 'telephone', 'adresse', 
      'diplome', 'specialite', 'etablissement', 'anneeObtention',
      'competences', 'experiences', 'statut', 'cv'
    ];

    let completedFields = 0;

    fields.forEach(field => {
      const value = studentData[field];
      if (value && value.toString().trim() !== '') {
        completedFields++;
      }
    });

    // Vérifier aussi les champs dans user si nécessaire
    if (studentData.user?.email) {
      completedFields++;
    }

    return Math.round((completedFields / fields.length) * 100);
  };

  // Rediriger vers login si non authentifié
  useEffect(() => {
    if (!isAuthenticated()) {
      navigate('/login');
      return;
    }
  }, [isAuthenticated, navigate]);

  // Récupérer les données de l'étudiant
  useEffect(() => {
    const fetchStudentData = async () => {
      if (!user || user.role !== 'STUDENT') {
        navigate('/login');
        return;
      }

      try {
        const token = getToken();
        const studentData = await authService.getStudentProfile(user.email, token);
        
        setStudent(studentData);
        
        // Calculer le pourcentage de complétion
        const percentage = calculateCompletionPercentage(studentData);
        setCompletionPercentage(percentage);
        
        setFormData({
          nom: studentData.nom || '',
          prenom: studentData.prenom || '',
          email: studentData.user?.email || user.email,
          telephone: studentData.telephone || '',
          adresse: studentData.adresse || '',
          diplome: studentData.diplome || '',
          specialite: studentData.specialite || '',
          etablissement: studentData.etablissement || '',
          anneeObtention: studentData.anneeObtention || new Date().getFullYear(),
          competences: studentData.competences || '',
          experiences: studentData.experiences || '',
          statut: studentData.statut || 'AUTRE'
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
      fetchStudentData();
    }
  }, [user, getToken, navigate, logout]);

  // Mettre à jour le pourcentage quand le student change
  useEffect(() => {
    if (student) {
      const percentage = calculateCompletionPercentage(student);
      setCompletionPercentage(percentage);
    }
  }, [student]);

  // Fonctions pour la gestion des documents
  const handleCVUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Vérifier le type de fichier
    if (file.type !== 'application/pdf') {
      setErrors({ submit: 'Veuillez sélectionner un fichier PDF' });
      return;
    }

    // Vérifier la taille du fichier (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      setErrors({ submit: 'Le fichier ne doit pas dépasser 5MB' });
      return;
    }

    setUploading(prev => ({ ...prev, cv: true }));
    try {
      const token = getToken();
      const result = await authService.uploadCV(user.email, file, token);
      
      setStudent(prev => ({ ...prev, cv: result.cvFilename }));
      setSuccessMessage('CV téléchargé avec succès!');
      setTimeout(() => setSuccessMessage(''), 5000);
    } catch (error) {
      setErrors({ submit: error.message || 'Erreur lors du téléchargement du CV' });
    } finally {
      setUploading(prev => ({ ...prev, cv: false }));
      event.target.value = ''; // Reset input
    }
  };

  const handlePhotoUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // Vérifier le type de fichier
    if (!file.type.startsWith('image/')) {
      setErrors({ submit: 'Veuillez sélectionner une image' });
      return;
    }

    // Vérifier la taille du fichier (2MB max)
    if (file.size > 2 * 1024 * 1024) {
      setErrors({ submit: 'L\'image ne doit pas dépasser 2MB' });
      return;
    }

    setUploading(prev => ({ ...prev, photo: true }));
    try {
      const token = getToken();
      const result = await authService.uploadPhotoProfil(user.email, file, token);
      
      setStudent(prev => ({ ...prev, photoProfil: result.photoProfilFilename }));
      setSuccessMessage('Photo de profil mise à jour avec succès!');
      setTimeout(() => setSuccessMessage(''), 5000);
      setShowPhotoMenu(false);
    } catch (error) {
      setErrors({ submit: error.message || 'Erreur lors du téléchargement de la photo' });
    } finally {
      setUploading(prev => ({ ...prev, photo: false }));
      event.target.value = ''; // Reset input
    }
  };

  const handleDeletePhoto = async () => {
    try {
      const token = getToken();
      await authService.deletePhotoProfil(user.email, token);
      
      setStudent(prev => ({ ...prev, photoProfil: null }));
      setSuccessMessage('Photo de profil supprimée avec succès!');
      setTimeout(() => setSuccessMessage(''), 5000);
      setShowPhotoMenu(false);
    } catch (error) {
      setErrors({ submit: error.message || 'Erreur lors de la suppression de la photo' });
    }
  };

  const handleDownloadCV = async () => {
    if (!student?.cv) return;

    try {
      // Utiliser le FileController pour télécharger le CV
      window.open(`http://localhost:8080/api/files/${student.cv}`, '_blank');
      
    } catch (error) {
      setErrors({ submit: error.message || 'Erreur lors du téléchargement du CV' });
    }
  };

  const triggerFileInput = (type) => {
    if (type === 'cv') {
      fileInputRef.current?.click();
    } else if (type === 'photo') {
      photoInputRef.current?.click();
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
    
    if (!formData.nom.trim()) newErrors.nom = 'Le nom est obligatoire';
    if (!formData.prenom.trim()) newErrors.prenom = 'Le prénom est obligatoire';
    if (!formData.email.trim()) newErrors.email = 'L\'email est obligatoire';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Format d\'email invalide';
    if (!formData.telephone.trim()) newErrors.telephone = 'Le téléphone est obligatoire';
    if (!formData.adresse.trim()) newErrors.adresse = 'L\'adresse est obligatoire';
    if (!formData.diplome.trim()) newErrors.diplome = 'Le diplôme est obligatoire';
    if (!formData.specialite.trim()) newErrors.specialite = 'La spécialité est obligatoire';
    if (!formData.etablissement.trim()) newErrors.etablissement = 'L\'établissement est obligatoire';
    if (!formData.anneeObtention) newErrors.anneeObtention = 'L\'année d\'obtention est obligatoire';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) return;
    
    setSaving(true);
    try {
      const token = getToken();
      const result = await authService.updateStudentProfile(user.email, formData, token);
      
      setStudent(result.student);
      
      // Recalculer le pourcentage après mise à jour
      const percentage = calculateCompletionPercentage(result.student);
      setCompletionPercentage(percentage);
      
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
      nom: student.nom || '',
      prenom: student.prenom || '',
      email: student.user?.email || user.email,
      telephone: student.telephone || '',
      adresse: student.adresse || '',
      diplome: student.diplome || '',
      specialite: student.specialite || '',
      etablissement: student.etablissement || '',
      anneeObtention: student.anneeObtention || new Date().getFullYear(),
      competences: student.competences || '',
      experiences: student.experiences || '',
      statut: student.statut || 'AUTRE'
    });
    setIsEditing(false);
    setErrors({});
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const getStatusBadge = (statut) => {
    const statusConfig = {
      'RECHERCHE_STAGE': { label: 'En recherche de stage', color: 'emerald' },
      'RECHERCHE_EMPLOI': { label: 'En recherche d\'emploi', color: 'green' },
      'AUTRE': { label: 'Autre', color: 'gray' }
    };
    
    const config = statusConfig[statut] || statusConfig.AUTRE;
    return (
      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-${config.color}-100 text-${config.color}-800`}>
        {config.label}
      </span>
    );
  };

  // Fonction pour déterminer la couleur du badge de progression
  const getProgressColor = (percentage) => {
    if (percentage >= 80) return 'emerald';
    if (percentage >= 60) return 'green';
    if (percentage >= 40) return 'yellow';
    return 'red';
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
      {/* Inputs cachés pour les fichiers */}
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleCVUpload}
        accept=".pdf"
        className="hidden"
      />
      <input
        type="file"
        ref={photoInputRef}
        onChange={handlePhotoUpload}
        accept="image/*"
        className="hidden"
      />

      {/* Navigation principale - Version responsive améliorée */}
      <nav className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            {/* Logo et bouton menu mobile */}
            <div className="flex items-center">
              <div className="flex-shrink-0 flex items-center cursor-pointer" onClick={() => navigate('/')}>
                <div className="h-14  rounded-lg flex items-center justify-center">
                  <img
                    src={logo}
                    alt="TalentMatch Logo"
                    className="w-14 h-14 rounded"
                  />
                </div>
                <span className="text-xl font-bold text-gray-900">TalentMatch</span>
              </div>
              
              {/* Navigation desktop */}
              <div className="hidden md:ml-8 md:flex md:space-x-1">
                <button 
                  className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === '/student/dashboard' 
                    ? 'bg-emerald-100 text-emerald-700' 
                    : 'text-gray-500 hover:text-emerald-600 hover:bg-gray-50'
                  }`}
                  onClick={() => navigate('/student/dashboard')}
                >
                  <i className="fas fa-home mr-2"></i>
                  Tableau de bord
                </button>
                <button 
                  className={`inline-flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    location.pathname === '/student/profile' 
                    ? 'bg-emerald-100 text-emerald-700' 
                    : 'text-gray-500 hover:text-emerald-600 hover:bg-gray-50'
                  }`}
                  onClick={() => navigate('/student/profile')}
                >
                  <i className="fas fa-user mr-2"></i>
                  Mon Profil
                </button>
                <button 
                  className="inline-flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-500 hover:text-emerald-600 hover:bg-gray-50 transition-colors"
                  onClick={() => navigate('/student/offers')}
                >
                  <i className="fas fa-briefcase mr-2"></i>
                  Offres
                </button>
                <button 
                  className="inline-flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-500 hover:text-emerald-600 hover:bg-gray-50 transition-colors"
                  onClick={() => navigate('/student/applications')}
                >
                  <i className="fas fa-file-alt mr-2"></i>
                  Candidatures
                </button>
                <button 
                  className="inline-flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-500 hover:text-emerald-600 hover:bg-gray-50 transition-colors"
                  onClick={() => navigate('/student/messages')}
                >
                  <i className="fas fa-comments mr-2"></i>
                  Messages
                </button>
              </div>
            </div>
            
            {/* Section utilisateur avec menu déroulant */}
            <div className="flex items-center space-x-3">
              {/* Bouton menu mobile */}
              <div className="md:hidden">
                <button
                  onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                  className="inline-flex items-center justify-center p-2 rounded-md text-gray-500 hover:text-emerald-600 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-emerald-500"
                >
                  <i className={`fas ${mobileMenuOpen ? 'fa-times' : 'fa-bars'} text-lg`}></i>
                </button>
              </div>

              {/* Menu utilisateur */}
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="flex items-center space-x-3 p-1 rounded-full hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                >
                  <div className="flex items-center space-x-2">
                    <div className="flex-shrink-0">
                      {student?.photoProfil ? (
                        <img 
                          className="h-8 w-8 rounded-full object-cover border border-gray-200" 
                          src={`http://localhost:8080/api/files/${student.photoProfil}`} 
                          alt="Profil" 
                        />
                      ) : (
                        <div className="h-8 w-8 rounded-full bg-emerald-100 flex items-center justify-center border border-gray-200">
                          <i className="fas fa-user text-emerald-600 text-sm"></i>
                        </div>
                      )}
                    </div>
                    <div className="hidden sm:block text-left">
                      <div className="text-sm font-medium text-gray-900">{student?.prenom} {student?.nom}</div>
                      <div className="text-xs text-gray-500">Étudiant</div>
                    </div>
                    <i className={`fas fa-chevron-down text-gray-400 text-xs transition-transform ${userMenuOpen ? 'rotate-180' : ''}`}></i>
                  </div>
                </button>

                {/* Menu déroulant utilisateur */}
                {userMenuOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50 py-1">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <div className="text-sm font-medium text-gray-900">{student?.prenom} {student?.nom}</div>
                      <div className="text-xs text-gray-500 truncate">{user?.email}</div>
                    </div>
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

          {/* Menu mobile */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-gray-200 py-2">
              <div className="space-y-1">
                <button 
                  className={`w-full flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    location.pathname === '/student/dashboard' 
                    ? 'bg-emerald-100 text-emerald-700' 
                    : 'text-gray-600 hover:text-emerald-600 hover:bg-gray-50'
                  }`}
                  onClick={() => {
                    navigate('/student/dashboard');
                    setMobileMenuOpen(false);
                  }}
                >
                  <i className="fas fa-home mr-3"></i>
                  Tableau de bord
                </button>
                <button 
                  className={`w-full flex items-center px-3 py-2 rounded-md text-base font-medium transition-colors ${
                    location.pathname === '/student/profile' 
                    ? 'bg-emerald-100 text-emerald-700' 
                    : 'text-gray-600 hover:text-emerald-600 hover:bg-gray-50'
                  }`}
                  onClick={() => {
                    navigate('/student/profile');
                    setMobileMenuOpen(false);
                  }}
                >
                  <i className="fas fa-user mr-3"></i>
                  Mon Profil
                </button>
                <button 
                  className="w-full flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-emerald-600 hover:bg-gray-50 transition-colors"
                  onClick={() => {
                    navigate('/student/offers');
                    setMobileMenuOpen(false);
                  }}
                >
                  <i className="fas fa-briefcase mr-3"></i>
                  Offres
                </button>
                <button 
                  className="w-full flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-emerald-600 hover:bg-gray-50 transition-colors"
                  onClick={() => {
                    navigate('/student/applications');
                    setMobileMenuOpen(false);
                  }}
                >
                  <i className="fas fa-file-alt mr-3"></i>
                  Candidatures
                </button>
                <button 
                  className="w-full flex items-center px-3 py-2 rounded-md text-base font-medium text-gray-600 hover:text-emerald-600 hover:bg-gray-50 transition-colors"
                  onClick={() => {
                    navigate('/student/messages');
                    setMobileMenuOpen(false);
                  }}
                >
                  <i className="fas fa-comments mr-3"></i>
                  Messages
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Contenu principal */}
      <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
        {/* Header du profil */}
        <div className="bg-white overflow-hidden shadow-sm rounded-lg mb-6">
          <div className="px-4 sm:px-6 py-6 sm:py-8">
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
              <div className="flex flex-col sm:flex-row sm:items-center space-y-4 sm:space-y-0 sm:space-x-6">
                <div className="relative self-start sm:self-auto">
                  {student?.photoProfil ? (
                    <img 
                      className="h-20 w-20 sm:h-24 sm:w-24 rounded-full object-cover border-4 border-white shadow-lg" 
                      src={`http://localhost:8080/api/files/${student.photoProfil}`} 
                      alt="Profil" 
                    />
                  ) : (
                    <div className="h-20 w-20 sm:h-24 sm:w-24 rounded-full bg-emerald-100 flex items-center justify-center border-4 border-white shadow-lg">
                      <i className="fas fa-user text-emerald-600 text-2xl sm:text-3xl"></i>
                    </div>
                  )}
                  <button 
                    className="absolute -bottom-1 -right-1 h-7 w-7 sm:h-8 sm:w-8 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-emerald-600 transition-colors"
                    onClick={() => setShowPhotoMenu(!showPhotoMenu)}
                  >
                    <i className="fas fa-camera text-xs sm:text-sm"></i>
                  </button>
                  
                  {/* Menu déroulant pour la photo */}
                  {showPhotoMenu && (
                    <div className="absolute bottom-10 right-0 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10">
                      <button
                        className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 rounded-t-lg flex items-center"
                        onClick={() => triggerFileInput('photo')}
                      >
                        <i className="fas fa-upload mr-2"></i>
                        {student?.photoProfil ? 'Changer la photo' : 'Ajouter une photo'}
                      </button>
                      {student?.photoProfil && (
                        <button
                          className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 rounded-b-lg flex items-center"
                          onClick={handleDeletePhoto}
                        >
                          <i className="fas fa-trash mr-2"></i>
                          Supprimer la photo
                        </button>
                      )}
                    </div>
                  )}
                </div>
                <div className="text-center sm:text-left">
                  <h1 className="text-xl sm:text-2xl font-bold text-gray-900">{student?.prenom} {student?.nom}</h1>
                  <p className="text-gray-600 mt-1 text-sm sm:text-base">{student?.specialite} • {student?.etablissement}</p>
                  <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
                    {getStatusBadge(student?.statut)}
                    {/* Afficher le badge de progression seulement si le profil n'est pas complet à 100% */}
                    {completionPercentage < 100 && (
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-${getProgressColor(completionPercentage)}-100 text-${getProgressColor(completionPercentage)}-800`}>
                        <i className="fas fa-check-circle mr-1"></i>
                        Profil complété à {completionPercentage}%
                      </span>
                    )}
                    {/* Badge de profil complet */}
                    {completionPercentage === 100 && (
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                        <i className="fas fa-check-circle mr-1"></i>
                        Profil complet ✓
                      </span>
                    )}
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
          {/* Navigation des onglets - Version responsive */}
          <div className="border-b border-gray-200">
            <nav className="flex overflow-x-auto -mb-px hide-scrollbar">
              {[
                { id: 'personal', name: 'Informations', icon: 'user', fullName: 'Informations personnelles' },
                { id: 'education', name: 'Formation', icon: 'graduation-cap', fullName: 'Formation' },
                { id: 'skills', name: 'Compétences', icon: 'code', fullName: 'Compétences' },
                { id: 'documents', name: 'Documents', icon: 'file', fullName: 'Documents' }
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
            {/* Onglet Informations personnelles */}
            {activeTab === 'personal' && (
              <div>
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">Informations personnelles</h2>
                  <p className="text-gray-600">Gérez vos informations de contact et votre statut</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Prénom *</label>
                    <input
                      name="prenom"
                      type="text"
                      value={formData.prenom}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                        errors.prenom ? 'border-red-300' : 'border-gray-300'
                      } ${!isEditing ? 'bg-gray-50 text-gray-500' : ''}`}
                      placeholder="Votre prénom"
                    />
                    {errors.prenom && <p className="mt-1 text-sm text-red-600">{errors.prenom}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Nom *</label>
                    <input
                      name="nom"
                      type="text"
                      value={formData.nom}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                        errors.nom ? 'border-red-300' : 'border-gray-300'
                      } ${!isEditing ? 'bg-gray-50 text-gray-500' : ''}`}
                      placeholder="Votre nom"
                    />
                    {errors.nom && <p className="mt-1 text-sm text-red-600">{errors.nom}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                    <input
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                        errors.email ? 'border-red-300' : 'border-gray-300'
                      } ${!isEditing ? 'bg-gray-50 text-gray-500' : ''}`}
                      placeholder="votre@email.com"
                    />
                    {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
                  </div>

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
                      } ${!isEditing ? 'bg-gray-50 text-gray-500' : ''}`}
                      placeholder="+33 6 12 34 56 78"
                    />
                    {errors.telephone && <p className="mt-1 text-sm text-red-600">{errors.telephone}</p>}
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
                      } ${!isEditing ? 'bg-gray-50 text-gray-500' : ''}`}
                      placeholder="Votre adresse complète"
                    />
                    {errors.adresse && <p className="mt-1 text-sm text-red-600">{errors.adresse}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Statut actuel</label>
                    <select
                      name="statut"
                      value={formData.statut}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    >
                      <option value="AUTRE">Autre</option>
                      <option value="RECHERCHE_STAGE">Recherche un stage</option>
                      <option value="RECHERCHE_EMPLOI">Recherche un emploi</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* Onglet Formation */}
            {activeTab === 'education' && (
              <div>
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">Formation académique</h2>
                  <p className="text-gray-600">Décrivez votre parcours éducatif</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Diplôme *</label>
                    <select
                      name="diplome"
                      value={formData.diplome}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                        errors.diplome ? 'border-red-300' : 'border-gray-300'
                      }`}
                    >
                      <option value="">Sélectionnez votre diplôme</option>
                      <option value="Baccalauréat">Baccalauréat</option>
                      <option value="DUT">DUT</option>
                      <option value="BTS">BTS</option>
                      <option value="Licence">Licence</option>
                      <option value="Master">Master</option>
                      <option value="Doctorat">Doctorat</option>
                    </select>
                    {errors.diplome && <p className="mt-1 text-sm text-red-600">{errors.diplome}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Spécialité *</label>
                    <input
                      name="specialite"
                      type="text"
                      value={formData.specialite}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                        errors.specialite ? 'border-red-300' : 'border-gray-300'
                      } ${!isEditing ? 'bg-gray-50 text-gray-500' : ''}`}
                      placeholder="Informatique, Marketing..."
                    />
                    {errors.specialite && <p className="mt-1 text-sm text-red-600">{errors.specialite}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Établissement *</label>
                    <input
                      name="etablissement"
                      type="text"
                      value={formData.etablissement}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                        errors.etablissement ? 'border-red-300' : 'border-gray-300'
                      } ${!isEditing ? 'bg-gray-50 text-gray-500' : ''}`}
                      placeholder="Nom de votre établissement"
                    />
                    {errors.etablissement && <p className="mt-1 text-sm text-red-600">{errors.etablissement}</p>}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Année d'obtention *</label>
                    <input
                      name="anneeObtention"
                      type="number"
                      min="1900"
                      max={new Date().getFullYear() + 5}
                      value={formData.anneeObtention}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                        errors.anneeObtention ? 'border-red-300' : 'border-gray-300'
                      } ${!isEditing ? 'bg-gray-50 text-gray-500' : ''}`}
                    />
                    {errors.anneeObtention && <p className="mt-1 text-sm text-red-600">{errors.anneeObtention}</p>}
                  </div>
                </div>
              </div>
            )}

            {/* Onglet Compétences */}
            {activeTab === 'skills' && (
              <div>
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">Compétences et expériences</h2>
                  <p className="text-gray-600">Mettez en valeur vos compétences et votre expérience</p>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Compétences *</label>
                    <textarea
                      name="competences"
                      value={formData.competences}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      rows="4"
                      className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                        errors.competences ? 'border-red-300' : 'border-gray-300'
                      } ${!isEditing ? 'bg-gray-50 text-gray-500' : ''}`}
                      placeholder="Listez vos compétences techniques et professionnelles (ex: Java, React, Gestion de projet, Communication...)"
                    />
                    {errors.competences && <p className="mt-1 text-sm text-red-600">{errors.competences}</p>}
                    <p className="mt-1 text-sm text-gray-500">Séparez les compétences par des virgules</p>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Expériences professionnelles *</label>
                    <textarea
                      name="experiences"
                      value={formData.experiences}
                      onChange={handleInputChange}
                      disabled={!isEditing}
                      rows="6"
                      className={`w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 ${
                        errors.experiences ? 'border-red-300' : 'border-gray-300'
                      } ${!isEditing ? 'bg-gray-50 text-gray-500' : ''}`}
                      placeholder="Décrivez vos expériences professionnelles, stages, projets académiques ou personnels..."
                    />
                    {errors.experiences && <p className="mt-1 text-sm text-red-600">{errors.experiences}</p>}
                  </div>
                </div>
              </div>
            )}

            {/* Onglet Documents */}
            {activeTab === 'documents' && (
              <div>
                <div className="mb-6">
                  <h2 className="text-lg font-semibold text-gray-900">Documents</h2>
                  <p className="text-gray-600">Gérez vos documents professionnels</p>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Carte CV */}
                  <div className="border border-gray-200 rounded-lg p-6 hover:border-emerald-300 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
                          <i className="fas fa-file-pdf text-red-600 text-xl"></i>
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">Curriculum Vitae (CV)</h3>
                          <p className="text-sm text-gray-500 mt-1">
                            {student?.cv ? 'CV téléchargé' : 'Aucun CV téléchargé'}
                          </p>
                          {student?.cv && <span className="text-xs text-gray-400">PDF</span>}
                        </div>
                      </div>
                      <div className="flex flex-col space-y-2">
                        {student?.cv ? (
                          <>
                            <button 
                              className="inline-flex items-center px-3 py-2 border border-emerald-300 text-sm font-medium rounded-md text-emerald-700 bg-white hover:bg-emerald-50 transition-colors"
                              onClick={handleDownloadCV}
                            >
                              <i className="fas fa-download mr-2"></i>
                              Télécharger
                            </button>
                            <button 
                              className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                              onClick={() => triggerFileInput('cv')}
                              disabled={uploading.cv}
                            >
                              {uploading.cv ? (
                                <>
                                  <i className="fas fa-spinner fa-spin mr-2"></i>
                                  Envoi...
                                </>
                              ) : (
                                <>
                                  <i className="fas fa-sync mr-2"></i>
                                  Modifier
                                </>
                              )}
                            </button>
                          </>
                        ) : (
                          <button 
                            className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-emerald-600 hover:bg-emerald-700 transition-colors"
                            onClick={() => triggerFileInput('cv')}
                            disabled={uploading.cv}
                          >
                            {uploading.cv ? (
                              <>
                                <i className="fas fa-spinner fa-spin mr-2"></i>
                                Envoi...
                              </>
                            ) : (
                              <>
                                <i className="fas fa-upload mr-2"></i>
                                Téléverser
                              </>
                            )}
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="mt-4 text-xs text-gray-500">
                      <p>• Format accepté : PDF</p>
                      <p>• Taille maximale : 5MB</p>
                    </div>
                  </div>

                  {/* Carte Photo de profil */}
                  <div className="border border-gray-200 rounded-lg p-6 hover:border-emerald-300 transition-colors">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="flex-shrink-0 w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                          <i className="fas fa-image text-emerald-600 text-xl"></i>
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">Photo de profil</h3>
                          <p className="text-sm text-gray-500 mt-1">
                            {student?.photoProfil ? 'Photo téléchargée' : 'Aucune photo'}
                          </p>
                        </div>
                      </div>
                      <div className="flex flex-col space-y-2">
                        <button 
                          className="inline-flex items-center px-3 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition-colors"
                          onClick={() => triggerFileInput('photo')}
                          disabled={uploading.photo}
                        >
                          {uploading.photo ? (
                            <>
                              <i className="fas fa-spinner fa-spin mr-2"></i>
                              Envoi...
                            </>
                          ) : (
                            <>
                              <i className="fas fa-upload mr-2"></i>
                              {student?.photoProfil ? 'Changer' : 'Ajouter'}
                            </>
                          )}
                        </button>
                        {student?.photoProfil && (
                          <button 
                            className="inline-flex items-center px-3 py-2 border border-red-300 text-sm font-medium rounded-md text-red-700 bg-white hover:bg-red-50 transition-colors"
                            onClick={handleDeletePhoto}
                          >
                            <i className="fas fa-trash mr-2"></i>
                            Supprimer
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="mt-4 text-xs text-gray-500">
                      <p>• Formats acceptés : JPG, PNG, GIF</p>
                      <p>• Taille maximale : 2MB</p>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* Fermer les menus déroulants en cliquant à l'extérieur */}
      {(showPhotoMenu || userMenuOpen || mobileMenuOpen) && (
        <div 
          className="fixed inset-0 z-40"
          onClick={() => {
            setShowPhotoMenu(false);
            setUserMenuOpen(false);
            setMobileMenuOpen(false);
          }}
        ></div>
      )}
    </div>
  );
}

export default StudentProfile;