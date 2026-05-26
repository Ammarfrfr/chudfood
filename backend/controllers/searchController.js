import fetch from 'node-fetch';
import Search from '../models/Search.js';
import Dish from '../models/Dish.js';

// Reusable: parse Groq response to extract filters from natural-language query
const parseQueryWithGroq = async (query) => {
  const groqResponse = await fetch('https://api.groq.com/openai/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
    },
    body: JSON.stringify({
      model: 'llama-3.3-70b-versatile',
      messages: [
        {
          role: 'system',
          content:
            'You are a Mumbai food search parser. Extract filters from the user query and return ONLY raw JSON, no markdown, no explanation. Fields: area (string or null), cuisine (string or null), isVeg (boolean or null), maxPrice (number or null), tags (array of strings).',
        },
        {
          role: 'user',
          content: query,
        },
      ],
    }),
  });

  const data = await groqResponse.json();

  if (!groqResponse.ok) {
    console.error('Groq API Error:', data);
    throw new Error(data.error?.message || 'Failed to parse query with Groq API');
  }

  const content = data.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error('Empty response from Groq API');
  }

  // Strip markdown code fences if Groq wraps the JSON
  const cleaned = content.replace(/```json\s*/gi, '').replace(/```\s*/g, '').trim();
  return JSON.parse(cleaned);
};

// Build a MongoDB filter object from the parsed Groq filters
const buildMongoQuery = (filters) => {
  const mongoQuery = {};

  if (filters.isVeg !== null && filters.isVeg !== undefined) {
    mongoQuery.isVeg = filters.isVeg;
  }

  if (filters.maxPrice !== null && filters.maxPrice !== undefined) {
    mongoQuery.price = { $lte: filters.maxPrice };
  }

  if (filters.cuisine) {
    mongoQuery.cuisine = { $regex: filters.cuisine, $options: 'i' };
  }

  if (filters.tags && Array.isArray(filters.tags) && filters.tags.length > 0) {
    mongoQuery.tags = { $in: filters.tags };
  }

  return mongoQuery;
};

export const searchDishes = async (req, res, next) => {
  try {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required',
      });
    }

    // 1. Parse the natural-language query into structured filters via Groq
    let filters = {};
    try {
      filters = await parseQueryWithGroq(query);
    } catch (parseError) {
      console.error('Error parsing query with Groq:', parseError.message);
      // Proceed with empty filters so the search still returns results
    }

    // 2. Build MongoDB query and fetch dishes
    const mongoQuery = buildMongoQuery(filters);

    let results = await Dish.find(mongoQuery)
      .populate('restaurantId')
      .sort({ aggregateScore: -1 })
      .limit(20);

    // 3. Post-query: filter by area on the populated restaurant (case-insensitive includes)
    if (filters.area) {
      const areaLower = filters.area.toLowerCase();
      results = results.filter(
        (dish) =>
          dish.restaurantId &&
          dish.restaurantId.area &&
          dish.restaurantId.area.toLowerCase().includes(areaLower)
      );
    }

    // 4. Save search record
    try {
      const searchRecord = new Search({
        query,
        filters,
        resultCount: results.length,
      });
      await searchRecord.save();
    } catch (dbError) {
      console.log('Note: Could not save search record to MongoDB', dbError.message);
    }

    // 5. Return results
    res.status(200).json({
      success: true,
      filters,
      results,
    });
  } catch (error) {
    next(error);
  }
};
