// Caminho: src/context/CartContext.js
'use client';

import { createContext, useState, useContext, useEffect } from 'react'; // MUDANÇA: Importamos o useEffect
import AddToCartModal from '@/components/AddToCartModal/AddToCartModal';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // MUDANÇA 1: Inicialização do estado a partir do localStorage.
  // Usamos uma função no useState para que a leitura do localStorage
  // aconteça apenas uma vez, na primeira renderização.
  const [cartItems, setCartItems] = useState(() => {
    // Código do lado do servidor (SSR) não tem acesso a 'window' ou 'localStorage'.
    // Verificamos se estamos no navegador antes de tentar acessá-los.
    if (typeof window === 'undefined') {
      return [];
    }
    try {
      const items = window.localStorage.getItem('cartItems');
      // Se houver itens salvos, converte de string JSON para objeto. Senão, retorna um array vazio.
      return items ? JSON.parse(items) : [];
    } catch (error) {
      console.error('Erro ao ler o carrinho do localStorage:', error);
      return [];
    }
  });

  const [modalItem, setModalItem] = useState(null);

  // MUDANÇA 2: Efeito para salvar o carrinho no localStorage sempre que ele mudar.
  // O useEffect observa a variável 'cartItems'. Sempre que ela for alterada,
  // a função dentro dele é executada.
  useEffect(() => {
    try {
      // Converte o estado do carrinho para uma string JSON e salva no localStorage.
      window.localStorage.setItem('cartItems', JSON.stringify(cartItems));
    } catch (error) {
      console.error('Erro ao salvar o carrinho no localStorage:', error);
    }
  }, [cartItems]);

  const addToCart = (product) => {
    // A lógica aqui permanece a mesma. O useEffect cuidará de salvar.
    const newItem = { ...product, cartId: Date.now(), price: 59.90 };
    setCartItems(prevItems => [...prevItems, newItem]);
    setModalItem(newItem);
  };

  const removeFromCart = (cartId) => {
    // A lógica aqui permanece a mesma. O useEffect cuidará de salvar.
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
      {modalItem && <AddToCartModal item={modalItem} onClose={closeModal} />}
    </CartContext.Provider>
  );
};

// Hook customizado para facilitar o uso do contexto
export const useCart = () => {
  return useContext(CartContext);
};