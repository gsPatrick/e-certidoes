// Salve em: src/app/finalizar-compra/page.js
'use client';

import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import PageLoader from '@/components/PageLoader/PageLoader'; // Importa o loader
import styles from './Checkout.module.css';
import { CreditCardIcon, PixIcon, BoletoIcon } from './SecurityIcons';

// Função para formatar as chaves do objeto em labels legíveis
const formatLabel = (key) => {
    // Adiciona exceções para não formatar chaves específicas
    if (['cpf', 'cnpj', 'rg'].includes(key.toLowerCase())) {
        return key.toUpperCase();
    }
    return key
        .replace(/_/g, ' ')
        .replace(/\b\w/g, char => char.toUpperCase());
};

// Componente auxiliar para renderizar detalhes no resumo
const DetailItem = ({ label, value }) => {
    if (value === null || value === undefined || value === '' || value === false) {
        return null;
    }
    const displayValue = typeof value === 'boolean' ? 'Sim' : String(value);
    return (
        <div className={styles.summaryDetailItem}>
            <span className={styles.detailLabel}>{label}:</span>
            <span className={styles.detailValue}>{displayValue}</span>
        </div>
    );
};

// Componente para o card de resumo do pedido na sidebar
const OrderSummaryCard = ({ item, onRemove }) => {
    if (!item || !item.formData) return null;
    const { formData } = item;
    
    // Lista de chaves a serem ignoradas na exibição dos detalhes
    const excludeKeys = new Set([
        'aceite_lgpd', 'ciente', 'tipo_pesquisa', 'tipo_pessoa',
        'requerente_nome', 'requerente_cpf', 'requerente_email', 'requerente_telefone', 'requerente_rg'
    ]);

    const allDetails = Object.entries(formData)
        .filter(([key]) => !excludeKeys.has(key));

    return (
        <div className={styles.summaryCard}>
            <div className={styles.summaryCardHeader}>
                <h4 className={styles.summaryCardTitle}>{item.name}</h4>
                <button onClick={() => onRemove(item.cartId)} className={styles.deleteButton} title="Remover item">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
                </button>
            </div>
            <div className={styles.summaryCardBody}>
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
    const { cartItems, itemCount, removeFromCart } = useCart();
    const { user, isAuthenticated, loading: authLoading } = useAuth();
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [activePayment, setActivePayment] = useState('card');
    const [isClient, setIsClient] = useState(false);
    
    useEffect(() => {
        setIsClient(true);
        // CORREÇÃO: Lógica de redirecionamento para login
        if (!authLoading && !isAuthenticated) {
            router.push('/minha-conta?redirect=/finalizar-compra');
        }
    }, [isAuthenticated, authLoading, router]);

    const subtotal = cartItems.reduce((acc, item) => acc + (item.price || 0), 0);
    const frete = 0; // Pode ser ajustado no futuro
    const total = subtotal + frete;

    const handleFinalizarCompra = async (e) => {
        e.preventDefault();
        setLoading(true);
        const orderData = { user, items: cartItems, paymentMethod: activePayment, total };
        console.log("Enviando para API de pagamento:", orderData);
        alert(`Iniciando pagamento de R$ ${total.toFixed(2)} via ${activePayment}...`);
        // Simulação de chamada de API
        await new Promise(resolve => setTimeout(resolve, 2000));
        setLoading(false);
        // router.push('/pedido-confirmado/12345'); // Exemplo de redirecionamento pós-pagamento
    };
    
    // CORREÇÃO: Exibe um loader enquanto verifica a autenticação
    if (!isClient || authLoading) {
        return <PageLoader />; 
    }
    
    // Se não estiver autenticado após o loading, a página fica em branco enquanto o redirect acontece
    if(!isAuthenticated) {
        return null;
    }

    return (
        <>
            <Header />
            <main className={styles.pageWrapper}>
                <div className={styles.container}>
                    <h1 className={styles.title}>Finalizar Compra</h1>
                    {itemCount === 0 ? (
                        <p>Seu carrinho está vazio. <Link href="/certidoes">Voltar para a loja.</Link></p>
                    ) : (
                        <form onSubmit={handleFinalizarCompra} className={styles.checkoutGrid}>
                            <div className={styles.mainContent}>
                                {/* CORREÇÃO: Seção "Detalhes da Cobrança" foi removida */}
                                <div className={`${styles.detailsBox} ${styles.paymentBox}`}>
                                    <h2>Pagamento</h2>
                                    <div className={styles.paymentTabs}>
                                        <button type="button" onClick={() => setActivePayment('card')} className={`${styles.paymentTab} ${activePayment === 'card' ? styles.activeTab : ''}`}><CreditCardIcon /> Cartão de crédito</button>
                                        <button type="button" onClick={() => setActivePayment('boleto')} className={`${styles.paymentTab} ${activePayment === 'boleto' ? styles.activeTab : ''}`}><BoletoIcon /> Boleto</button>
                                        <button type="button" onClick={() => setActivePayment('pix')} className={`${styles.paymentTab} ${activePayment === 'pix' ? styles.activeTab : ''}`}><PixIcon /> PIX</button>
                                    </div>
                                    <div className={styles.paymentContent}>
                                         {activePayment === 'card' && (
                                            <div className={styles.creditCardForm}>
                                                <div className={styles.formGroup}><label>Número do cartão</label><input type="text" placeholder="0000 0000 0000 0000" required/></div>
                                                <div className={styles.creditCardGrid}>
                                                    <div className={styles.formGroup}><label>Validade (MM/AA)</label><input type="text" placeholder="MM/AA" required/></div>
                                                    <div className={styles.formGroup}><label>Código (CVV)</label><input type="text" placeholder="123" required/></div>
                                                </div>
                                                <div className={styles.formGroup}><label>Parcelas</label>
                                                    {/* CORREÇÃO: Removido "sem juros" */}
                                                    <select>
                                                        <option>1x de R$ {total.toFixed(2).replace('.',',')}</option>
                                                        <option>2x de R$ {(total / 2).toFixed(2).replace('.',',')}</option>
                                                        <option>3x de R$ {(total / 3).toFixed(2).replace('.',',')}</option>
                                                    </select>
                                                </div>
                                            </div>
                                        )}
                                        {activePayment === 'boleto' && <p>Ao finalizar a compra, seu boleto será gerado com vencimento para o próximo dia útil.</p>}
                                        {activePayment === 'pix' && <p>Ao finalizar a compra, um QR Code será gerado para pagamento. A confirmação é instantânea.</p>}
                                    </div>
                                </div>
                            </div>

                            <aside className={styles.orderSummary}>
                                {cartItems.map(item => (
                                    <OrderSummaryCard key={item.cartId} item={item} onRemove={removeFromCart} />
                                ))}
                                <div className={styles.summaryTotalBox}>
                                    <div className={styles.summaryRow}><span>Subtotal</span><span>R$ {subtotal.toFixed(2).replace('.', ',')}</span></div>
                                    <div className={styles.summaryRow}><span>Frete</span><span>R$ {frete.toFixed(2).replace('.', ',')}</span></div>
                                    <div className={`${styles.summaryRow} ${styles.summaryTotal}`}><span>Total</span><span>R$ {total.toFixed(2).replace('.', ',')}</span></div>
                                    <button type="submit" disabled={loading} className={styles.checkoutButton}>{loading ? 'Processando...' : 'Finalizar Pedido'}</button>
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