import mongoose from 'mongoose';

const searchSchema = new mongoose.Schema({
  query: {
    type: String,
    required: true,
  },
  filters: {
    type: Object,
    default: {},
  },
  resultCount: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model('Search', searchSchema);
