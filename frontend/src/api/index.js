const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const searchDishes = async (query) => {
  try {
    const response = await fetch(`${API_URL}/api/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error searching dishes:', error);
    throw error;
  }
};

export const getReviews = async (dishName) => {
  try {
    const response = await fetch(`${API_URL}/api/reviews/${encodeURIComponent(dishName)}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching reviews:', error);
    throw error;
  }
};

export const submitReview = async (reviewData) => {
  try {
    const response = await fetch(`${API_URL}/api/reviews`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(reviewData),
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error submitting review:', error);
    throw error;
  }
};

export const getDishImageApi = async (dishName, restaurant, area) => {
  try {
    const response = await fetch(`${API_URL}/api/dish-image?dishName=${encodeURIComponent(dishName)}&restaurant=${encodeURIComponent(restaurant)}&area=${encodeURIComponent(area || '')}`);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching dish image:', error);
    throw error;
  }
};


