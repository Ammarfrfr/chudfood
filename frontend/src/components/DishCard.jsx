import { useState, useEffect } from 'react';
import { ReviewPanel } from './ReviewPanel';
import { DirectionsPanel } from './DirectionsPanel';
import { getDishImageApi } from '../api/index';

export const DishCard = ({ dish, index, isSponsored }) => {
  const [showReviews, setShowReviews] = useState(false);
  const [showDirections, setShowDirections] = useState(false);
  const [imageUrl, setImageUrl] = useState(dish.image);
  const [imgLoading, setImgLoading] = useState(!dish.image);
  const [imgError, setImgError] = useState(false);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    let active = true;
    
    const fetchLazyImage = async () => {
      if (dish.image) {
        setImageUrl(dish.image);
        setImgLoading(false);
        return;
      }
      
      try {
        setImgLoading(true);
        const data = await getDishImageApi(dish.dishName, dish.restaurant, dish.area);
        if (active && data.success && data.image) {
          setImageUrl(data.image);
        }
      } catch (err) {
        console.error("Failed to load lazy image for card", err);
      } finally {
        if (active) {
          setImgLoading(false);
        }
      }
    };

    fetchLazyImage();

    return () => {
      active = false;
    };
  }, [dish.dishName, dish.restaurant, dish.area, dish.image]);

  const renderStars = (rating) => {
    return '★'.repeat(Math.floor(rating)) + (rating % 1 > 0 ? '☆' : '');
  };

  const hygienePercent = (dish.hygieneScore || 0) * 10;
  const hygieneColor = dish.hygieneScore >= 8 ? '#1D9E75' : dish.hygieneScore >= 6 ? '#639922' : '#E74C3C';

  return (
    <>
      <div className={`dish-card ${isSponsored ? 'sponsored' : ''}`}>
        <div className={`card-rank ${index < 3 ? 'top' : ''}`} style={isSponsored ? { background: '#FAEEDA', color: '#854F0B', width: '58px', minWidth: '58px', flexDirection: 'column', gap: '2px' } : {}}>
          {isSponsored ? (
            <>
              <span style={{ fontSize: '18px', fontWeight: 500 }}>#{index + 1}</span>
            </>
          ) : (
            index + 1
          )}
        </div>
        <div className="card-img">
          {imgLoading ? (
            <div className="image-loading-shimmer" />
          ) : imageUrl && !imgError ? (
            <img
              src={imageUrl}
              alt={dish.dishName}
              loading="lazy"
              decoding="async"
              referrerPolicy="no-referrer"
              onError={() => setImgError(true)}
              className="lazy-loaded-img"
            />
          ) : (
            <div className="card-emoji-placeholder">{dish.emoji || '🍽️'}</div>
          )}
        </div>
        <div className="card-body">
          <div className="card-top">
            <span className="dish-name">{dish.dishName}</span>
            {isSponsored && <span className="ad-badge">AD</span>}
          </div>
          <div className="restaurant-name">{dish.restaurant} — {dish.area}</div>
          <div className="card-meta">
            <span className="stars">{renderStars(dish.score)}</span>
            <span className="score-badge">{dish.score.toFixed(1)} / 10</span>
            <span className="price-badge">₹{dish.price} per plate</span>
            <span className="meta-chip">{dish.reviewCount || 0} reviews</span>
            <span className="meta-chip">{dish.distance || '0'} km away</span>
          </div>
          <div className="hygiene-bar-wrap">
            <span className="hygiene-label">Hygiene</span>
            <div className="hygiene-bar">
              <div className="hygiene-fill" style={{ width: `${hygienePercent}%`, background: hygieneColor }}></div>
            </div>
            <span style={{ fontSize: '11px', color: hygieneColor, minWidth: '28px' }}>{dish.hygieneScore.toFixed(1)}</span>
          </div>
          <div className="card-actions">
            <button 
              className={`action-btn primary ${showReviews ? 'active-btn-tab' : ''}`} 
              onClick={() => { setShowReviews(!showReviews); setShowDirections(false); }}
            >
              {showReviews ? 'Hide reviews' : 'See reviews'}
            </button>
            <button 
              className={`action-btn ${showDirections ? 'active-btn-tab' : ''}`}
              onClick={() => { setShowDirections(!showDirections); setShowReviews(false); }}
            >
              {showDirections ? 'Hide Directions' : '📍 Directions'}
            </button>
            <button 
              className={`action-btn save-btn ${isSaved ? 'saved' : ''}`}
              onClick={() => setIsSaved(!isSaved)}
            >
              {isSaved ? '❤️ Saved' : '🤍 Save'}
            </button>
          </div>
        </div>
      </div>
      {showReviews && <ReviewPanel dishName={dish.dishName} restaurant={dish.restaurant} />}
      {showDirections && <DirectionsPanel restaurant={dish.restaurant} area={dish.area} dishName={dish.dishName} />}
    </>
  );
};

export const SkeletonCard = () => {
  return (
    <div className="skeleton-card">
      <div className="skeleton-rank"></div>
      <div className="skeleton-img"></div>
      <div className="skeleton-body">
        <div className="skeleton-line"></div>
        <div className="skeleton-line short"></div>
        <div className="skeleton-line medium"></div>
        <div className="skeleton-line short"></div>
      </div>
    </div>
  );
};



