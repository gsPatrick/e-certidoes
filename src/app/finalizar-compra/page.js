// Salve em: src/app/checkout/page.js
'use client';

import { useState, useEffect, useCallback } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import api from '@/services/api';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import styles from './Checkout.module.css';
import axios from 'axios';

// ... (Componente PaymentIcons) ...

export default function CheckoutPage() {
  const { cartItems } = useCart();
  const { user, isAuthenticated } = useAuth();
  const router = useRouter();

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [billingDetails, setBillingDetails] = useState({
    nome: '', sobrenome: '', cpf: '', cep: '', endereco: '', numero: '', bairro: '', 
    cidade: '', estado: '', telefone: '', email: '', observacoes: ''
  });

  const [cepLoading, setCepLoading] = useState(false);
  const [cepError, setCepError] = useState('');

  // Preenche dados do usuário logado
  useEffect(() => {
    if (isAuthenticated && user) {
        const nomeCompleto = user.nome ? user.nome.split(' ') : [''];
        const nome = nomeCompleto.shift() || '';
        const sobrenome = nomeCompleto.join(' ') || '';
        setBillingDetails(prev => ({ ...prev, nome, sobrenome, email: user.email || '' }));
    }
  }, [isAuthenticated, user]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setBillingDetails(prev => ({ ...prev, [name]: value }));
  };

  // **LÓGICA DE BUSCA DE CEP APRIMORADA**
  const fetchAddressByCep = useCallback(async (cep) => {
    setCepLoading(true);
    setCepError('');
    try {
      const response = await axios.get(`https://brasilapi.com.br/api/cep/v1/${cep}`);
      const { street, neighborhood, city, state } = response.data;
      
      setBillingDetails(prev => ({
        ...prev,
        endereco: street,
        bairro: neighborhood,
        cidade: city,
        estado: state,
      }));
    } catch (err) {
      setCepError('CEP não encontrado. Por favor, preencha o endereço manualmente.');
      // Limpa os campos caso o CEP seja inválido
      setBillingDetails(prev => ({
        ...prev,
        endereco: '',
        bairro: '',
        cidade: '',
        estado: '',
      }));
      console.error("Erro ao buscar CEP:", err);
    } finally {
      setCepLoading(false);
    }
  }, []);

  // useEffect para acionar a busca de CEP com debounce
  useEffect(() => {
    const cepLimpo = billingDetails.cep.replace(/\D/g, ''); // Apenas números

    if (cepLimpo.length !== 8) {
      setCepError(''); // Limpa o erro se o CEP não estiver completo
      return;
    }

    // "Debounce": espera 500ms após o usuário parar de digitar para fazer a busca
    const handler = setTimeout(() => {
      fetchAddressByCep(cepLimpo);
    }, 500);

    // Limpa o timeout se o usuário digitar novamente
    return () => {
      clearTimeout(handler);
    };
  }, [billingDetails.cep, fetchAddressByCep]);


  const subtotal = cartItems.reduce((acc, item) => acc + (item.price || 0), 0);
  const total = subtotal;

  const handleFinalizarCompra = async (event) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    const validCartItems = cartItems.filter(item => item && item.id && item.name);
    if (validCartItems.length === 0) {
        setError('Seu carrinho está vazio.');
        setLoading(false);
        return;
    }
    const pedidoData = {
        itens: validCartItems,
        dadosCliente: billingDetails
    };
    try {
        const { data } = await api.post('/pedidos', pedidoData);
        router.push(`/pedido-confirmado?pedidoId=${data.pedido.id}`);
    } catch (err) {
        setError(err.response?.data?.message || 'Ocorreu um erro. Verifique seus dados.');
    } finally {
        setLoading(false);
    }
  };
  
  // ... (JSX restante)
  return (
    <>
      <Header />
      <main className={styles.pageWrapper}>
        <div className={styles.container}>
          <h1 className={styles.title}>Finalização de Compra</h1>

          <form className={styles.checkoutGrid} onSubmit={handleFinalizarCompra}>
            {/* Coluna da Esquerda: Detalhes da Cobrança */}
            <div className={styles.billingForm}>
              <h2>Detalhes da Cobrança</h2>
              <div className={styles.formRow}>
                  <div className={styles.formGroup}><label htmlFor="nome">Nome *</label><input type="text" id="nome" name="nome" value={billingDetails.nome} onChange={handleInputChange} required /></div>
                  <div className={styles.formGroup}><label htmlFor="sobrenome">Sobrenome *</label><input type="text" id="sobrenome" name="sobrenome" value={billingDetails.sobrenome} onChange={handleInputChange} required /></div>
              </div>
              <div className={styles.formGroup}><label htmlFor="cpf">CPF *</label><input type="text" id="cpf" name="cpf" value={billingDetails.cpf} onChange={handleInputChange} required /></div>
              <div className={styles.formGroup}>
                <label htmlFor="cep">CEP *</label>
                <input type="text" id="cep" name="cep" value={billingDetails.cep} onChange={handleInputChange} maxLength="9" placeholder="00000-000" required />
                {cepLoading && <small className={styles.cepFeedback}>Buscando endereço...</small>}
                {cepError && <small className={styles.cepError}>{cepError}</small>}
              </div>
              <div className={styles.formGroup}><label htmlFor="endereco">Endereço *</label><input type="text" id="endereco" name="endereco" value={billingDetails.endereco} onChange={handleInputChange} placeholder="Rua, Av, etc." required /></div>
              <div className={styles.formRow}>
                  <div className={styles.formGroup}><label htmlFor="numero">Número *</label><input type="text" id="numero" name="numero" value={billingDetails.numero} onChange={handleInputChange} required /></div>
                  <div className={styles.formGroup}><label htmlFor="bairro">Bairro *</label><input type="text" id="bairro" name="bairro" value={billingDetails.bairro} onChange={handleInputChange} required /></div>
              </div>
              <div className={styles.formRow}>
                  <div className={styles.formGroup}><label htmlFor="cidade">Cidade *</label><input type="text" id="cidade" name="cidade" value={billingDetails.cidade} onChange={handleInputChange} required /></div>
                  <div className={styles.formGroup}><label htmlFor="estado">Estado *</label><input type="text" id="estado" name="estado" value={billingDetails.estado} onChange={handleInputChange} required /></div>
              </div>
              <div className={styles.formGroup}><label htmlFor="telefone">Telefone *</label><input type="tel" id="telefone" name="telefone" value={billingDetails.telefone} onChange={handleInputChange} required /></div>
              <div className={styles.formGroup}><label htmlFor="email">E-mail *</label><input type="email" id="email" name="email" value={billingDetails.email} onChange={handleInputChange} required /></div>
              <div className={styles.formGroup}>
                <label htmlFor="observacoes">Observações do pedido (opcional)</label>
                <textarea id="observacoes" name="observacoes" value={billingDetails.observacoes} onChange={handleInputChange} placeholder="Observações sobre seu pedido, ex.: observações especiais sobre entrega."></textarea>
              </div>
            </div>

            {/* Coluna da Direita: Pedido e Pagamento */}
            <div className={styles.orderSummary}>
                {/* ... seu código para resumo do pedido e pagamento ... */}
                <div className={styles.paymentBox}>
                    {/* ... (código das opções de pagamento) ... */}
                    {error && <p className={styles.errorMessage}>{error}</p>}
                    <button type="submit" className={styles.checkoutButton} disabled={loading || cartItems.length === 0}>
                        {loading ? 'Processando...' : 'Finalizar Pedido'}
                    </button>
                </div>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
}