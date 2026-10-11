import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { useAuth } from './AuthContext';
import api from '../api/axios';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const { user, isAuthenticated, loading: authLoading } = useAuth();

  // Helper to get storage key based on authenticated user ID
  const getStorageKey = (currentUser) => {
    return currentUser?._id ? `shopease_cart_${currentUser._id}` : 'shopease_cart_guest';
  };

  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const prevUserRef = useRef(null);

  // Sync / Load cart on user change (Login, Logout, Initial Load)
  useEffect(() => {
    if (authLoading) return;

    const currentUserId = user?._id || null;
    const prevUserId = prevUserRef.current;

    // Reset items on user switch
    if (currentUserId !== prevUserId) {
      prevUserRef.current = currentUserId;

      if (isAuthenticated && user?._id) {
        // Logged in: Sync any existing guest items into database, then load user's DB cart
        const guestStorage = localStorage.getItem('shopease_cart_guest');
        let guestItems = [];
        try {
          guestItems = guestStorage ? JSON.parse(guestStorage) : [];
        } catch (e) {
          guestItems = [];
        }

        const loadUserCart = async () => {
          setLoading(true);
          try {
            if (guestItems.length > 0) {
              // Sync guest items to DB cart and clear guest storage
              await api.post('/cart/sync', { items: guestItems });
              localStorage.removeItem('shopease_cart_guest');
            }

            const { data } = await api.get('/cart');
            if (data && data.items) {
              setItems(data.items);
              localStorage.setItem(getStorageKey(user), JSON.stringify(data.items));
            }
          } catch (err) {
            console.warn('Failed to fetch user cart from backend, using local cache:', err);
            const cached = localStorage.getItem(getStorageKey(user));
            setItems(cached ? JSON.parse(cached) : []);
          } finally {
            setLoading(false);
          }
        };

        loadUserCart();
      } else {
        // Guest user: Load only guest cart
        const guestStorage = localStorage.getItem('shopease_cart_guest');
        try {
          setItems(guestStorage ? JSON.parse(guestStorage) : []);
        } catch (e) {
          setItems([]);
        }
        setLoading(false);
      }
    }
  }, [user, isAuthenticated, authLoading]);

  // Save to user-specific localStorage whenever items change
  useEffect(() => {
    if (!authLoading) {
      const key = getStorageKey(user);
      localStorage.setItem(key, JSON.stringify(items));
    }
  }, [items, user, authLoading]);

  const addToCart = async (product, quantity = 1) => {
    const qtyToAdd = parseInt(quantity, 10) || 1;
    const productId = product._id || product.product;

    // Optimistically update local state
    setItems((prevItems) => {
      const existingIndex = prevItems.findIndex(
        (item) => item.product === productId || item._id === productId
      );

      if (existingIndex > -1) {
        const updated = [...prevItems];
        const newQty = updated[existingIndex].qty + qtyToAdd;
        const maxStock = product.stock ?? updated[existingIndex].stock ?? 999;
        updated[existingIndex].qty = Math.min(newQty, maxStock);
        return updated;
      } else {
        return [
          ...prevItems,
          {
            product: productId,
            _id: productId,
            title: product.title,
            price: product.price,
            image: product.image,
            category: product.category,
            stock: product.stock,
            qty: Math.min(qtyToAdd, product.stock || 1),
          },
        ];
      }
    });

    // If authenticated, sync with backend database
    if (isAuthenticated) {
      try {
        const { data } = await api.post('/cart/add', {
          productId,
          qty: qtyToAdd,
        });
        if (data && data.items) {
          setItems(data.items);
        }
      } catch (err) {
        console.error('Failed to sync addToCart with backend:', err);
      }
    }
  };

  const removeFromCart = async (productId) => {
    setItems((prevItems) =>
      prevItems.filter(
        (item) => item.product !== productId && item._id !== productId
      )
    );

    if (isAuthenticated) {
      try {
        const { data } = await api.delete(`/cart/item/${productId}`);
        if (data && data.items) {
          setItems(data.items);
        }
      } catch (err) {
        console.error('Failed to sync removeFromCart with backend:', err);
      }
    }
  };

  const updateQty = async (productId, newQty) => {
    const qty = parseInt(newQty, 10);
    if (qty <= 0) {
      removeFromCart(productId);
      return;
    }

    setItems((prevItems) =>
      prevItems.map((item) => {
        if (item.product === productId || item._id === productId) {
          const maxStock = item.stock || 999;
          return {
            ...item,
            qty: Math.min(qty, maxStock),
          };
        }
        return item;
      })
    );

    if (isAuthenticated) {
      try {
        const { data } = await api.put('/cart/update', { productId, qty });
        if (data && data.items) {
          setItems(data.items);
        }
      } catch (err) {
        console.error('Failed to sync updateQty with backend:', err);
      }
    }
  };

  const clearCart = async () => {
    setItems([]);
    const key = getStorageKey(user);
    localStorage.removeItem(key);

    if (isAuthenticated) {
      try {
        await api.delete('/cart/clear');
      } catch (err) {
        console.error('Failed to sync clearCart with backend:', err);
      }
    }
  };

  const count = items.reduce((acc, item) => acc + (Number(item.qty) || 0), 0);

  const total = items.reduce(
    (acc, item) => acc + (Number(item.price) || 0) * (Number(item.qty) || 1),
    0
  );

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQty,
        clearCart,
        count,
        total: Math.round(total * 100) / 100,
        loading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
