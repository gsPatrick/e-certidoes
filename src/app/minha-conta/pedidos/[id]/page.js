// Salve em: src/app/minha-conta/pedidos/[id]/page.js
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter, useParams } from 'next/navigation';
import api from '@/services/api';

import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import PageLoader from '@/components/PageLoader/PageLoader';
import styles from './DetalhesPedido.module.css';
import { DownloadIcon, PackageIcon } from './Icons';

// Componente de Badge de Status
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

export default function DetalhesPedidoPage() {
    const [pedido, setPedido] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const { isAuthenticated, authLoading } = useAuth();
    const router = useRouter();
    const params = useParams();

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/minha-conta');
            return;
        }

        if (isAuthenticated && params.id) {
            const fetchPedido = async () => {
                try {
                    const { data } = await api.get(`/pedidos/${params.id}`);
                    setPedido(data);
                } catch (err) {
                    setError('Pedido não encontrado ou você não tem permissão para acessá-lo.');
                } finally {
                    setLoading(false);
                }
            };
            fetchPedido();
        }
    }, [isAuthenticated, authLoading, router, params]);

    if (authLoading || loading) {
        return <PageLoader />;
    }

    if (error || !pedido) {
        return (
            <>
                <Header />
                <main className={styles.pageWrapper}><div className={styles.container}><p>{error || 'Pedido não encontrado.'}</p></div></main>
                <Footer />
            </>
        );
    }
    
    const formatLabel = (key) => key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

    // Filtra os arquivos enviados pelo admin e pelo cliente
    const arquivosAdmin = pedido.arquivos?.filter(a => a.tipo === 'certidao') || [];
    const arquivosCliente = pedido.arquivos?.filter(a => a.tipo === 'comprovante') || [];

    return (
        <>
            <Header />
            <main className={styles.pageWrapper}>
                <div className={styles.container}>
                    <div className={styles.breadcrumb}>
                        <Link href="/minha-conta/painel">Meus Pedidos</Link> / <span>Detalhes do Pedido</span>
                    </div>
                    <div className={styles.card}>
                        <div className={styles.cardHeader}>
                            <div>
                                <h1 className={styles.protocolo}>Pedido #{pedido.protocolo}</h1>
                                <p className={styles.data}>Realizado em: {new Date(pedido.createdAt).toLocaleDateString('pt-BR')}</p>
                            </div>
                            <StatusBadge status={pedido.status} />
                        </div>
                        <div className={styles.cardBody}>
                            <section className={styles.section}>
                                <h2 className={styles.sectionTitle}>Andamento</h2>
                                {pedido.observacoesAdmin && <div className={styles.adminMessage}><strong>Mensagem do Administrador:</strong><p>{pedido.observacoesAdmin}</p></div>}
                                {pedido.codigoRastreio && <div className={styles.rastreio}><PackageIcon /><div><strong>Código de Rastreio:</strong><span>{pedido.codigoRastreio}</span></div></div>}
                                {!pedido.observacoesAdmin && !pedido.codigoRastreio && <p>Nenhuma atualização no momento.</p>}
                            </section>

                            {arquivosAdmin.length > 0 && (
                                <section className={styles.section}>
                                    <h2 className={styles.sectionTitle}>Documentos Recebidos</h2>
                                    <div className={styles.downloadList}>
                                        {arquivosAdmin.map(arquivo => (
                                            <a href={`${process.env.NEXT_PUBLIC_API_URL}/api/pedidos/${pedido.id}/arquivos/${arquivo.id}/download`} key={arquivo.id} className={styles.downloadButton} download={arquivo.nomeOriginal} rel="noopener noreferrer">
                                                <DownloadIcon />
                                                Baixar: {arquivo.nomeOriginal}
                                            </a>
                                        ))}
                                    </div>
                                </section>
                            )}
                            
                            {/* --- NOVA SEÇÃO PARA ANEXOS DO CLIENTE --- */}
                            {arquivosCliente.length > 0 && (
                                <section className={styles.section}>
                                    <h2 className={styles.sectionTitle}>Seus Anexos Enviados</h2>
                                    <ul className={styles.anexosList}>
                                        {arquivosCliente.map(arquivo => (
                                            <li key={arquivo.id}>{arquivo.nomeOriginal}</li>
                                        ))}
                                    </ul>
                                </section>
                            )}
                            {/* --- FIM DA NOVA SEÇÃO --- */}

                            <section className={styles.section}>
                                <h2 className={styles.sectionTitle}>Detalhes do Serviço Contratado</h2>
                                {pedido.itens.map((item, index) => (
                                    <div key={index}>
                                        <h3 className={styles.itemName}>{item.nomeProduto}</h3>
                                        <dl className={styles.formDataList}>
                                            {Object.entries(item.dadosFormulario).map(([key, value]) => value && (
                                                <div key={key} className={styles.formDataItem}>
                                                    <dt>{formatLabel(key)}</dt>
                                                    <dd>{String(value)}</dd>
                                                </div>
                                            ))}
                                        </dl>
                                    </div>
                                ))}
                            </section>

                            <section className={`${styles.section} ${styles.noBorder}`}>
                                <h2 className={styles.sectionTitle}>Resumo Financeiro</h2>
                                <div className={styles.totalRow}>
                                    <strong>Total Pago</strong>
                                    <span>R$ {parseFloat(pedido.valorTotal).toFixed(2).replace('.', ',')}</span>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </main>
            <Footer />
        </>
    );
}