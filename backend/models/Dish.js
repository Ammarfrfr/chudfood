import mongoose from 'mongoose';

const dishSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  restaurantId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Restaurant',
    required: true,
  },
  price: {
    type: Number,
  },
  isVeg: {
    type: Boolean,
  },
  cuisine: {
    type: String,
  },
  tags: {
    type: [String],
    default: [],
  },
  emoji: {
    type: String,
    default: '🍽️',
  },
  aggregateScore: {
    type: Number,
    default: 0,
  },
  hygieneScore: {
    type: Number,
    default: 0,
  },
  reviewCount: {
    type: Number,
    default: 0,
  },
});

export default mongoose.model('Dish', dishSchema);
