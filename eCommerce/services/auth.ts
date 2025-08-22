import { Alert } from 'react-native';

import { signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut as webSignOut, type User as WebUser } from 'firebase/auth';

import { getFirebaseApp, getFirebaseAuth } from '@/services/firebase';

import { User } from '@/types/auth';

interface AuthResponse {
  success: boolean;
  user?: User;
  errorMessage?: string;
}

// INFO: Normalize Firebase user to app User
const mapFirebaseUser = (firebaseUser: WebUser | null): User | undefined => {
  if (!firebaseUser) return undefined;
  return {
    uid: firebaseUser.uid,
    email: firebaseUser.email ?? undefined,
    displayName: firebaseUser.displayName ?? undefined,
    photoURL: firebaseUser.photoURL ?? undefined,
  };
};

  // INFO: Sign in with email/password
export const signIn = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const auth = getFirebaseAuth();
    await signInWithEmailAndPassword(auth, email, password);
    const u = mapFirebaseUser(auth.currentUser);
    return { success: true, user: u };
  } catch (error: any) {
    const message = error?.message ?? 'Invalid email or password.';
    Alert.alert('Sign In Failed', message);
    return { success: false, errorMessage: message };
  }
};

  // INFO: Create user with email/password
export const signUp = async (email: string, password: string): Promise<AuthResponse> => {
  try {
    const auth = getFirebaseAuth();
    await createUserWithEmailAndPassword(auth, email, password);
    const u = mapFirebaseUser(auth.currentUser);
    return { success: true, user: u };
  } catch (error: any) {
    const message = error?.message ?? 'Could not create an account.';
    Alert.alert('Sign Up Failed', message);
    return { success: false, errorMessage: message };
  }
};

  // INFO: Sign out current user
export const signOut = async (): Promise<{ success: boolean } & { errorMessage?: string }> => {
  try {
    const auth = getFirebaseAuth();
    await webSignOut(auth);
    return { success: true };
  } catch (error: any) {
    const message = error?.message ?? 'Could not sign out.';
    Alert.alert('Sign Out Failed', message);
    return { success: false, errorMessage: message };
  }
};
