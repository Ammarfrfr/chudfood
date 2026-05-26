export const Navbar = ({ onNavigate }) => {
  return (
    <nav className="nav">
      <div className="logo">
        <div className="logo-dot"></div>
        Khoj Mumbai
      </div>
      <div className="nav-links">
        <button className="nav-btn" onClick={() => onNavigate('home')}>
          Search
        </button>
        <button className="nav-btn" onClick={() => onNavigate('results')}>
          Rankings
        </button>
        <button className="nav-btn">For restaurants</button>
        <button className="nav-btn primary">Sign up</button>
      </div>
    </nav>
  );
};

