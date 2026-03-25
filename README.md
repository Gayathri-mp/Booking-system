# 🌴 Holiday Package Booking System

A responsive frontend interface for a Holiday Package Booking System built with pure **HTML5, CSS3, and Vanilla JavaScript** — no frameworks, no dependencies.

## 📁 Project Structure

```
Booking System/
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

## 🖼️ Adding Images

Drop your image files inside `assets/images/` and reference them like:
```html
<img src="assets/images/your-image.jpg" alt="Description">
```

## 🚀 Running the Project

Just open `index.html` in your browser — no server required!

## ☁️ Deployment

**Vercel:** Push to GitHub → Import repo on [vercel.com](https://vercel.com) → Deploy (zero config for static sites).

**InfinityFree:** Upload all files into the `htdocs/` folder via File Manager or FTP.

## 🛠️ Tech Stack

- HTML5
- CSS3 (Flexbox + Grid)
- JavaScript (Vanilla JS)

## 📌 Features

- Responsive sidebar navigation with mobile hamburger toggle
- Indian & International holiday tabs with flight/no-flight sub-tabs
- Dynamic package search and star-rating filter
- Package cards with flight details and pricing
- Multi-step booking form with validation
- Booking confirmation modal
- Contact & support page
