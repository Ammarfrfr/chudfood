import { useState } from 'react';

export const DirectionsPanel = ({ restaurant, area, dishName }) => {
  const [loading, setLoading] = useState(false);
  const [gpsError, setGpsError] = useState(null);

  const destinationQuery = `${restaurant}, ${area}, Mumbai`;
  const mapIframeUrl = `https://maps.google.com/maps?q=${encodeURIComponent(destinationQuery)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

  const handleGetRoute = (mode = 'driving') => {
    setLoading(true);
    setGpsError(null);

    if (!navigator.geolocation) {
      setGpsError("Geolocation is not supported by your browser.");
      setLoading(false);
      // Fallback to Google's automatic Current Location
      openGoogleMaps('Current Location', mode);
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        setLoading(false);
        openGoogleMaps(`${latitude},${longitude}`, mode);
      },
      (error) => {
        console.warn("Geolocation error:", error);
        setLoading(false);
        let errorMsg = "Could not get your precise location.";
        if (error.code === error.PERMISSION_DENIED) {
          errorMsg = "Location permission denied. Using general browser location.";
        }
        setGpsError(errorMsg);
        
        // Fallback to Google's automatic Current Location after a short delay
        setTimeout(() => {
          openGoogleMaps('Current Location', mode);
        }, 1500);
      },
      { enableHighAccuracy: true, timeout: 10000 }
    );
  };

  const openGoogleMaps = (origin, mode) => {
    const mapsUrl = `https://www.google.com/maps/dir/?api=1&origin=${encodeURIComponent(origin)}&destination=${encodeURIComponent(destinationQuery)}&travelmode=${mode}`;
    window.open(mapsUrl, '_blank', 'noopener,noreferrer');
  };

  return (
    <div className="directions-panel">
      <div className="directions-header">
        <div className="location-info">
          <h3>📍 Restaurant Location</h3>
          <p className="restaurant-address">{restaurant} — {area}, Mumbai</p>
        </div>
        <button 
          className={`route-main-btn ${loading ? 'loading' : ''}`}
          onClick={() => handleGetRoute('driving')}
          disabled={loading}
        >
          {loading ? (
            <>
              <span className="gps-spinner"></span>
              Locating you...
            </>
          ) : (
            '🚗 Find Optimal Route'
          )}
        </button>
      </div>

      {gpsError && (
        <div className="gps-status-bar warning">
          ⚠️ {gpsError}
        </div>
      )}

      <div className="directions-content">
        <div className="map-wrapper">
          <iframe
            title={`Map location for ${restaurant}`}
            width="100%"
            height="220"
            style={{ border: 0, borderRadius: 'var(--border-radius-md)' }}
            src={mapIframeUrl}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          ></iframe>
        </div>

        <div className="route-options">
          <h4>Select Travel Mode:</h4>
          <p style={{ fontSize: '12px', color: 'var(--color-text-secondary)', marginBottom: '12px' }}>
            Check real-time traffic and routes from your location on Google Maps:
          </p>
          <div className="travel-modes-grid">
            <button className="travel-mode-card" onClick={() => handleGetRoute('driving')}>
              <span className="mode-icon">🚗</span>
              <span className="mode-name">Drive</span>
              <span className="mode-desc">Best route</span>
            </button>
            
            <button className="travel-mode-card" onClick={() => handleGetRoute('walking')}>
              <span className="mode-icon">🚶</span>
              <span className="mode-name">Walk</span>
              <span className="mode-desc">Short distance</span>
            </button>

            <button className="travel-mode-card" onClick={() => handleGetRoute('transit')}>
              <span className="mode-icon">🚌</span>
              <span className="mode-name">Transit</span>
              <span className="mode-desc">Local train/bus</span>
            </button>
          </div>

          <div className="panel-footer-actions">
            <a 
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(destinationQuery)}`} 
              target="_blank" 
              rel="noopener noreferrer"
              className="footer-link-btn"
            >
              🌐 Open full location details in Google Maps
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};
