import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  dishName: {
    type: String,
    required: true,
  },
  restaurant: {
    type: String,
    required: true,
  },
  reviewerName: {
    type: String,
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  text: {
    type: String,
    required: true,
  },
  hygieneRating: {
    type: Number,
    required: true,
    min: 1,
    max: 10,
  },
  priceAccuracy: {
    type: Number,
    required: true,
    min: 1,
    max: 10,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Review', reviewSchema);
