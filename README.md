# 🏠 Somansa - Smart Rental System

A modern, feature-rich rental management system for houses, boarding accommodations (kos), and car rentals. Built with React, featuring a beautiful UI, smooth animations, and mobile-responsive design.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/React-18.2.0-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Vite-5.0.11-646CFF?logo=vite)

## ✨ Features

### Core Functionality
- 🏠 **Property Browsing** - Browse houses, boarding accommodations, and car rentals
- 🔍 **Advanced Filtering** - Filter by type, location, and price range
- 📅 **Booking System** - Easy-to-use booking with confirmation codes
- 📊 **Overview Dashboard** - Track bookings and property statistics
- 📆 **Calendar View** - Visualize availability across properties

### New Features (v2.0)
1. **❤️ Favorites/Wishlist** - Save properties for later viewing
2. **📊 Compare Properties** - Side-by-side comparison of up to 3 properties
3. **⭐ Reviews & Ratings** - User-generated reviews and star ratings for properties
4. **💬 Support Chat Widget** - Real-time support with quick action buttons
5. **🖼️ Image Gallery & Lightbox** - Beautiful image galleries with full-screen viewer

### Technical Features
- 🎨 **Smooth Animations** - Engaging CSS animations throughout the app
- 📱 **Mobile Responsive** - Optimized for all screen sizes (mobile, tablet, desktop)
- 🚀 **PWA Support** - Installable as a Progressive Web App
- 🔄 **Offline Capability** - Works offline with service worker caching
- ⚡ **Fast Performance** - Optimized with React Query and Vite
- 🎯 **SEO Optimized** - Enhanced meta tags, Open Graph, and structured data

## 🚀 Quick Start

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/sobri3195/somansa-rental-system.git

# Navigate to project directory
cd somansa-rental-system

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Configure your API endpoint in .env
# VITE_API_BASE_URL=http://localhost:3000

# Start development server
npm run dev
```

The application will be available at `http://localhost:5173`

### Building for Production

```bash
# Build the application
npm run build

# Preview production build
npm run preview
```

## 🛠️ Technology Stack

- **Frontend Framework**: React 18
- **Build Tool**: Vite 5
- **Routing**: React Router v6
- **Data Fetching**: TanStack Query (React Query) v5
- **HTTP Client**: Axios
- **Styling**: Custom CSS with CSS Variables
- **PWA**: vite-plugin-pwa with Workbox
- **Date Picker**: react-datepicker

## 📁 Project Structure

```
somansa-rental-system/
├── public/               # Static assets
│   ├── favicon.svg      # SVG favicon
│   ├── robots.txt       # SEO robots file
│   └── sitemap.xml      # SEO sitemap
├── src/
│   ├── api/             # API client configuration
│   ├── components/      # React components
│   │   ├── layout/      # Header, Footer, Layout
│   │   ├── property/    # PropertyCard, PropertyFilter, UnitCard
│   │   ├── booking/     # BookingForm, BookingCard, BookingSuccess
│   │   ├── calendar/    # CalendarView
│   │   └── common/      # Reusable components (Spinner, Error, etc.)
│   ├── hooks/           # Custom React hooks
│   │   ├── useFavorites.js
│   │   ├── useCompare.js
│   │   └── useProperties.js
│   ├── pages/           # Page components
│   │   ├── Home.jsx
│   │   ├── PropertyList.jsx
│   │   ├── PropertyDetail.jsx
│   │   ├── Favorites.jsx
│   │   ├── Compare.jsx
│   │   ├── BookingLookup.jsx
│   │   ├── Overview.jsx
│   │   └── Calendar.jsx
│   ├── utils/           # Utility functions
│   ├── App.jsx          # Main app component
│   ├── main.jsx         # Entry point
│   └── index.css        # Global styles
├── .env.example         # Environment variables template
├── package.json         # Dependencies
└── vite.config.js       # Vite configuration
```

## 🎨 Key Features Explained

### 1. Favorites System
Users can save properties to their favorites list, stored in local storage for persistence across sessions.

### 2. Compare Properties
Compare up to 3 properties side-by-side with detailed feature comparison.

### 3. Reviews & Ratings
Leave reviews and star ratings for properties. Data is stored locally per property.

### 4. Support Widget
Floating support widget with:
- Live chat interface
- Quick action buttons (Email, Telegram, WhatsApp)
- Auto-reply functionality

