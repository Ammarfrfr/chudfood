import express from 'express';
import { searchDishes } from '../controllers/searchController.js';

const router = express.Router();

router.post('/api/search', searchDishes);

export default router;
