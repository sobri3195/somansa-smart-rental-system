import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Home from './pages/Home';
import PropertyList from './pages/PropertyList';
import PropertyDetail from './pages/PropertyDetail';
import BookingLookup from './pages/BookingLookup';
import Overview from './pages/Overview';
import Calendar from './pages/Calendar';
import Favorites from './pages/Favorites';
import Compare from './pages/Compare';
import SupportWidget from './components/common/SupportWidget';
import DarkModeToggle from './components/common/DarkModeToggle';
import LanguageToggle, { LanguageProvider } from './components/common/LanguageToggle';
import Analytics from './components/common/Analytics';
import { ToastProvider } from './components/common/Toast';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
      staleTime: 5 * 60 * 1000,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <LanguageProvider>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/properties" element={<PropertyList />} />
              <Route path="/properties/:id" element={<PropertyDetail />} />
              <Route path="/booking-lookup" element={<BookingLookup />} />
              <Route path="/overview" element={<Overview />} />
              <Route path="/calendar" element={<Calendar />} />
              <Route path="/favorites" element={<Favorites />} />
              <Route path="/compare" element={<Compare />} />
            </Routes>
            <SupportWidget />
            <DarkModeToggle />
            <LanguageToggle />
            <Analytics />
          </BrowserRouter>
        </LanguageProvider>
      </ToastProvider>
    </QueryClientProvider>
  );
}

export default App;
