import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/candidatures';

// Configuration Axios avec intercepteurs pour mieux gérer les erreurs
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000, // 10 secondes timeout
});

// Intercepteur pour les requêtes
api.interceptors.request.use(
  (config) => {
    console.log(`🔄 Requête ${config.method?.toUpperCase()} vers: ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour les réponses
api.interceptors.response.use(
  (response) => {
    console.log('✅ Réponse reçue:', response.status);
    return response;
  },
  (error) => {
    console.error('❌ Erreur API:', error.response?.status, error.message);
    if (error.response?.status === 404) {
      throw new Error('Service non trouvé - Vérifiez que le backend est démarré');
    } else if (error.code === 'ECONNREFUSED') {
      throw new Error('Impossible de se connecter au serveur - Backend non démarré');
    } else if (error.response?.status >= 500) {
      throw new Error('Erreur serveur - Vérifiez les logs du backend');
    }
    return Promise.reject(error);
  }
);

class CandidatureService {
  
  // Récupérer les candidatures par offre (avec les infos étudiant)
  async getCandidaturesByOffre(offreId) {
    try {
      const response = await api.get(`/offre/${offreId}`);
      return response.data;
    } catch (error) {
      console.error('Erreur dans getCandidaturesByOffre:', error);
      throw error;
    }
  }

  // Mettre à jour le statut d'une candidature
  async updateStatut(candidatureId, nouveauStatut) {
    try {
      const response = await api.put(`/${candidatureId}/statut`, null, {
        params: { statut: nouveauStatut }
      });
      return response.data;
    } catch (error) {
      console.error('Erreur dans updateStatut:', error);
      throw error;
    }
  }

  // Récupérer toutes les candidatures
  async getAllCandidatures() {
    try {
      const response = await api.get('/');
      return response.data;
    } catch (error) {
      console.error('Erreur dans getAllCandidatures:', error);
      throw error;
    }
  }

  // Récupérer une candidature par ID
  async getCandidatureById(id) {
    try {
      const response = await api.get(`/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erreur dans getCandidatureById:', error);
      throw error;
    }
  }

  // Supprimer une candidature
  async deleteCandidature(id) {
    try {
      const response = await api.delete(`/${id}`);
      return response.data;
    } catch (error) {
      console.error('Erreur dans deleteCandidature:', error);
      throw error;
    }
  }

  // Récupérer les candidatures d'un étudiant
  async getCandidaturesByStudent(studentId) {
    try {
      const response = await api.get(`/etudiant/${studentId}`);
      return response.data;
    } catch (error) {
      console.error('Erreur dans getCandidaturesByStudent:', error);
      throw error;
    }
  }

  // Créer une candidature
  async createCandidature(studentId, offreId) {
    try {
      const response = await api.post('', null, {
        params: { studentId, offreId }
      });
      return response.data;
    } catch (error) {
      console.error('Erreur dans createCandidature:', error);
      throw error;
    }
  }

  // Compter les candidatures d'une offre
  async getNombreCandidatures(offreId) {
    try {
      const response = await api.get(`/offre/${offreId}/count`);
      return response.data;
    } catch (error) {
      console.error('Erreur dans getNombreCandidatures:', error);
      throw error;
    }
  }
}

// Exportez une instance unique (singleton)
export default new CandidatureService();