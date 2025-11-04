// Salve em: src/app/finalizar-compra/page.js
'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import api from '@/services/api';

import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import PageLoader from '@/components/PageLoader/PageLoader';
import AuthModal from '@/components/AuthModal/AuthModal';
import styles from './Checkout.module.css';
import { CreditCardIcon, PixIcon, BoletoIcon } from './SecurityIcons';

const formatLabel = (key) => {
    if (['cpf', 'cnpj', 'rg'].includes(key.toLowerCase())) return key.toUpperCase();
    return key.replace(/_/g, ' ').replace(/\b\w/g, char => char.toUpperCase());
};

const DetailItem = ({ label, value }) => {
    if (value === null || value === undefined || value === '' || value === false) return null;
    const displayValue = typeof value === 'boolean' ? (value ? 'Sim' : 'Não') : String(value);
    return (
        <div className={styles.summaryDetailItem}>
            <span className={styles.detailLabel}>{label}:</span>
            <span className={styles.detailValue}>{displayValue}</span>
        </div>
    );
};

// *** COMPONENTE ATUALIZADO ***
const OrderSummaryCard = ({ item, onRemove }) => {
    if (!item || !item.formData) return null;
    const { formData } = item;
    
    const excludeKeys = new Set([
        'aceite_lgpd', 'ciente', 'tipo_pesquisa', 'tipo_pessoa', 'tipo_certidao',
        'requerente_nome', 'requerente_cpf', 'requerente_email', 'requerente_telefone', 'requerente_rg',
        'estado_cartorio', 'cidade_cartorio', 'cartorio_protesto', 'todos_cartorios_protesto' // Exclui para tratar separadamente
    ]);

    const allDetails = Object.entries(formData)
        .filter(([key, value]) => {
            if (!value || value === '' || value === false) return false;
            if (key === 'tempo_pesquisa' && item.slug !== 'certidao-de-protesto') return false;
            if (excludeKeys.has(key)) return false;
            return true;
        });

    return (
        <div className={styles.summaryCard}>
            <div className={styles.summaryCardHeader}>
                <h4 className={styles.summaryCardTitle}>{item.name}</h4>
                <button onClick={() => onRemove(item.cartId)} className={styles.deleteButton} title="Remover item">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
                </button>
            </div>
            <div className={styles.summaryCardBody}>
                {/* Lógica para exibir os dados de Protesto */}
                <DetailItem label="Estado" value={formData.estado_cartorio} />
                <DetailItem label="Cidade" value={formData.cidade_cartorio} />
                <DetailItem label="Cartório" value={formData.todos_cartorios_protesto ? `Todos os cartórios de ${formData.cidade_cartorio}` : formData.cartorio_protesto} />

                {allDetails.map(([key, value]) => (
                    <DetailItem key={key} label={formatLabel(key)} value={value} />
                ))}
            </div>
            <div className={styles.summaryActions}>
                <span className={styles.summaryPrice}>R$ {item.price.toFixed(2).replace('.', ',')}</span>
            </div>
        </div>
    );
};

