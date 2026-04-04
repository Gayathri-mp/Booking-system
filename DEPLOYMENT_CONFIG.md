# Voyager's Compass - Deployment Environment Variables

## Frontend (Vercel/Vite)
# Add these in Vercel Dashboard -> Settings -> Environment Variables
VITE_API_BASE_URL=https://your-backend-url.render.com

## Backend (Render/Node)
# Add these in Render Dashboard -> Environment
PORT=10000
MONGO_URI=mongodb+srv://your-uri-here
JWT_SECRET=your-secure-random-string-here
NODE_ENV=production
