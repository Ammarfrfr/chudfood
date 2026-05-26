import express from 'express';
import { searchDishes, getDishImage } from '../controllers/searchController.js';

const router = express.Router();

router.post('/api/search', searchDishes);
router.get('/api/dish-image', getDishImage);

export default router;
