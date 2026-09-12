import React, { createContext, useContext, useEffect, useState, useMemo } from 'react';
import { User, auth, onAuthStateChanged, signInWithGoogle, logoutUser, ShikshaUser } from '../firebase';

export type AuthUser = User | ShikshaUser;

interface AuthContextType {
  user: AuthUser | null;
  loading: boolean;
  signInWithGoogle: (options?: { email?: string; name?: string; selectAnother?: boolean }) => Promise<AuthUser>;
  logout: () => Promise<void>;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signInWithGoogle: async () => { throw new Error('AuthContext not initialized'); },
  logout: async () => {},
  isAuthenticated: false,
});

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleSignIn = async (options?: { email?: string; name?: string }) => {
    return await signInWithGoogle(options);
  };

  const handleLogout = async () => {
    await logoutUser();
  };

  const value = useMemo(() => ({
    user,
    loading,
    signInWithGoogle: handleSignIn,
    logout: handleLogout,
    isAuthenticated: !!user,
  }), [user, loading]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
