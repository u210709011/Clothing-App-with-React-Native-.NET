import '@/services/firebase';
import { useFonts } from 'expo-font';
import { router, Stack } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useEffect, useState } from 'react';
import 'react-native-reanimated';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ActivityIndicator, AppState, Platform, Text, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { usePathname } from 'expo-router';

import { AuthProvider } from '@/auth/providers/AuthProvider';

import { apiGet } from '@/services/api';

import { setApiBaseUrl, clearApiBaseUrl } from '@/config/api';

import Input from '@/components/atoms/Input';
import Button from '@/components/atoms/Button';

import { DISABLE_BACKEND_GUARD, USE_NGROK } from '@/config/environment';


import { Colors } from '@/constants/Colors';




SplashScreen.preventAutoHideAsync();


export default function RootLayout() {

  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
    InterRegular: require('../assets/fonts/Inter-Regular.otf'),
    InterBold: require('../assets/fonts/Inter-Bold.otf'),
    InterSemiBold: require('../assets/fonts/Inter-SemiBold.otf'),
    MaterialIcons: require('@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/MaterialIcons.ttf'),
    Ionicons: require('@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/Ionicons.ttf'),
    Feather: require('@expo/vector-icons/build/vendor/react-native-vector-icons/Fonts/Feather.ttf'),
  });

  const [backendReady, setBackendReady] = useState(false);
  const [apiUrl, setApiUrl] = useState<string>('');
  const [apiConfigured, setApiConfigured] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);

  const [checkingBackend, setCheckingBackend] = useState(true);

  const [serviceOnline, setServiceOnline] = useState<boolean>(true);

  const [showConnectedBanner, setShowConnectedBanner] = useState<boolean>(false);
  
  const pathname = usePathname();



  useEffect(() => {
    (async () => {
      if (USE_NGROK) {
        await clearApiBaseUrl();
        setApiUrl('');
        setApiConfigured(false);
      } else {
        setApiConfigured(true);
      }
      setCheckingBackend(false);
    })();
  }, []);

  const checkBackend = async () => {
    if (!apiConfigured) return; 
    if (DISABLE_BACKEND_GUARD) {
      setBackendReady(true);
      setServiceOnline(true);
      setCheckingBackend(false);
      return;
    }
    setCheckingBackend(true);
    try {
      const res = await apiGet<string>('/health', undefined, { timeoutMs: 5000 });
      if (res && typeof res === 'string') {
        setBackendReady(true);
        setServiceOnline(true);
      } else {
        setServiceOnline(false);
      }
    } catch (e: any) {
      setServiceOnline(false);
    } finally {
      setCheckingBackend(false);
    }
  };

  const pingBackend = async () => {
    if (DISABLE_BACKEND_GUARD) return;
    try {
      const res = await apiGet<string>('/health', undefined, { timeoutMs: 4000 });
      setServiceOnline(prev => {
        const nowOnline = !!res;
        if (!prev && nowOnline) {
          setShowConnectedBanner(true);
          setTimeout(() => setShowConnectedBanner(false), 1800);
        }
        return nowOnline;
      });
    } catch {
      setServiceOnline(false);
    }
  };


  useEffect(() => {
    if (loaded) {
      checkBackend();
    }
  }, [loaded]);

  useEffect(() => {
    if (loaded && (!apiConfigured || !checkingBackend)) {
      SplashScreen.hideAsync();
    }
  }, [loaded, checkingBackend, apiConfigured]);

  useEffect(() => {
    if (!backendReady || DISABLE_BACKEND_GUARD) return;
    const sub = AppState.addEventListener('change', (state) => {
      if (state === 'active') {
        pingBackend();
      }
    });
    const intervalId = setInterval(() => {
      pingBackend();
    }, 30000);
    return () => {
      sub.remove();
      clearInterval(intervalId);
    };
  }, [backendReady]);

  useEffect(() => {
    if (!backendReady || DISABLE_BACKEND_GUARD) return;
    pingBackend();
  }, [pathname, backendReady]);

  if (!loaded) {
    return null;
  }

  if (USE_NGROK && !apiConfigured) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
            <Input
              label="API Base URL"
              value={apiUrl}
              onChangeText={setApiUrl}
              placeholder="https://abcd123.ngrok.io"
              keyboardType="url"
              autoCapitalize={'none'}
            />
            {apiError && <Text style={{ color: 'red', marginTop: 8 }}>{apiError}</Text>}
            <Button
              title="Save & Continue"
              onPress={async () => {
                try {
                  if (!apiUrl) throw new Error('Please enter a valid URL');
                  await setApiBaseUrl(apiUrl);
                  setApiConfigured(true);
                  setApiError(null);
                  checkBackend();
                } catch (e: any) {
                  setApiError(e?.message || 'Failed to save URL');
                }
              }}
              style={{ marginTop: 12 }}
            />
          </View>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    );
  }

  if (!backendReady && !DISABLE_BACKEND_GUARD && USE_NGROK) {
    return (
      <GestureHandlerRootView style={{ flex: 1 }}>
        <SafeAreaProvider>
          <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24 }}>
            {checkingBackend ? (
              <>
                <ActivityIndicator size="large" color={Colors.tabIconSelected} />
                <Text style={{ marginTop: 12 }}>Connecting to server…</Text>
              </>
            ) : (
              <>
                <Text style={{ textAlign: 'center', marginBottom: 12 }}>Cannot reach the server.</Text>
                <View style={{ flexDirection: 'row', gap: 12 }}>
                  <Button title="Retry" onPress={checkBackend} />
                  <Button title="Change URL" onPress={async () => { setApiConfigured(false); await clearApiBaseUrl(); setBackendReady(false); }} />
                </View>
              </>
            )}
          </View>
        </SafeAreaProvider>
      </GestureHandlerRootView>
    );
  }

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider>
        <AuthProvider>
          {(!DISABLE_BACKEND_GUARD && (!serviceOnline || showConnectedBanner)) && (
            <View pointerEvents="none" style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 9999 }}>
              <SafeAreaView edges={['top']}>
                <View style={{ backgroundColor: serviceOnline ? '#1b5e20' : '#b00020' }}>
                  <View style={{ paddingVertical: 8, paddingHorizontal: 12 }}>
                    <Text style={{ color: 'white', fontWeight: '600', textAlign: 'center' }}>
                      {serviceOnline ? 'Connected' : 'Connection lost'}
                    </Text>
                  </View>
                </View>
              </SafeAreaView>
            </View>
          )}
          <Stack>
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
            <Stack.Screen name="+not-found" />
          </Stack>
        </AuthProvider>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
}
