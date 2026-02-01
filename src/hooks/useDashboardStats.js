import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';

/**
 * Custom hook to manage dashboard statistics
 * Stores data in Firestore 'dashboardStats' collection with document ID 'overview'
 * Provides real-time updates when stats change
 */
const useDashboardStats = () => {
  const [stats, setStats] = useState({
    totalSales: 250000,
    totalCosts: 180000,
    monthlySaleGoal: 300000,
    totalEmployees: 25,
    loading: true,
    error: null
  });

  // Real-time listener for stats changes
  useEffect(() => {
    const statsDocRef = doc(db, 'dashboardStats', 'overview');

    const unsubscribe = onSnapshot(
      statsDocRef,
      (docSnap) => {
        if (docSnap.exists()) {
          setStats({
            ...docSnap.data(),
            loading: false,
            error: null
          });
        } else {
          // If document doesn't exist, use default values and create it
          const defaultStats = {
            totalSales: 250000,
            totalCosts: 180000,
            monthlySaleGoal: 300000,
            totalEmployees: 25
          };
          
          setStats({
            ...defaultStats,
            loading: false,
            error: null
          });

          // Create the document with default values
          setDoc(statsDocRef, defaultStats).catch((error) => {
            console.error('Error creating default dashboard stats:', error);
          });
        }
      },
      (error) => {
        console.error('Error listening to dashboard stats:', error);
        setStats(prev => ({
          ...prev,
          loading: false,
          error: error.message
        }));
      }
    );

    return () => unsubscribe();
  }, []);

  // Function to update stats in Firestore
  const updateStats = async (newStats) => {
    try {
      const statsDocRef = doc(db, 'dashboardStats', 'overview');
      await setDoc(statsDocRef, newStats, { merge: true });
      console.log('✅ Dashboard stats updated successfully');
      return { success: true };
    } catch (error) {
      console.error('❌ Error updating dashboard stats:', error);
      return { success: false, error: error.message };
    }
  };

  // Function to update a single stat field
  const updateSingleStat = async (key, value) => {
    try {
      const statsDocRef = doc(db, 'dashboardStats', 'overview');
      await setDoc(statsDocRef, { [key]: value }, { merge: true });
      console.log(`✅ Updated ${key} to ${value}`);
      return { success: true };
    } catch (error) {
      console.error(`❌ Error updating ${key}:`, error);
      return { success: false, error: error.message };
    }
  };

  return {
    stats,
    updateStats,
    updateSingleStat,
    loading: stats.loading,
    error: stats.error
  };
};

export default useDashboardStats;
