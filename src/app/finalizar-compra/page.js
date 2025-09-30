// Salve em: src/app/finalizar-compra/page.js
'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import styles from './Checkout.module.css';
import { CreditCardIcon, PixIcon, BoletoIcon } from './SecurityIcons';
import SummarySidebar from '@/components/MultiStepForm/SummarySidebar';

export default function CheckoutPage() {
  const { cartItems, itemCount } = useCart();
  const [loading, setLoading] = useState(false);
  const [activePayment, setActivePayment] = useState('card');

  // Lógica de cálculo (simulada)
  const subtotal = cartItems.reduce((acc, item) => acc + (item.price || 0), 0);
  const total = subtotal; // Adicionar frete e outras taxas aqui no futuro

  const handleFinalizarCompra = async (e) => {
    e.preventDefault();
    setLoading(true);
    alert(`Iniciando pagamento via ${activePayment}...`);
    // Aqui iria a lógica de API para processar o pagamento
    setLoading(false);
  };

  return (
    <>
      <Header />
      <main className={styles.pageWrapper}>
        <div className={styles.container}>
          <h1 className={styles.title}>Finalizar Compra</h1>
          <form onSubmit={handleFinalizarCompra} className={styles.checkoutGrid}>
            
            {/* --- COLUNA PRINCIPAL (ESQUERDA) --- */}
            <div className={styles.billingDetails}>
              <h2>Detalhes da Cobrança</h2>
              {/* Seus formulários de cobrança e entrega aqui... */}
              <div className={styles.formRow}>
                  <div className={styles.formGroup}><label>Nome *</label><input type="text" required /></div>
                  <div className={styles.formGroup}><label>Sobrenome *</label><input type="text" required /></div>
              </div>
              <div className={styles.formGroup}><label>CPF *</label><input type="text" required /></div>
              {/* ... mais campos ... */}

              {/* === SEÇÃO DE PAGAMENTO === */}
              <div className={styles.paymentSection}>
                <h2>Pagamento</h2>
                <div className={styles.paymentTabs}>
                  <button type="button" onClick={() => setActivePayment('card')} className={`${styles.paymentTab} ${activePayment === 'card' ? styles.activeTab : ''}`}>
                    <CreditCardIcon /> Cartão de crédito
                  </button>
                  <button type="button" onClick={() => setActivePayment('boleto')} className={`${styles.paymentTab} ${activePayment === 'boleto' ? styles.activeTab : ''}`}>
                    <BoletoIcon /> Boleto
                  </button>
                  <button type="button" onClick={() => setActivePayment('pix')} className={`${styles.paymentTab} ${activePayment === 'pix' ? styles.activeTab : ''}`}>
                    <PixIcon /> PIX
                  </button>
                </div>

                <div className={styles.paymentContent}>
                  {activePayment === 'card' && (
                    <div className={styles.creditCardForm}>
                      <div className={styles.formGroup}><label>Número do cartão</label><input type="text" placeholder="0000 0000 0000 0000" required/></div>
                      <div className={styles.formGroup}><label>Nome do Titular</label><input type="text" placeholder="Nome como no cartão" required/></div>
                      <div className={styles.cardRow}>
                          <div className={styles.formGroup}><label>Validade (MM/AA)</label><input type="text" placeholder="MM/AA" required/></div>
                          <div className={styles.formGroup}><label>Código (CVV)</label><input type="text" placeholder="123" required/></div>
                      </div>
                      <div className={styles.formGroup}><label>Parcelas</label>
                        <select>
                          <option>1x de R$ {total.toFixed(2).replace('.',',')} sem juros</option>
                          <option>2x de R$ {(total / 2).toFixed(2).replace('.',',')} sem juros</option>
                          <option>3x de R$ {(total / 3).toFixed(2).replace('.',',')} sem juros</option>
                        </select>
                      </div>
                    </div>
                  )}
                  {activePayment === 'boleto' && (
                    <p>Ao finalizar a compra, seu boleto será gerado e ficará disponível para pagamento.</p>
                  )}
                  {activePayment === 'pix' && (
                    <p>Ao finalizar a compra, um QR Code será gerado para você efetuar o pagamento via PIX.</p>
                  )}
                </div>
              </div>

              <button type="submit" disabled={loading || itemCount === 0} className={styles.checkoutButton}>
                {loading ? 'Processando...' : 'Confirmar Pedido'}
              </button>
            </div>

            {/* --- SIDEBAR (DIREITA) --- */}
            <aside className={styles.sidebar}>
              {cartItems.length > 0 && (
                <SummarySidebar
                  productData={cartItems[0]}
                  formData={cartItems[0].formData}
                  finalPrice={total}
                  currentStep={Object.keys(cartItems[0].formData || {}).length}
                  formSteps={['Resumo do Pedido']}
                  goToStep={() => {}}
                />
              )}
            </aside>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}