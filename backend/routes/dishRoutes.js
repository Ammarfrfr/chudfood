import express from 'express';
import Dish from '../models/Dish.js';

const router = express.Router();

// GET /api/dishes — return all dishes, populate restaurantId, sort by aggregateScore desc
router.get('/api/dishes', async (req, res, next) => {
  try {
    const dishes = await Dish.find()
      .populate('restaurantId')
      .sort({ aggregateScore: -1 });

    res.status(200).json({
      success: true,
      count: dishes.length,
      dishes,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/dishes/:id — single dish with populated restaurant
router.get('/api/dishes/:id', async (req, res, next) => {
  try {
    const dish = await Dish.findById(req.params.id).populate('restaurantId');

    if (!dish) {
      return res.status(404).json({
        success: false,
        message: 'Dish not found',
      });
    }

    res.status(200).json({
      success: true,
      dish,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
