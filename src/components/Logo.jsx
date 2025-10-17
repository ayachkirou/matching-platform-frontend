
// Importez votre image logo (ajustez le chemin selon l'emplacement de votre image)
import logoImage from '../assets/images/logo.jpeg';

const Logo = () => (
  <div className="logo-container">
    <img 
      src={logoImage} 
      alt="TalentMatch Logo" 
      className="logo-image"
    />
    <span className="logo-text">TalentMatch</span>
  </div>
);

export default Logo;