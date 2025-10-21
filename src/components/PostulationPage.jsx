import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Postulation from './Postulation';

const PostulationPage = () => {
  const { offerId } = useParams(); // Récupère l'ID de l'offre depuis l'URL
  const navigate = useNavigate();
  const [offer, setOffer] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOffer = async () => {
      try {
        const response = await fetch(`http://localhost:8080/api/offers/${offerId}`);
        if (!response.ok) throw new Error('Erreur lors du chargement de l\'offre');
        const data = await response.json();

        // Adapter les champs selon ton backend
        setOffer({
          ...data,
          companyInitials: `C${data.companyId}`,
          skills: data.competencesRequises ? JSON.parse(data.competencesRequises) : [],
        });

        setLoading(false);
      } catch (error) {
        console.error(error);
        alert('Erreur lors du chargement de l\'offre2');
        navigate('/'); // Retour à la page principale en cas d'erreur
      }
    };

    fetchOffer();
  }, [offerId, navigate]);

  if (loading) return <div>Chargement de l'offre...</div>;

  return <Postulation offer={offer} onClose={() => navigate(-1)} />;
};

export default PostulationPage;
