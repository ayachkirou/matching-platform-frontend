import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

function StudentSignup() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    // Step 1: Informations personnelles
    email: '',
    motDePasse: '',
    confirmPassword: '',
    nom: '',
    prenom: '',
    telephone: '',
    adresse: '',
    
    // Step 2: Formation et compétences
    diplome: '',
    autreDiplome: '',
    specialite: '',
    etablissement: '',
    anneeObtention: new Date().getFullYear(),
    competences: '',
    experiences: '',
    statut: 'AUTRE',
    
    // Step 3: Documents
    cv: null,
    photoProfil: null
  });
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear error when user types
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: files[0]
    }));
  };

  const validateStep1 = () => {
    const newErrors = {};
    
    if (!formData.email) newErrors.email = 'Email est obligatoire';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Format d\'email invalide';
    
    if (!formData.motDePasse) newErrors.motDePasse = 'Mot de passe est obligatoire';
    else if (formData.motDePasse.length < 6) newErrors.motDePasse = 'Le mot de passe doit contenir au moins 6 caractères';
    
    if (formData.motDePasse !== formData.confirmPassword) newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    
    if (!formData.nom) newErrors.nom = 'Nom est obligatoire';
    if (!formData.prenom) newErrors.prenom = 'Prénom est obligatoire';
    if (!formData.telephone) newErrors.telephone = 'Téléphone est obligatoire';
    if (!formData.adresse) newErrors.adresse = 'Adresse est obligatoire';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = () => {
    const newErrors = {};
    
    if (!formData.diplome) {
      newErrors.diplome = 'Diplôme est obligatoire';
    } else if (formData.diplome === 'Autre' && !formData.autreDiplome) {
      newErrors.autreDiplome = 'Veuillez préciser votre diplôme';
    }
    if (!formData.specialite) newErrors.specialite = 'Spécialité est obligatoire';
    if (!formData.etablissement) newErrors.etablissement = 'Établissement est obligatoire';
    if (!formData.anneeObtention || formData.anneeObtention < 1900 || formData.anneeObtention > new Date().getFullYear() + 5) {
      newErrors.anneeObtention = 'Année d\'obtention invalide';
    }
    if (!formData.competences) newErrors.competences = 'Compétences sont obligatoires';
    if (!formData.experiences) newErrors.experiences = 'Expériences sont obligatoires';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = () => {
    const newErrors = {};
    
    if (!formData.cv) newErrors.cv = 'Le CV est obligatoire';
    else if (formData.cv.type !== 'application/pdf') newErrors.cv = 'Le fichier doit être au format PDF';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = () => {
    if (step === 1 && validateStep1()) {
      setStep(2);
    } else if (step === 2 && validateStep2()) {
      setStep(3);
    } else if (step === 3 && validateStep3()) {
      handleSubmit();
    }
  };

  const handlePreviousStep = () => {
    setStep(step - 1);
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    
    try {
      // Créer FormData pour envoyer les fichiers
      const submitData = new FormData();
      
      const diplomeFinal = formData.diplome === 'Autre' 
        ? formData.autreDiplome 
        : formData.diplome;
      
      // Ajouter les champs texte
      submitData.append('email', formData.email);
      submitData.append('motDePasse', formData.motDePasse);
      submitData.append('nom', formData.nom);
      submitData.append('prenom', formData.prenom);
      submitData.append('telephone', formData.telephone);
      submitData.append('adresse', formData.adresse);
      submitData.append('diplome', diplomeFinal);
      submitData.append('specialite', formData.specialite);
      submitData.append('etablissement', formData.etablissement);
      submitData.append('anneeObtention', formData.anneeObtention);
      submitData.append('competences', formData.competences);
      submitData.append('experiences', formData.experiences);
      submitData.append('statut', formData.statut);
      
      // Ajouter les fichiers
      if (formData.cv) submitData.append('cv', formData.cv);
      if (formData.photoProfil) submitData.append('photoProfil', formData.photoProfil);
      
      const response = await fetch('http://localhost:8080/api/students/register-with-files', {
        method: 'POST',
        body: submitData,
      });
      
      if (response.ok) {
        const student = await response.json();
        console.log('Inscription réussie:', student);
        navigate('/login');
      } else {
        const errorData = await response.json();
        setErrors({ submit: errorData.message || 'Erreur lors de l\'inscription' });
      }
    } catch (error) {
      setErrors({ submit: 'Erreur de connexion au serveur' });
    } finally {
      setIsLoading(false);
    }
  };

  const progress = (step / 3) * 100;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-10 h-10 bg-green-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">TM</span>
            </div>
            <span className="text-2xl font-bold text-gray-800">TalentMatch</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Inscription Étudiant</h1>
          <p className="text-gray-600">Créez votre profil pour accéder aux meilleures opportunités</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>Étape {step} sur 3</span>
            <span>{Math.round(progress)}% complété</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-green-600 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Error Alert */}
        {errors.submit && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {errors.submit}
          </div>
        )}

        {/* Step 1: Basic Information */}
        {step === 1 && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Informations personnelles</h2>
            <p className="text-gray-600 mb-6">Commençons par vos informations de base</p>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="prenom" className="block text-sm font-medium text-gray-700">
                    Prénom *
                  </label>
                  <input
                    id="prenom"
                    name="prenom"
                    type="text"
                    value={formData.prenom}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      errors.prenom ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Prénom"
                  />
                  {errors.prenom && <p className="text-red-500 text-sm">{errors.prenom}</p>}
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="nom" className="block text-sm font-medium text-gray-700">
                    Nom *
                  </label>
                  <input
                    id="nom"
                    name="nom"
                    type="text"
                    value={formData.nom}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      errors.nom ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Nom"
                  />
                  {errors.nom && <p className="text-red-500 text-sm">{errors.nom}</p>}
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email *
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Prénom.Nom@exemple.com"
                />
                {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="motDePasse" className="block text-sm font-medium text-gray-700">
                  Mot de passe *
                </label>
                <div className="relative">
                  <input
                    id="motDePasse"
                    name="motDePasse"
                    type={showPassword ? "text" : "password"}
                    value={formData.motDePasse}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      errors.motDePasse ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <i className="fas fa-eye-slash text-sm"></i>
                    ) : (
                      <i className="fas fa-eye text-sm"></i>
                    )}
                  </button>
                </div>
                {errors.motDePasse && <p className="text-red-500 text-sm">{errors.motDePasse}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                  Confirmer le mot de passe *
                  </label>
                <div className="relative">
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="••••••••"
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? (
                      <i className="fas fa-eye-slash text-sm"></i>
                    ) : (
                      <i className="fas fa-eye text-sm"></i>
                    )}
                  </button>
                </div>
                {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="telephone" className="block text-sm font-medium text-gray-700">
                  Téléphone *
                </label>
                <input
                  id="telephone"
                  name="telephone"
                  type="tel"
                  value={formData.telephone}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    errors.telephone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="+33 6 12 34 56 78"
                />
                {errors.telephone && <p className="text-red-500 text-sm">{errors.telephone}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="adresse" className="block text-sm font-medium text-gray-700">
                  Adresse *
                </label>
                <textarea
                  id="adresse"
                  name="adresse"
                  value={formData.adresse}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    errors.adresse ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Votre adresse complète"
                  rows={3}
                />
                {errors.adresse && <p className="text-red-500 text-sm">{errors.adresse}</p>}
              </div>

              <button
                type="button"
                onClick={handleNextStep}
                className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
              >
                Continuer
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Education & Skills */}
        {step === 2 && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Formation et compétences</h2>
            <p className="text-gray-600 mb-6">Parlez-nous de votre parcours académique</p>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="diplome" className="block text-sm font-medium text-gray-700">
                  Diplôme *
                </label>
                <select
                  id="diplome"
                  name="diplome"
                  value={formData.diplome}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    errors.diplome ? 'border-red-500' : 'border-gray-300'
                  }`}
                >
                  <option value="">Sélectionnez votre diplôme</option>
                  <option value="Baccalauréat">Baccalauréat</option>
                  <option value="DUT">DUT</option>
                  <option value="BTS">BTS</option>
                  <option value="ISTA">ISTA</option>
                  <option value="Licence">Licence</option>
                  <option value="Master">Master</option>
                  <option value="Doctorat">Doctorat</option>
                  <option value="Autre">Autre (précisez)</option>
                </select>
                {errors.diplome && <p className="text-red-500 text-sm">{errors.diplome}</p>}
              </div>

              {formData.diplome === 'Autre' && (
                <div className="space-y-2">
                  <label htmlFor="autreDiplome" className="block text-sm font-medium text-gray-700">
                    Précisez votre diplôme *
                  </label>
                  <input
                    id="autreDiplome"
                    name="autreDiplome"
                    type="text"
                    value={formData.autreDiplome}
                    onChange={handleInputChange}
                    className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                      errors.autreDiplome ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="Votre diplôme"
                  />
                  {errors.autreDiplome && <p className="text-red-500 text-sm">{errors.autreDiplome}</p>}
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="specialite" className="block text-sm font-medium text-gray-700">
                  Spécialité *
                </label>
                <input
                  id="specialite"
                  name="specialite"
                  type="text"
                  value={formData.specialite}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    errors.specialite ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Informatique, Marketing, Finance..."
                />
                {errors.specialite && <p className="text-red-500 text-sm">{errors.specialite}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="etablissement" className="block text-sm font-medium text-gray-700">
                  École/Université *
                </label>
                <input
                  id="etablissement"
                  name="etablissement"
                  type="text"
                  value={formData.etablissement}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    errors.etablissement ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Nom de votre établissement"
                />
                {errors.etablissement && <p className="text-red-500 text-sm">{errors.etablissement}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="anneeObtention" className="block text-sm font-medium text-gray-700">
                  Année d'obtention *
                </label>
                <input
                  id="anneeObtention"
                  name="anneeObtention"
                  type="number"
                  min="1900"
                  max={new Date().getFullYear() + 5}
                  value={formData.anneeObtention}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    errors.anneeObtention ? 'border-red-500' : 'border-gray-300'
                  }`}
                />
                {errors.anneeObtention && <p className="text-red-500 text-sm">{errors.anneeObtention}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="competences" className="block text-sm font-medium text-gray-700">
                  Compétences *
                </label>
                <textarea
                  id="competences"
                  name="competences"
                  value={formData.competences}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    errors.competences ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Listez vos compétences séparées par des virgules (Java, React, Python...)"
                  rows={3}
                />
                {errors.competences && <p className="text-red-500 text-sm">{errors.competences}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="experiences" className="block text-sm font-medium text-gray-700">
                  Expérience professionnelle *
                </label>
                <textarea
                  id="experiences"
                  name="experiences"
                  value={formData.experiences}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    errors.experiences ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Décrivez brièvement vos expériences (stages, jobs étudiants, projets...)"
                  rows={4}
                />
                {errors.experiences && <p className="text-red-500 text-sm">{errors.experiences}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="statut" className="block text-sm font-medium text-gray-700">
                  Statut actuel *
                </label>
                <select
                  id="statut"
                  name="statut"
                  value={formData.statut}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                >
                  <option value="AUTRE">Autre</option>
                  <option value="RECHERCHE_STAGE">Recherche un stage</option>
                  <option value="RECHERCHE_EMPLOI">Recherche un emploi</option>
                </select>
              </div>

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={handlePreviousStep}
                  className="flex-1 py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Retour
                </button>
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="flex-1 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
                >
                  Continuer
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Documents */}
        {step === 3 && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Documents</h2>
            <p className="text-gray-600 mb-6">Ajoutez votre CV et photo de profil pour finaliser votre inscription</p>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  CV (PDF) *
                </label>
                <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  errors.cv ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-green-500'
                }`}>
                  <div className="w-8 h-8 text-gray-400 mx-auto mb-2">
                    <i className="fas fa-file-pdf text-2xl"></i>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    {formData.cv ? formData.cv.name : 'Glissez-déposez votre CV PDF ou cliquez pour sélectionner'}
                  </p>
                  <input
                    type="file"
                    id="cv"
                    name="cv"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="cv"
                    className="inline-block px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 cursor-pointer"
                  >
                    Choisir un fichier
                  </label>
                </div>
                {errors.cv && <p className="text-red-500 text-sm">{errors.cv}</p>}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Photo de profil (optionnel)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-500 transition-colors">
                  <div className="w-8 h-8 text-gray-400 mx-auto mb-2">
                    <i className="fas fa-camera text-2xl"></i>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    {formData.photoProfil ? formData.photoProfil.name : 'Ajoutez une photo professionnelle'}
                  </p>
                  <input
                    type="file"
                    id="photoProfil"
                    name="photoProfil"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="photoProfil"
                    className="inline-block px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 cursor-pointer"
                  >
                    Choisir une photo
                  </label>
                </div>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                <p className="text-sm text-blue-700">
                  En vous inscrivant, vous acceptez nos conditions d'utilisation et notre politique de confidentialité.
                </p>
              </div>

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={handlePreviousStep}
                  className="flex-1 py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Retour
                </button>
                <button
                  type="button"
                  onClick={handleNextStep}
                  disabled={isLoading}
                  className="flex-1 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {isLoading ? 'Création du compte...' : 'Créer mon compte'}
                </button>
              </div>
            </div>
          </div>
        )}

        <div className="text-center">
          <p className="text-sm text-gray-600">
            Vous avez déjà un compte ?{' '}
            <button onClick={() => navigate('/login')} className="text-green-600 hover:underline">
              Se connecter
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}

export default StudentSignup;