import express from 'express';
import Restaurant from '../models/Restaurant.js';

const router = express.Router();

// GET /api/restaurants — all restaurants
router.get('/api/restaurants', async (req, res, next) => {
  try {
    const restaurants = await Restaurant.find();

    res.status(200).json({
      success: true,
      count: restaurants.length,
      restaurants,
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/restaurants — create restaurant (admin use)
router.post('/api/restaurants', async (req, res, next) => {
  try {
    const restaurant = new Restaurant(req.body);
    await restaurant.save();

    res.status(201).json({
      success: true,
      message: 'Restaurant created successfully',
      restaurant,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
