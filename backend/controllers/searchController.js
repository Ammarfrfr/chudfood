import fetch from 'node-fetch';
import Search from '../models/Search.js';

// In-memory image cache to prevent redundant search scraping
const imageCache = new Map();

// High-quality, authentic food fallback images from Unsplash (Curated categories)
const getCategoryFallback = (dishName) => {
  const name = (dishName || '').toLowerCase();
  
  if (name.includes('biryani') || name.includes('rice') || name.includes('pulao')) {
    return 'https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&auto=format&fit=crop&q=80';
  }
  if (name.includes('pav') || name.includes('bhaji') || name.includes('vada')) {
    return 'https://images.unsplash.com/photo-1601050690597-df056fb4ce78?w=600&auto=format&fit=crop&q=80';
  }
  if (name.includes('kebab') || name.includes('tandoori') || name.includes('chicken') || name.includes('tikka') || name.includes('meat')) {
    return 'https://images.unsplash.com/photo-1555939594-58d7cb561ad1?w=600&auto=format&fit=crop&q=80';
  }
  if (name.includes('pizza')) {
    return 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=80';
  }
  if (name.includes('burger') || name.includes('sandwich')) {
    return 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&auto=format&fit=crop&q=80';
  }
  if (name.includes('roll') || name.includes('wrap') || name.includes('shawarma')) {
    return 'https://images.unsplash.com/photo-1626804475315-9654b423853d?w=600&auto=format&fit=crop&q=80';
  }
  if (name.includes('chaat') || name.includes('puri') || name.includes('bhel') || name.includes('samosa')) {
    return 'https://images.unsplash.com/photo-1626132647523-66f5bf380027?w=600&auto=format&fit=crop&q=80';
  }
  if (name.includes('dosa') || name.includes('idli') || name.includes('uttapam') || name.includes('south indian')) {
    return 'https://images.unsplash.com/photo-1668236543090-82eba5ee5976?w=600&auto=format&fit=crop&q=80';
  }
  if (name.includes('noodle') || name.includes('chow') || name.includes('manchurian') || name.includes('chinese') || name.includes('momos')) {
    return 'https://images.unsplash.com/photo-1585032226651-759b368d7246?w=600&auto=format&fit=crop&q=80';
  }
  if (name.includes('curry') || name.includes('paneer') || name.includes('masala') || name.includes('dal') || name.includes('roti') || name.includes('naan')) {
    return 'https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=600&auto=format&fit=crop&q=80';
  }
  if (name.includes('sweet') || name.includes('dessert') || name.includes('ice cream') || name.includes('cake') || name.includes('gulab') || name.includes('jalebi') || name.includes('shake')) {
    return 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=600&auto=format&fit=crop&q=80';
  }
  
  // Generic beautiful food fallback
  return 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80';
};

// Robust function to search image using DuckDuckGo (2-step VQD process)
const fetchActualDDGImage = async (dishName, restaurant, area) => {
  try {
    const query = `${dishName} ${restaurant} ${area} Mumbai food`;
    console.log(`[DDG Image Search] Querying: "${query}"`);

    // 1. Get the session VQD token
    const searchUrl = `https://duckduckgo.com/?q=${encodeURIComponent(query)}`;
    const response = await fetch(searchUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Referer': 'https://duckduckgo.com/'
      }
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch main page (Status: ${response.status})`);
    }

    const html = await response.text();
    const vqdMatch = html.match(/vqd=['"]([^'"]+)['"]/);

    if (!vqdMatch) {
      throw new Error('VQD token extraction failed');
    }

    const vqd = vqdMatch[1];

    // 2. Fetch the JSON image results
    const params = new URLSearchParams({
      q: query,
      vqd: vqd,
      f: ",,,type:photo",
      o: "json",
      l: "wt-wt"
    });

    const imageApiUrl = `https://duckduckgo.com/i.js?${params.toString()}`;
    const imageResponse = await fetch(imageApiUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36',
        'Accept': 'application/json',
        'Referer': 'https://duckduckgo.com/'
      }
    });

    if (!imageResponse.ok) {
      throw new Error(`Failed to fetch image JSON (Status: ${imageResponse.status})`);
    }

    const data = await imageResponse.json();
    if (data.results && data.results.length > 0) {
      // Find the first result that has a valid image URL
      for (const res of data.results) {
        if (res.image && res.image.startsWith('http')) {
          console.log(`[DDG Image Search] Success for "${dishName}": ${res.image}`);
          return res.image;
        }
      }
    }
    
    throw new Error('No valid image results found in DDG payload');
  } catch (error) {
    console.error(`[DDG Image Search] Failed for "${dishName}":`, error.message);
    // Fall back to our beautiful curated fallbacks
    return getCategoryFallback(dishName);
  }
};

