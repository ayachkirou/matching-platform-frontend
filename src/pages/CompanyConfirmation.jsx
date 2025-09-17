import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import '../App.css';

function CompanyConfirmation() {
  const navigate = useNavigate();
  const location = useLocation();
  const [companyData, setCompanyData] = useState(null);


  useEffect(() => {
    // Récupérer les données de l'entreprise depuis l'état de navigation
    if (location.state?.company) {
      setCompanyData(location.state.company);
    } else {
      // Rediriger si pas de données
      navigate('/signup/company');
    }
  }, [location, navigate]);

  if (!companyData) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Chargement...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-6">
            <div className="w-12 h-12 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">TM</span>
            </div>
            <span className="text-3xl font-bold text-gray-800">TalentMatch</span>
          </div>
        </div>

        {/* Card de confirmation */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-6">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            
            <h1 className="text-2xl font-bold text-gray-800 mb-4">
              Inscription Réussie !
            </h1>
            
            <p className="text-lg text-gray-600 mb-2">
              Bienvenue <strong>{companyData.nomEntreprise}</strong> 
            </p>
          </div>

          <div className="bg-blue-50 border-l-4 border-blue-500 p-6 rounded-lg mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="ml-3">
                <h3 className="text-sm font-medium text-blue-800">
                  Votre compte est en cours de vérification
                </h3>
                <div className="mt-2 text-sm text-blue-700">
                  <p>
                    Notre équipe examine vos documents. Vous recevrez un email de confirmation 
                    dans les 24-48 heures une fois votre compte approuvé.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-2"> Email de confirmation</h4>
              <p className="text-sm text-gray-600">
                Un email a été envoyé à <strong>{companyData.email}</strong> avec les détails de votre inscription.
              </p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-semibold text-gray-800 mb-2"> Prochaines étapes</h4>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Vérification de vos documents</li>
                <li>• Approval de votre compte</li>
                <li>• Accès à la plateforme</li>
              </ul>
            </div>
          </div>

          <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-lg mb-6">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-yellow-700">
                  <strong>Note importante :</strong> Vous ne pouvez pas vous connecter tant que votre compte n'est pas vérifié.
                </p>
              </div>
            </div>
          </div>

          <div className="text-center">
            
            <div className="flex justify-center gap-4">
              <button
                onClick={() => navigate('/')}
                className="px-6 py-2 bg-gray-200 text-gray-800 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Page d'accueil
              </button>
              
              <button
                onClick={() => navigate('/login')}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Se connecter
              </button>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center">
          <p className="text-sm text-gray-600">
            Besoin d'aide ?{' '}
            <a href="mailto:support@talentmatch.com" className="text-blue-600 hover:underline">
              Contactez notre support
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default CompanyConfirmation;