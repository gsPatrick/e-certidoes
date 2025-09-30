// Salve em: src/app/finalizar-compra/page.js
'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import api from '@/services/api';
import styles from './Checkout.module.css';
import shippingStyles from './ShippingOptions.module.css';
import { LockIcon } from './SecurityIcons';
import SummarySidebar from '@/components/MultiStepForm/SummarySidebar';

export default function CheckoutPage() {
  const { cartItems, itemCount } = useCart();
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [billingDetails, setBillingDetails] = useState({
    nome: '', sobrenome: '', cpf: '', telefone: '', email: '', 
    cep: '', endereco: '', numero: '', complemento: '', bairro: '', cidade: '', estado: '', 
    observacoes: ''
  });
  
  const [shippingOptions, setShippingOptions] = useState([]);
  const [selectedShipping, setSelectedShipping] = useState(null);
  
  const isShippingRequired = cartItems.some(item => 
    item.formData?.formato === 'Certidão em papel' || 
    item.formData?.formato === 'Certidão em papel + eletrônica'
  );
  
  const subtotal = cartItems.reduce((acc, item) => acc + (item.price || 0), 0);
  const total = subtotal + (selectedShipping ? selectedShipping.preco : 0);

  useEffect(() => {
    if (isAuthenticated && user) {
      const nomeCompleto = user.nome ? user.nome.split(' ') : [''];
      const nome = nomeCompleto.shift() || '';
      const sobrenome = nomeCompleto.join(' ') || '';
      setBillingDetails(prev => ({ 
        ...prev, 
        nome, 
        sobrenome, 
        email: user.email || '' 
      }));
    }
  }, [isAuthenticated, user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBillingDetails(prev => ({ ...prev, [name]: value }));
  };

  const handleFinalizarCompra = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      alert("Redirecionando para o Mercado Pago...");
      // Simulação da lógica de API
      // const { data: pedidoResult } = await api.post('/pedidos', { ... });
      // const { data: checkoutResult } = await api.post('/pagamentos/criar-checkout', { pedidoId: pedidoResult.pedido.id });
      // window.location.href = checkoutResult.checkoutUrl;
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Ocorreu um erro ao finalizar o pedido.';
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Header />
      <main className={styles.pageWrapper}>
        <div className={styles.container}>
          <h1 className={styles.title}>Finalizar Compra</h1>
          <form onSubmit={handleFinalizarCompra} className={styles.checkoutGrid}>
            
            {/* ============================================== */}
            {/* === COLUNA PRINCIPAL (ESQUERDA) - CORRIGIDA === */}
            {/* ============================================== */}
            <div className={styles.billingDetails}>
              <h2>Detalhes da Cobrança</h2>
              <div className={styles.formRow}>
                <div className={styles.formGroup}><label>Nome *</label><input type="text" name="nome" value={billingDetails.nome} onChange={handleInputChange} required /></div>
                <div className={styles.formGroup}><label>Sobrenome *</label><input type="text" name="sobrenome" value={billingDetails.sobrenome} onChange={handleInputChange} required /></div>
              </div>
              <div className={styles.formGroup}><label>CPF *</label><input type="text" name="cpf" value={billingDetails.cpf} onChange={handleInputChange} required /></div>
              <div className={styles.formGroup}><label>Telefone *</label><input type="tel" name="telefone" value={billingDetails.telefone} onChange={handleInputChange} required /></div>
              <div className={styles.formGroup}><label>E-mail *</label><input type="email" name="email" value={billingDetails.email} onChange={handleInputChange} required /></div>
              
              {isShippingRequired && (
                <>
                  <h2 style={{ marginTop: '2.5rem' }}>Endereço de Entrega</h2>
                  {/* ... cole aqui toda a sua lógica de CEP e campos de endereço ... */}
                </>
              )}
              <div className={styles.formGroup}><label>Observações do pedido (opcional)</label><textarea name="observacoes" value={billingDetails.observacoes} onChange={handleInputChange} rows="4"></textarea></div>

              {/* === BLOCO DE PAGAMENTO AGORA ESTÁ AQUI DENTRO === */}
              <div className={styles.paymentBox}>
                <div className={styles.securityInfo}>
                  <LockIcon />
                  <div>
                    <h4>Pagamento 100% Seguro</h4>
                    <p>Você será redirecionado para o ambiente seguro do <strong>Mercado Pago</strong> para concluir sua compra com total proteção dos seus dados.</p>
                  </div>
                </div>
                {error && <p className={styles.errorMessage}>{error}</p>}
                <button type="submit" disabled={loading || itemCount === 0} className={styles.checkoutButton}>
                  {loading ? 'Processando...' : 'Ir para Pagamento'}
                </button>
              </div>

            </div>

            {/* ================================================== */}
            {/* === SIDEBAR (DIREITA) - APENAS O RESUMO === */}
            {/* ================================================== */}
            <aside className={styles.sidebar}>
              {cartItems.length > 0 && (
                <SummarySidebar
                  productData={cartItems[0]}
                  formData={cartItems[0].formData}
                  finalPrice={total}
                  // Simula que todas as etapas foram concluídas
                  currentStep={Object.keys(cartItems[0].formData || {}).length}
                  formSteps={['Resumo do Pedido']}
                  goToStep={() => {}} // Desabilita o clique em "editar"
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