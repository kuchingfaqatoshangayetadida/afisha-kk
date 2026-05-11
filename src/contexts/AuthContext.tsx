import React, { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc, setDoc, collection, query, getDocs, limit } from 'firebase/firestore';
import { auth, db } from '../lib/firebase';
import { AppUser } from '../types';

interface AuthContextType {
  user: AppUser | null;
  loading: boolean;
  isAdmin: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<AppUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      setLoading(true);
      try {
        if (firebaseUser) {
          const userDocRef = doc(db, 'users', firebaseUser.uid);
          const userSnap = await getDoc(userDocRef);
          
          if (userSnap.exists()) {
            setUser({ uid: firebaseUser.uid, ...userSnap.data() } as AppUser);
          } else {
            // Check if this is the first user in the system to bootstrap admin
            const usersRef = collection(db, 'users');
            const firstUserQuery = query(usersRef, limit(1));
            const usersSnap = await getDocs(firstUserQuery);
            const isFirstUser = usersSnap.empty;

            const userData: Omit<AppUser, 'uid'> = {
              name: firebaseUser.displayName,
              displayName: firebaseUser.displayName,
              email: firebaseUser.email,
              role: isFirstUser ? 'admin' : 'user',
              favoriteEvents: [],
              createdAt: new Date()
            };

            await setDoc(userDocRef, userData);
            setUser({ uid: firebaseUser.uid, ...userData } as AppUser);
          }
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Auth initialization error:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, isAdmin: user?.role === 'admin' }}>
      {!loading ? children : (
        <div className="min-h-screen flex items-center justify-center bg-neutral-950">
          <div className="flex flex-col items-center gap-4">
            <div className="w-12 h-12 border-4 border-brand-amber border-t-transparent rounded-full animate-spin" />
            <p className="text-neutral-500 font-bold uppercase tracking-[0.2em] text-xs">Initializing Atmosphere...</p>
          </div>
        </div>
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) throw new Error('useAuth must be used within AuthProvider');
  return context;
};
