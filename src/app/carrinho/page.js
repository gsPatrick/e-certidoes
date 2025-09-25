// Salve em: src/app/carrinho/page.js
'use client';

import { useCart } from '@/context/CartContext';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import Image from 'next/image';
import Link from 'next/link';
import styles from './Carrinho.module.css';

const FormDetails = ({ formData }) => {
    if (!formData) return null;
    const { preco_final, ...details } = formData;
    return (
        <div className={styles.formDetails}>
            {Object.entries(details).map(([key, value]) => {
                if (!value || value === 'on') return null;
                const label = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
                return (
                    <div key={key} className={styles.detailItem}>
                        <strong>{label}:</strong> {String(value)}
                    </div>
                );
            })}
        </div>
    );
};

export default function CarrinhoPage() {
  const { cartItems, removeFromCart, itemCount } = useCart();

  // LÓGICA CHAVE: Verifica se algum item requer envio físico
  const isShippingRequired = cartItems.some(item => item.formData?.formato === 'Certidão Impressa');

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price || 0), 0);
  const total = subtotal; // O custo de entrega será adicionado no futuro, se necessário

  return (
    <>
      <Header />
      <main className={styles.pageWrapper}>
        <div className={styles.container}>
          <h1 className={styles.title}>Carrinho de Compras</h1>
          
          {itemCount === 0 ? (
            <div className={styles.emptyCart}>
              <p>Seu carrinho está vazio.</p>
              <Link href="/certidoes" className={styles.returnButton}>Ver todas as certidões</Link>
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
                          <button onClick={() => removeFromCart(item.cartId)} title="Remover item">×</button>
                        </td>
                        <td className={styles.productCell}>
                          <Image src={item.imageSrc} alt={item.name} width={60} height={75} />
                          <div>
                            <span className={styles.productName}>{item.name}</span>
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
                
                {/* RENDERIZAÇÃO CONDICIONAL DA ENTREGA */}
                {isShippingRequired && (
                    <div className={styles.totalsRow}>
                        <span>Entrega</span>
                        <span>A calcular no checkout</span>
                    </div>
                )}

                <div className={`${styles.totalsRow} ${styles.finalTotal}`}>
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