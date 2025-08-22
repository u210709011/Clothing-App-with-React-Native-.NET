import { useState, useEffect } from 'react';
import { onAuthStateChanged } from 'firebase/auth';

import { signIn as apiSignIn, signUp as apiSignUp, signOut as apiSignOut } from '@/services/auth';
import { getFirebaseAuth } from '@/services/firebase';

import { User } from '@/types/auth';

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true); 

  // INFO: Listen to Firebase auth state changes
  useEffect(() => {
    const auth = getFirebaseAuth();
    const unsubscribe = onAuthStateChanged(auth, (firebaseUser) => {
      if (firebaseUser) {
        const mappedUser: User = {
          uid: firebaseUser.uid,
          email: firebaseUser.email ?? undefined,
          displayName: firebaseUser.displayName ?? undefined,
          photoURL: firebaseUser.photoURL ?? undefined,
        };
        setUser(mappedUser);
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const signIn = async (email: string, password: string) => {
    setLoading(true);
    const response = await apiSignIn(email, password);
    setLoading(false);
    return response;
  };

  const signUp = async (email: string, password: string) => {
    setLoading(true);
    const response = await apiSignUp(email, password);
    setLoading(false);
    return response;
  };

  const signOut = async () => {
    setLoading(true);
    await apiSignOut();
    setLoading(false);
  };

  return { user, loading, signIn, signUp, signOut };
};
