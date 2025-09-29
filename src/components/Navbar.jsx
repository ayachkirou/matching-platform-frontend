import React from 'react';
import './Navbar.css';

const Navbar = () => {
  return (
    <nav className="navbar">
      <div className="navbar-brand">
        <h2>JobMatch</h2>
      </div>
      <div className="navbar-links">
        <a href="#offers">Offres</a>
        <a href="#profile">Mon Profil</a>
        <a href="#logout">Déconnexion</a>
      </div>
    </nav>
  );
};

export default Navbar;