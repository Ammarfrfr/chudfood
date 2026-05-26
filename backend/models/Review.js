import mongoose from 'mongoose';

const reviewSchema = new mongoose.Schema({
  dishId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Dish',
    required: true,
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5,
  },
  hygieneRating: {
    type: Number,
    min: 1,
    max: 10,
  },
  priceAccuracy: {
    type: String,
    enum: ['Cheaper than listed', 'As listed', 'More expensive'],
  },
  text: {
    type: String,
  },
  reviewerName: {
    type: String,
    default: 'Anonymous',
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Review', reviewSchema);
