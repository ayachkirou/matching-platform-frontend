import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';
import { authService } from './services/authService';
import './App.css';
import logo from './assets/logo.png'

function Login() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [activeTab, setActiveTab] = useState('student');
  const [formData, setFormData] = useState({
    email: '',
    motDePasse: ''
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    if (error) setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    try {
      const response = await authService.login(formData.email, formData.motDePasse);
      
      // Vérifier si le type d'utilisateur correspond à l'onglet sélectionné
      if ((activeTab === 'student' && response.role !== 'STUDENT') ||
          (activeTab === 'company' && response.role !== 'COMPANY')) {
        setError('Veuillez vous connecter avec le bon type de compte');
        setIsLoading(false);
        return;
      }

      // Vérifier le statut de vérification pour les entreprises
      if (response.role === 'COMPANY' && !response.isVerified) {
        setError('Votre compte entreprise est en attente de vérification. Vous recevrez un email une fois approuvé.');
        setIsLoading(false);
        return;
      }

      // Stocker les données utilisateur dans le contexte
      const userData = {
        id: response.id,
        email: response.email,
        role: response.role,
        nom: response.nom,
        prenom: response.prenom,
        nomEntreprise: response.nomEntreprise,
        isVerified: response.isVerified
      };

      // Utiliser le contexte d'authentification pour connecter l'utilisateur
      login(userData, response.token);
      
      // Rediriger selon le rôle
      if (response.role === 'STUDENT') {
        navigate('/student/profile');
      } else if (response.role === 'COMPANY') {
        navigate('/company/dashboard');
      } else if (response.role === 'ADMIN') {
        navigate('/admin/dashboard');
      }

    } catch (error) {
      setError(error.message || 'Email ou mot de passe incorrect');
    } finally {
      setIsLoading(false);
    }
  };

  // Réinitialiser le formulaire quand on change d'onglet
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setFormData({ email: '', motDePasse: '' });
    setError("");
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header */}
        <div className="text-center mb-8">
          <Link to="/" className="inline-flex items-center space-x-2 mb-3">
            <div className="rounded-lg flex items-center justify-center">
              <img
                src={logo}
                alt="TalentMatch Logo"
                className="w-12 h-12 rounded"
              />
            </div>
            <span className="text-2xl font-bold text-gray-800">TalentMatch</span>
          </Link>
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Connexion</h1>
          <p className="text-gray-600">Accédez à votre espace personnel</p>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="grid grid-cols-2 gap-2 p-1 bg-gray-100 rounded-lg">
            <button
              className={`flex items-center justify-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'student' 
                ? 'bg-white text-gray-800 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => handleTabChange('student')}
            >
              <i className="fas fa-graduation-cap w-4 h-4"></i>
              <span>Étudiant</span>
            </button>
            <button
              className={`flex items-center justify-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                activeTab === 'company' 
                ? 'bg-white text-gray-800 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700'
              }`}
              onClick={() => handleTabChange('company')}
            >
              <i className="fas fa-building w-4 h-4"></i>
              <span>Entreprise</span>
            </button>
          </div>
        </div>

        {/* Student Login */}
        {activeTab === 'student' && (
          <div className="bg-white rounded-xl shadow-md border border-gray-200">
            <div className="p-6 pb-0">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Connexion Étudiant</h2>
              <p className="text-gray-600 text-sm">Connectez-vous pour accéder à vos offres et candidatures</p>
            </div>
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="student-email" className="block text-sm font-medium text-gray-700">
                    Email étudiant
                  </label>
                  <input
                    id="student-email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="etudiant@exemple.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="student-password" className="block text-sm font-medium text-gray-700">
                    Mot de passe
                  </label>
                  <div className="relative">
                    <input
                      id="student-password"
                      name="motDePasse"
                      type={showPassword ? "text" : "password"}
                      value={formData.motDePasse}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 pr-10"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-0 top-0 h-full px-3 py-2 text-gray-500 hover:text-gray-700"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <i className="fas fa-eye-slash w-4 h-4"></i>
                      ) : (
                        <i className="fas fa-eye w-4 h-4"></i>
                      )}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className="bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded">
                    <p className="text-sm">{error}</p>
                  </div>
                )}

                <button 
                  type="submit" 
                  className="w-full py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                      Connexion...
                    </>
                  ) : (
                    "Se connecter"
                  )}
                </button>
              </form>
            </div>
          </div>
        )}

        {/* Company Login */}
        {activeTab === 'company' && (
          <div className="bg-white rounded-xl shadow-md border border-gray-200">
            <div className="p-6 pb-0">
              <h2 className="text-xl font-semibold text-gray-800 mb-2">Connexion Entreprise</h2>
              <p className="text-gray-600 text-sm">Connectez-vous pour gérer vos offres et candidatures</p>
            </div>
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="company-email" className="block text-sm font-medium text-gray-700">
                    Email professionnel
                  </label>
                  <input
                    id="company-email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                    placeholder="contact@entreprise.com"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <label htmlFor="company-password" className="block text-sm font-medium text-gray-700">
                    Mot de passe
                  </label>
                  <div className="relative">
                    <input
                      id="company-password"
                      name="motDePasse"
                      type={showPassword ? "text" : "password"}
                      value={formData.motDePasse}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 pr-10"
                      placeholder="••••••••"
                      required
                    />
                    <button
                      type="button"
                      className="absolute right-0 top-0 h-full px-3 py-2 text-gray-500 hover:text-gray-700"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <i className="fas fa-eye-slash w-4 h-4"></i>
                      ) : (
                        <i className="fas fa-eye w-4 h-4"></i>
                      )}
                    </button>
                  </div>
                </div>

                {error && (
                  <div className={`px-4 py-3 rounded ${
                    error.includes('en attente') ? 'bg-yellow-100 border border-yellow-200 text-yellow-700' :
                    error.includes('rejeté') ? 'bg-red-100 border border-red-200 text-red-700' :
                    'bg-red-100 border border-red-200 text-red-700'
                  }`}>
                    <p className="text-sm">{error}</p>
                  </div>
                )}

                <button 
                  type="submit" 
                  className="w-full py-2 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors disabled:opacity-50"
                  disabled={isLoading}
                >
                  {isLoading ? (
                    <>
                      <i className="fas fa-spinner fa-spin mr-2"></i>
                      Connexion...
                    </>
                  ) : (
                    "Se connecter"
                  )}
                </button>
              </form>
            </div>
          </div>
        )}

        <div className="mt-6 text-center space-y-2">
          <Link to="/forgot-password" className="text-sm text-green-600 hover:underline">
            <i className="fas fa-key mr-1"></i>
            Mot de passe oublié ?
          </Link>
          <p className="text-sm text-gray-600">
            Pas encore de compte ?{" "}
            <Link to="/signup" className="text-green-600 hover:underline">
              <i className="fas fa-user-plus mr-1"></i>
              S'inscrire
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default Login;