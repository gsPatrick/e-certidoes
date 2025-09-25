// Salve em: src/app/finalizar-compra/page.js
'use client';

import { useState, useEffect, useCallback } from 'react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { isValidCPF } from '@/utils/cpfValidator'; // 1. IMPORTAR VALIDADOR
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import api from '@/services/api';
import axios from 'axios';
import styles from './Checkout.module.css';
import shippingStyles from './ShippingOptions.module.css';
import { LockIcon } from './SecurityIcons';

// Valor de frete padrão em caso de falha da API
const DEFAULT_SHIPPING_OPTION = {
  servico: 'Entrega Padrão',
  preco: 25.00,
  prazo: 10,
};

// Função para aplicar máscara de CPF
const maskCPF = (value) => value.replace(/\D/g, '').slice(0, 11).replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2');

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
  
  const [cepLoading, setCepLoading] = useState(false);
  const [cepError, setCepError] = useState('');
  
  const [shippingOptions, setShippingOptions] = useState([]);
  const [selectedShipping, setSelectedShipping] = useState(null);
  const [shippingLoading, setShippingLoading] = useState(false);
  const [shippingError, setShippingError] = useState('');
  
  const isShippingRequired = cartItems.some(item => item.formData?.formato === 'Certidão Impressa');
  const subtotal = cartItems.reduce((acc, item) => acc + (item.price || 0), 0);
  const total = subtotal + (selectedShipping ? selectedShipping.preco : 0);

  useEffect(() => {
    if (itemCount === 0 && !loading) {
      router.push('/carrinho');
    }

    if (isAuthenticated && user) {
      const nomeCompleto = user.nome ? user.nome.split(' ') : [''];
      const nome = nomeCompleto.shift() || '';
      const sobrenome = nomeCompleto.join(' ') || '';
      // 2. PREENCHIMENTO AUTOMÁTICO DOS DADOS
      setBillingDetails(prev => ({ 
        ...prev, 
        nome, 
        sobrenome, 
        email: user.email || '' 
      }));
    }
  }, [isAuthenticated, user, itemCount, loading, router]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // Aplicar máscara de CPF ao digitar
    const finalValue = name === 'cpf' ? maskCPF(value) : value;
    setBillingDetails(prev => ({ ...prev, [name]: finalValue }));
  };

  const fetchAddressByCep = useCallback(async (cep) => {
    if (!isShippingRequired) return;
    setCepLoading(true); setCepError('');
    try {
      const { data } = await axios.get(`https://brasilapi.com.br/api/cep/v1/${cep}`);
      setBillingDetails(prev => ({ ...prev, endereco: data.street, bairro: data.neighborhood, cidade: data.city, estado: data.state }));
    } catch (err) {
      setBillingDetails(prev => ({ ...prev, endereco: '', bairro: '', cidade: '', estado: '' }));
      setCepError('CEP não encontrado. Preencha o endereço manualmente.');
    } finally { setCepLoading(false); }
  }, [isShippingRequired]);

  const fetchShippingOptions = useCallback(async (cep) => {
    if (!isShippingRequired) return;
    setShippingLoading(true);
    setShippingError('');
    setSelectedShipping(null);
    setShippingOptions([]);

    try {
      const response = await api.post('/frete/calcular', {
        cepDestino: cep,
        valorTotal: subtotal,
      });

      if (response.data && response.data.length > 0) {
        setShippingOptions(response.data);
        setSelectedShipping(response.data[0]);
      } else {
        throw new Error('Nenhuma opção de frete encontrada.');
      }

    } catch (error) {
      console.error("Erro ao buscar frete:", error);
      setShippingError('Não foi possível calcular o frete. Usando valor padrão.');
      setShippingOptions([DEFAULT_SHIPPING_OPTION]);
      setSelectedShipping(DEFAULT_SHIPPING_OPTION);
    } finally {
      setShippingLoading(false);
    }
  }, [isShippingRequired, subtotal]);

  useEffect(() => {
    const cepLimpo = billingDetails.cep.replace(/\D/g, '');
    if (cepLimpo.length !== 8) {
      setCepError('');
      setSelectedShipping(null);
      setShippingOptions([]);
      return;
    }
    
    const handler = setTimeout(() => {
      fetchAddressByCep(cepLimpo);
      fetchShippingOptions(cepLimpo);
    }, 800);
    
    return () => clearTimeout(handler);
  }, [billingDetails.cep, fetchAddressByCep, fetchShippingOptions]);

  const handleFinalizarCompra = async (e) => {
    e.preventDefault();
    setError('');

    // 3. VALIDAÇÃO DO CPF ANTES DE ENVIAR
    if (!isValidCPF(billingDetails.cpf)) {
      setError('O CPF informado não é válido. Por favor, verifique.');
      return;
    }

    if (isShippingRequired && !selectedShipping) {
      setError('Por favor, selecione uma opção de entrega.');
      return;
    }
    setLoading(true);

    const finalBillingDetails = { ...billingDetails, frete: selectedShipping };
    const formData = new FormData();
    formData.append('itens', JSON.stringify(cartItems));
    formData.append('dadosCliente', JSON.stringify(finalBillingDetails));
    
    cartItems.forEach(item => {
      if (item.uploadedFiles && item.uploadedFiles.length > 0) {
        item.uploadedFiles.forEach(file => { formData.append('anexosCliente', file); });
      }
    });

    try {
      const { data: pedidoResult } = await api.post('/pedidos', formData);
      const { data: checkoutResult } = await api.post('/pagamentos/criar-checkout', { pedidoId: pedidoResult.pedido.id });
      window.location.href = checkoutResult.checkoutUrl;
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
            <div className={styles.billingDetails}>
              <h2>Detalhes da Cobrança</h2>
              <div className={styles.formRow}>
                <div className={styles.formGroup}><label>Nome *</label><input type="text" name="nome" value={billingDetails.nome} onChange={handleInputChange} required /></div>
                <div className={styles.formGroup}><label>Sobrenome *</label><input type="text" name="sobrenome" value={billingDetails.sobrenome} onChange={handleInputChange} required /></div>
              </div>
              <div className={styles.formGroup}><label>CPF *</label><input type="text" name="cpf" value={billingDetails.cpf} onChange={handleInputChange} required placeholder="000.000.000-00"/></div>
              <div className={styles.formGroup}><label>Telefone *</label><input type="tel" name="telefone" value={billingDetails.telefone} onChange={handleInputChange} required placeholder="(00) 00000-0000"/></div>
              <div className={styles.formGroup}><label>E-mail *</label><input type="email" name="email" value={billingDetails.email} onChange={handleInputChange} required /></div>
              
              {isShippingRequired && (
                <>
                  <h2 className={styles.shippingTitle}>Endereço de Entrega</h2>
                  <div className={styles.formGroup}><label>CEP *</label><input type="text" name="cep" value={billingDetails.cep} onChange={handleInputChange} required maxLength="9" placeholder="00000-000" />{cepLoading && <small>Buscando...</small>}{cepError && <small className={styles.cepError}>{cepError}</small>}</div>
                  <div className={styles.formGroup}><label>Endereço *</label><input type="text" name="endereco" value={billingDetails.endereco} onChange={handleInputChange} required placeholder="Nome da Rua, Avenida..."/></div>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}><label>Número *</label><input type="text" name="numero" value={billingDetails.numero} onChange={handleInputChange} required /></div>
                    <div className={styles.formGroup}><label>Complemento</label><input type="text" name="complemento" value={billingDetails.complemento} onChange={handleInputChange} placeholder="Apto, Bloco, etc." /></div>
                  </div>
                  <div className={styles.formGroup}><label>Bairro *</label><input type="text" name="bairro" value={billingDetails.bairro} onChange={handleInputChange} required /></div>
                  <div className={styles.formRow}>
                    <div className={styles.formGroup}><label>Cidade *</label><input type="text" name="cidade" value={billingDetails.cidade} onChange={handleInputChange} required /></div>
                    <div className={styles.formGroup}><label>Estado *</label><input type="text" name="estado" value={billingDetails.estado} onChange={handleInputChange} required maxLength="2" placeholder="Ex: SP"/></div>
                  </div>

                  <div className={shippingStyles.shippingOptionsContainer}>
                      {shippingLoading && <p className={shippingStyles.loading}>Calculando frete...</p>}
                      {shippingError && <p className={shippingStyles.error}>{shippingError}</p>}
                      
                      {!shippingLoading && shippingOptions.length > 0 && (
                        <div>
                          {shippingOptions.map((opt, index) => (
                            <div key={index}>
                              <input
                                type="radio"
                                id={`shipping-${index}`}
                                name="shippingOption"
                                value={opt.servico}
                                checked={selectedShipping?.servico === opt.servico}
                                onChange={() => setSelectedShipping(opt)}
                                className={shippingStyles.shippingInput}
                                required
                              />
                              <label htmlFor={`shipping-${index}`} className={`${shippingStyles.shippingLabel} ${selectedShipping?.servico === opt.servico ? shippingStyles.selected : ''}`}>
                                <div className={shippingStyles.serviceInfo}>
                                  <span className={shippingStyles.radioCircle}></span>
                                  <div>
                                    <div className={shippingStyles.serviceName}>{opt.servico}</div>
                                    <div className={shippingStyles.deliveryTime}>Entrega em até {opt.prazo} dias úteis</div>
                                  </div>
                                </div>
                                <div className={shippingStyles.servicePrice}>R$ {opt.preco.toFixed(2).replace('.', ',')}</div>
                              </label>
                            </div>
                          ))}
                        </div>
                      )}
                  </div>
                </>
              )}
              <div className={styles.formGroup}><label>Observações do pedido (opcional)</label><textarea name="observacoes" value={billingDetails.observacoes} onChange={handleInputChange} rows="4" placeholder="Instruções especiais para entrega ou sobre o pedido."></textarea></div>
            </div>

            <aside className={styles.orderSummary}>
              <h2>Seu Pedido</h2>
              <div className={styles.summaryBox}>
                {cartItems.map(item=>(<div key={item.cartId} className={styles.summaryRow}><span>{item.name} x 1</span><strong>R$ {item.price.toFixed(2).replace('.',',')}</strong></div>))}
                <div className={`${styles.summaryRow} ${styles.summarySubtotal}`}><span>Subtotal</span><strong>R$ {subtotal.toFixed(2).replace('.',',')}</strong></div>
                {isShippingRequired && (
                  <div className={styles.summaryRow}>
                    <span>Entrega</span>
                    <strong>{selectedShipping ? `R$ ${selectedShipping.preco.toFixed(2).replace('.', ',')}` : 'A calcular'}</strong>
                  </div>
                )}
                <div className={`${styles.summaryRow} ${styles.summaryTotal}`}><span>Total</span><strong>R$ {total.toFixed(2).replace('.',',')}</strong></div>
              </div>
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
            </aside>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}