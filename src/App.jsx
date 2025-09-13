import { useNavigate } from 'react-router-dom'
import './App.css'

function App() {
  const navigate = useNavigate()

  return (
    <div className="App min-h-screen bg-white flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold text-green-800 mb-8">
        Bienvenue sur TalentMatch
      </h1>
      
      <div className="text-center">
        <p className="text-lg text-gray-600 mb-6">
          Découvrez notre plateforme de recrutement et de recherche d'emploi
        </p>
        
        <button
          className="px-6 py-3 bg-green-600 text-white font-semibold rounded-lg hover:bg-green-700 transition-colors"
          onClick={() => navigate('/signup')}
        >
          Commencer l'inscription
        </button>
      </div>
    </div>
  )
}

export default App
