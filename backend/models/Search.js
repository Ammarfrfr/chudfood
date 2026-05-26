import mongoose from 'mongoose';

const searchSchema = new mongoose.Schema({
  query: {
    type: String,
    required: true,
  },
  results: {
    type: Array,
    default: [],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Search', searchSchema);
