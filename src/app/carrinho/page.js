// Salve em: src/app/carrinho/page.js
'use client';

import { useCart } from '@/context/CartContext';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import Image from 'next/image';
import Link from 'next/link';
import styles from './Carrinho.module.css';

// Componente FormDetails ajustado para a nova lógica
const FormDetails = ({ formData, item }) => {
    if (!formData) return null;

    // Chaves que não devem ser exibidas ou são tratadas de outra forma
    const excludeKeys = new Set([
        'preco_final', 'tipo_pesquisa', 'tipo_pessoa',
        'aceite_lgpd', 'ciente', 'tipo_certidao'
    ]);

    // Filtra e formata os detalhes
    const details = Object.entries(formData)
        .filter(([key, value]) => {
            if (!value || value === 'on') return false;
            // Regra específica: só mostrar 'tempo_pesquisa' se for Certidão de Protesto
            if (key === 'tempo_pesquisa' && item.slug !== 'certidao-de-protesto') return false;
            if (excludeKeys.has(key)) return false;
            return true;
        })
        .map(([key, value]) => {
            const label = key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
            return { key, label, value };
        });

    if (details.length === 0) return null;

    return (
        <div className={styles.formDetails}>
            {details.map(({ key, label, value }) => (
                <div key={key} className={styles.detailItem}>
                    <strong>{label}:</strong> {String(value)}
                </div>
            ))}
        </div>
    );
};

export default function CarrinhoPage() {
  const { cartItems, removeFromCart, itemCount } = useCart();

  const isShippingRequired = cartItems.some(item => {
    const formato = item.formData?.formato;
    return formato === 'Certidão em papel' || formato === 'Certidão Transcrita' || formato === 'Certidão Reprográfica';
  });

  const subtotal = cartItems.reduce((acc, item) => acc + (item.price || 0), 0);
  const total = subtotal;

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
                            {/* Passando o 'item' completo para o FormDetails */}
                            <FormDetails formData={item.formData} item={item} />
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