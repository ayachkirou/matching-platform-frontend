import React from 'react';
import '@fortawesome/fontawesome-free/css/all.min.css'; // Assure-toi que cet import est global si déjà présent

const Header = () => {
  return (
    <header>
      <div className="container">
        <div className="header-content">

          {/* Logo avec icône briefcase */}
          <div className="logo">
            <i className="fas fa-briefcase"></i>
            <span>TalentMatch</span>
          </div>

          {/* Navigation principale */}
          <nav className="nav-links">
            <a href="#" className="active">
              <i className="fas fa-briefcase"></i> Offres
            </a>
            <a href="#">
              <i className="fas fa-balance-scale"></i> Matching
            </a>
            <a href="#">
              <i className="fas fa-file-alt"></i> Mes Candidatures
            </a>
            <a href="#">
              <i className="fas fa-comments"></i> Messages
            </a>
            <a href="#">
              <i className="fas fa-user"></i> Profil
            </a>
          </nav>

          {/* Badge utilisateur */}
          <div className="user-badge">
            <i className="fas fa-user-graduate"></i> Étudiant
          </div>

        </div>
      </div>
    </header>
  );
};

export default Header;
