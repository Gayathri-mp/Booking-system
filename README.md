# 🌴 Voyager's Compass - Holiday Package Booking System

Voyager's Compass is a full-stack MERN (MongoDB, Express, React, Node.js) application for browsing and booking holiday packages. 

The project includes a modern React frontend (`/client`), a robust backend API (`/server`), and previously included a legacy pure HTML/CSS/JS interface in the root.

## 🌐 Live Deployment
- **Frontend (Vercel):** [https://booking-system-frontend-zeta.vercel.app/packages](https://booking-system-frontend-zeta.vercel.app/packages)
- **Backend (Render):** [https://booking-system-d2ck.onrender.com/](https://booking-system-d2ck.onrender.com/)

fRONTEND LINK - https://booking-system-frontend-zeta.vercel.app/packages

BACKEND LINK - https://booking-system-d2ck.onrender.com/
## 📁 Project Structure

```text
Booking System/
├── client/                     → React.js Frontend (Vite)
│   ├── src/pages/              → React Pages (Dashboard, Packages, Login, etc)
│   ├── src/components/         → Reusable UI Components
│   └── package.json            → Frontend dependencies
├── server/                     → Node.js Backend (Express)
│   ├── models/                 → MongoDB Database Models
│   ├── routes/                 → API Endpoints (Auth, Packages, Bookings)
│   └── package.json            → Backend dependencies
├── DEPLOYMENT_CONFIG.md        → Deployment instructions (Vercel & Render)
│
└── Legacy Architecture (Vanilla HTML/JS):
    ├── index.html          → Dashboard / Home
    ├── packages.html       → Browse & filter holiday packages
    ├── booking.html        → Package detail + booking form
    ├── contact.html        → Contact & Support page
    ├── assets/
    │   └── images/         → Place all your images here
    ├── css/
    │   ├── style.css       → Global styles & design tokens
    │   ├── sidebar.css     → Sidebar navigation
    │   ├── cards.css       → Package cards & flight rows
    │   └── responsive.css  → Mobile responsiveness
    ├── js/
    │   ├── main.js         → Sidebar toggle & general UI
    │   ├── packages.js     → Search, filter, tab switching
    │   └── booking.js      → Booking form & modal
    └── .gitignore
```

## 🛠️ Tech Stack

### Modern Stack (MERN)
- **Frontend**: React 19, React Router v7, Vite, Axios
- **Backend**: Node.js, Express 5, MongoDB (Mongoose)
- **Security**: JSON Web Tokens (JWT), bcryptjs
- **Deployment**: Vercel (Frontend), Render (Backend)

### Legacy UI
- HTML5
- CSS3 (Flexbox + Grid)
- JavaScript (Vanilla JS)

## 📌 Features

<<<<<<< HEAD
- **Authentication System:** Secure user registration and login functionality.
- **Dynamic Package Browsing:** View, search, and filter holiday packages fetched from the database.
- **Trip Variations:** Indian & International holiday categories with flight/no-flight configurations.
- **Booking Management:** Create booking leads saved directly to identical remote servers.
- **Responsive Layout:** Sidebar navigation with mobile optimization.

## 🚀 Running Locally

You will need two terminal windows to run both the frontend and backend locally.

### Start the Backend
```bash
cd server
npm install
npm run dev
```

### Start the Frontend
```bash
cd client
npm install
npm run dev
```

Once running, the React application will be available at `http://localhost:5173/`, and backend will connect to `http://localhost:5000/`.
=======
- Responsive sidebar navigation with mobile hamburger toggle
- Indian & International holiday tabs with flight/no-flight sub-tabs
- Dynamic package search and star-rating filter
- Package cards with flight details and pricing
- Multi-step booking form with validation
- Booking confirmation modal
- Contact & support page

>>>>>>> 26646bb5744b66f45f0603d7f3c2f8d5f4f0e4ed
