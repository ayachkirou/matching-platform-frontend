// src/services/OffresService.js
const API_BASE = "http://localhost:8080/api";

export async function getAllOffres() {
  const res = await fetch(`${API_BASE}/offres`);
  if (!res.ok) throw new Error("Impossible de récupérer les offres");
  return res.json();
}

export async function getOffreById(id) {
  const res = await fetch(`${API_BASE}/offres/${id}`);
  if (!res.ok) throw new Error("Offre introuvable");
  return res.json();
}
