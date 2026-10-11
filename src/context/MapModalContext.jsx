import React, { createContext, useContext, useState, useMemo } from 'react';
import MapPickerModal from '../components/MapPickerModal';

const MapModalContext = createContext({
  openMapModal: () => {},
  closeMapModal: () => {},
  isMapModalOpen: false,
});

export const MapModalProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);

  const value = useMemo(() => ({
    openMapModal: () => setIsOpen(true),
    closeMapModal: () => setIsOpen(false),
    isMapModalOpen: isOpen,
  }), [isOpen]);

  return (
    <MapModalContext.Provider value={value}>
      {children}
      <MapPickerModal isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </MapModalContext.Provider>
  );
};

export const useMapModal = () => useContext(MapModalContext);
