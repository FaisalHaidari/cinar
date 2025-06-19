"use client";
import { createContext, useContext, useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';

const AppContext = createContext({});

export default function AppProvider({ children }) {
  const [userName, setUserName] = useState('');
  const [cartCount, setCartCount] = useState(0);
  const [newOrdersCount, setNewOrdersCount] = useState(0);
  const { data: session, status } = useSession();

  useEffect(() => {
    if (status === 'authenticated') {
      let name = session?.user?.name;
      if (name && name.trim() !== '') {
        setUserName(name);
      } else {
        const email = session?.user?.email || '';
        const fallback = email.includes('@') ? email.split('@')[0] : '';
        setUserName(fallback);
      }
    } else {
      setUserName('');
    }
  }, [session, status]);

  return (
    <AppContext.Provider value={{
      userName,
      setUserName,
      cartCount,
      setCartCount,
      newOrdersCount,
      setNewOrdersCount,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export const useUser = () => {
  const context = useContext(AppContext);
  return {
    userName: context.userName,
    setUserName: context.setUserName,
  };
};

export const useCartCount = () => {
  const context = useContext(AppContext);
  return {
    cartCount: context.cartCount,
    setCartCount: context.setCartCount,
  };
};

export const useNewOrders = () => {
  const context = useContext(AppContext);
  return {
    newOrdersCount: context.newOrdersCount,
    setNewOrdersCount: context.setNewOrdersCount,
  };
};

// Cart items context for showing actual items in cart page
const CartItemsContext = createContext();

export function CartItemsProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const { setCartCount } = useContext(AppContext); // Get setCartCount from AppContext

  // Helper to update cartCount
  const updateCartTotalCount = (currentItems) => {
    const totalCount = currentItems.reduce((sum, item) => sum + (item.quantity || 0), 0);
    setCartCount(totalCount);
  };

  function addItem(item) {
    setCartItems(prev => {
      const idx = prev.findIndex(i => i.name === item.name);
      let updatedItems;
      if (idx > -1) {
        updatedItems = prev.map((i, index) =>
          index === idx ? { ...i, quantity: (i.quantity || 1) + 1 } : i
        );
      } else {
        updatedItems = [...prev, { ...item, quantity: 1 }];
      }
      updateCartTotalCount(updatedItems);
      return updatedItems;
    });
  }

  function removeItem(index) {
    setCartItems(prev => {
      const updatedItems = prev.filter((_, i) => i !== index);
      updateCartTotalCount(updatedItems);
      return updatedItems;
    });
  }

  function increaseQuantity(index) {
    setCartItems(prev => {
      const updatedItems = prev.map((item, i) =>
        i === index ? { ...item, quantity: (item.quantity || 1) + 1 } : item
      );
      updateCartTotalCount(updatedItems);
      return updatedItems;
    });
  }

  function decreaseQuantity(index) {
    setCartItems(prev => {
      const updatedItems = prev.map((item, i) => {
        if (i === index) {
          const newQty = (item.quantity || 1) - 1;
          return newQty > 0 ? { ...item, quantity: newQty } : item;
        }
        return item;
      }).filter((item, i) => (i !== index || (item.quantity && item.quantity > 0)));
      updateCartTotalCount(updatedItems);
      return updatedItems;
    });
  }

  function clearCart() {
    setCartItems([]);
    setCartCount(0);
  }

  return (
    <CartItemsContext.Provider value={{ cartItems, addItem, removeItem, increaseQuantity, decreaseQuantity, clearCart }}>
      {children}
    </CartItemsContext.Provider>
  );
}

export function useCartItems() {
  return useContext(CartItemsContext);
}