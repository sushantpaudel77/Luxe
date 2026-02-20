import { createSlice } from '@reduxjs/toolkit';

const loadCart = () => {
  try {
    const saved = localStorage.getItem('luxe_cart');
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const saveCart = (items) => {
  localStorage.setItem('luxe_cart', JSON.stringify(items));
};

const cartSlice = createSlice({
  name: 'cart',
  initialState: {
    items: loadCart(),
    isOpen: false,
  },
  reducers: {
    addToCart(state, action) {
      const existing = state.items.find(i => i.id === action.payload.id);
      if (existing) {
        existing.qty += 1;
      } else {
        state.items.push({ ...action.payload, qty: 1 });
      }
      saveCart(state.items);
    },
    removeFromCart(state, action) {
      state.items = state.items.filter(i => i.id !== action.payload);
      saveCart(state.items);
    },
    updateQty(state, action) {
      const { id, qty } = action.payload;
      const item = state.items.find(i => i.id === id);
      if (item) {
        if (qty <= 0) {
          state.items = state.items.filter(i => i.id !== id);
        } else {
          item.qty = qty;
        }
      }
      saveCart(state.items);
    },
    clearCart(state) {
      state.items = [];
      saveCart([]);
    },
    toggleCart(state) {
      state.isOpen = !state.isOpen;
    },
    closeCart(state) {
      state.isOpen = false;
    },
  },
});

export const { addToCart, removeFromCart, updateQty, clearCart, toggleCart, closeCart } = cartSlice.actions;
export default cartSlice.reducer;