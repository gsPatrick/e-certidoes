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

  const [modalItem, setModalItem] = useState(null);

  useEffect(() => {
    try {
      window.localStorage.setItem('cartItems', JSON.stringify(cartItems));
    } catch (error) {
      console.error('Erro ao salvar o carrinho no localStorage:', error);
    }
  }, [cartItems]);

  const addToCart = (product) => {
    // Adiciona um ID único para cada item no carrinho, útil para remoção
    const newItem = { ...product, cartId: Date.now() }; 
    setCartItems(prevItems => [...prevItems, newItem]);
    
    // A lógica do modal foi removida para redirecionar direto para o carrinho/checkout
    // setModalItem(newItem); 
  };

  const removeFromCart = (cartId) => {
    setCartItems(prevItems => prevItems.filter(item => item.cartId !== cartId));
  };

  // --- FUNÇÃO ADICIONADA ---
  // Limpa todos os itens do carrinho. Essencial após a criação do pedido.
  const clearCart = () => {
    setCartItems([]);
  };

  const closeModal = () => {
    setModalItem(null);
  };

  const value = {
    cartItems,
    addToCart,
    removeFromCart,
    clearCart, // <-- Exportando a nova função
    itemCount: cartItems.length,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
      {/* O componente do modal continua aqui, caso queira usá-lo em outro lugar no futuro */}
      {modalItem && <AddToCartModal item={modalItem} onClose={closeModal} />}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  return useContext(CartContext);
};