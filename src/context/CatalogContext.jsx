import React, { createContext, useContext, useState, useEffect } from 'react';
import { products as defaultProducts } from '../data/products';
import { businessInfo as defaultBusinessInfo } from '../config/businessInfo';

const CatalogContext = createContext();

export const useCatalog = () => {
  const context = useContext(CatalogContext);
  if (!context) {
    throw new Error('useCatalog must be used within a CatalogProvider');
  }
  return context;
};

export const CatalogProvider = ({ children }) => {
  // Initialize products from localStorage or defaults
  const [products, setProducts] = useState(() => {
    try {
      const saved = localStorage.getItem('uf_catalog_products');
      if (saved) {
        const parsed = JSON.parse(saved);
        const defaultMap = new Map(defaultProducts.map(p => [p.id, p]));
        const merged = parsed.map(p => {
          const def = defaultMap.get(p.id);
          if (def) {
            return {
              ...def,
              ...p,
              collections: p.collections || def.collections,
              productType: p.productType || def.productType
            };
          }
          return p;
        });
        const existingIds = new Set(merged.map(p => p.id));
        for (const def of defaultProducts) {
          if (!existingIds.has(def.id)) {
            merged.push(def);
          }
        }
        return merged;
      }
    } catch (e) {
      console.warn('Failed to load products from localStorage:', e);
    }
    return defaultProducts;
  });

  // Initialize settings from localStorage or defaults
  const [settings, setSettings] = useState(() => {
    try {
      const saved = localStorage.getItem('uf_business_settings');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Automatically sync to updated showroom address if older location was cached
        if (parsed?.showroom) {
          if (parsed.showroom.addressKu && parsed.showroom.addressKu.includes('سالم')) {
            parsed.showroom.addressKu = defaultBusinessInfo.showroom.addressKu;
            parsed.showroom.addressAr = defaultBusinessInfo.showroom.addressAr;
            parsed.showroom.addressEn = defaultBusinessInfo.showroom.addressEn;
          }
          parsed.showroom.googleMapsUrl = defaultBusinessInfo.showroom.googleMapsUrl;
          parsed.showroom.appleMapsUrl = defaultBusinessInfo.showroom.appleMapsUrl;
          localStorage.setItem('uf_business_settings', JSON.stringify(parsed));
        }
        return parsed;
      }
    } catch (e) {
      console.warn('Failed to load settings from localStorage:', e);
    }
    return defaultBusinessInfo;
  });

  // Persist products on change
  useEffect(() => {
    try {
      localStorage.setItem('uf_catalog_products', JSON.stringify(products));
    } catch (e) {
      console.warn('Failed to persist products:', e);
    }
  }, [products]);

  // Persist settings on change
  useEffect(() => {
    try {
      localStorage.setItem('uf_business_settings', JSON.stringify(settings));
    } catch (e) {
      console.warn('Failed to persist settings:', e);
    }
  }, [settings]);

  // Product CRUD
  const addProduct = (newProd) => {
    const id = Date.now();
    const productWithId = {
      ...newProd,
      id,
      slug: newProd.slug || (newProd.title?.en || 'product')
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/^-|-$/g, '') + `-${id.toString().slice(-4)}`,
      createdAt: new Date().toISOString(),
      published: newProd.published !== false
    };
    setProducts((prev) => [productWithId, ...prev]);
    return productWithId;
  };

  const updateProduct = (id, updatedFields) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, ...updatedFields, updatedAt: new Date().toISOString() } : p))
    );
  };

  const deleteProduct = (id) => {
    setProducts((prev) => prev.filter((p) => p.id !== id));
  };

  const togglePublish = (id) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, published: !p.published } : p))
    );
  };

  const toggleFeatured = (id) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, featured: !p.featured } : p))
    );
  };

  const toggleNewArrival = (id) => {
    setProducts((prev) =>
      prev.map((p) => (p.id === id ? { ...p, isNew: !p.isNew } : p))
    );
  };

  const updateSettings = (newSettings) => {
    setSettings((prev) => ({ ...prev, ...newSettings }));
  };

  const resetCatalogToDefaults = () => {
    setProducts(defaultProducts);
    setSettings(defaultBusinessInfo);
    localStorage.removeItem('uf_catalog_products');
    localStorage.removeItem('uf_business_settings');
  };

  return (
    <CatalogContext.Provider
      value={{
        products,
        settings,
        addProduct,
        updateProduct,
        deleteProduct,
        togglePublish,
        toggleFeatured,
        toggleNewArrival,
        updateSettings,
        resetCatalogToDefaults
      }}
    >
      {children}
    </CatalogContext.Provider>
  );
};

export default CatalogContext;
