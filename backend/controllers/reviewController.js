import Review from '../models/Review.js';
import Dish from '../models/Dish.js';

export const createReview = async (req, res, next) => {
  try {
    const { dishId, rating, hygieneRating, priceAccuracy, text, reviewerName } = req.body;

    // Validate required fields
    if (!dishId || !rating) {
      return res.status(400).json({
        success: false,
        message: 'dishId and rating are required',
      });
    }

    // Verify the dish exists
    const dish = await Dish.findById(dishId);
    if (!dish) {
      return res.status(404).json({
        success: false,
        message: 'Dish not found',
      });
    }

    // Save the review
    const review = new Review({
      dishId,
      rating,
      hygieneRating,
      priceAccuracy,
      text,
      reviewerName,
    });
    await review.save();

    // Recalculate aggregate scores for the dish
    const allReviews = await Review.find({ dishId });

    const avgRating =
      allReviews.reduce((sum, r) => sum + r.rating, 0) / allReviews.length;

    const reviewsWithHygiene = allReviews.filter(
      (r) => r.hygieneRating !== null && r.hygieneRating !== undefined
    );
    const avgHygieneRating =
      reviewsWithHygiene.length > 0
        ? reviewsWithHygiene.reduce((sum, r) => sum + r.hygieneRating, 0) /
          reviewsWithHygiene.length
        : 0;

    // aggregateScore = (avgRating/5 * 10 * 0.6) + (avgHygieneRating * 0.4)
    const aggregateScore =
      Math.round(((avgRating / 5) * 10 * 0.6 + avgHygieneRating * 0.4) * 10) / 10;

    const hygieneScore = Math.round(avgHygieneRating * 10) / 10;

    await Dish.findByIdAndUpdate(dishId, {
      aggregateScore,
      hygieneScore,
      reviewCount: allReviews.length,
    });

    res.status(201).json({
      success: true,
      message: 'Review created successfully',
      review,
      updatedScores: { aggregateScore, hygieneScore, reviewCount: allReviews.length },
    });
  } catch (error) {
    next(error);
  }
};

export const getReviews = async (req, res, next) => {
  try {
    const { dishId } = req.params;

    if (!dishId) {
      return res.status(400).json({
        success: false,
        message: 'dishId is required',
      });
    }

    const reviews = await Review.find({ dishId }).sort({ date: -1 });

    res.status(200).json({
      success: true,
      count: reviews.length,
      reviews,
    });
  } catch (error) {
    next(error);
  }
};
