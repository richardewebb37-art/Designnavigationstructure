import { logger, LogCategory } from './logger';

// Global error handler setup
export function setupGlobalErrorHandlers() {
  // Handle unhandled promise rejections
  window.addEventListener('unhandledrejection', (event) => {
    logger.error(LogCategory.ERROR, 'Unhandled promise rejection', {
      reason: event.reason,
      promise: event.promise,
    });
    
    console.error('🚨 Unhandled Promise Rejection:', event.reason);
    
    // Prevent default handling
    event.preventDefault();
  });

  // Handle general errors
  window.addEventListener('error', (event) => {
    logger.error(LogCategory.ERROR, 'Unhandled error', {
      message: event.message,
      filename: event.filename,
      lineno: event.lineno,
      colno: event.colno,
      error: event.error,
    });
    
    console.error('🚨 Unhandled Error:', {
      message: event.message,
      source: event.filename,
      line: event.lineno,
      column: event.colno,
      error: event.error,
    });
  });

  // Log when the page is loaded
  window.addEventListener('load', () => {
    logger.info(LogCategory.APP, 'Page fully loaded');
    console.log('✅ Page loaded successfully');
  });

  // Detect network connectivity issues
  window.addEventListener('online', () => {
    logger.info(LogCategory.NETWORK, 'Network connection restored');
    console.log('🌐 Network: ONLINE');
  });

  window.addEventListener('offline', () => {
    logger.warn(LogCategory.NETWORK, 'Network connection lost');
    console.warn('🔌 Network: OFFLINE');
  });

  // Log initial network status
  if (navigator.onLine) {
    logger.info(LogCategory.NETWORK, 'Initial network status: ONLINE');
  } else {
    logger.warn(LogCategory.NETWORK, 'Initial network status: OFFLINE');
  }

  console.log('✅ Global error handlers initialized');
}

// Enhanced error wrapper for async functions
export async function withErrorHandling<T>(
  fn: () => Promise<T>,
  context: string
): Promise<T | null> {
  try {
    logger.debug(LogCategory.API, `Starting: ${context}`);
    const result = await fn();
    logger.debug(LogCategory.API, `Completed: ${context}`);
    return result;
  } catch (error: any) {
    logger.error(LogCategory.ERROR, `Error in ${context}`, error);
    
    // Log detailed error info
    if (error instanceof TypeError && error.message.includes('fetch')) {
      logger.error(LogCategory.NETWORK, 'Network fetch error', {
        context,
        error: error.message,
        online: navigator.onLine,
      });
      console.error(`🌐 Network Error in ${context}:`, error);
    } else {
      console.error(`❌ Error in ${context}:`, error);
    }
    
    return null;
  }
}

// Retry wrapper for flaky operations
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: {
    maxRetries?: number;
    delay?: number;
    context?: string;
  } = {}
): Promise<T | null> {
  const { maxRetries = 3, delay = 1000, context = 'operation' } = options;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      logger.debug(LogCategory.API, `Attempt ${attempt}/${maxRetries}: ${context}`);
      const result = await fn();
      if (attempt > 1) {
        logger.info(LogCategory.API, `Success on attempt ${attempt}: ${context}`);
      }
      return result;
    } catch (error: any) {
      logger.warn(LogCategory.API, `Attempt ${attempt} failed: ${context}`, error);
      
      if (attempt === maxRetries) {
        logger.error(LogCategory.ERROR, `All ${maxRetries} attempts failed: ${context}`, error);
        return null;
      }
      
      // Wait before retrying
      await new Promise(resolve => setTimeout(resolve, delay * attempt));
    }
  }
  
  return null;
}

// Check if error is a network error
export function isNetworkError(error: any): boolean {
  return (
    error instanceof TypeError &&
    (error.message.includes('fetch') ||
      error.message.includes('NetworkError') ||
      error.message.includes('Failed to fetch'))
  );
}

// Format error for display
export function formatErrorMessage(error: any): string {
  if (typeof error === 'string') {
    return error;
  }
  
  if (error instanceof Error) {
    return error.message;
  }
  
  if (error?.message) {
    return error.message;
  }
  
  return 'An unknown error occurred';
}

// Safe localStorage operations
export const safeLocalStorage = {
  getItem(key: string): string | null {
    try {
      return localStorage.getItem(key);
    } catch (error) {
      logger.error(LogCategory.STORAGE, `Failed to get item from localStorage: ${key}`, error);
      return null;
    }
  },
  
  setItem(key: string, value: string): boolean {
    try {
      localStorage.setItem(key, value);
      return true;
    } catch (error) {
      logger.error(LogCategory.STORAGE, `Failed to set item in localStorage: ${key}`, error);
      return false;
    }
  },
  
  removeItem(key: string): boolean {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (error) {
      logger.error(LogCategory.STORAGE, `Failed to remove item from localStorage: ${key}`, error);
      return false;
    }
  },
  
  clear(): boolean {
    try {
      localStorage.clear();
      return true;
    } catch (error) {
      logger.error(LogCategory.STORAGE, 'Failed to clear localStorage', error);
      return false;
    }
  },
};
