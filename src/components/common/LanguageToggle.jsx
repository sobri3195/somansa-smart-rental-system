import { useState, useEffect, createContext, useContext } from 'react';

const translations = {
  en: {
    home: 'Home',
    properties: 'Properties',
    favorites: 'Favorites',
    calendar: 'Calendar',
    compare: 'Compare',
    bookingLookup: 'Booking Lookup',
    overview: 'Overview',
    search: 'Search',
    filters: 'Filters',
    welcome: 'Welcome to',
    smartRental: 'Smart Rental System',
    browseRentals: 'Browse Rentals',
    whatWeOffer: 'What We Offer',
    houses: 'Houses',
    boarding: 'Boarding (Kos)',
    carRentals: 'Car Rentals',
    howItWorks: 'How It Works',
    browse: 'Browse',
    select: 'Select',
    book: 'Book',
    confirm: 'Confirm',
  },
  id: {
    home: 'Beranda',
    properties: 'Properti',
    favorites: 'Favorit',
    calendar: 'Kalender',
    compare: 'Bandingkan',
    bookingLookup: 'Cek Booking',
    overview: 'Ringkasan',
    search: 'Cari',
    filters: 'Filter',
    welcome: 'Selamat Datang di',
    smartRental: 'Sistem Rental Pintar',
    browseRentals: 'Jelajahi Rental',
    whatWeOffer: 'Apa yang Kami Tawarkan',
    houses: 'Rumah',
    boarding: 'Kost',
    carRentals: 'Rental Mobil',
    howItWorks: 'Cara Kerja',
    browse: 'Jelajah',
    select: 'Pilih',
    book: 'Pesan',
    confirm: 'Konfirmasi',
  }
};

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || 'id';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.lang = language;
  }, [language]);

  const t = (key) => {
    return translations[language][key] || key;
  };

  const toggleLanguage = () => {
    setLanguage(prev => prev === 'en' ? 'id' : 'en');
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, toggleLanguage }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}

export default function LanguageToggle() {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button 
      className="language-toggle" 
      onClick={toggleLanguage}
      title="Change language"
    >
      {language === 'en' ? '🇮🇩 ID' : '🇬🇧 EN'}
    </button>
  );
}
