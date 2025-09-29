import React from 'react';
import './SearchBar.css';

const SearchBar = ({ searchTerm, onSearchChange, onSearchSubmit, placeholder }) => {
  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSearchSubmit) {
      onSearchSubmit(searchTerm);
    }
  };

  return (
    <form className="search-bar" onSubmit={handleSubmit}>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
        placeholder={placeholder || "Rechercher des offres..."}
        className="search-input"
      />
      <button type="submit" className="search-button">
        <i className="search-icon">🔍</i>
      </button>
    </form>
  );
};

export default SearchBar;