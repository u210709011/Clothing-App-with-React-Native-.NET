import { useEffect } from 'react';
import { router } from 'expo-router';

export default function RootIndex() {
  useEffect(() => {
    // Redirect to home tab immediately
    router.replace('/(tabs)/home');
  }, []);

  // Return null since we're redirecting immediately
  return null;
}
