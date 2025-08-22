import { TouchableOpacity } from 'react-native';

/**
 *  vibed
 */

export interface TouchEvent {
  nativeEvent: {
    locationX: number;
    locationY: number;
    pageX: number;
    pageY: number;
    target: number;
    timestamp: number;
  };
  currentTarget: number;
  target: number;
  bubbles?: boolean;
  cancelable?: boolean;
  defaultPrevented?: boolean;
  eventPhase?: number;
  isTrusted?: boolean;
  preventDefault: () => void;
  stopPropagation: () => void;
  timeStamp: number;
  type: string;
}

// INFO: Promo banner interface
export interface PromoBanner {
  id: string;
  title: string;
  subtitle: string;
  discount?: string;
  imageUrl: string;
  backgroundColor: string;
  targetUrl?: string;
}

// INFO: Navigation section types
export type NavigationSection = 
  | 'new-items' 
  | 'flash-sale' 
  | 'popular' 
  | 'recommended' 
  | 'trending';

// INFO: Error with context for better error handling
export interface AppError extends Error {
  code?: string;
  context?: string;
  timestamp?: Date;
}

// INFO: Loading states for consistent UI feedback
export interface LoadingState {
  isLoading: boolean;
  error?: AppError | null;
  lastUpdated?: Date;
}

// INFO: Refresh control state
export interface RefreshState {
  refreshing: boolean;
  onRefresh: () => void | Promise<void>;
}