export default function CheckoutPage() {
    const { cartItems, itemCount, removeFromCart, clearCart } = useCart();
    const { user, isAuthenticated, loading: authLoading } = useAuth();
    const router = useRouter();
    
    const [loading, setLoading] = useState(false);
    const [activePayment, setActivePayment] = useState('card');
    const [isClient, setIsClient] = useState(false);
    const [showAuthModal, setShowAuthModal] = useState(false);
    const [clientData, setClientData] = useState({ 
        nome: '', sobrenome: '', cpf: '', email: '', telefone: '', 
        cep: '', endereco: '', numero: '', complemento: '', bairro: '', cidade: '', estado: '' 
    });

    useEffect(() => {
        setIsClient(true);
        if (!authLoading && !isAuthenticated) {
            setShowAuthModal(true);
        } else if (user) {
            setClientData(prev => ({ ...prev, nome: user.nome || '', email: user.email || '' }));
        }
    }, [isAuthenticated, authLoading, user]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setClientData(prev => ({ ...prev, [name]: value }));
    };

    const handleFinalizarCompra = async (e) => {
        e.preventDefault();
        if (!isAuthenticated) {
            setShowAuthModal(true);
            return;
        }
        setLoading(true);

        try {
            const orderFormData = new FormData();
            
            const itensParaApi = cartItems.map(item => ({
                name: item.name,
                slug: item.slug,
                price: item.price,
                formData: item.formData,
            }));
            
            orderFormData.append('itens', JSON.stringify(itensParaApi));
            orderFormData.append('dadosCliente', JSON.stringify(clientData));

            cartItems.forEach((item) => {
                if (item.attachedFile) {
                    orderFormData.append('anexosCliente', item.attachedFile, item.attachedFile.name);
                }
            });

            const pedidoResponse = await api.post('/pedidos', orderFormData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            
            const novoPedido = pedidoResponse.data.pedido;

            clearCart();

            const checkoutResponse = await api.post('/pagamentos/criar-checkout', {
                pedidoId: novoPedido.id
            });
            
            const { checkoutUrl } = checkoutResponse.data;

            window.location.href = checkoutUrl;

        } catch (err) {
            console.error("Erro ao finalizar a compra:", err.response?.data || err.message);
            alert(err.response?.data?.message || 'Ocorreu um erro ao processar seu pedido. Por favor, tente novamente.');
            setLoading(false);
        }
    };
    
    const handleAuthSuccess = () => {
        setShowAuthModal(false);
        if (user) {
             setClientData(prev => ({ ...prev, nome: user.nome || '', email: user.email || '' }));
        }
    };
    
    if (!isClient || authLoading) {
        return <PageLoader />; 
    }
    
    const subtotal = cartItems.reduce((acc, item) => acc + (item.price || 0), 0);
    const frete = 0;
    const total = subtotal + frete;

    return (
        <>
            {showAuthModal && <AuthModal onAuthSuccess={handleAuthSuccess} />}
            <Header />
            <main className={styles.pageWrapper}>
                <div className={styles.container}>
                    <h1 className={styles.title}>Finalizar Compra</h1>
                    {itemCount === 0 && isClient ? (
                        <p>Seu carrinho está vazio. <Link href="/certidoes">Voltar para a loja.</Link></p>
                    ) : (
                        <form onSubmit={handleFinalizarCompra} className={styles.checkoutGrid}>
                            <div className={styles.mainContent}>
                                <div className={styles.detailsBox}>
                                    <h2>Dados de Cobrança</h2>
                                    <div className={styles.formRow}>
                                        <div className={styles.formGroup}><label>Nome*</label><input type="text" name="nome" value={clientData.nome} onChange={handleChange} required /></div>
                                        <div className={styles.formGroup}><label>Sobrenome*</label><input type="text" name="sobrenome" value={clientData.sobrenome} onChange={handleChange} required /></div>
                                    </div>
                                    <div className={styles.formGroup}><label>CPF*</label><input type="text" name="cpf" value={clientData.cpf} onChange={handleChange} required placeholder="000.000.000-00"/></div>
                                    <div className={styles.formGroup}><label>E-mail*</label><input type="email" name="email" value={clientData.email} onChange={handleChange} required placeholder="seuemail@dominio.com"/></div>
                                    <div className={styles.formGroup}><label>Telefone*</label><input type="tel" name="telefone" value={clientData.telefone} onChange={handleChange} required placeholder="(00) 00000-0000"/></div>
                                </div>
                                
                                <div className={`${styles.detailsBox} ${styles.paymentBox}`}>
                                    <h2>Pagamento</h2>
                                    <div className={styles.paymentTabs}>
                                        <button type="button" onClick={() => setActivePayment('card')} className={`${styles.paymentTab} ${activePayment === 'card' ? styles.activeTab : ''}`}><CreditCardIcon /> Cartão de crédito</button>
                                        <button type="button" onClick={() => setActivePayment('boleto')} className={`${styles.paymentTab} ${activePayment === 'boleto' ? styles.activeTab : ''}`}><BoletoIcon /> Boleto</button>
                                        <button type="button" onClick={() => setActivePayment('pix')} className={`${styles.paymentTab} ${activePayment === 'pix' ? styles.activeTab : ''}`}><PixIcon /> PIX</button>
                                    </div>
                                    <div className={styles.paymentContent}>
                                         <p>Você será redirecionado para um ambiente seguro para concluir o pagamento com a opção selecionada.</p>
                                    </div>
                                </div>
                            </div>

                            <aside className={styles.orderSummary}>
                                {cartItems.map(item => (
                                    <OrderSummaryCard key={item.cartId} item={item} onRemove={removeFromCart} />
                                ))}
                                <div className={styles.summaryTotalBox}>
                                    <div className={styles.summaryRow}><span>Subtotal</span><span>R$ {subtotal.toFixed(2).replace('.', ',')}</span></div>
                                    <div className={styles.summaryRow}><span>Frete</span><span>A calcular</span></div>
                                    <div className={`${styles.summaryRow} ${styles.summaryTotal}`}><span>Total</span><span>R$ {total.toFixed(2).replace('.', ',')}</span></div>
                                    <button type="submit" disabled={loading || !isAuthenticated} className={styles.checkoutButton}>{loading ? 'Processando...' : 'Ir para Pagamento'}</button>
                                </div>
                            </aside>
                        </form>
                    )}
                </div>
            </main>
            <Footer />
        </>
    );
}