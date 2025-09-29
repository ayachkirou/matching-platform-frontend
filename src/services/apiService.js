const API_BASE_URL = 'http://localhost:8080/api';

export const apiService = {
  // Récupérer toutes les offres avec matching
  getOffersWithMatching: async (studentId) => {
    const response = await fetch(`${API_BASE_URL}/matching/student/${studentId}/all`);
    if (!response.ok) throw new Error('Erreur récupération offres');
    return response.json();
  },

  // Rechercher des offres
  searchOffers: async (titre) => {
    const response = await fetch(`${API_BASE_URL}/offres/recherche?titre=${encodeURIComponent(titre)}`);
    if (!response.ok) throw new Error('Erreur recherche');
    return response.json();
  },

  // Récupérer offres avec score minimum
  getMatchingOffers: async (studentId, minMatch) => {
    const response = await fetch(`${API_BASE_URL}/matching/student/${studentId}?minMatch=${minMatch}`);
    if (!response.ok) throw new Error('Erreur matching');
    return response.json();
  }
};