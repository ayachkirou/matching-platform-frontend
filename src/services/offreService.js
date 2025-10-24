// offreService.js - Version complète avec module Admin
import axios from 'axios';

const BASE_URL = 'http://localhost:8080';

export const offreService = {
  // Fonctions existantes (pour les entreprises/étudiants)
  getAll: () => axios.get(`${BASE_URL}/api/offres`),
  getById: (id) => axios.get(`${BASE_URL}/api/offres/${id}`),
  create: (offre) => axios.post(`${BASE_URL}/api/offres`, offre),
  update: (id, offre) => axios.put(`${BASE_URL}/api/offres/${id}`, offre),
  delete: (id) => axios.delete(`${BASE_URL}/api/offres/${id}`),

  // ✅ NOUVELLES FONCTIONS POUR L'ADMIN
  admin: {
    // Récupérer toutes les offres avec pagination
    getAllOffres: (page = 0, size = 10) => 
      axios.get(`${BASE_URL}/api/admin/offres?page=${page}&size=${size}`),
    
    // Récupérer les offres par type
    getOffresByType: (type, page = 0, size = 10) => 
      axios.get(`${BASE_URL}/api/admin/offres/type/${type}?page=${page}&size=${size}`),
    
    // Supprimer une offre (admin)
    deleteOffre: (id) => 
      axios.delete(`${BASE_URL}/api/admin/offres/${id}`),
    
    // Récupérer les statistiques
    getStatistiques: () => 
      axios.get(`${BASE_URL}/api/admin/offres/statistiques`),
    
    // Rechercher des offres
    searchOffres: (searchTerm, page = 0, size = 10) =>
      axios.get(`${BASE_URL}/api/admin/offres/search?q=${searchTerm}&page=${page}&size=${size}`)
  }
};

// Alternative : version avec async/await et gestion d'erreurs
// Version avec gestion d'erreurs pour l'admin
export const offreAdminService = {
  getAllOffres: async (page = 0, size = 10) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/admin/offres?page=${page}&size=${size}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getOffresByType: async (type, page = 0, size = 10) => {
    try {
      const response = await axios.get(`${BASE_URL}/api/admin/offres/type/${type}?page=${page}&size=${size}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  deleteOffre: async (id) => {
    try {
      const response = await axios.delete(`${BASE_URL}/api/admin/offres/${id}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  getStatistiques: async () => {
    try {
      const response = await axios.get(`${BASE_URL}/api/admin/offres/statistiques`);
      return response.data;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  }
};

export default offreService;