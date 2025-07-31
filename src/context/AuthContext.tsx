// src/context/AuthContext.tsx

/**
 * @file Manages global user authentication state using React Context.
 * It provides the current user and a loading status to the entire application.
 *
 * @format
 */

import React, {createContext, useContext, useState, useEffect} from 'react';
import auth from '@react-native-firebase/auth';
import {FirebaseAuthTypes} from '@react-native-firebase/auth';

/**
 * The shape of the authentication context.
 * user: The current Firebase user object or null if not authenticated.
 * loading: A boolean that is true while the authentication state is being determined.
 */
interface AuthContextType {
  user: FirebaseAuthTypes.User | null;
  loading: boolean;
}

/**
 * React Context for authentication.
 */
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

/**
 * A provider component that wraps the application and makes auth state available to any
 * child components that call useAuth().
 *
 * It listens to Firebase's onAuthStateChanged to automatically update the user state.
 *
 * @param {object} props - The component props.
 * @param {React.ReactNode} props.children - The child components to render.
 * @returns {React.JSX.Element} The rendered provider.
 */
export const AuthProvider = ({
  children,
}: {
  children: React.ReactNode;
}): React.JSX.Element => {
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // onAuthStateChanged returns an unsubscriber
    const subscriber = auth().onAuthStateChanged(userState => {
      console.log(
        '🔒 AuthProvider: onAuthStateChanged triggered. User:',
        userState ? userState.email : null,
      );
      setUser(userState);
      if (loading) {
        setLoading(false);
      }
    });

    // Unsubscribe on unmount
    return subscriber;
  }, [loading]);

  return (
    <AuthContext.Provider value={{user, loading}}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook to use the authentication context.
 *
 * @returns {AuthContextType} The authentication context value.
 */
export const useAuth = (): AuthContextType => {
  return useContext(AuthContext);
};
