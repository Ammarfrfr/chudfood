# Khoj Mumbai - Food Discovery App

A MERN stack application for discovering and reviewing the best dishes in Mumbai, powered by AI and crowd-sourced ratings.

## Features

- 🔍 **AI-Powered Search** — Describe your mood, craving, or occasion in plain language
- ⭐ **Aggregated Ratings** — Honest scores from the crowd across taste, hygiene, and value
- 📊 **Detailed Analytics** — Hygiene scores, price accuracy, and review distributions
- 💬 **User Reviews** — Read and submit detailed reviews with ratings
- 📱 **Fully Responsive** — Works seamlessly on desktop and mobile
- 🏷️ **Smart Filters** — Filter by location, price, hygiene score, and dish type
- 🚀 **Real-time Results** — Instant dish rankings and aggregated stats

## Tech Stack

**Frontend:**
- React 18 with Hooks
- Vite (fast build tool)
- CSS3 with responsive design

**Backend:**
- Express.js
- MongoDB + Mongoose
- Groq API (LLaMA 3.3-70b for AI search)
- CORS, Dotenv

## Project Structure

```
khoj-mumbai/
├── backend/
│   ├── config/db.js                 # MongoDB connection
│   ├── controllers/
│   │   ├── searchController.js      # AI search logic
│   │   └── reviewController.js      # Review CRUD
│   ├── models/
│   │   ├── Search.js                # Search history schema
│   │   └── Review.js                # Review schema
│   ├── routes/
│   │   ├── searchRoutes.js          # /api/search endpoints
│   │   └── reviewRoutes.js          # /api/reviews endpoints
│   ├── middleware/
│   │   └── errorHandler.js          # Global error handling
│   ├── .env                         # Environment variables
│   ├── .gitignore
│   ├── package.json
│   └── server.js                    # Express server setup
├── frontend/
│   ├── src/
│   │   ├── api/index.js             # API layer (fetch calls)
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── DishCard.jsx         # Dish display + reviews toggle
│   │   │   ├── ReviewPanel.jsx      # Review form & aggregation
│   │   │   ├── MoodPills.jsx        # AI prompt suggestions
│   │   │   └── Sidebar.jsx          # Filters
│   │   ├── pages/
│   │   │   ├── HomePage.jsx         # Search interface
│   │   │   └── ResultsPage.jsx      # Results with filters & sorts
│   │   ├── hooks/
│   │   │   ├── useSearch.js         # Search state management
│   │   │   └── useReviews.js        # Review state management
│   │   ├── utils/
│   │   │   └── filterDishes.js      # Client-side filtering
│   │   ├── App.jsx                  # Main app component
│   │   ├── main.jsx                 # React root
│   │   └── index.css                # Global styles
│   ├── index.html                   # HTML entry point
│   ├── vite.config.js               # Vite config (API proxy)
│   └── package.json
└── README.md
```

## Getting Started

### Prerequisites

- Node.js 16+
- MongoDB (local or cloud)
- Groq API key (free from [console.groq.com](https://console.groq.com))

### Backend Setup

1. **Navigate to backend:**
   ```bash
   cd backend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file:**
   ```env
   PORT=5000
   MONGO_URI=mongodb://localhost:27017/khoj-mumbai
   # OR for MongoDB Atlas:
   # MONGO_URI=mongodb+srv://username:password@cluster.mongodb.net/khoj-mumbai
   
   NODE_ENV=development
   GROQ_API_KEY=your_groq_api_key_here
   ```

   **Get Groq API key:**
   - Go to [console.groq.com](https://console.groq.com)
   - Sign up (no credit card needed)
   - Create an API key in the dashboard
   - Copy and paste into `.env`

4. **Start MongoDB (if local):**
   ```bash
   # macOS with Homebrew
   brew services start mongodb-community
   
   # Windows (ensure MongoDB is installed)
   mongod
   ```

5. **Start backend server:**
   ```bash
   npm run dev
   # Server runs on http://localhost:5000
   ```

### Frontend Setup

1. **Navigate to frontend (in a new terminal):**
   ```bash
   cd frontend
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start development server:**
   ```bash
   npm run dev
   # App runs on http://localhost:5173
   ```

4. **Open in browser:**
   Navigate to `http://localhost:5173`

## API Endpoints

### Search
- **POST** `/api/search`
  - Body: `{ "query": "butter chicken near Bandra" }`
  - Response: Array of 6 dish results with AI rankings

### Reviews
- **POST** `/api/reviews`
  - Body: `{ "dishName", "restaurant", "reviewerName", "rating", "text", "hygieneRating", "priceAccuracy" }`
  - Response: Created review object

- **GET** `/api/reviews/:dishName`
  - Response: Array of reviews for the dish, sorted by date (newest first)

## How to Use

### Search
1. Enter a search query or click a mood pill
2. AI processes your request and returns ranked dishes
3. Results show aggregate scores, hygiene ratings, and review counts

### Filter & Sort
- Use the sidebar to filter by location, price, hygiene, and dish type
- Sort by aggregate score, price, hygiene, or review count
- On mobile, tap the filter button to open/close the sidebar

### Leave a Review
1. Click "See reviews" on any dish
2. Rate the dish (1-5 stars)
3. Describe your experience
4. Rate hygiene and price accuracy
5. Submit

## Environment Variables

### Backend (.env)
```env
PORT=5000                          # Express server port
MONGO_URI=mongodb://...            # MongoDB connection string
NODE_ENV=development               # Environment mode
GROQ_API_KEY=gsk_...               # Groq API key from console.groq.com
```

### Frontend (.env.local) - Optional
```env
VITE_API_URL=http://localhost:5000 # Backend API base URL (defaults to localhost:5000)
```

## Building for Production

### Backend
```bash
cd backend
npm install
# Update .env with production values
NODE_ENV=production
# Deploy to hosting (Heroku, AWS, Render, etc.)
```

### Frontend
```bash
cd frontend
npm install
npm run build
# dist/ folder contains static files for deployment
# Deploy to Vercel, Netlify, etc.
```

## Troubleshooting

### Backend won't start
- Check if MongoDB is running: `mongod` or `brew services start mongodb-community`
- Verify `GROQ_API_KEY` is set in `.env`
- Ensure port 5000 is available

### Frontend can't connect to backend
- Backend must be running on port 5000
- Check vite.config.js proxy configuration
- Open browser console to see API errors

### Groq API errors
- Verify API key is valid at [console.groq.com](https://console.groq.com)
- Check API quota/rate limits
- Ensure request format matches LLaMA 3.3 specifications

## Mobile Responsiveness

- Desktop (>768px): Full sidebar with all filters visible
- Tablet (768px): Collapsible filter drawer
- Mobile (<768px): Hamburger menu for filters, optimized card layout

## Performance Features

- Loading skeletons while AI processes search
- Error recovery with retry buttons
- Empty state messaging for no results
- Client-side filtering for instant UX
- API response caching in MongoDB

## Future Enhancements

- [ ] User authentication & saved favorites
- [ ] Restaurant dashboard for metrics
- [ ] Photo uploads for reviews
- [ ] Real-time dish trending
- [ ] Recommendation engine
- [ ] Integration with delivery platforms
- [ ] Advanced analytics for restaurants

## License

MIT

## Support

For issues or questions, please open an issue on the repository.
