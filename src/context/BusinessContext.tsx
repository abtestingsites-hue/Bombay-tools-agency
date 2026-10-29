import React, { createContext, useContext, useState, useEffect } from 'react';
import { BusinessSettings } from '@/types';
import { DataService } from '@/services/dataService';
import { DEFAULT_BUSINESS_SETTINGS } from '@/config/business';

interface BusinessContextType {
  settings: BusinessSettings;
  isLoading: boolean;
  refreshSettings: () => Promise<void>;
  updateSettings: (updates: Partial<BusinessSettings>) => Promise<void>;
}

const BusinessContext = createContext<BusinessContextType | undefined>(undefined);

export const BusinessProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [settings, setSettings] = useState<BusinessSettings>(DEFAULT_BUSINESS_SETTINGS);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const loadSettings = async () => {
    try {
      const data = await DataService.getBusinessSettings();
      setSettings(data);
    } catch (err) {
      console.error('Failed to load business settings', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSettings();
  }, []);

  const updateSettings = async (updates: Partial<BusinessSettings>) => {
    const updated = await DataService.adminUpdateBusinessSettings(updates);
    setSettings(updated);
  };

  return (
    <BusinessContext.Provider
      value={{
        settings,
        isLoading,
        refreshSettings: loadSettings,
        updateSettings,
      }}
    >
      {children}
    </BusinessContext.Provider>
  );
};

export const useBusiness = (): BusinessContextType => {
  const context = useContext(BusinessContext);
  if (!context) {
    throw new Error('useBusiness must be used within a BusinessProvider');
  }
  return context;
};
