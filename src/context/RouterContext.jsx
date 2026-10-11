import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

export const RouterContext = createContext();

export const useRouter = () => {
  const context = useContext(RouterContext);
  if (!context) {
    throw new Error('useRouter must be used within a RouterProvider');
  }
  return context;
};

export const RouterProvider = ({ children }) => {
  const [currentPath, setCurrentPath] = useState(() => {
    return window.location.pathname || '/';
  });

  const [searchParams, setSearchParams] = useState(() => {
    return new URLSearchParams(window.location.search);
  });

  const updateLocation = useCallback(() => {
    setCurrentPath(window.location.pathname || '/');
    setSearchParams(new URLSearchParams(window.location.search));
  }, []);

  useEffect(() => {
    const handlePopState = () => {
      updateLocation();
      window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, [updateLocation]);

  const navigate = useCallback((to, options = {}) => {
    if (to.startsWith('http') || to.startsWith('tel:') || to.startsWith('mailto:')) {
      window.open(to, options.target || '_blank');
      return;
    }

    if (to === window.location.pathname + window.location.search) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    window.history.pushState({}, '', to);
    updateLocation();
    
    if (!options.keepScroll) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [updateLocation]);

  // Route parsing
  let route = 'home';
  let slug = null;

  const normalizedPath = currentPath.replace(/\/$/, '') || '/';

  if (normalizedPath === '/' || normalizedPath === '') {
    route = 'home';
  } else if (normalizedPath === '/admin/login') {
    route = 'admin-login';
  } else if (normalizedPath.startsWith('/admin')) {
    route = 'admin';
  } else if (normalizedPath.startsWith('/products')) {
    route = 'products';
  } else if (normalizedPath.startsWith('/home-furniture')) {
    route = 'home-furniture';
  } else if (normalizedPath.startsWith('/office-furniture')) {
    route = 'office-furniture';
  } else if (normalizedPath.startsWith('/product/')) {
    route = 'product';
    slug = normalizedPath.replace('/product/', '').split('/')[0];
  } else if (normalizedPath.startsWith('/about')) {
    route = 'about';
  } else if (normalizedPath.startsWith('/contact')) {
    route = 'contact';
  } else if (normalizedPath.startsWith('/design-system') || normalizedPath.startsWith('/design')) {
    route = 'design-system';
  }

  const categoryParam = searchParams.get('cat') || 'all';
  const collectionParam = searchParams.get('collection') || searchParams.get('col') || null;
  const productCategoryParam = searchParams.get('product') || searchParams.get('prod') || null;

  return (
    <RouterContext.Provider value={{
      currentPath: normalizedPath,
      route,
      slug,
      categoryParam,
      collectionParam,
      productCategoryParam,
      navigate,
      searchParams
    }}>
      {children}
    </RouterContext.Provider>
  );
};

export const Link = ({ href, children, className = '', style = {}, onClick, ...props }) => {
  const { navigate, currentPath } = useRouter();
  const isActive = currentPath === href;

  const handleClick = (e) => {
    const isModified = e.metaKey || e.altKey || e.ctrlKey || e.shiftKey;
    const isExternal = (props.target && props.target !== '_self') ||
                       (typeof href === 'string' && (href.startsWith('http') || href.startsWith('tel:') || href.startsWith('mailto:')));

    if (!isModified && !isExternal && (e.button === 0 || e.button === undefined)) {
      e.preventDefault();
      navigate(href);
    }

    if (onClick) {
      try {
        onClick(e);
      } catch (err) {
        console.error('Link onClick error:', err);
      }
    }
  };

  return (
    <a
      href={href}
      onClick={handleClick}
      className={`${className} ${isActive ? 'is-active' : ''}`}
      style={style}
      {...props}
    >
      {children}
    </a>
  );
};
