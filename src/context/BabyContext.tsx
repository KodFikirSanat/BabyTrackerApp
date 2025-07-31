// src/context/BabyContext.tsx

/**
 * @file Manages the global state for baby profiles using React Context.
 * It fetches the user's babies from Firestore, manages the currently selected baby,
 * and provides this data to the rest of the application.
 *
 * @format
 */

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react';
import firestore from '@react-native-firebase/firestore';
import {useAuth} from './AuthContext'; // Depends on the authenticated user

// Define the structure of a baby object based on your schema
export interface Baby {
  id: string; // Firestore document ID
  userId: string;
  name: string;
  dateOfBirth: firestore.Timestamp;
  gender: string;
  createdAt: firestore.Timestamp;
}

interface BabyContextType {
  babies: Baby[];
  selectedBaby: Baby | null;
  setSelectedBaby: (baby: Baby | null) => void;
  loading: boolean;
}

const BabyContext = createContext<BabyContextType | undefined>(undefined);

export const BabyProvider = ({children}: {children: ReactNode}) => {
  const {user} = useAuth(); // Get the current user
  const [babies, setBabies] = useState<Baby[]>([]);
  const [selectedBaby, setSelectedBaby] = useState<Baby | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      setLoading(true);
      console.log(
        '👶🍼 BabyProvider: User detected, fetching babies for userId:',
        user.uid,
      );
      const subscriber = firestore()
        .collection('babies')
        .where('userId', '==', user.uid)
        .orderBy('createdAt', 'asc')
        .onSnapshot(
          querySnapshot => {
            const userBabies: Baby[] = [];
            querySnapshot.forEach(documentSnapshot => {
              userBabies.push({
                id: documentSnapshot.id,
                ...(documentSnapshot.data() as Omit<Baby, 'id'>),
              });
            });

            setBabies(userBabies);
            console.log(
              '👶🍼 BabyProvider: Fetched',
              userBabies.length,
              'babies.',
            );

            // If no baby is selected or the selected one is no longer available,
            // select the first one by default.
            if (
              (!selectedBaby || !userBabies.find(b => b.id === selectedBaby.id)) &&
              userBabies.length > 0
            ) {
              setSelectedBaby(userBabies[0]);
              console.log(
                '👶🍼 BabyProvider: Setting default selected baby to:',
                userBabies[0].name,
              );
            } else if (userBabies.length === 0) {
              setSelectedBaby(null); // No babies available
            }
            setLoading(false);
          },
          error => {
            console.error('👶🍼 BabyProvider: Error fetching babies:', error);
            setLoading(false);
          },
        );

      // Unsubscribe from snapshot listener on unmount
      return () => subscriber();
    } else {
      // If user logs out, clear all baby data
      setBabies([]);
      setSelectedBaby(null);
      setLoading(false);
    }
  }, [user]); // Re-run effect when user logs in or out

  const value = {
    babies,
    selectedBaby,
    setSelectedBaby,
    loading,
  };

  return <BabyContext.Provider value={value}>{children}</BabyContext.Provider>;
};

export const useBaby = (): BabyContextType => {
  const context = useContext(BabyContext);
  if (context === undefined) {
    throw new Error('useBaby must be used within a BabyProvider');
  }
  return context;
};
