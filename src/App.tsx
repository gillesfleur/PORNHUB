import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { ThemeProvider } from './lib/ThemeContext';
import { AuthProvider } from './lib/AuthContext';
import { Header } from './components/Header';
import { MobileBottomNav } from './components/MobileBottomNav';
import { Footer } from './components/Footer';
import { AgeVerification } from './components/AgeVerification';
import { CookieConsent } from './components/CookieConsent';
import { ScrollToTop } from './components/ScrollToTop';
import { HomePage } from './pages/HomePage';
import { VideoPage } from './pages/VideoPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { CategoryPage } from './pages/CategoryPage';
import { TagsPage } from './pages/TagsPage';
import { TagPage } from './pages/TagPage';
import { SearchPage } from './pages/SearchPage';
import { PornstarsPage } from './pages/PornstarsPage';
import { PornstarProfilePage } from './pages/PornstarProfilePage';
import { PopularPage } from './pages/PopularPage';
import { RecentPage } from './pages/RecentPage';
import { TopRatedPage } from './pages/TopRatedPage';
import { TrendingPage } from './pages/TrendingPage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { ForgotPasswordPage } from './pages/ForgotPasswordPage';
import { ProfilePage } from './pages/ProfilePage';
import { FavoritesPage } from './pages/FavoritesPage';
import { PlaylistsPage } from './pages/PlaylistsPage';
import { PlaylistDetailPage } from './pages/PlaylistDetailPage';
import { SettingsPage } from './pages/SettingsPage';
import { AboutPage } from './pages/AboutPage';
import { ContactPage } from './pages/ContactPage';
import { TermsPage } from './pages/TermsPage';
import { PrivacyPage } from './pages/PrivacyPage';
import { DMCAPage } from './pages/DMCAPage';
import { NotFoundPage } from './pages/NotFoundPage';
import { ProtectedRoute } from './components/ProtectedRoute';
import { AdminLayout } from './components/admin/AdminLayout';
import { AdminDashboardPage } from './pages/admin/AdminDashboardPage';
import { AdminVideoPage } from './pages/admin/AdminVideoPage';
import { AdminUserPage } from './pages/admin/AdminUserPage';
import { AdminCategoryPage } from './pages/admin/AdminCategoryPage';
import { AdminTagPage } from './pages/admin/AdminTagPage';
import { AdminCommentPage } from './pages/admin/AdminCommentPage';
import { AdminReportPage } from './pages/admin/AdminReportPage';
import { AdminAdPage } from './pages/admin/AdminAdPage';
import { AdminSettingsPage } from './pages/admin/AdminSettingsPage';
import { motion, AnimatePresence } from 'motion/react';

const AnimatedRoutes = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');
  
  const routes = (
    <Routes location={location}>
      <Route path="/" element={<HomePage />} />
      <Route path="/video/:slug" element={<VideoPage />} />
      <Route path="/categories" element={<CategoriesPage />} />
      <Route path="/category/:slug" element={<CategoryPage />} />
      <Route path="/tags" element={<TagsPage />} />
      <Route path="/tag/:slug" element={<TagPage />} />
      <Route path="/search" element={<SearchPage />} />
      <Route path="/pornstars" element={<PornstarsPage />} />
      <Route path="/pornstar/:slug" element={<PornstarProfilePage />} />
      <Route path="/popular" element={<PopularPage />} />
      <Route path="/recent" element={<RecentPage />} />
      <Route path="/top-rated" element={<TopRatedPage />} />
      <Route path="/trending" element={<TrendingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/forgot-password" element={<ForgotPasswordPage />} />
      
      {/* Protected User Routes */}
      <Route path="/profile" element={<ProtectedRoute><ProfilePage /></ProtectedRoute>} />
      <Route path="/favorites" element={<ProtectedRoute><FavoritesPage /></ProtectedRoute>} />
      <Route path="/history" element={<ProtectedRoute><div className="p-12 text-center"><h1 className="text-4xl font-black">Mon Historique</h1><p className="mt-4 text-muted">Votre historique de visionnage apparaîtra ici.</p></div></ProtectedRoute>} />
      <Route path="/playlists" element={<ProtectedRoute><PlaylistsPage /></ProtectedRoute>} />
      <Route path="/playlist/:id" element={<ProtectedRoute><PlaylistDetailPage /></ProtectedRoute>} />
      <Route path="/settings" element={<ProtectedRoute><SettingsPage /></ProtectedRoute>} />
      
      {/* Protected Admin Routes */}
      <Route path="/admin/dashboard" element={<ProtectedRoute adminOnly><AdminDashboardPage /></ProtectedRoute>} />
      <Route path="/admin/videos" element={<ProtectedRoute adminOnly><AdminVideoPage /></ProtectedRoute>} />
      <Route path="/admin/users" element={<ProtectedRoute adminOnly><AdminUserPage /></ProtectedRoute>} />
      <Route path="/admin/categories" element={<ProtectedRoute adminOnly><AdminCategoryPage /></ProtectedRoute>} />
      <Route path="/admin/tags" element={<ProtectedRoute adminOnly><AdminTagPage /></ProtectedRoute>} />
      <Route path="/admin/comments" element={<ProtectedRoute adminOnly><AdminCommentPage /></ProtectedRoute>} />
      <Route path="/admin/reports" element={<ProtectedRoute adminOnly><AdminReportPage /></ProtectedRoute>} />
      <Route path="/admin/ads" element={<ProtectedRoute adminOnly><AdminAdPage /></ProtectedRoute>} />
      <Route path="/admin/settings" element={<ProtectedRoute adminOnly><AdminSettingsPage /></ProtectedRoute>} />

      <Route path="/about" element={<AboutPage />} />
      <Route path="/contact" element={<ContactPage />} />
      <Route path="/terms" element={<TermsPage />} />
      <Route path="/privacy" element={<PrivacyPage />} />
      <Route path="/dmca" element={<DMCAPage />} />
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );

  if (isAdminRoute) {
    return (
      <AdminLayout>
        <AnimatePresence mode="wait">
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.2 }}
            className="flex-grow flex flex-col"
          >
            {routes}
          </motion.div>
        </AnimatePresence>
      </AdminLayout>
    );
  }

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="flex-grow flex flex-col pb-14 lg:pb-0"
      >
        {routes}
      </motion.div>
    </AnimatePresence>
  );
};

export default function App() {
  React.useEffect(() => {
    console.log('App: Mounted with full layout and advertising placements');
  }, []);

  return (
    <ThemeProvider>
      <Router>
        <AuthProvider>
          <AppContent />
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}

const AppContent = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  return (
    <div className="min-h-screen flex flex-col bg-background text-main">
      <AgeVerification />
      <ScrollToTop />
      {!isAdminRoute && <Header />}
      <main className="flex-grow flex flex-col">
        {!isAdminRoute && <CookieConsent />}
        <AnimatedRoutes />
      </main>
      {!isAdminRoute && <Footer />}
      {!isAdminRoute && <MobileBottomNav />}
    </div>
  );
};
