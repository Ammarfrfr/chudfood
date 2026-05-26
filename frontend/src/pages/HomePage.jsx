import { useState } from 'react';
import { MoodPills } from '../components/MoodPills';

export const HomePage = ({ onSearch }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const moods = [
    'Something light for lunch near Andheri',
    'Best butter chicken under ₹400 in Mumbai',
    'Romantic dinner place with good hygiene ratings',
    'Post-gym high protein meal in Powai',
    'Crispy street-style chicken tikka, not too fancy',
  ];

  const handleSearch = async () => {
    if (searchQuery.trim()) {
      setIsLoading(true);
      onSearch(searchQuery);
      setTimeout(() => setIsLoading(false), 1000);
    }
  };

  return (
    <div className="hero">
      <h1>Find Mumbai's best dishes, ranked by the crowd</h1>
      <p>Every review, every restaurant — aggregated into one honest score</p>
      <div className="search-wrap">
        <input
          className="search-box"
          placeholder="I'm craving something spicy, not too oily, near Bandra..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
        />
        <button className={`search-btn ${isLoading ? 'loading' : ''}`} onClick={handleSearch}>
          {isLoading ? (
            <>
              <span className="spinner"></span>
              Finding...
            </>
          ) : (
            <>Search ↗</>
          )}
        </button>
      </div>
      <p className="ai-hint">AI-powered — describe your mood, craving, or occasion in plain language</p>
      <MoodPills pills={moods} onSelect={(mood) => {setSearchQuery(mood); setTimeout(handleSearch, 0)}} />
    </div>
  );
};

