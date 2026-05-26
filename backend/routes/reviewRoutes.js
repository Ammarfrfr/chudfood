import express from 'express';
import { createReview, getReviews } from '../controllers/reviewController.js';

const router = express.Router();

router.post('/api/reviews', createReview);
router.get('/api/reviews/:dishName', getReviews);

export default router;
