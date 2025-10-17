// offreService.js - Version ultra-simple
import axios from 'axios';

const BASE_URL = 'http://localhost:8080';

export const offreService = {
  getAll: () => axios.get(`${BASE_URL}/api/offres`),
  getById: (id) => axios.get(`${BASE_URL}/api/offres/${id}`),
  create: (offre) => axios.post(`${BASE_URL}/api/offres`, offre),
  update: (id, offre) => axios.put(`${BASE_URL}/api/offres/${id}`, offre),
  delete: (id) => axios.delete(`${BASE_URL}/api/offres/${id}`),
};