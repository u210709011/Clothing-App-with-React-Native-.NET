import { useEffect } from 'react';
import { router } from 'expo-router';

export default function RootIndex() {
  useEffect(() => {
    router.replace('/(tabs)/home');
  }, []);

  return null;
}
