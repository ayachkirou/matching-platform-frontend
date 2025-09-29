import React from 'react';
import './FilterPanel.css';

const FilterPanel = ({ minMatch, onMinMatchChange, onSortChange, sortBy }) => {
  return (
    <div className="filter-panel">
      <h3>Filtres</h3>
      
      <div className="filter-group">
        <label htmlFor="minMatch">Correspondance minimum:</label>
        <input
          type="range"
          id="minMatch"
          min="0"
          max="100"
          value={minMatch}
          onChange={(e) => onMinMatchChange(parseInt(e.target.value))}
        />
        <span>{minMatch}%</span>
      </div>
      
      <div className="filter-group">
        <label htmlFor="sortBy">Trier par:</label>
        <select 
          id="sortBy" 
          value={sortBy} 
          onChange={(e) => onSortChange(e.target.value)}
        >
          <option value="match">Pertinence</option>
          <option value="date">Date de publication</option>
          <option value="company">Entreprise</option>
        </select>
      </div>
    </div>
  );
};

export default FilterPanel;