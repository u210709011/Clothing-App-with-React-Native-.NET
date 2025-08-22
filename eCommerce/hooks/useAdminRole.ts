import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { getFirebaseAuth } from '@/services/firebase';

export const useAdminRole = () => {
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [checked, setChecked] = useState<boolean>(false);

  useEffect(() => {
    const auth = getFirebaseAuth();


    // INFO: CHECK ADMIN ROLE
    (async () => {
      try {
        const u = auth.currentUser;
        if (!u) {
          setIsAdmin(false);
          setChecked(true);
          return;
        }
        const token = await u.getIdTokenResult(true);
        const role = (token?.claims as any)?.role as string | undefined;
        setIsAdmin(role === 'Admin');
        setChecked(true);
      } catch {
        setIsAdmin(false);
        setChecked(true);
      }
    })();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      try {
        if (!user) {
          setIsAdmin(false);
          setChecked(true);
          return;
        }
        const token = await user.getIdTokenResult(true);
        const role = (token?.claims as any)?.role as string | undefined;
        setIsAdmin(role === 'Admin');
        setChecked(true);
      } catch {
        setIsAdmin(false);
        setChecked(true);
      }
    });

    return () => unsubscribe();
  }, []);

  return { isAdmin, checked };
};


