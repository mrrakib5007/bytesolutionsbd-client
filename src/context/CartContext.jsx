"use client";

import { createContext, useContext, useState, useEffect } from "react";
import toast from "react-hot-toast";

const CartContext = createContext(null);

const CART_STORAGE_KEY = "slh_cart_items";

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load cart from localStorage on client mount
  useEffect(() => {
    let active = true;
    Promise.resolve().then(() => {
      if (!active) return;
      try {
        const stored =
          typeof window !== "undefined"
            ? localStorage.getItem(CART_STORAGE_KEY)
            : null;
        if (stored) {
          setCartItems(JSON.parse(stored));
        }
      } catch (err) {
        console.error("Failed to parse cart items from localStorage:", err);
      } finally {
        if (active) setIsHydrated(true);
      }
    });

    return () => {
      active = false;
    };
  }, []);

  // Save to localStorage whenever cart changes (after hydration)
  const saveCart = (items) => {
    setCartItems(items);
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (err) {
      console.error("Failed to save cart items to localStorage:", err);
    }
  };

  /**
   * Add item to cart
   */
  const addToCart = (product, variant, quantity = 1) => {
    if (!product || !product._id) return;

    const selectedVariant = variant || product.variants?.[0] || {
      id: 1,
      duration: "Standard",
      price: 0,
      originalPrice: null,
    };

    const variantId = selectedVariant.id || 1;
    const duration = selectedVariant.duration || "Standard";
    const itemKey = `${product._id}_${variantId}_${duration}`;

    const existingIndex = cartItems.findIndex((item) => item.key === itemKey);
    let updated;

    if (existingIndex > -1) {
      updated = [...cartItems];
      updated[existingIndex] = {
        ...updated[existingIndex],
        quantity: updated[existingIndex].quantity + quantity,
      };
    } else {
      const newItem = {
        key: itemKey,
        productId: product._id,
        title: product.title,
        slug: product.slug,
        image: product.image,
        variantId,
        duration,
        price: Number(selectedVariant.price) || 0,
        originalPrice: selectedVariant.originalPrice ? Number(selectedVariant.originalPrice) : null,
        quantity: Math.max(1, quantity),
      };
      updated = [...cartItems, newItem];
    }

    saveCart(updated);
    toast.success(`${product.title} (${duration}) added to cart!`);
  };

  /**
   * Remove item by key
   */
  const removeFromCart = (key) => {
    const updated = cartItems.filter((item) => item.key !== key);
    saveCart(updated);
    toast.success("Item removed from cart");
  };

  /**
   * Update quantity
   */
  const updateQuantity = (key, qty) => {
    const cleanQty = Math.max(1, parseInt(qty, 10) || 1);
    const updated = cartItems.map((item) => {
      if (item.key === key) {
        return { ...item, quantity: cleanQty };
      }
      return item;
    });
    saveCart(updated);
  };

  /**
   * Clear all items
   */
  const clearCart = () => {
    saveCart([]);
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
    } catch (err) {
      console.error(err);
    }
  };

  const totalCount = cartItems.reduce((acc, item) => acc + item.quantity, 0);
  const subtotal = cartItems.reduce(
    (acc, item) => acc + (Number(item.price) || 0) * item.quantity,
    0
  );

  return (
    <CartContext.Provider
      value={{
        cartItems: isHydrated ? cartItems : [],
        isCartOpen,
        setIsCartOpen,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        totalCount: isHydrated ? totalCount : 0,
        subtotal: isHydrated ? subtotal : 0,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}
