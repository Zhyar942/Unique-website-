import React, { useState } from 'react';
import { LanguageProvider } from './context/LanguageContext';
import { RouterProvider, useRouter } from './context/RouterContext';
import { CatalogProvider } from './context/CatalogContext';
import { AdminAuthProvider } from './context/AdminAuthContext';

import { MapModalProvider } from './context/MapModalContext';

import Navbar from './components/Navbar';
import Home from './pages/Home';
import Catalogue from './pages/Catalogue';
import ProductDetail from './pages/ProductDetail';
import About from './pages/About';
import ContactShowroom from './pages/ContactShowroom';
import AdminLogin from './pages/admin/AdminLogin';
import AdminDashboard from './pages/admin/AdminDashboard';
import DesignSystemShowcase from './pages/DesignSystemShowcase';

import SearchModal from './components/SearchModal';
import Footer from './components/Footer';
import useStartupLoader from './hooks/useStartupLoader';

import PageTransition from './components/ui/PageTransition';

const AppContent = () => {
  const { route, slug, currentPath } = useRouter();
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  // Admin Routes (Isolated from customer navigation)
  if (route === 'admin-login') {
    return <AdminLogin />;
  }

  if (route === 'admin') {
    return <AdminDashboard />;
  }

  // Public Customer Experience
  return (
    <div className="app-wrapper">
      {/* Redesigned 3-Zone Header */}
      <Navbar onSearchClick={() => setIsSearchOpen(true)} />

      {/* Viewport Routing with Smooth Page Transition */}
      <main className="main-content" id="main-content">
        <PageTransition transitionKey={currentPath}>
          {route === 'home' && (
            <Home />
          )}
          {route === 'products' && (
            <Catalogue type="all" />
          )}
          {route === 'home-furniture' && (
            <Catalogue type="home" />
          )}
          {route === 'office-furniture' && (
            <Catalogue type="office" />
          )}
          {route === 'product' && (
            <ProductDetail key={slug} slug={slug} />
          )}
          {route === 'about' && (
            <About />
          )}
          {route === 'contact' && (
            <ContactShowroom />
          )}
          {route === 'design-system' && (
            <DesignSystemShowcase />
          )}
        </PageTransition>
      </main>

      {/* Shared Responsive Showroom Footer */}
      <Footer />

      {/* Trilingual Search Modal */}
      <SearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
      />
    </div>
  );
};

function App() {
  useStartupLoader();
  return (
    <LanguageProvider>
      <RouterProvider>
        <CatalogProvider>
          <AdminAuthProvider>
            <MapModalProvider>
              <AppContent />
            </MapModalProvider>
          </AdminAuthProvider>
        </CatalogProvider>
      </RouterProvider>
    </LanguageProvider>
  );
}

export default App;
