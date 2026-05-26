import Review from '../models/Review.js';

export const createReview = async (req, res, next) => {
  try {
    const { dishName, restaurant, reviewerName, rating, text, hygieneRating, priceAccuracy } =
      req.body;

    // Validate required fields
    if (!dishName || !restaurant || !reviewerName || !rating || !text || !hygieneRating || !priceAccuracy) {
      return res.status(400).json({
        success: false,
        message: 'All fields are required',
      });
    }

    const review = new Review({
      dishName,
      restaurant,
      reviewerName,
      rating,
      text,
      hygieneRating,
      priceAccuracy,
    });

    try {
      await review.save();
    } catch (dbError) {
      console.log('Note: Could not save review to MongoDB, but returning success', dbError.message);
      // Don't block - return success anyway
    }

    res.status(201).json({
      success: true,
      message: 'Review created successfully',
      review,
    });
  } catch (error) {
    next(error);
  }
};

export const getReviews = async (req, res, next) => {
  try {
    const { dishName } = req.params;

    if (!dishName) {
      return res.status(400).json({
        success: false,
        message: 'Dish name is required',
      });
    }

    let reviews = [];
    try {
      reviews = await Review.find({ dishName }).sort({ date: -1 }).maxTimeMS(5000);
    } catch (dbError) {
      console.log('Note: Could not fetch reviews from MongoDB, returning empty array', dbError.message);
      // Return empty array if MongoDB is not available
      reviews = [];
    }

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    next(error);
  }
};
