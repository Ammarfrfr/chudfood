import mongoose from 'mongoose';

const restaurantSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  area: {
    type: String,
    required: true,
  },
  address: {
    type: String,
  },
  cuisine: {
    type: [String],
    default: [],
  },
  priceRange: {
    type: String,
    enum: ['₹', '₹₹', '₹₹₹'],
  },
  hours: {
    type: String,
  },
  isVeg: {
    type: Boolean,
    default: false,
  },
  fssaiCertified: {
    type: Boolean,
    default: false,
  },
  deliveryAvailable: {
    type: Boolean,
    default: true,
  },
  dineIn: {
    type: Boolean,
    default: true,
  },
});

export default mongoose.model('Restaurant', restaurantSchema);