// NEW: Controller to fetch dish image lazily and cache it
export const getDishImage = async (req, res, next) => {
  try {
    const { dishName, restaurant, area } = req.query;

    if (!dishName || !restaurant) {
      return res.status(400).json({
        success: false,
        message: 'dishName and restaurant are required query parameters',
      });
    }

    const cacheKey = `${dishName.trim()}-${restaurant.trim()}-${(area || '').trim()}`.toLowerCase();

    // Check in-memory cache first
    if (imageCache.has(cacheKey)) {
      console.log(`[Cache Hit] returning image for key: "${cacheKey}"`);
      return res.status(200).json({
        success: true,
        image: imageCache.get(cacheKey)
      });
    }

    // Otherwise, fetch from DDG image search
    const imageUrl = await fetchActualDDGImage(dishName, restaurant, area);
    
    // Store in cache
    imageCache.set(cacheKey, imageUrl);

    res.status(200).json({
      success: true,
      image: imageUrl,
    });
  } catch (error) {
    next(error);
  }
};

// Refactored Search: Instant response times (doesn't block on image fetching)
export const searchDishes = async (req, res, next) => {
  try {
    const { query } = req.body;

    if (!query) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required',
      });
    }

    const resultCount = 12;

    // Call Groq API
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
            content: `You are a Mumbai food expert. Return ONLY a valid JSON array of ${resultCount} dish results. Each object: dishName, restaurant, area, cuisine, price (INR number), score (out of 10), isVeg (boolean), hygieneScore (out of 10), tags (string array), sponsored (boolean, only 1 true). No markdown, no explanation, raw JSON only.`,
          },
          {
            role: 'user',
            content: `Find Mumbai dishes matching: ${query}`,
          },
        ],
      }),
    });

    const data = await groqResponse.json();

    // Check if Groq API returned an error
    if (!groqResponse.ok) {
      console.error('Groq API Error:', data);
      return res.status(400).json({
        success: false,
        message: data.error?.message || 'Failed to get results from Groq API',
      });
    }

    // Parse Groq response safely
    let results = [];
    try {
      if (data.choices && data.choices[0] && data.choices[0].message) {
        const content = data.choices[0].message.content;
        results = JSON.parse(content);

        // Validate it's an array
        if (!Array.isArray(results)) {
          results = [];
        }

        // Return immediately with null images so the frontend can load them lazily
        results = results.map((dish) => ({
          ...dish,
          image: null, // Triggers frontend shimmer & lazy-load fetch
          emoji: dish.isVeg ? '🟢' : '🔴',
        }));
      }
    } catch (parseError) {
      console.error('Error parsing Groq response:', parseError);
      results = [];
    }

    // Save search to MongoDB (optional)
    try {
      const searchRecord = new Search({
        query,
        results,
      });
      await searchRecord.save();
    } catch (dbError) {
      console.log('Note: Could not save to MongoDB, but search results are ready', dbError.message);
    }

    res.status(200).json({
      success: true,
      query,
      results,
    });
  } catch (error) {
    next(error);
  }
};

