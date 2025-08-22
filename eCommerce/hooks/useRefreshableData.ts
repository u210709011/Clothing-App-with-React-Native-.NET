import { useState, useCallback, useRef } from 'react';

interface RefreshableHook {
  refresh: () => Promise<void>;
}

interface UseRefreshableDataResult {
  refreshing: boolean;
  onRefresh: () => void;
}

/**
 * INFO: Helper hook to manage pull-to-refresh state for multiple data sources
 * Coordinates refreshing multiple hooks simultaneously
 */
export function useRefreshableData(
  ...refreshableHooks: RefreshableHook[]
): UseRefreshableDataResult {
  const [refreshing, setRefreshing] = useState(false);
  
  // INFO: Store hooks in ref to prevent dependency issues
  const hooksRef = useRef(refreshableHooks);
  hooksRef.current = refreshableHooks;

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      // INFO: Refresh all provided hooks in parallel
      await Promise.all(
        hooksRef.current.map(hook => hook.refresh())
      );
    } catch (error) {
      console.warn('Error during refresh:', error);
    } finally {
      setRefreshing(false);
    }
  }, []);

  return {
    refreshing,
    onRefresh,
  };
}
