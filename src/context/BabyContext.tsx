// src/context/BabyContext.tsx

/**
 * @file BabyContext.tsx
 * @description This file establishes a global state management system for baby profiles.
 *              It fetches the list of babies for the currently authenticated user from
 *              Firestore, manages which baby is currently "selected" throughout the app,
 *              and provides this data and related actions to any component.
 *
 * @format
 */

import React, {createContext, useContext, useState, useEffect, ReactNode} from 'react';
import {
  FirebaseFirestoreTypes,
  getFirestore,
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
} from '@react-native-firebase/firestore';
import {useAuth} from './AuthContext'; // This context is dependent on the user's authentication state.

/**
 * @interface Baby
 * @description Defines the data structure for a single baby profile.
 *              This should match the schema in the 'babies' collection in Firestore.
 */
export interface Baby {
  id: string; // The Firestore document ID for the baby.
  userId: string; // The UID of the user who owns this profile.
  name: string;
  dateOfBirth: FirebaseFirestoreTypes.Timestamp;
  gender: 'male' | 'female' | 'other';
  createdAt: FirebaseFirestoreTypes.Timestamp;
}

/**
 * @interface BabyContextType
 * @description Defines the shape of the data that the BabyContext will provide.
 * @property {Baby[]} babies - An array of all baby profiles belonging to the user.
 * @property {Baby | null} selectedBaby - The currently active baby profile.
 * @property {(baby: Baby | null) => void} setSelectedBaby - Function to change the selected baby.
 * @property {boolean} loading - True while the baby data is being fetched, false afterward.
 */
interface BabyContextType {
  babies: Baby[];
  selectedBaby: Baby | null;
  setSelectedBaby: (baby: Baby | null) => void;
  loading: boolean;
}

// Create the context with an initial undefined value.
const BabyContext = createContext<BabyContextType | undefined>(undefined);

/**
 * @name BabyProvider
 * @description A component that supplies the baby data to its children. It listens for
 *              changes to the authenticated user and fetches the corresponding baby data
 *              from Firestore in real-time.
 * @param {object} props - Component properties.
 * @param {ReactNode} props.children - The child components.
 * @returns {React.JSX.Element} The provider component.
 */
export const BabyProvider = ({children}: {children: ReactNode}): React.JSX.Element => {
  console.log('🧸✅ BabyProvider: Component has mounted.');

  const {user} = useAuth(); // Get the current user from the AuthContext.

  // --- State Definitions ---
  const [babies, setBabies] = useState<Baby[]>([]);
  const [selectedBaby, setSelectedBaby] = useState<Baby | null>(null);
  const [loading, setLoading] = useState(true);

  // This effect hook is the core of the provider. It runs whenever the `user` object changes.
  useEffect(() => {
    // If a user is logged in, we fetch their data.
    if (user) {
      console.log(`🧸⏳ BabyProvider: User detected (${user.uid}). Fetching babies from Firestore...`);
      setLoading(true);

      // Prefer an ordered query for stable UI; if a required index is missing, gracefully
      // fall back to an unordered listener and log guidance to create the composite index.
      const db = getFirestore();
      const baseQueryRef = query(
        collection(db, 'babies'),
        where('userId', '==', user.uid),
      );

      const handleSnapshot = (querySnapshot: FirebaseFirestoreTypes.QuerySnapshot<FirebaseFirestoreTypes.DocumentData>) => {
        const userBabies: Baby[] = querySnapshot.docs.map(doc => ({
          id: doc.id,
          ...(doc.data() as Omit<Baby, 'id'>),
        }));

        console.log(`🧸✅ BabyProvider: Firestore update received. Found ${userBabies.length} babies.`);
        setBabies(userBabies);

        // Logic to set a default selected baby.
        const isSelectedBabyStillValid = !!selectedBaby && userBabies.some(b => b.id === selectedBaby.id);
        if (!isSelectedBabyStillValid && userBabies.length > 0) {
          console.log(`🧸➡️ BabyProvider: Setting default selected baby to '${userBabies[0].name}'.`);
          setSelectedBaby(userBabies[0]);
        } else if (userBabies.length === 0) {
          console.log('🧸🎨 BabyProvider: No babies found, clearing selected baby.');
          setSelectedBaby(null);
        }

        setLoading(false);
      };

      let unsubscribe: undefined | (() => void);
      const subscribeWithOrder = () => {
        const orderedQueryRef = query(baseQueryRef, orderBy('createdAt', 'desc'));
        return onSnapshot(orderedQueryRef, handleSnapshot, err => {
          // Missing index or other error: fall back without ordering.
          console.warn(
            '🧸⚠️ Ordered babies query failed, falling back without order. Consider adding a composite index on (userId ASC, createdAt DESC).',
            err,
          );
          setLoading(true);
          unsubscribe = onSnapshot(baseQueryRef, handleSnapshot, e => {
            console.error('🧸❌ BabyProvider: Error fetching babies (fallback):', e);
            setLoading(false);
          });
        });
      };

      unsubscribe = subscribeWithOrder();

      // Cleanup function to unsubscribe from the listener when the user logs out or the component unmounts.
      return () => {
        console.log('🧸🧹 BabyProvider: Cleaning up Firestore listener for babies.');
        if (unsubscribe) unsubscribe();
      };
    } else {
      // If there is no user (logged out), clear all local baby data.
      console.log('🧸🧹 BabyProvider: No user detected. Clearing all baby data.');
      setBabies([]);
      setSelectedBaby(null);
      setLoading(false); // We are not loading if there's no user.
    }
  }, [user]);

  // The value object holds all the data and functions that will be provided to child components.
  const value = {babies, selectedBaby, setSelectedBaby, loading};

  return <BabyContext.Provider value={value}>{children}</BabyContext.Provider>;
};

/**
 * @name useBaby
 * @description A custom hook for easy access to the BabyContext.
 *              It also includes an error check to ensure it's used within a BabyProvider.
 * @returns {BabyContextType} The baby context value.
 */
export const useBaby = (): BabyContextType => {
  const context = useContext(BabyContext);
  if (context === undefined) {
    throw new Error('useBaby must be used within a BabyProvider. Make sure your component is wrapped correctly.');
  }
  return context;
};
