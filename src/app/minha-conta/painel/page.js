    // Salve em: src/app/minha-conta/painel/page.js
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import api from '@/services/api';

import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import PageLoader from '@/components/PageLoader/PageLoader';
import styles from './MeusPedidos.module.css';

// Componente auxiliar para o badge de status
const StatusBadge = ({ status }) => {
    const statusClass = {
      'Aguardando Pagamento': styles.statusPendente,
      'Processando': styles.statusProcessando,
      'Busca em Andamento': styles.statusProcessando,
      'Concluído': styles.statusConcluido,
      'Cancelado': styles.statusCancelado,
    }[status] || styles.statusDefault;
  
    return <span className={`${styles.statusBadge} ${statusClass}`}>{status}</span>;
};

export default function MeusPedidosPage() {
    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { isAuthenticated, authLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/minha-conta');
        }
    }, [isAuthenticated, authLoading, router]);

    useEffect(() => {
        const fetchPedidos = async () => {
            if (isAuthenticated) {
                try {
                    const { data } = await api.get('/pedidos/meus-pedidos');
                    setPedidos(data);
                } catch (err) {
                    setError('Não foi possível carregar seus pedidos. Tente novamente mais tarde.');
                    console.error(err);
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchPedidos();
    }, [isAuthenticated]);

    if (authLoading || loading) {
        return <PageLoader />;
    }

    return (
        <>
            <Header />
            <main className={styles.pageWrapper}>
                <div className={styles.container}>
                    <h1 className={styles.title}>Meus Pedidos</h1>
                    {error && <p className={styles.errorMessage}>{error}</p>}
                    
                    {!error && (
                        pedidos.length === 0 ? (
                            <div className={styles.emptyState}>
                                <p>Você ainda não realizou nenhum pedido.</p>
                                <Link href="/certidoes" className={styles.ctaButton}>
                                    Solicitar Certidão
                                </Link>
                            </div>
                        ) : (
                            <div className={styles.pedidosList}>
                                {pedidos.map(pedido => (
                                    <div key={pedido.id} className={styles.pedidoCard}>
                                        <div className={styles.cardHeader}>
                                            <div>
                                                <span className={styles.protocolo}>Pedido #{pedido.protocolo}</span>
                                                <span className={styles.data}>Realizado em: {new Date(pedido.createdAt).toLocaleDateString('pt-BR')}</span>
                                            </div>
                                            <StatusBadge status={pedido.status} />
                                        </div>
                                        <div className={styles.cardBody}>
                                            <div className={styles.infoItem}>
                                                <strong>Valor Total:</strong>
                                                <span>R$ {parseFloat(pedido.valorTotal).toFixed(2).replace('.', ',')}</span>
                                            </div>
                                        </div>
                                        <div className={styles.cardFooter}>
                                            <Link href={`/minha-conta/pedidos/${pedido.id}`} className={styles.detailsButton}>
                                                Ver Detalhes
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )
                    )}
                </div>
            </main>
            <Footer />
        </>
    );
}