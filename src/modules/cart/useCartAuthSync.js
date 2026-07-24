import { useEffect, useRef } from 'react';
import { useCustomerAuth } from '../auth/CustomerAuthContext';
import { useCartStore } from './cartStore';

// Bridges auth state -> cart state without coupling the two modules
// directly: on login, whatever was in the guest (localStorage) cart gets
// merged into the user's DB cart; on logout, the in-memory cart resets so a
// shared device doesn't show the previous account's items to the next guest.
export function useCartAuthSync() {
  const { isAuthenticated, loading } = useCustomerAuth();
  const wasAuthenticated = useRef(false);

  useEffect(() => {
    if (loading) return;
    if (isAuthenticated && !wasAuthenticated.current) {
      useCartStore.getState().mergeGuestCartIntoServer();
    } else if (!isAuthenticated && wasAuthenticated.current) {
      useCartStore.getState().resetToGuest();
    }
    wasAuthenticated.current = isAuthenticated;
  }, [isAuthenticated, loading]);
}
