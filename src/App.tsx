import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from './lib/ThemeContext';
import { AuthProvider } from './lib/AuthContext';
import { Header } from './components/Header';
import { Footer } from './components/Footer';
import { AgeVerification } from './components/AgeVerification';
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

export default function App() {
  React.useEffect(() => {
    console.log('App: Mounted with full layout and advertising placements');
  }, []);

  return (
    <ThemeProvider>
      <Router>
        <AuthProvider>
          <div className="min-h-screen flex flex-col bg-background text-main">
          <AgeVerification />
          
          <Header />

          <main className="flex-grow">
            <Routes>
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
              <Route path="/profile" element={<ProfilePage />} />
              <Route path="/favorites" element={<FavoritesPage />} />
              {/* Fallback for 404 can be added here */}
              <Route path="*" element={<HomePage />} />
            </Routes>
          </main>

          <Footer />
        </div>
        </AuthProvider>
      </Router>
    </ThemeProvider>
  );
}
