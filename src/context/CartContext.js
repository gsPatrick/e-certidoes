// Caminho: src/context/CartContext.js
'use client';

import { createContext, useState, useContext, useEffect } from 'react';
import AddToCartModal from '@/components/AddToCartModal/AddToCartModal';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    if (typeof window === 'undefined') {
      return [];
    }
    try {
      const items = window.localStorage.getItem('cartItems');
      return items ? JSON.parse(items) : [];
    } catch (error) {
      console.error('Erro ao ler o carrinho do localStorage:', error);
      return [];
    }
  });

  // O estado do modal ainda existe, mas não será mais ativado pelo fluxo principal.
  const [modalItem, setModalItem] = useState(null);

  useEffect(() => {
    try {
      window.localStorage.setItem('cartItems', JSON.stringify(cartItems));
    } catch (error) {
      console.error('Erro ao salvar o carrinho no localStorage:', error);
    }
  }, [cartItems]);

  const addToCart = (product) => {
    const newItem = { ...product, cartId: Date.now() }; // O preço agora vem do product
    setCartItems(prevItems => [...prevItems, newItem]);
    
    // =======================================================
    // === AQUI ESTÁ A CORREÇÃO: REMOVA OU COMENTE ESTA LINHA ===
    // =======================================================
    // setModalItem(newItem); // Esta linha causava a exibição do modal.
  };

  const removeFromCart = (cartId) => {
    setCartItems(prevItems => prevItems.filter(item => item.cartId !== cartId));
  };

  const closeModal = () => {
    setModalItem(null);
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    itemCount: cartItems.length,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
      {/* O componente do modal continua aqui, caso você queira usá-lo em outro lugar no futuro */}
      {modalItem && <AddToCartModal item={modalItem} onClose={closeModal} />}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  return useContext(CartContext);
};