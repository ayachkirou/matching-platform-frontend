import React from 'react';

const Header = () => {
  return (
    <header>
      <div className="container">
        <div className="header-content">
          <div className="logo">
            <i className="fas fa-briefcase"></i>
            <span>JobMatch</span>
          </div>
          
          <nav className="nav-links">
            <a href="#" className="active">Offres</a>
            <a href="#">Matching</a>
            <a href="#">Mes Candidatures</a>
            <a href="#">Messages</a>
            <a href="#">Profil</a>
          </nav>
          
          <div className="user-badge">Étudiant</div>
        </div>
      </div>
    </header>
  );
};

export default Header;