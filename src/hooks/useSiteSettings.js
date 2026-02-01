import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

/**
 * Custom hook to manage site-wide settings (contact info, social links)
 * Stores data in Firestore 'contact' collection with document ID 'general'
 * Provides real-time updates when settings change
 */
const useSiteSettings = () => {
  const [settings, setSettings] = useState({
    phone: '01711660004',
    email: 'info@ashrafienginfers.com',
    address: 'Workshop Location, Dhaka, Bangladesh',
    facebookUrl: '',
    whatsappNumber: '01711660004',
    businessHours: 'Mon - Sat: 8:00 AM - 6:00 PM',
    workshopDescription: 'Our state-of-the-art workshop is equipped with modern machinery and tools to handle projects of all sizes. We welcome clients to visit and discuss their requirements in person.',
    workshopSize: '5000 sq ft',
    workshopCapacity: 'Large scale projects',
    workshopEquipment: 'Modern machinery',
    workshopTeam: '25+ skilled workers',
    googleMapsUrl: '',
    loading: true,
    error: null
  });

  // Real-time listener for settings changes
  useEffect(() => {
    const settingsDocRef = doc(db, 'contact', 'general');

    const unsubscribe = onSnapshot(
      settingsDocRef,
      (docSnap) => {
        if (docSnap.exists()) {
          setSettings({
            ...docSnap.data(),
            loading: false,
            error: null
          });
        } else {
          // If document doesn't exist, use default values and create it
          const defaultSettings = {
            phone: '01711660004',
            email: 'info@ashrafienginfers.com',
            address: 'Workshop Location, Dhaka, Bangladesh',
            facebookUrl: '',
            whatsappNumber: '01711660004',
            businessHours: 'Mon - Sat: 8:00 AM - 6:00 PM',
            workshopDescription: 'Our state-of-the-art workshop is equipped with modern machinery and tools to handle projects of all sizes. We welcome clients to visit and discuss their requirements in person.',
            workshopSize: '5000 sq ft',
            workshopCapacity: 'Large scale projects',
            workshopEquipment: 'Modern machinery',
            workshopTeam: '25+ skilled workers',
            googleMapsUrl: ''
          };
          
          setSettings({
            ...defaultSettings,
            loading: false,
            error: null
          });

          // Create the document with default values
          setDoc(settingsDocRef, defaultSettings).catch((error) => {
            console.error('Error creating default settings:', error);
          });
        }
      },
      (error) => {
        console.error('Error listening to settings:', error);
        setSettings(prev => ({
          ...prev,
          loading: false,
          error: error.message
        }));
      }
    );

    return () => unsubscribe();
  }, []);

  // Function to update settings in Firestore
  const updateSettings = async (newSettings) => {
    try {
      const settingsDocRef = doc(db, 'contact', 'general');
      await setDoc(settingsDocRef, newSettings, { merge: true });
      console.log('✅ Site settings updated successfully');
      return { success: true };
    } catch (error) {
      console.error('❌ Error updating site settings:', error);
      return { success: false, error: error.message };
    }
  };

  return {
    settings,
    updateSettings,
    loading: settings.loading,
    error: settings.error
  };
};

export default useSiteSettings;
