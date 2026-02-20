import { createSlice } from '@reduxjs/toolkit';

const loadWishlist = () => {
  try {
    const saved = localStorage.getItem('luxe_wishlist');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState: {
    items: loadWishlist(),
  },
  reducers: {
    toggleWishlist(state, action) {
      const idx = state.items.findIndex(i => i.id === action.payload.id);
      if (idx >= 0) {
        state.items.splice(idx, 1);
      } else {
        state.items.push(action.payload);
      }
      localStorage.setItem('luxe_wishlist', JSON.stringify(state.items));
    },
  },
});

export const { toggleWishlist } = wishlistSlice.actions;
export default wishlistSlice.reducer;