### 5. Image Gallery
Beautiful image galleries with:
- Grid layout
- Lightbox viewer
- Keyboard navigation
- Touch-friendly mobile interface

## 🌐 Deployment

### Netlify (Recommended)

1. Push your code to GitHub
2. Connect your repository to Netlify
3. Configure build settings:
   - Build command: `npm run build`
   - Publish directory: `dist`
4. Set environment variables in Netlify dashboard
5. Deploy!

The app includes a `netlify.toml` for automatic configuration.

### Other Platforms

The app can be deployed to:
- Vercel
- GitHub Pages
- Firebase Hosting
- Any static hosting service

## 🔧 Configuration

### Environment Variables

Create a `.env` file based on `.env.example`:

```env
VITE_API_BASE_URL=http://localhost:3000
```

### API Integration

The app expects the following API endpoints:

- `GET /api/properties` - List properties
- `GET /api/properties/:id` - Property details
- `GET /api/properties/:id/units` - Property units
- `POST /api/bookings` - Create booking
- `GET /api/bookings` - List bookings
- `GET /api/bookings/lookup/:code` - Lookup booking

See `API_EXAMPLES.md` for detailed API specifications.

## 📱 Mobile Support

The application is fully responsive with:
- Mobile-first design approach
- Touch-friendly interfaces
- Optimized animations for mobile devices
- Hamburger menu for small screens
- PWA installation support

## 🎯 SEO Optimization

- Comprehensive meta tags
- Open Graph tags for social sharing
- Twitter Card support
- Structured data (JSON-LD)
- Sitemap and robots.txt
- Semantic HTML markup
- Fast loading times

## 👨‍💻 Author

**Lettu Kes dr. Muhammad Sobri Maulana**
- Qualifications: S.Kom, CEH, OSCP, OSCE
- Email: [muhammadsobrimaulana31@gmail.com](mailto:muhammadsobrimaulana31@gmail.com)
- GitHub: [@sobri3195](https://github.com/sobri3195)
- Website: [muhammadsobrimaulana.netlify.app](https://muhammadsobrimaulana.netlify.app)

### Social Media
- 📹 YouTube: [@muhammadsobrimaulana6013](https://www.youtube.com/@muhammadsobrimaulana6013)
- 🎵 TikTok: [@dr.sobri](https://www.tiktok.com/@dr.sobri)
- 💬 Telegram: [@winlin_exploit](https://t.me/winlin_exploit)
- 📱 WhatsApp Group: [Join Group](https://chat.whatsapp.com/B8nwRZOBMo64GjTwdXV8Bl)

### Support the Developer 💖

If you find this project helpful, consider supporting:

- 💰 [Lynk.id](https://lynk.id/muhsobrimaulana)
- ☕ [Trakteer](https://trakteer.id/g9mkave5gauns962u07t)
- 🎨 [KaryaKarsa](https://karyakarsa.com/muhammadsobrimaulana)
- 💸 [Nyawer](https://nyawer.co/MuhammadSobriMaulana)
- 🛒 [Gumroad](https://maulanasobri.gumroad.com/)

### Other Projects
- 🔧 [Sevalla Portfolio](https://muhammad-sobri-maulana-kvr6a.sevalla.page/)
- 🛍️ [Pegasus Shop](https://pegasus-shop.netlify.app)

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome! Feel free to check the issues page.

1. Fork the project
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 🙏 Acknowledgments

- React team for the amazing framework
- Vite team for the blazing-fast build tool
- TanStack team for React Query
- All open-source contributors

## 📞 Contact & Support

For questions, support, or inquiries:

- **Email**: muhammadsobrimaulana31@gmail.com
- **Telegram**: [@winlin_exploit](https://t.me/winlin_exploit)
- **WhatsApp Group**: [Join Now](https://chat.whatsapp.com/B8nwRZOBMo64GjTwdXV8Bl)

---

<p align="center">
  Made with ❤️ by <a href="https://github.com/sobri3195">Lettu Kes dr. Muhammad Sobri Maulana</a>
</p>

<p align="center">
  <a href="https://github.com/sobri3195">GitHub</a> •
  <a href="https://www.youtube.com/@muhammadsobrimaulana6013">YouTube</a> •
  <a href="https://t.me/winlin_exploit">Telegram</a> •
  <a href="https://www.tiktok.com/@dr.sobri">TikTok</a>
</p>
