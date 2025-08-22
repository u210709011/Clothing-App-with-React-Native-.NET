import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';
import { EMULATOR, USE_NGROK } from './environment';

const STORAGE_KEY = 'apiBaseUrl';

const androidIP = '10.0.2.2';

const localIp = '192.168.1.107';

const localHost = 'localhost';

let memoizedBaseUrl: string | null = null;

export async function setApiBaseUrl(url: string): Promise<void> {
  const withProtocol = url.startsWith('http') ? url + "/api/v1" : `https://${url}/api/v1`;
  const cleaned = withProtocol.replace(/\/$/, '');
  await AsyncStorage.setItem(STORAGE_KEY, cleaned);
  memoizedBaseUrl = cleaned;
}

export async function getApiBaseUrl(): Promise<string | null> {
  if(!USE_NGROK) {
    return resolveDefaultBaseUrl();
  }
  if (memoizedBaseUrl) return memoizedBaseUrl;
  const v = await AsyncStorage.getItem(STORAGE_KEY);
  if (!v) {
    memoizedBaseUrl = null;
    return null;
  }
  memoizedBaseUrl = v;
  return v;
}

export function clearApiBaseUrl(): Promise<void> {
  memoizedBaseUrl = null;
  return AsyncStorage.removeItem(STORAGE_KEY);
}

function resolveDefaultBaseUrl(): string | null {

  let baseIp: string = "";
  if (USE_NGROK) return null;
  if (Platform.OS === 'android') {
    baseIp = EMULATOR ? androidIP : localIp;
  }
  if (Platform.OS === 'web') {
    baseIp = localHost;
  }
  if (Platform.OS === 'ios') {
    baseIp = localIp;
  }
  return `http://${baseIp}:5186/api/v1`;
}

export const DEFAULT_API_BASE_URL: string | null = resolveDefaultBaseUrl();