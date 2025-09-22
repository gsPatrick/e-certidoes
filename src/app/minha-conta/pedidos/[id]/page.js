// Salve em: src/app/minha-conta/pedidos/[id]/page.js
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useRouter, useParams } from 'next/navigation';
import api from '@/services/api'; // Importa a instância do Axios

import Header from '@/components/Header/Header';
import Footer from '@/components/Footer/Footer';
import PageLoader from '@/components/PageLoader/PageLoader';
import styles from './DetalhesPedido.module.css';
import { DownloadIcon, PackageIcon } from './Icons';

// Componente de Badge de Status (reutilizável)
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
    const params = useParams(); // Hook para pegar o [id] da URL

    useEffect(() => {
        // Passo 1: Lógica de proteção da rota
        if (!authLoading && !isAuthenticated) {
            router.push('/minha-conta?redirect=/minha-conta/painel');
            return;
        }

        // Passo 2: Buscar os dados do pedido se o usuário estiver autenticado
        if (isAuthenticated && params.id) {
            const fetchPedido = async () => {
                try {
                    const pedidoId = params.id;
                    const { data } = await api.get(`/pedidos/${pedidoId}`);
                    setPedido(data);
                } catch (err) {
                    console.error("Erro ao buscar detalhes do pedido:", err);
                    setError('Pedido não encontrado ou você não tem permissão para acessá-lo.');
                } finally {
                    setLoading(false);
                }
            };
            
            fetchPedido();
        }
    }, [isAuthenticated, authLoading, router, params]);

    // Exibe um loader enquanto a autenticação ou o fetch estão em andamento
    if (authLoading || loading) {
        return <PageLoader />;
    }

    // Exibe uma mensagem de erro se a busca falhar
    if (error) {
        return (
            <>
                <Header />
                <main className={styles.pageWrapper}>
                    <div className={styles.container}>
                        <p className={styles.errorMessage}>{error}</p>
                        <Link href="/minha-conta/painel" className={styles.backButton}>Voltar para Meus Pedidos</Link>
                    </div>
                </main>
                <Footer />
            </>
        );
    }
    
    // Fallback caso o pedido ainda não tenha sido carregado
    if (!pedido) {
        return null; 
    }
    
    // Função para formatar os rótulos do formulário
    const formatLabel = (key) => {
        return key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    return (
        <>
            <Header />
            <main className={styles.pageWrapper}>
                <div className={styles.container}>
                    <div className={styles.breadcrumb}>
                        <Link href="/minha-conta/painel">Meus Pedidos</Link> / <span>Detalhes do Pedido</span>
                    </div>

                    <div className={styles.card}>
                        {/* Cabeçalho do Pedido */}
                        <div className={styles.cardHeader}>
                            <div>
                                <h1 className={styles.protocolo}>Pedido #{pedido.protocolo}</h1>
                                <p className={styles.data}>Realizado em: {new Date(pedido.createdAt).toLocaleDateString('pt-BR')}</p>
                            </div>
                            <StatusBadge status={pedido.status} />
                        </div>

                        {/* Corpo do Card */}
                        <div className={styles.cardBody}>
                            {/* Seção de Andamento */}
                            <section className={styles.section}>
                                <h2 className={styles.sectionTitle}>Andamento</h2>
                                {pedido.observacoesAdmin && (
                                    <div className={styles.adminMessage}>
                                        <strong>Mensagem do Administrador:</strong>
                                        <p>{pedido.observacoesAdmin}</p>
                                    </div>
                                )}
                                {pedido.codigoRastreio && (
                                    <div className={styles.rastreio}>
                                        <PackageIcon />
                                        <div>
                                            <strong>Código de Rastreio:</strong>
                                            <span>{pedido.codigoRastreio}</span>
                                        </div>
                                    </div>
                                )}
                                {!pedido.observacoesAdmin && !pedido.codigoRastreio && (
                                    <p className={styles.noUpdates}>Nenhuma atualização no momento.</p>
                                )}
                            </section>

                            {/* Seção de Download (renderização condicional) */}
                            {pedido.status === 'Concluído' && pedido.arquivos && pedido.arquivos.length > 0 && (
                                <section className={styles.section}>
                                    <h2 className={styles.sectionTitle}>Documentos</h2>
                                    <div className={styles.downloadList}>
                                        {pedido.arquivos.map(arquivo => (
                                            <a 
                                                // A URL base da API já é configurada no 'api.js' do Axios, mas para downloads diretos via <a>, é mais seguro usar a URL completa.
                                                href={`${process.env.NEXT_PUBLIC_API_URL}/pedidos/${pedido.id}/arquivos/${arquivo.id}/download`}
                                                key={arquivo.id} 
                                                className={styles.downloadButton}
                                                download={arquivo.nomeOriginal} // Força o download com o nome original do arquivo
                                                rel="noopener noreferrer"
                                            >
                                                <DownloadIcon />
                                                Baixar: {arquivo.nomeOriginal}
                                            </a>
                                        ))}
                                    </div>
                                </section>
                            )}

                            {/* Detalhes do Serviço Contratado */}
                            <section className={styles.section}>
                                <h2 className={styles.sectionTitle}>Detalhes do Serviço Contratado</h2>
                                {pedido.itens && pedido.itens.map((item, index) => (
                                    <div key={index} className={styles.itemDetails}>
                                        <h3 className={styles.itemName}>{item.nomeProduto}</h3>
                                        <dl className={styles.formDataList}>
                                            {Object.entries(item.dadosFormulario).map(([key, value]) => (
                                                value && (
                                                    <div key={key} className={styles.formDataItem}>
                                                        <dt>{formatLabel(key)}</dt>
                                                        <dd>{String(value)}</dd>
                                                    </div>
                                                )
                                            ))}
                                        </dl>
                                    </div>
                                ))}
                            </section>

                            {/* Resumo Financeiro */}
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