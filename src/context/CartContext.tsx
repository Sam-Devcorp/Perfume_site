import { createContext, useContext, useState, ReactNode } from 'react';
import type { CartItem, Perfume } from '../types';
import { toFcfaInteger } from '../lib/currency';

interface CartContextType {
  cart: CartItem[];
  addToCart: (perfume: Perfume, quantity?: number) => void;
  addBouquetToCart: (perfumes: Perfume[], giftMessage?: string, quantity?: number, isGift?: boolean) => void;
  removeFromCart: (itemId: string) => void;
  updateQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getCartTotal: () => number;
  getCartItemsCount: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>([]);

  const createCartItemId = () => {
    return `ci-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
  };

  const addToCart = (perfume: Perfume, quantity: number = 1) => {
    if (quantity <= 0) return;

    setCart((prevCart) => {
      const existingItem = prevCart.find(
        (item) => item.type === 'perfume' && item.perfume.id === perfume.id
      );

      if (existingItem) {
        return prevCart.map((item) =>
          item.type === 'perfume' && item.perfume.id === perfume.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      return [
        ...prevCart,
        { id: createCartItemId(), type: 'perfume', perfume, quantity },
      ];
    });
  };

  const addBouquetToCart = (
    perfumes: Perfume[],
    giftMessage: string = '',
    quantity: number = 1,
    isGift: boolean = true
  ) => {
    if (perfumes.length === 0 || quantity <= 0) return;

    const groupedByPerfume = perfumes.reduce<Record<string, { perfume: Perfume; quantity: number }>>(
      (acc, perfume) => {
        if (!acc[perfume.id]) {
          acc[perfume.id] = { perfume, quantity: 0 };
        }
        acc[perfume.id].quantity += 1;
        return acc;
      },
      {}
    );

    const bouquetItems = Object.values(groupedByPerfume).sort((a, b) =>
      a.perfume.id.localeCompare(b.perfume.id)
    );
    const trimmedGiftMessage = giftMessage.trim();
    const normalizedGiftMessage = isGift ? trimmedGiftMessage : '';
    const bouquetKey = bouquetItems
      .map((item) => `${item.perfume.id}:${item.quantity}`)
      .join('|');

    setCart((prevCart) => {
      const existingBouquet = prevCart.find((item) => {
        if (item.type !== 'bouquet') return false;
        const itemKey = item.items
          .slice()
          .sort((a, b) => a.perfume.id.localeCompare(b.perfume.id))
          .map((bouquetItem) => `${bouquetItem.perfume.id}:${bouquetItem.quantity}`)
          .join('|');

        return (
          itemKey === bouquetKey &&
          (item.giftMessage || '') === normalizedGiftMessage &&
          item.isGift === isGift
        );
      });

      if (existingBouquet) {
        return prevCart.map((item) =>
          item.id === existingBouquet.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }

      return [
        ...prevCart,
        {
          id: createCartItemId(),
          type: 'bouquet',
          items: bouquetItems,
          quantity,
          isGift,
          giftMessage: normalizedGiftMessage,
        },
      ];
    });
  };

  const removeFromCart = (itemId: string) => {
    setCart((prevCart) => prevCart.filter((item) => item.id !== itemId));
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(itemId);
      return;
    }

    setCart((prevCart) =>
      prevCart.map((item) =>
        item.id === itemId ? { ...item, quantity } : item
      )
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const getCartTotal = () => {
    return cart.reduce((total, item) => {
      if (item.type === 'perfume') {
        return total + toFcfaInteger(item.perfume.price) * item.quantity;
      }

      const bouquetUnitPrice = item.items.reduce(
        (bouquetTotal, bouquetItem) =>
          bouquetTotal + toFcfaInteger(bouquetItem.perfume.price) * bouquetItem.quantity,
        0
      );

      return total + bouquetUnitPrice * item.quantity;
    }, 0);
  };

  const getCartItemsCount = () => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        addBouquetToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getCartTotal,
        getCartItemsCount,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
