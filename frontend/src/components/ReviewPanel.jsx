import { useState } from 'react';
import { useReviews } from '../hooks/useReviews';

export const ReviewPanel = ({ dishName, restaurant }) => {
  const { reviews, submitReview } = useReviews(dishName);
  const [stars, setStars] = useState(4);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [formData, setFormData] = useState({
    reviewerName: '',
    text: '',
    hygieneRating: 7,
    priceAccuracy: 'As listed',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.text.trim()) return;
    
    setIsSubmitting(true);
    try {
      await submitReview({
        dishName,
        restaurant,
        reviewerName: formData.reviewerName || 'Anonymous',
        rating: stars,
        text: formData.text,
        hygieneRating: parseInt(formData.hygieneRating),
        priceAccuracy: formData.priceAccuracy,
      });
      setFormData({ reviewerName: '', text: '', hygieneRating: 7, priceAccuracy: 'As listed' });
      setStars(4);
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2500);
    } catch (error) {
      console.error('Error submitting review:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  return (
    <div className="review-panel">
      <h2>{restaurant} — {dishName} reviews</h2>

      {reviews.length > 0 && (
        <div className="agg-section">
          <div className="agg-score">
            <div className="agg-num">{avgRating}</div>
            <div className="agg-stars">{'★'.repeat(Math.floor(avgRating))}{'☆'.repeat(5 - Math.floor(avgRating))}</div>
            <div className="agg-count">{reviews.length} reviews</div>
          </div>
          <div>
            {[5, 4, 3, 2, 1].map((rating) => {
              const count = reviews.filter((r) => r.rating === rating).length;
              const percent = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
              return (
                <div key={rating} className="bar-row">
                  <span className="bar-lbl">{rating}</span>
                  <div className="bar-track">
                    <div className="bar-fill" style={{ width: `${percent}%` }}></div>
                  </div>
                  <span className="bar-count">{count}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div style={{ marginBottom: '16px' }}>
        <p style={{ fontSize: '13px', fontWeight: 500, marginBottom: '8px' }}>Leave a review</p>
        <div className="star-select">
          {[1, 2, 3, 4, 5].map((i) => (
            <span
              key={i}
              className={`star-btn ${i <= stars ? 'active' : ''}`}
              onClick={() => setStars(i)}
            >
              ★
            </span>
          ))}
        </div>
        <form onSubmit={handleSubmit} className="review-form">
          <div className="form-row">
            <input
              placeholder="Your name (optional)"
              value={formData.reviewerName}
              onChange={(e) => setFormData({ ...formData, reviewerName: e.target.value })}
            />
            <input type="date" />
          </div>
          <textarea
            className="full"
            placeholder="Describe the dish — flavour, portion, value, ambience, how clean the place looked..."
            value={formData.text}
            onChange={(e) => setFormData({ ...formData, text: e.target.value })}
            style={{ marginBottom: '8px' }}
          ></textarea>
          <div className="form-row" style={{ marginBottom: '10px' }}>
            <select
              value={formData.hygieneRating}
              onChange={(e) => setFormData({ ...formData, hygieneRating: e.target.value })}
            >
              <option value="1">1 — Very poor</option>
              <option value="5">5 — Average</option>
              <option value="7">7 — Good</option>
              <option value="10">10 — Excellent</option>
            </select>
            <select
              value={formData.priceAccuracy}
              onChange={(e) => setFormData({ ...formData, priceAccuracy: e.target.value })}
            >
              <option>Cheaper than listed</option>
              <option>As listed</option>
              <option>More expensive</option>
            </select>
          </div>
          <button type="submit" className={`submit-review ${showSuccess ? 'success' : ''}`} disabled={isSubmitting || showSuccess}>
            {showSuccess ? (
              <>
                <span className="checkmark">✓</span>
                Review submitted!
              </>
            ) : (
              'Submit review'
            )}
          </button>
        </form>
      </div>

      <div className="review-list">
        {reviews.map((review, idx) => (
          <div key={idx} className="review-item">
            <div className="reviewer-row">
              <div className="avatar">{(review.reviewerName || 'A').substring(0, 2).toUpperCase()}</div>
              <div>
                <div className="reviewer-name">{review.reviewerName || 'Anonymous'}</div>
                <div className="review-date">{new Date(review.date).toLocaleDateString()} · {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}</div>
              </div>
            </div>
            <p className="review-text">{review.text}</p>
            <div className="tag-row">
              {review.text.split(' ').slice(0, 3).map((word, idx) => (
                <span key={idx} className="review-tag">{word.slice(0, 20)}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

