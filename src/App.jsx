import { useNavigate } from 'react-router-dom'
import './App.css'
import '@fortawesome/fontawesome-free/css/all.min.css';
import logo from './assets/logo.png'


function App() {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className=" rounded-lg flex items-center justify-center">
              <img
                src={logo}
                alt="TalentMatch Logo"
                className="w-14 h-14 rounded"
              />
            </div>
            <span className="text-xl font-bold text-green-800">TalentMatch</span>
          </div>
          <nav className="hidden md:flex items-center space-x-6">
            <a href="#features" className="text-gray-600 hover:text-green-700 transition-colors">
              Fonctionnalités
            </a>
            <a href="#how-it-works" className="text-gray-600 hover:text-green-700 transition-colors">
              Comment ça marche
            </a>
            <a href="#contact" className="text-gray-600 hover:text-green-700 transition-colors">
              Contact
            </a>
          </nav>
          <div className="flex items-center space-x-3">
            <button 
              className="px-4 py-2 text-gray-600 hover:text-green-700 transition-colors"
              onClick={() => navigate('/login')}
            >
              Se connecter
            </button>
            <button 
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              onClick={() => navigate('/signup')}
            >
              S'inscrire
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4 bg-gradient-to-b from-white to-green-50">
        <div className="container mx-auto text-center max-w-4xl">
          <span className="inline-block px-3 py-1 text-sm bg-green-100 text-green-700 rounded-full mb-6">
            Plateforme de recrutement nouvelle génération
          </span>
          <h1 className="text-4xl md:text-6xl font-bold text-gray-800 mb-6 leading-tight">
            Connectez les <span className="text-green-600">talents</span> aux{" "}
            <span className="text-green-600">opportunités</span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto leading-relaxed">
            TalentMatch facilite le recrutement en mettant en relation étudiants, diplômés et entreprises grâce à un
            système de matching intelligent basé sur les compétences.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              className="px-8 py-3 bg-green-600 text-white rounded-lg text-lg font-medium hover:bg-green-700 transition-colors flex items-center justify-center shadow-md hover:shadow-lg"
              onClick={() => navigate('/signup/student')}
            >
              <i className="fas fa-graduation-cap mr-2"></i>
              Je suis étudiant
            </button>
            <button 
              className="px-8 py-3 border border-green-600 text-green-700 rounded-lg text-lg font-medium hover:bg-green-50 transition-colors flex items-center justify-center"
              onClick={() => navigate('/signup/company')}
            >
              <i className="fas fa-building mr-2"></i>
              Je suis une entreprise
            </button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-white">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Une plateforme complète pour tous</h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Découvrez les fonctionnalités qui font de TalentMatch la solution idéale pour étudiants et entreprises.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Student Features */}
            <div className="bg-gray-50 rounded-xl shadow-md p-6 border border-gray-200 transition-all hover:shadow-lg">
              <div className="mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <i className="fas fa-graduation-cap text-green-600 text-xl"></i>
                </div>
                <h3 className="text-xl font-bold text-green-700">Pour les étudiants</h3>
                <p className="text-gray-600">Trouvez votre stage ou emploi idéal</p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <i className="fas fa-check-circle text-green-500"></i>
                  <span className="text-sm text-gray-700">Profil complet avec CV</span>
                </div>
                <div className="flex items-center space-x-2">
                  <i className="fas fa-check-circle text-green-500"></i>
                  <span className="text-sm text-gray-700">Matching intelligent</span>
                </div>
                <div className="flex items-center space-x-2">
                  <i className="fas fa-check-circle text-green-500"></i>
                  <span className="text-sm text-gray-700">Candidatures simplifiées</span>
                </div>
                <div className="flex items-center space-x-2">
                  <i className="fas fa-check-circle text-green-500"></i>
                  <span className="text-sm text-gray-700">Messagerie intégrée</span>
                </div>
              </div>
            </div>

            {/* Company Features */}
            <div className="bg-gray-50 rounded-xl shadow-md p-6 border border-gray-200 transition-all hover:shadow-lg">
              <div className="mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <i className="fas fa-building text-green-600 text-xl"></i>
                </div>
                <h3 className="text-xl font-bold text-green-700">Pour les entreprises</h3>
                <p className="text-gray-600">Recrutez les meilleurs talents</p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <i className="fas fa-check-circle text-green-500"></i>
                  <span className="text-sm text-gray-700">Publication d'offres</span>
                </div>
                <div className="flex items-center space-x-2">
                  <i className="fas fa-check-circle text-green-500"></i>
                  <span className="text-sm text-gray-700">Candidats suggérés</span>
                </div>
                <div className="flex items-center space-x-2">
                  <i className="fas fa-check-circle text-green-500"></i>
                  <span className="text-sm text-gray-700">Gestion des candidatures</span>
                </div>
                <div className="flex items-center space-x-2">
                  <i className="fas fa-check-circle text-green-500"></i>
                  <span className="text-sm text-gray-700">Communication directe</span>
                </div>
              </div>
            </div>

            {/* Platform Features */}
            <div className="bg-gray-50 rounded-xl shadow-md p-6 border border-gray-200 transition-all hover:shadow-lg md:col-span-2 lg:col-span-1">
              <div className="mb-4">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                  <i className="fas fa-comments text-green-600 text-xl"></i>
                </div>
                <h3 className="text-xl font-bold text-green-700">Plateforme sécurisée</h3>
                <p className="text-gray-600">Environnement de confiance</p>
              </div>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <i className="fas fa-check-circle text-green-500"></i>
                  <span className="text-sm text-gray-700">Validation des entreprises</span>
                </div>
                <div className="flex items-center space-x-2">
                  <i className="fas fa-check-circle text-green-500"></i>
                  <span className="text-sm text-gray-700">Modération active</span>
                </div>
                <div className="flex items-center space-x-2">
                  <i className="fas fa-check-circle text-green-500"></i>
                  <span className="text-sm text-gray-700">Notifications en temps réel</span>
                </div>
                <div className="flex items-center space-x-2">
                  <i className="fas fa-check-circle text-green-500"></i>
                  <span className="text-sm text-gray-700">Support dédié</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="py-20 px-4 bg-green-50">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">Comment ça marche ?</h2>
            <p className="text-xl text-gray-600">Un processus simple et efficace en quelques étapes</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">1</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-green-700">Inscription</h3>
              <p className="text-gray-600">
                Créez votre profil en quelques minutes avec vos informations et compétences
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">2</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-green-700">Matching</h3>
              <p className="text-gray-600">
                Notre algorithme intelligent vous propose les meilleures correspondances
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-2xl font-bold text-white">3</span>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-green-700">Connexion</h3>
              <p className="text-gray-600">Échangez directement et trouvez votre opportunité ou talent idéal</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 bg-green-600">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Prêt à commencer ?</h2>
          <p className="text-xl text-green-100 mb-8">
            Rejoignez des milliers d'étudiants et d'entreprises qui font confiance à TalentMatch
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              className="px-8 py-3 bg-white text-green-700 rounded-lg text-lg font-medium hover:bg-green-50 transition-colors flex items-center justify-center shadow-md hover:shadow-lg"
              onClick={() => navigate('/signup')}
            >
              Commencer maintenant
              <i className="fas fa-arrow-right ml-2"></i>
            </button>
            <button 
              className="px-8 py-3 border border-white text-white rounded-lg text-lg font-medium hover:bg-green-700/20 transition-colors"
              onClick={() => navigate('/demo')}
            >
              Voir la démo
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-white py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="rounded-lg flex items-center justify-center">
                  <img
                    src={logo}
                    alt="TalentMatch Logo"
                    className="w-14 h-14 rounded"
                  />
                </div>
                <span className="text-xl font-bold text-green-800">TalentMatch</span>
              </div>
              <p className="text-gray-600 text-sm">La plateforme qui connecte les talents aux opportunités.</p>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-green-700">Étudiants</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <a href="/signup/student" className="hover:text-green-700">
                    S'inscrire
                  </a>
                </li>
                <li>
                  <a href="/jobs" className="hover:text-green-700">
                    Offres d'emploi
                  </a>
                </li>
                <li>
                  <a href="/internships" className="hover:text-green-700">
                    Stages
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-green-700">Entreprises</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <a href="/signup/company" className="hover:text-green-700">
                    S'inscrire
                  </a>
                </li>
                <li>
                  <a href="/post-job" className="hover:text-green-700">
                    Publier une offre
                  </a>
                </li>
                <li>
                  <a href="/candidates" className="hover:text-green-700">
                    Trouver des candidats
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="font-semibold mb-4 text-green-700">Support</h4>
              <ul className="space-y-2 text-sm text-gray-600">
                <li>
                  <a href="/help" className="hover:text-green-700">
                    Aide
                  </a>
                </li>
                <li>
                  <a href="/contact" className="hover:text-green-700">
                    Contact
                  </a>
                </li>
                <li>
                  <a href="/privacy" className="hover:text-green-700">
                    Confidentialité
                  </a>
                </li>
              </ul>
            </div>
          </div>

          <div className="border-t border-gray-200 mt-8 pt-8 text-center text-sm text-gray-600">
            <p>&copy; 2025 TalentMatch. Tous droits réservés.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App