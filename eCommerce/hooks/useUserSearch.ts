import { useCallback, useEffect, useState } from 'react';
import { AdminUser, getAdminUsers } from '@/services/admin';
import { AppError } from '@/types/ui';

interface UseUserSearchReturn {
  query: string;
  setQuery: (q: string) => void;
  users: AdminUser[];
  loading: boolean;
  hasMore: boolean;
  refresh: () => void;
  loadMore: () => void;
  error: AppError | null;
}

export function useUserSearch({ pageSize = 20 }: { pageSize?: number } = {}): UseUserSearchReturn {
  const [query, setQuery] = useState('');
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<AppError | null>(null);
  const [page, setPage] = useState(1);
  const [all, setAll] = useState<AdminUser[] | null>(null);

  const fetchAll = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const list = await getAdminUsers(500);
      setAll(list);
      const initial = list.slice(0, pageSize);
      setUsers(initial);
      setHasMore(list.length > initial.length);
      setPage(1);
    } catch (e) {
      setError({ name: 'Failed to fetch users', message: 'Failed to fetch users', code: 'FETCH_ERROR' });
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const recompute = useCallback((reset = false, explicitPage?: number) => {
    if (!all) return;
    const term = query.trim().toLowerCase();
    const filtered = term
      ? all.filter(u =>
          (u.displayName || '').toLowerCase().includes(term) ||
          (u.email || '').toLowerCase().includes(term) ||
          (u.role || '').toLowerCase().includes(term)
        )
      : all;
    const nextPage = explicitPage ?? (reset ? 1 : page);
    const start = (nextPage - 1) * pageSize;
    const end = start + pageSize;
    const pageItems = filtered.slice(start, end);
    setUsers(prev => (reset ? pageItems : [...prev, ...pageItems]));
    setHasMore(end < filtered.length);
    if (reset) setPage(1); else setPage(nextPage);
  }, [all, query, page, pageSize]);

  useEffect(() => {
    const id = setTimeout(() => {
      recompute(true, 1);
    }, 650);
    return () => clearTimeout(id);
  }, [query, recompute]);

  useEffect(() => {
    if (!all) return;
    recompute(true, 1);
  }, [all, recompute]);

  const refresh = useCallback(() => {
    setPage(1);
    fetchAll();
  }, [fetchAll]);

  const loadMore = useCallback(() => {
    if (!hasMore || loading) return;
    const next = page + 1;
    recompute(false, next);
  }, [hasMore, loading, page, recompute]);

  return { query, setQuery, users, loading, hasMore, refresh, loadMore, error };
}


