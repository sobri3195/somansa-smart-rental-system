import { useState, useEffect, useRef } from 'react';
import VoiceSearch from './VoiceSearch';

const searchSuggestions = [
  '🏠 House in Jakarta',
  '🏢 Kos near campus',
  '🚗 Car rental for weekend',
  '💰 Affordable boarding',
  '🌟 Luxury house',
  '🎓 Student kos',
  '👨‍👩‍👧‍👦 Family house 3 bedroom',
  '🚙 SUV rental',
  '📍 Properties in Bandung',
  '⭐ Top rated rentals',
];

export default function SmartSearch({ onSearch, initialValue = '' }) {
  const [query, setQuery] = useState(initialValue);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [recentSearches, setRecentSearches] = useState(() => {
    const saved = localStorage.getItem('recentSearches');
    return saved ? JSON.parse(saved) : [];
  });
  const inputRef = useRef(null);

  useEffect(() => {
    if (query.length >= 2) {
      const filtered = searchSuggestions.filter(s => 
        s.toLowerCase().includes(query.toLowerCase())
      );
      setSuggestions([...recentSearches.slice(0, 3), ...filtered.slice(0, 5)]);
      setShowSuggestions(true);
    } else if (query.length === 0 && recentSearches.length > 0) {
      setSuggestions(recentSearches);
      setShowSuggestions(true);
    } else {
      setSuggestions([]);
      setShowSuggestions(false);
    }
  }, [query, recentSearches]);

  const handleSearch = (searchQuery) => {
    if (searchQuery.trim()) {
      const newRecent = [searchQuery, ...recentSearches.filter(s => s !== searchQuery)].slice(0, 5);
      setRecentSearches(newRecent);
      localStorage.setItem('recentSearches', JSON.stringify(newRecent));
      onSearch(searchQuery);
      setShowSuggestions(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSearch(query);
  };

  const handleVoiceSearch = (transcript) => {
    setQuery(transcript);
    handleSearch(transcript);
  };

  const selectSuggestion = (suggestion) => {
    const cleanSuggestion = suggestion.replace(/^[\p{Emoji}\s]+/u, '').trim();
    setQuery(cleanSuggestion);
    handleSearch(cleanSuggestion);
  };

  const clearRecent = () => {
    setRecentSearches([]);
    localStorage.removeItem('recentSearches');
    setSuggestions([]);
  };

  return (
    <div className="smart-search">
      <form onSubmit={handleSubmit} className="search-form">
        <div className="search-input-wrapper">
          <span className="search-icon">🔍</span>
          <input
            ref={inputRef}
            type="text"
            className="search-input"
            placeholder="Search properties, locations, or keywords..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          />
          {query && (
            <button 
              type="button" 
              className="clear-btn" 
              onClick={() => setQuery('')}
            >
              ✕
            </button>
          )}
          <VoiceSearch onSearch={handleVoiceSearch} />
          <button type="submit" className="btn btn-primary search-btn">
            Search
          </button>
        </div>
      </form>

      {showSuggestions && suggestions.length > 0 && (
        <div className="search-suggestions">
          {recentSearches.length > 0 && query.length === 0 && (
            <div className="suggestions-header">
              <span>Recent Searches</span>
              <button onClick={clearRecent} className="clear-recent-btn">Clear</button>
            </div>
          )}
          <ul className="suggestions-list">
            {suggestions.map((suggestion, idx) => (
              <li 
                key={idx} 
                className="suggestion-item"
                onClick={() => selectSuggestion(suggestion)}
              >
                <span className="suggestion-icon">
                  {recentSearches.includes(suggestion) ? '🕐' : '🔍'}
                </span>
                <span className="suggestion-text">{suggestion}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
