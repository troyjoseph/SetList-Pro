
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signOut,
  onAuthStateChanged,
  User as FirebaseUser 
} from "firebase/auth";
import { auth } from './firebase';
import { User } from '../types';

// Helper to map Firebase User to our App User
const mapUser = (fbUser: FirebaseUser | null): User | null => {
  if (!fbUser) return null;
  return {
    id: fbUser.uid,
    email: fbUser.email || '',
    name: fbUser.displayName || fbUser.email?.split('@')[0] || 'User'
  };
};

export const authService = {
  
  // Real-time listener for auth state changes
  subscribeToAuthChanges: (callback: (user: User | null) => void) => {
    return onAuthStateChanged(auth, (fbUser) => {
      callback(mapUser(fbUser));
    });
  },

  getCurrentUser: async (): Promise<User | null> => {
    // In Firebase, accessing currentUser is synchronous if initialized, 
    // but the listener is preferred for the initial load.
    return mapUser(auth.currentUser);
  },

  login: async (email: string, password: string): Promise<User> => {
    const result = await signInWithEmailAndPassword(auth, email, password);
    const user = mapUser(result.user);
    if (!user) throw new Error("Login failed to retrieve user details");
    return user;
  },

  signup: async (email: string, password: string): Promise<User> => {
    const result = await createUserWithEmailAndPassword(auth, email, password);
    const user = mapUser(result.user);
    if (!user) throw new Error("Signup failed to retrieve user details");
    return user;
  },

  logout: async (): Promise<void> => {
    await signOut(auth);
  }
};
