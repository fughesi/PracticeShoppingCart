import { useContext, createContext, ReactNode, useState } from "react";
import { ShoppingCart } from "../components/ShoppingCart";
import {useLocalStorage } from "../hooks/useLocalStorage"

type ShoppingCartProviderProps = {
  children: ReactNode;
};

type CartItem = {
  id: number;
  quantity: number;
};

type ShoppingCartContext = {
  openCart: () => void;
  closeCart: () => void;
  getItemQuantity: (id: number) => number;
  increaseCartQuantity: (id: number) => void;
  decreaseCartQuantity: (id: number) => void;
  removeFromCart: (id: number) => void;
  cartQuantity: number;
  cartItems: CartItem[];
};

const ShoppingCartContext = createContext({} as ShoppingCartContext);

export function useShoppingCart() {
  return useContext(ShoppingCartContext);
}

export function ShoppingCartProvider({ children }: ShoppingCartProviderProps) {
  const [cartItems, setCartItems] = useLocalStorage<CartItem[]>("shopping-cart",[]);
  const [isOpen, setIsOpen] = useState(false);

  const cartQuantity = cartItems.reduce(
    (quantity, item) => item.quantity + quantity,
    0
  );
  const openCart = () => setIsOpen(true);
  const closeCart = () => setIsOpen(false);
  function getItemQuantity(id: number) {
    return cartItems.find((i) => i.id === id)?.quantity || 0;
  }
  function increaseCartQuantity(id: number) {
    setCartItems((i) => {
      if (i.find((x) => x.id === id) == null) {
        return [...i, { id, quantity: 1 }];
      } else {
        return i.map((y) => {
          if (y.id === id) {
            return { ...y, quantity: y.quantity + 1 };
          } else {
            return y;
          }
        });
      }
    });
  }
  function decreaseCartQuantity(id: number) {
    setCartItems((i) => {
      if (i.find((x) => x.id === id)?.quantity === 1) {
        return i.filter((x) => x.id !== id);
      } else {
        return i.map((y) => {
          if (y.id === id) {
            return { ...y, quantity: y.quantity - 1 };
          } else {
            return y;
          }
        });
      }
    });
  }
  function removeFromCart(id: number) {
    setCartItems((i) => {
      return i.filter((x) => x.id !== id);
    });
  }

  return (
    <ShoppingCartContext.Provider
      value={{
        getItemQuantity,
        increaseCartQuantity,
        decreaseCartQuantity,
        removeFromCart,
        openCart,
        closeCart,
        cartItems,
        cartQuantity,
      }}
    >
      {children}

      <ShoppingCart isOpen={isOpen} />
    </ShoppingCartContext.Provider>
  );
}
