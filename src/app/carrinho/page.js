// Salve como: src/app/carrinho/page.js
'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useCart } from '@/context/CartContext';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import styles from './Carrinho.module.css';
import Link from 'next/link';

// **NOVO: Componente para renderizar os detalhes do formulário**
const FormDetails = ({ formData }) => {
    if (!formData) return null;

    // Remove campos que não queremos exibir (como o preço, que já está na tabela)
    const { preco_final, ...details } = formData;

    return (
        <div className={styles.formDetails}>
            {Object.entries(details).map(([key, value]) => {
                if (!value) return null; // Não mostra campos vazios
                // Formata a chave para ser mais legível (ex: 'nome_completo' -> 'Nome Completo')
                const label = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                return (
                    <div key={key} className={styles.detailItem}>
                        <strong>{label}:</strong> {value}
                    </div>
                );
            })}
        </div>
    );
};


export default function CarrinhoPage() {
  const { cartItems, removeFromCart, itemCount } = useCart();
  const [cep, setCep] = useState('');
  const [shippingCost, setShippingCost] = useState(0);

  const subtotal = cartItems.reduce((acc, item) => acc + item.price, 0);
  const total = subtotal + shippingCost;

  return (
    <>
      <Header />
      <main className={styles.pageWrapper}>
        <div className={styles.container}>
          <h1 className={styles.title}>Carrinho</h1>
          
          {itemCount === 0 ? (
            <div className={styles.emptyCart}>
              <p>Seu carrinho está vazio.</p>
              <Link href="/certidoes" className={styles.returnButton}>
                Ver todas as certidões
              </Link>
            </div>
          ) : (
            <div className={styles.cartGrid}>
              <div className={styles.cartItems}>
                <table className={styles.itemsTable}>
                  <thead>
                    <tr>
                      <th colSpan="2">Produto</th>
                      <th>Subtotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    {cartItems.map(item => (
                      <tr key={item.cartId}>
                        <td className={styles.removeCell}>
                          <button onClick={() => removeFromCart(item.cartId)}>×</button>
                        </td>
                        <td className={styles.productCell}>
                          <Image src={item.imageSrc} alt={item.name} width={60} height={75} />
                          <div>
                            <span className={styles.productName}>{item.name}</span>
                             {/* **MUDANÇA: Renderiza os detalhes do formulário aqui** */}
                            <FormDetails formData={item.formData} />
                          </div>
                        </td>
                        <td className={styles.priceCell}>R$ {item.price.toFixed(2).replace('.', ',')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className={styles.cartTotals}>
                <h2 className={styles.totalsTitle}>Total no Carrinho</h2>
                <div className={styles.totalsRow}>
                  <span>Subtotal</span>
                  <span>R$ {subtotal.toFixed(2).replace('.', ',')}</span>
                </div>
                <div className={styles.totalsRow}>
                  <span>Entrega</span>
                   <span>A calcular</span>
                </div>
                <div className={styles.finalTotal}>
                  <span>Total</span>
                  <span>R$ {total.toFixed(2).replace('.', ',')}</span>
                </div>
                <Link href="/finalizar-compra" className={styles.checkoutButton}>Finalizar Compra</Link>
              </div>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}