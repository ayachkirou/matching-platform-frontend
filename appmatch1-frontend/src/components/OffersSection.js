import React, { useState } from 'react';
import OfferCard from './OfferCard';

const OffersSection = () => {
  // État pour stocker les offres d'emploi
  const [offers, setOffers] = useState([
    {
      id: 1,
      companyInitials: 'TC',
      title: 'Stage Développeur Full Stack',
      company: 'TechCorp',
      type: 'Stage',
      salary: '4000-6000 MAD',
      location: 'Casablanca',
      time: 'Il y a 2 jours',
      description: '///////////',
      skills: ['React', 'Node.js', 'MongoDB'],
      saved: false
    },
    // ... autres offres
  ]);

  // Fonction pour gérer l'état "sauvegardé" des offres
  const toggleSave = (id) => {
    setOffers(offers.map(offer => 
      offer.id === id ? { ...offer, saved: !offer.saved } : offer
    ));
  };

  return (
    <section className="offers-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">{offers.length} offres trouvées</h2>
        </div>
        
        <div className="offers-grid">
          {offers.map(offer => (
            <OfferCard 
              key={offer.id}
              offer={offer}
              toggleSave={toggleSave}
            />
          ))}
        </div>
      </div>
    </section>
  );
};

export default OffersSection;