import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

function CompanySignup() {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formData, setFormData] = useState({
    // Step 1: Informations de connexion
    email: '',
    motDePasse: '',
    confirmPassword: '',
    
    // Step 2: Informations entreprise
    nomEntreprise: '',
    telephone: '',
    adresse: '',
    siteWeb: '',
    registreCommerce: '',
    ice: '',
    secteurActivite: '',
    description: '',
    
    // Step 3: Documents
    documentJustificatif: null,
    logo: null
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingEmail, setIsCheckingEmail] = useState(false);
  const [isCheckingCompany, setIsCheckingCompany] = useState(false);
  const [errors, setErrors] = useState({});
  const [verificationStep, setVerificationStep] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [isSendingCode, setIsSendingCode] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);

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

  // Fonction pour vérifier si l'email existe déjà
  const checkEmailExists = async (email) => {
    try {
      const response = await fetch(`http://localhost:8080/api/companies/check-email?email=${encodeURIComponent(email)}`);
      if (response.ok) {
        const data = await response.json();
        return data.exists;
      }
      return false;
    } catch (error) {
      console.error('Erreur lors de la vérification de l\'email:', error);
      return false;
    }
  };

  // Fonction pour vérifier si le nom d'entreprise existe déjà
  const checkCompanyNameExists = async (nomEntreprise) => {
    try {
      const response = await fetch(`http://localhost:8080/api/companies/check-company-name?nomEntreprise=${encodeURIComponent(nomEntreprise)}`);
      if (response.ok) {
        const data = await response.json();
        return data.exists;
      }
      return false;
    } catch (error) {
      console.error('Erreur lors de la vérification du nom d\'entreprise:', error);
      return false;
    }
  };

  // Fonction pour envoyer le code de vérification
  const sendVerificationCode = async (email) => {
    try {
      const response = await fetch('http://localhost:8080/api/companies/send-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `email=${encodeURIComponent(email)}`
      });
      return response.ok;
    } catch (error) {
      console.error('Erreur lors de l\'envoi du code:', error);
      return false;
    }
  };

  // Fonction pour vérifier le code
  const verifyCode = async (email, code) => {
    try {
      const response = await fetch('http://localhost:8080/api/companies/verify-code', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `email=${encodeURIComponent(email)}&code=${encodeURIComponent(code)}`
      });
      return response.ok;
    } catch (error) {
      console.error('Erreur lors de la vérification du code:', error);
      return false;
    }
  };

  const validateStep1 = async () => {
    const newErrors = {};
    
    if (!formData.email) newErrors.email = 'Email est obligatoire';
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Format d\'email invalide';
    
    if (!formData.motDePasse) newErrors.motDePasse = 'Mot de passe est obligatoire';
    else if (formData.motDePasse.length < 6) newErrors.motDePasse = 'Le mot de passe doit contenir au moins 6 caractères';
    
    if (formData.motDePasse !== formData.confirmPassword) newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    
    // Si il y a des erreurs de validation basique, on les affiche
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return false;
    }
    
    // Vérifier si l'email existe déjà
    setIsCheckingEmail(true);
    try {
      const emailExists = await checkEmailExists(formData.email);
      if (emailExists) {
        setErrors({ email: 'Cet email est déjà utilisé par un autre utilisateur' });
        setIsCheckingEmail(false);
        return false;
      }
    } catch (error) {
      setErrors({ email: 'Erreur lors de la vérification de l\'email' });
      setIsCheckingEmail(false);
      return false;
    }
    
    setIsCheckingEmail(false);
    setErrors({});
    return true;
  };

  const validateStep2 = async () => {
    const newErrors = {};
    
    if (!formData.nomEntreprise) newErrors.nomEntreprise = 'Nom de l\'entreprise est obligatoire';
    if (!formData.telephone) newErrors.telephone = 'Téléphone est obligatoire';
    if (!formData.adresse) newErrors.adresse = 'Adresse est obligatoire';
    if (!formData.secteurActivite) newErrors.secteurActivite = 'Secteur d\'activité est obligatoire';
    
    // Si il y a des erreurs de validation basique, on les affiche
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return false;
    }
    
    // Vérifier si le nom d'entreprise existe déjà
    setIsCheckingCompany(true);
    try {
      const companyExists = await checkCompanyNameExists(formData.nomEntreprise);
      if (companyExists) {
        setErrors({ nomEntreprise: 'Ce nom d\'entreprise est déjà utilisé' });
        setIsCheckingCompany(false);
        return false;
      }
    } catch (error) {
      setErrors({ nomEntreprise: 'Erreur lors de la vérification du nom d\'entreprise' });
      setIsCheckingCompany(false);
      return false;
    }
    
    setIsCheckingCompany(false);
    setErrors({});
    return true;
  };

  const validateStep3 = () => {
    const newErrors = {};
    
    if (!formData.documentJustificatif) newErrors.documentJustificatif = 'Le document justificatif est obligatoire';
    else if (formData.documentJustificatif.type !== 'application/pdf') {
      newErrors.documentJustificatif = 'Le document doit être au format PDF';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNextStep = async () => {
    if (step === 1) {
      const isValid = await validateStep1();
      if (isValid) {
        // Envoyer le code de vérification
        setIsSendingCode(true);
        const success = await sendVerificationCode(formData.email);
        setIsSendingCode(false);
        
        if (success) {
          setVerificationStep(true);
        } else {
          setErrors({ submit: 'Erreur lors de l\'envoi du code de vérification' });
        }
      }
    } else if (step === 2 && await validateStep2()) {
      setStep(3);
    } else if (step === 3 && validateStep3()) {
      handleSubmit();
    }
  };

  const handleVerification = async () => {
    if (!verificationCode) {
      setErrors({ verification: 'Veuillez entrer le code de vérification' });
      return;
    }

    setIsVerifying(true);
    const isValid = await verifyCode(formData.email, verificationCode);
    setIsVerifying(false);

    if (isValid) {
      setVerificationStep(false);
      setStep(2);
      setErrors({});
    } else {
      setErrors({ verification: 'Code de vérification incorrect' });
    }
  };

  const handleResendCode = async () => {
    setIsSendingCode(true);
    const success = await sendVerificationCode(formData.email);
    setIsSendingCode(false);
    
    if (success) {
      setErrors({});
      alert('Code de vérification renvoyé avec succès!');
    } else {
      setErrors({ verification: 'Erreur lors de l\'envoi du code' });
    }
  };

  const handlePreviousStep = () => {
    if (verificationStep) {
      setVerificationStep(false);
    } else {
      setStep(step - 1);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    
    try {
      // Créer FormData pour envoyer les fichiers
      const submitData = new FormData();
      
      // Ajouter les champs texte
      submitData.append('email', formData.email);
      submitData.append('motDePasse', formData.motDePasse);
      submitData.append('nomEntreprise', formData.nomEntreprise);
      submitData.append('telephone', formData.telephone);
      submitData.append('adresse', formData.adresse);
      submitData.append('siteWeb', formData.siteWeb);
      submitData.append('registreCommerce', formData.registreCommerce);
      submitData.append('ice', formData.ice);
      submitData.append('secteurActivite', formData.secteurActivite);
      submitData.append('description', formData.description);
      
      // Ajouter les fichiers
      if (formData.documentJustificatif) submitData.append('documentJustificatif', formData.documentJustificatif);
      if (formData.logo) submitData.append('logo', formData.logo);
      
      const response = await fetch('http://localhost:8080/api/companies/register', {
        method: 'POST',
        body: submitData,
      });
      
      if (response.ok) {
        const company = await response.json();
        console.log('Inscription réussie:', company);
        
        // Redirection vers la page de confirmation avec les données
        navigate('/company/confirmation', { 
          state: { company: company } 
        });
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

  const progress = verificationStep ? 33 : (step / 3) * 100;

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
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Inscription Entreprise</h1>
          <p className="text-gray-600">Créez votre profil entreprise pour recruter les meilleurs talents</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-8">
          <div className="flex justify-between text-sm text-gray-500 mb-2">
            <span>Étape {verificationStep ? 'Vérification' : step} sur {verificationStep ? 2 : 3}</span>
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

        {/* Étape de vérification */}
        {verificationStep && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Vérification de l'email</h2>
            <p className="text-gray-600 mb-6">
              Nous avons envoyé un code de vérification à <strong>{formData.email}</strong>
            </p>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="verificationCode" className="block text-sm font-medium text-gray-700">
                  Code de vérification *
                </label>
                <input
                  id="verificationCode"
                  type="text"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    errors.verification ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Entrez le code reçu par email"
                />
                {errors.verification && <p className="text-red-500 text-sm">{errors.verification}</p>}
              </div>

              <div className="flex space-x-4">
                <button
                  type="button"
                  onClick={() => setVerificationStep(false)}
                  className="flex-1 py-3 bg-gray-200 text-gray-800 font-semibold rounded-lg hover:bg-gray-300 transition-colors"
                >
                  Retour
                </button>
                <button
                  type="button"
                  onClick={handleVerification}
                  disabled={isVerifying}
                  className="flex-1 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {isVerifying ? 'Vérification...' : 'Vérifier'}
                </button>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={handleResendCode}
                  disabled={isSendingCode}
                  className="text-green-600 hover:underline disabled:opacity-50 text-sm"
                >
                  {isSendingCode ? 'Envoi en cours...' : 'Renvoyer le code'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 1: Informations de connexion */}
        {step === 1 && !verificationStep && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Informations de connexion</h2>
            <p className="text-gray-600 mb-6">Créez vos identifiants d'accès</p>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email professionnel *
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
                  placeholder="contact@entreprise.com"
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

              <button
                type="button"
                onClick={handleNextStep}
                disabled={isCheckingEmail || isSendingCode}
                className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
              >
                {isCheckingEmail ? 'Vérification de l\'email...' : 
                 isSendingCode ? 'Envoi du code...' : 'Continuer'}
              </button>
            </div>
          </div>
        )}

        {/* Step 2: Informations entreprise */}
        {step === 2 && !verificationStep && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Informations de l'entreprise</h2>
            <p className="text-gray-600 mb-6">Renseignez les informations de votre entreprise</p>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="nomEntreprise" className="block text-sm font-medium text-gray-700">
                  Nom de l'entreprise *
                </label>
                <input
                  id="nomEntreprise"
                  name="nomEntreprise"
                  type="text"
                  value={formData.nomEntreprise}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    errors.nomEntreprise ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Nom officiel de votre entreprise"
                />
                {errors.nomEntreprise && <p className="text-red-500 text-sm">{errors.nomEntreprise}</p>}
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
                  placeholder="+212 5 23 45 67 89"
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
                  placeholder="Adresse complète de l'entreprise"
                  rows={3}
                />
                {errors.adresse && <p className="text-red-500 text-sm">{errors.adresse}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="siteWeb" className="block text-sm font-medium text-gray-700">
                  Site web
                </label>
                <input
                  id="siteWeb"
                  name="siteWeb"
                  type="url"
                  value={formData.siteWeb}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="https://www.votre-entreprise.com"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label htmlFor="registreCommerce" className="block text-sm font-medium text-gray-700">
                    Registre de commerce
                  </label>
                  <input
                    id="registreCommerce"
                    name="registreCommerce"
                    type="text"
                    value={formData.registreCommerce}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="RC"
                  />
                </div>

                <div className="space-y-2">
                  <label htmlFor="ice" className="block text-sm font-medium text-gray-700">
                    ICE
                  </label>
                  <input
                    id="ice"
                    name="ice"
                    type="text"
                    value={formData.ice}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="001234567890"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label htmlFor="secteurActivite" className="block text-sm font-medium text-gray-700">
                  Secteur d'activité *
                </label>
                <input
                  id="secteurActivite"
                  name="secteurActivite"
                  type="text"
                  value={formData.secteurActivite}
                  onChange={handleInputChange}
                  className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 ${
                    errors.secteurActivite ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Informatique, Conseil, Santé, etc."
                />
                {errors.secteurActivite && <p className="text-red-500 text-sm">{errors.secteurActivite}</p>}
              </div>

              <div className="space-y-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description de l'entreprise
                </label>
                <textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                  placeholder="Décrivez brièvement votre entreprise, ses valeurs et ses activités..."
                  rows={4}
                />
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
                  disabled={isCheckingCompany}
                  className="flex-1 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                >
                  {isCheckingCompany ? 'Vérification...' : 'Continuer'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 3: Documents */}
        {step === 3 && !verificationStep && (
          <div className="bg-white rounded-xl shadow-md p-6 mb-6">
            <h2 className="text-xl font-semibold text-gray-800 mb-4">Documents justificatifs</h2>
            <p className="text-gray-600 mb-6">Téléchargez les documents nécessaires à la vérification</p>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Document justificatif *
                </label>
                <div className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                  errors.documentJustificatif ? 'border-red-500 bg-red-50' : 'border-gray-300 hover:border-green-500'
                }`}>
                  <div className="w-8 h-8 text-gray-400 mx-auto mb-2">
                    <i className="fas fa-file-pdf text-2xl"></i>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    {formData.documentJustificatif ? formData.documentJustificatif.name : 'Glissez-déposez votre document PDF ou cliquez pour sélectionner'}
                  </p>
                  <p className="text-xs text-gray-500 mb-3">
                    (KBIS, extrait Kbis, ou tout document officiel prouvant l'existence de votre entreprise)
                  </p>
                  <input
                    type="file"
                    id="documentJustificatif"
                    name="documentJustificatif"
                    accept=".pdf"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="documentJustificatif"
                    className="inline-block px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 cursor-pointer"
                  >
                    Choisir un fichier
                  </label>
                </div>
                {errors.documentJustificatif && <p className="text-red-500 text-sm">{errors.documentJustificatif}</p>}
              </div>

              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Logo de l'entreprise (optionnel)
                </label>
                <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-500 transition-colors">
                  <div className="w-8 h-8 text-gray-400 mx-auto mb-2">
                    <i className="fas fa-image text-2xl"></i>
                  </div>
                  <p className="text-sm text-gray-600 mb-2">
                    {formData.logo ? formData.logo.name : 'Ajoutez le logo de votre entreprise'}
                  </p>
                  <input
                    type="file"
                    id="logo"
                    name="logo"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="hidden"
                  />
                  <label
                    htmlFor="logo"
                    className="inline-block px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 cursor-pointer"
                  >
                    Choisir une image
                  </label>
                </div>
              </div>

              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <p className="text-sm text-green-700">
                  Votre compte sera créé avec le statut <strong>"En attente de vérification"</strong>.
                  Notre équipe examinera vos documents sous 24-48 heures. Vous recevrez un email de confirmation une fois votre compte approuvé.
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
                  {isLoading ? 'Création du compte...' : 'Finaliser l\'inscription'}
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

export default CompanySignup;