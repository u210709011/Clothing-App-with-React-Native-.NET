import { AppError } from '@/types/ui';

/**
 * INFO: Centralized error handling utilities
 * Provides consistent error processing and logging
 */

export enum ErrorContext {
  PRODUCT_FETCH = 'product-fetch',
  CATEGORY_FETCH = 'category-fetch',
  FLASH_SALE_FETCH = 'flash-sale-fetch',
  CART_OPERATION = 'cart-operation',
  WISHLIST_OPERATION = 'wishlist-operation',
  USER_AUTH = 'user-auth',
  NETWORK = 'network',
  UNKNOWN = 'unknown',
}

export enum ErrorSeverity {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical',
}

export function createAppError(
  error: unknown,
  context: ErrorContext,
  severity: ErrorSeverity = ErrorSeverity.MEDIUM
): AppError {
  let appError: AppError;
  
  if (error instanceof Error) {
    appError = {
      ...error,
      context,
      timestamp: new Date(),
    };
  } else if (typeof error === 'string') {
    appError = {
      name: 'StringError',
      message: error,
      context,
      timestamp: new Date(),
    };
  } else {
    appError = {
      name: 'UnknownError',
      message: 'An unknown error occurred',
      context,
      timestamp: new Date(),
    };
  }
  
  logError(appError, severity);
  
  return appError;
}

function logError(error: AppError, severity: ErrorSeverity): void {
  const logMessage = `[${error.context}] ${error.message}`;
  
  switch (severity) {
    case ErrorSeverity.LOW:
      console.info('⚪', logMessage, error);
      break;
    case ErrorSeverity.MEDIUM:
      console.warn('🟡', logMessage, error);
      break;
    case ErrorSeverity.HIGH:
      console.error('🔴', logMessage, error);
      break;
    case ErrorSeverity.CRITICAL:
      console.error('🚨', logMessage, error);
      // TODO: Send to error reporting service in production
      break;
  }
}


export function getUserFriendlyMessage(error: AppError): string {
  const contextMessages: Record<ErrorContext, string> = {
    [ErrorContext.PRODUCT_FETCH]: 'Unable to load products. Please try again.',
    [ErrorContext.CATEGORY_FETCH]: 'Unable to load categories. Please try again.',
    [ErrorContext.FLASH_SALE_FETCH]: 'Unable to load flash sale items. Please try again.',
    [ErrorContext.CART_OPERATION]: 'Unable to update cart. Please try again.',
    [ErrorContext.WISHLIST_OPERATION]: 'Unable to update wishlist. Please try again.',
    [ErrorContext.USER_AUTH]: 'Authentication failed. Please sign in again.',
    [ErrorContext.NETWORK]: 'Network connection failed. Please check your internet.',
    [ErrorContext.UNKNOWN]: 'Something went wrong. Please try again.',
  };
  
  return contextMessages[error.context as ErrorContext] || contextMessages[ErrorContext.UNKNOWN];
}

export async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 1000
): Promise<T> {
  let lastError: AppError;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = createAppError(
        error,
        ErrorContext.UNKNOWN,
        attempt === maxRetries ? ErrorSeverity.HIGH : ErrorSeverity.LOW
      );
      
      if (attempt === maxRetries) {
        throw lastError;
      }
      
      await new Promise(resolve => setTimeout(resolve, delayMs * attempt));
    }
  }
  
  throw lastError!;
}


export async function safeAsync<T>(
  operation: () => Promise<T>,
  context: ErrorContext,
  fallback?: T
): Promise<{ data: T | undefined; error: AppError | null }> {
  try {
    const data = await operation();
    return { data, error: null };
  } catch (error) {
    const appError = createAppError(error, context);
    return { data: fallback, error: appError };
  }
}
