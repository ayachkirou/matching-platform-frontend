// src/services/api.js
import axios from "axios";

const BASE_URL = "http://localhost:8080/api";

export const offersAPI = {
  // Obtenir toutes les offres
  getAll: () => axios.get(`${BASE_URL}/offres/affiche`),

  // Recherche d’offres
  search: (titre) => axios.get(`${BASE_URL}/offres/recherche?titre=${titre}`),

  // Offres avec % match (toutes)
  getStudentOffersWithMatch: (studentId) =>
    axios.get(`${BASE_URL}/matching/student/${studentId}/all`),
};
