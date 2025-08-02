// src/context/AuthContext.tsx

/**
 * @file Establishes a global state management system for user authentication
 * using React Context. It allows any component to access the current user's
 * auth status without prop drilling.
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
import auth, {FirebaseAuthTypes} from '@react-native-firebase/auth';

/**
 * Defines the shape of the data that the AuthContext will provide.
 */
interface AuthContextType {
  /**
   * The Firebase user object if a user is authenticated, otherwise null.
   */
  user: FirebaseAuthTypes.User | null;
  /**
   * True only during the initial check of the auth state when the app first loads.
   * This is useful for rendering a loading indicator instead of a login screen.
   */
  loading: boolean;
}

// The Context object is initialized with a default value.
// This is primarily for TypeScript's benefit and is immediately overwritten by the Provider.
const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

/**
 * A component that acts as the provider for the authentication state.
 * It should wrap the entire application or any part that needs access to auth data.
 * It establishes a real-time listener to Firebase Authentication services.
 * @param {object} props - Component properties.
 * @param {ReactNode} props.children - The child components to be rendered.
 */
export const AuthProvider = ({
  children,
}: {
  children: ReactNode;
}): React.JSX.Element => {
  console.log('🔑🎨 AuthProvider: Rendering...');
  // I've chosen a new emoji 🔑 for Auth-related contexts.

  const [user, setUser] = useState<FirebaseAuthTypes.User | null>(null);
  const [loading, setLoading] = useState(true);

  // This effect hook sets up the Firebase auth state listener upon mounting.
  useEffect(() => {
    console.log('🔑👂 AuthProvider: Setting up Firebase auth state listener.');

    // onAuthStateChanged returns an unsubscribe function, which is critical for cleanup.
    const subscriber = auth().onAuthStateChanged(userState => {
      console.log(
        `🔑🔄 AuthProvider: Auth state changed. User: ${userState ? userState.uid : 'null'}`,
      );
      setUser(userState);

      // This ensures the loading state is only changed once on the initial check.
      if (loading) {
        console.log('🔑✅ AuthProvider: Initial auth check complete.');
        setLoading(false);
      }
    });

    // The cleanup function is called when the component unmounts.
    // It's essential to unsubscribe from the listener to prevent memory leaks.
    return () => {
      console.log('🔑🧹 AuthProvider: Cleaning up auth listener.');
      subscriber();
    };
  }, []); // The empty dependency array ensures this effect runs only once.

  return (
    <AuthContext.Provider value={{user, loading}}>
      {children}
    </AuthContext.Provider>
  );
};

/**
 * A custom hook to simplify access to the authentication context.
 * This avoids the need to import and use `useContext(AuthContext)` in every component.
 * @returns {AuthContextType} The current authentication context value.
 */
export const useAuth = (): AuthContextType => {
  return useContext(AuthContext);
};
