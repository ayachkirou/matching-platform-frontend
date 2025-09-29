// src/components/OffersList.jsx
import React, { useState } from "react";
import { useOffers } from "../hooks/useOffers";

const OffersList = ({ studentId }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const { offers, loading, error } = useOffers(studentId, searchTerm);

  if (loading) return <p>Chargement des offres...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h2>Liste des Offres</h2>

      {/* Champ de recherche */}
      <input
        type="text"
        placeholder="Rechercher une offre par titre..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        style={{ marginBottom: "10px", padding: "5px" }}
      />

      <table border="1" cellPadding="10" style={{ width: "100%" }}>
        <thead>
          <tr>
            <th>Titre</th>
            <th>Description</th>
            <th>Entreprise</th>
            <th>% de Matching</th>
          </tr>
        </thead>
        <tbody>
          {offers.length > 0 ? (
            offers.map((offre) => (
              <tr key={offre.id}>
                <td>{offre.titre}</td>
                <td>{offre.description}</td>
                <td>{offre.companyName || "N/A"}</td>
                <td>
                  {offre.matchScore !== undefined
                    ? `${(offre.matchScore * 100).toFixed(2)}%`
                    : "N/A"}
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="4">Aucune offre trouvée</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default OffersList;
