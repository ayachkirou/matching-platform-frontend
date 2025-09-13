import { useNavigate } from 'react-router-dom'
import './App.css'
import logo from './assets/logo.png'

function Signup() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-white">
      {/* Logo et titre */}
      <div className="text-center mb-10">
        <div className="flex justify-center items-center gap-3 mb-6">
          <img
            src={logo}
            alt="TalentMatch Logo"
            className="w-16 h-16 rounded"
          />
          <h1 className="text-5xl font-bold text-green-700 ">TalentMatch</h1>
        </div>
        <h2 className="text-2xl font-semibold mb-1 text-gray-800">
          Rejoignez TalentMatch
        </h2>
        <p className="text-gray-500 text-lg">
          Choisissez votre profil pour commencer votre parcours sur notre plateforme.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl w-full ">
        {/* Carte Étudiant */}
        <div className="bg-gray-50 rounded-xl shadow-md p-6 border border-gray-200 transition-all hover:shadow-lg hover-scale">
          <h3 className="text-xl font-semibold text-green-700 mb-3">Je suis un étudiant</h3>
          <p className="mb-4 text-gray-600">Trouvez votre stage ou emploi idéal</p>
          
          <ul className="space-y-2 mb-6 text-gray-700">
            <li className="flex items-start">
              <span className="text-green-500 mr-2 mt-1">•</span>
              <span>Créez votre profil complet</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2 mt-1">•</span>
              <span>Uploadez votre CV</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2 mt-1">•</span>
              <span>Recevez des offres personnalisées</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2 mt-1">•</span>
              <span>Communiquez avec les entreprises</span>
            </li>
          </ul>
          
          <button
            className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors shadow-md hover:shadow-lg"
            onClick={() => navigate('/signup/student')}
          >
            S'inscrire comme étudiant
          </button>
        </div>

        {/* Carte Entreprise */}
        <div className="bg-gray-50 rounded-xl shadow-md p-6 border border-gray-200 transition-all hover:shadow-lg hover-scale">
          <h3 className="text-xl font-semibold text-green-700 mb-3">Je suis une entreprise</h3>
          <p className="mb-4 text-gray-600">Recrutez les meilleurs talents</p>
          
          <ul className="space-y-2 mb-6 text-gray-700">
            <li className="flex items-start">
              <span className="text-green-500 mr-2 mt-1">•</span>
              <span>Publiez vos offres d'emploi</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2 mt-1">•</span>
              <span>Recevez des candidats qualifiés</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2 mt-1">•</span>
              <span>Gérez vos recrutements</span>
            </li>
            <li className="flex items-start">
              <span className="text-green-500 mr-2 mt-1">•</span>
              <span>Messagerie intégrée</span>
            </li>
          </ul>
          
          <button
            className="w-full py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors shadow-md hover:shadow-lg"
            onClick={() => navigate('/signup/company')}
          >
            S'inscrire comme entreprise
          </button>
        </div>
      </div>
    </div>
  )
}

export default Signup