import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "./AuthContext.jsx";

const CartContext = createContext(null);

function cartKeyFor(userId) {
  return `sagarfeeds_cart_${userId || "guest"}`;
}

function readCart(userId) {
  try {
    const raw = localStorage.getItem(cartKeyFor(userId));
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function CartProvider({ children }) {
  const { user } = useAuth();
  const userId = user?.id;
  const [items, setItems] = useState(() => readCart(userId));

  // Reload the cart whenever the logged-in user changes (each account keeps its own cart)
  useEffect(() => {
    Promise.resolve().then(() => setItems(readCart(userId)));
  }, [userId]);

  useEffect(() => {
    localStorage.setItem(cartKeyFor(userId), JSON.stringify(items));
  }, [items, userId]);

  const addItem = (product, quantity = 1) => {
    setItems((prev) => {
      const existing = prev.find((item) => item.productId === product.id);
      if (existing) {
        return prev.map((item) =>
          item.productId === product.id
            ? {
                ...item,
                name: product.name,
                category: product.category,
                stage: product.stage,
                image: product.image,
                imageUrl: product.image_url,
                price: Number(product.price),
                unit: product.unit,
                quantity: item.quantity + quantity,
              }
            : item
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          category: product.category,
          stage: product.stage,
          image: product.image,
          imageUrl: product.image_url,
          price: Number(product.price),
          unit: product.unit,
          quantity,
        },
      ];
    });
  };

  const updateQuantity = (productId, quantity) => {
    if (quantity <= 0) {
      removeItem(productId);
      return;
    }
    setItems((prev) =>
      prev.map((item) => (item.productId === productId ? { ...item, quantity } : item))
    );
  };

  const replaceItems = (nextItems) => {
    setItems(nextItems);
  };

  const removeItem = (productId) => {
    setItems((prev) => prev.filter((item) => item.productId !== productId));
  };

  const clearCart = () => setItems([]);

  const totalItems = useMemo(() => items.reduce((sum, item) => sum + item.quantity, 0), [items]);
  const totalAmount = useMemo(
    () => items.reduce((sum, item) => sum + item.quantity * item.price, 0),
    [items]
  );

  const value = {
    items,
    addItem,
    updateQuantity,
    replaceItems,
    removeItem,
    clearCart,
    totalItems,
    totalAmount,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}

export default CartContext;
