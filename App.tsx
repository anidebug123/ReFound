import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import { Navbar } from './components/navigation/Navbar';
import { Footer } from './components/navigation/Footer';
import { Toast } from './components/common/Toast';
import { HomePage } from './pages/HomePage';
import { BrowsePage } from './pages/BrowsePage';
import { ReportItemPage } from './pages/ReportItemPage';
import { ItemDetailsPage } from './pages/ItemDetailsPage';
import { MyActivityPage } from './pages/MyActivityPage';
import { ModeratorPage } from './pages/ModeratorPage';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';

// Scroll to top on route navigation
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

// 404 NotFound page
const NotFoundPage = () => (
  <div className="max-w-md mx-auto text-center py-24 px-4">
    <div className="w-16 h-16 rounded-3xl bg-paper-card text-ink-muted flex items-center justify-center mx-auto mb-4 font-serif text-2xl font-bold">
      404
    </div>
    <h1 className="font-serif text-3xl font-bold text-ink-primary mb-2">Page Not Found</h1>
    <p className="text-sm text-ink-secondary mb-6">
      The campus page or lost listing you are searching for does not exist.
    </p>
    <Link
      to="/"
      className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-cobalt text-white text-xs font-semibold shadow-subtle hover:bg-cobalt-hover transition"
    >
      <ArrowLeft className="w-4 h-4" />
      <span>Return to Homepage</span>
    </Link>
  </div>
);

export const App: React.FC = () => {
  return (
    <AppProvider>
      <BrowserRouter>
        <ScrollToTop />
        <div className="min-h-screen flex flex-col bg-[#FAF8F3] text-[#242424]">
          <Navbar />
          <main className="flex-1">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/browse" element={<BrowsePage />} />
              <Route path="/report" element={<ReportItemPage />} />
              <Route path="/item/:id" element={<ItemDetailsPage />} />
              <Route path="/my-activity" element={<MyActivityPage />} />
              <Route path="/moderator" element={<ModeratorPage />} />
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer />
          <Toast />
        </div>
      </BrowserRouter>
    </AppProvider>
  );
};

export default App;

