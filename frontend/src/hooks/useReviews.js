import { useState, useEffect } from 'react';
import { getReviews, submitReview } from '../api/index';

export const useReviews = (dishName) => {
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!dishName) return;

    const fetchReviews = async () => {
      setLoading(true);
      try {
        const data = await getReviews(dishName);
        if (data.success) {
          setReviews(data.reviews || []);
        }
      } catch (error) {
        console.error('Error fetching reviews:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [dishName]);

  const submit = async (reviewData) => {
    try {
      const data = await submitReview(reviewData);
      if (data.success) {
        setReviews([data.review, ...reviews]);
      }
      return data;
    } catch (error) {
      console.error('Error submitting review:', error);
      throw error;
    }
  };

  return { reviews, loading, submitReview: submit };
};

