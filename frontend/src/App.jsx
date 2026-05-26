import { useState } from 'react';
import { Navbar } from './components/Navbar';
import { HomePage } from './pages/HomePage';
import { ResultsPage } from './pages/ResultsPage';
import { useSearch } from './hooks/useSearch';

function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [searchQuery, setSearchQuery] = useState('');
  const { results, loading, error, executeSearch } = useSearch(searchQuery);

  const handleSearch = (query) => {
    setSearchQuery(query);
    executeSearch(query);
    setCurrentPage('results');
  };

  const handleRetry = () => {
    executeSearch(searchQuery);
  };

  const handleNewSearch = () => {
    setCurrentPage('home');
  };

  return (
    <div className="app">
      <Navbar onNavigate={setCurrentPage} />
      {currentPage === 'home' && <HomePage onSearch={handleSearch} />}
      {currentPage === 'results' && (
        <ResultsPage
          query={searchQuery}
          results={results}
          loading={loading}
          error={error}
          onNewSearch={handleNewSearch}
          onRetry={handleRetry}
        />
      )}
    </div>
  );
}

export default App;


