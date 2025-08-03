// src/context/AuthContext.tsx

/**
 * @file AuthContext.tsx
 * @description This file establishes a global state management system for user authentication
 *              using React Context. It provides a way for any component in the application
 *              to access the current user's authentication status without prop drilling.
 *
 * @format
 */

import React, {createContext, useContext, useState, useEffect, ReactNode} from 'react';
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';

/**
 * @interface AuthContextType
 * @description Defines the shape of the data that the AuthContext will provide.
 * @property {FirebaseAuthTypes.User | null} user - Holds the Firebase user object if logged in, otherwise null.
 * @property {boolean} loading - True when the app is initially trying to determine the auth state, false afterward.
 */
interface AuthContextType {
  user: FirebaseAuthTypes.User | null;
  loading: boolean;
}

/**
 * @const AuthContext
 * @description The actual React Context object. It is initialized with a default shape.
 *              Components will subscribe to this context to receive auth updates.
 */
// The default value is provided for type-safety, but will be immediately overwritten by the Provider.
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

/**
 * @name AuthProvider
 * @description A component that acts as the supplier of the authentication state.
 *              It should wrap any part of the app that needs access to user data.
 *              It sets up a real-time listener to Firebase Auth.
 * @param {object} props - Component properties.
 * @param {ReactNode} props.children - The child components that will be rendered within this provider.
 * @returns {React.JSX.Element} The provider component.
 */
export const AuthProvider = ({children}: {children: ReactNode}): React.JSX.Element => {
  console.log('🔒✅ AuthProvider: Component has mounted.');

  // State to hold the current user object provided by Firebase.
  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  // State to track the initial check of authentication status.
  const [loading, setLoading] = useState(true);

  // useEffect hook to set up the Firebase authentication listener when the component mounts.
  useEffect(() => {
    console.log('🔒⏳ AuthProvider: Setting up Firebase auth listener...');
    
    // onAuthStateChanged is a real-time listener from Firebase.
    // It returns an `unsubscribe` function which is crucial for cleanup.
    const subscriber = auth().onAuthStateChanged(userState => {
      // This function is called whenever a user signs in or out.
      console.log(
        `🔒✅ AuthProvider: Auth state changed. User is now: ${userState ? userState.email : 'null'}`
      );
      setUser(userState);

      // We only want to set loading to false on the very first check.
      if (loading) {
        console.log('🔒✅ AuthProvider: Initial auth check finished.');
        setLoading(false);
      }
    });

    // The cleanup function: When the AuthProvider component is unmounted (e.g., app closes),
    // we must unsubscribe from the listener to prevent memory leaks.
    return () => {
      console.log('🔒🧹 AuthProvider: Cleaning up Firebase auth listener.');
      subscriber();
    };
  }, []); // The empty dependency array [] ensures this effect runs only once on mount.

  // The Provider component makes the `user` and `loading` state available to all of its children.
  return (
    <AuthContext.Provider value={{user, loading}}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * @name useAuth
 * @description A custom hook that simplifies the process of accessing the auth context.
 *              Instead of using `useContext(AuthContext)` in every component, we can just call `useAuth()`.
 * @returns {AuthContextType} The current value of the AuthContext (user and loading state).
 */
export const useAuth = (): AuthContextType => {
  return useContext(AuthContext);
};
