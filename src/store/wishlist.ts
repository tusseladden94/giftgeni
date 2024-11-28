import { atom } from 'nanostores';

// Initialize wishlist from localStorage or empty array
const initialWishlist = typeof localStorage !== 'undefined' 
  ? JSON.parse(localStorage.getItem('wishlist') || '[]')
  : [];

export const wishlistStore = atom<number[]>(initialWishlist);

// Save to localStorage whenever wishlist changes
if (typeof window !== 'undefined') {
  wishlistStore.subscribe((wishlist) => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist));
  });
}

export function toggleWishlist(productId: number) {
  const currentWishlist = wishlistStore.get();
  if (currentWishlist.includes(productId)) {
    wishlistStore.set(currentWishlist.filter(id => id !== productId));
  } else {
    wishlistStore.set([...currentWishlist, productId]);
  }
}