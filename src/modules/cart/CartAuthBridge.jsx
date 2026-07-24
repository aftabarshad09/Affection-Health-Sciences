import { useCartAuthSync } from './useCartAuthSync';

// Invisible — just wires cart/auth synchronization for the whole subtree.
export default function CartAuthBridge() {
  useCartAuthSync();
  return null;
}
