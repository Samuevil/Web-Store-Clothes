// frontend/src/Context/ShopContext.jsx
import React, { createContext, useState, useEffect, useCallback, useRef } from 'react';

export const ShopContext = createContext(null);

const ShopContextProvider = (props) => {
  const [allProducts, setAllProducts] = useState([]);
  const [cartItems, setCartItems] = useState({});
  const isMounted = useRef(true);

  const saveCartToLocalStorage = useCallback((cart) => {
    localStorage.setItem('cartItems', JSON.stringify(cart));
  }, []);

  // Carregar os itens do carrinho do localStorage ao inicializar
  useEffect(() => {
    const savedCartItems = localStorage.getItem('cartItems');
    if (savedCartItems) {
      setCartItems(JSON.parse(savedCartItems));
    }
  }, []);

  // Atualizar o localStorage sempre que o carrinho mudar
  useEffect(() => {
    saveCartToLocalStorage(cartItems);
  }, [cartItems, saveCartToLocalStorage]);

  const updateCartOnServer = async (url, requestBody) => {
    const authToken = localStorage.getItem('auth-token');
    if (authToken) {
      try {
        const response = await fetch(url, {
          method: 'POST',
          headers: {
            Accept: 'application/json',
            'auth-token': authToken,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(requestBody),
        });
        await response.text();
      } catch (_) {
        // Silencia erros
      }
    }
  };

  const addToCart = useCallback(async (itemId, size) => {
    setCartItems((prev) => {
      const updatedCart = { ...prev, [`${itemId}-${size}`]: (prev[`${itemId}-${size}`] || 0) + 1 };
      return updatedCart;
    });
    await updateCartOnServer('http://localhost:4000/addtocart', { itemId, size });
  }, []);

  const removeFromCart = useCallback(async (itemId, size) => {
    setCartItems((prev) => {
      const updatedCart = { ...prev, [`${itemId}-${size}`]: Math.max((prev[`${itemId}-${size}`] || 0) - 1, 0) };
      if (updatedCart[`${itemId}-${size}`] === 0) {
        const { [`${itemId}-${size}`]: _, ...rest } = updatedCart;
        return rest;
      }
      return updatedCart;
    });
    await updateCartOnServer('http://localhost:4000/removefromcart', { itemId, size });
  }, []);

  const getTotalCartAmount = useCallback(() => {
    let totalAmount = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        const itemId = item.split('-')[0]; // _id é string no MongoDB
        const itemInfo = allProducts.find((product) => product._id === itemId);
        if (itemInfo) {
          // ✅ Preço fixo temporário (você pode adicionar price nas variants depois)
          totalAmount += cartItems[item] * 99.90;
        }
      }
    }
    return totalAmount;
  }, [cartItems, allProducts]);

  const getTotalCartItems = useCallback(() => {
    let totalItem = 0;
    for (const item in cartItems) {
      if (cartItems[item] > 0) {
        totalItem += cartItems[item];
      }
    }
    return totalItem;
  }, [cartItems]);

  // ✅ CORRIGIDO: URL correta do backend
  const fetchProducts = useCallback(async () => {
    try {
      const response = await fetch('http://localhost:4000/api/products/all');
      if (!response.ok) return;
      const data = await response.json();
      if (isMounted.current) {
        setAllProducts(data);
      }
    } catch (_) {
      // Silencia erros
    }
  }, []);

  useEffect(() => {
    isMounted.current = true;
    const initializeData = async () => {
      await fetchProducts();
    };
    initializeData();
    return () => {
      isMounted.current = false;
    };
  }, [fetchProducts]);

  const contextValue = {
    getTotalCartAmount,
    allProducts,
    cartItems,
    addToCart,
    removeFromCart,
    getTotalCartItems,
    fetchProducts,
  };

  return (
    <ShopContext.Provider value={contextValue}>
      {props.children}
    </ShopContext.Provider>
  );
};

export default ShopContextProvider;