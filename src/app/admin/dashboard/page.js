// Salve em: src/app/admin/dashboard/page.js
'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import api from '@/services/api';
import AdminLayout from '../AdminLayout';
import styles from './Dashboard.module.css';

// --- DICIONÁRIO / MAPEAMENTO DE STATUS ---
// Este objeto centraliza a "tradução" dos status.
// A chave é o valor exato que o backend usa/espera.
const statusMap = {
    'Aguardando Pagamento': { text: 'Aguardando Pagamento', badge: styles.statusPendente },
    'Processando': { text: 'Processando', badge: styles.statusProcessando },
    'Busca em Andamento': { text: 'Busca em Andamento', badge: styles.statusBusca },
    'Concluído': { text: 'Concluído', badge: styles.statusConcluido },
    'Cancelado': { text: 'Cancelado', badge: styles.statusCancelado },
};

// Objeto para gerar os botões de filtro.
// A chave é o texto que aparece no botão, e o valor é o status real enviado para a API.
const filterButtons = {
    'Todos': '',
    'Aguardando Pagamento': 'Aguardando Pagamento',
    'Processando': 'Processando',
    'Busca em Andamento': 'Busca em Andamento',
    'Concluídos': 'Concluído', // Exibe "Concluídos", mas filtra por "Concluído"
    'Cancelados': 'Cancelado',   // Exibe "Cancelados", mas filtra por "Cancelado"
};

// Componente auxiliar para o badge de status, usando o mapeamento
const StatusBadge = ({ status }) => {
    const statusInfo = statusMap[status] || { text: status, badge: styles.statusDefault };
    return <span className={`${styles.statusBadge} ${statusInfo.badge}`}>{statusInfo.text}</span>;
};

// Componente auxiliar para a paginação
const Paginacao = ({ currentPage, totalPages, onPageChange }) => {
    if (totalPages <= 1) return null;

    const paginas = Array.from({ length: totalPages }, (_, i) => i + 1);

    return (
        <div className={styles.pagination}>
            <button onClick={() => onPageChange(currentPage - 1)} disabled={currentPage === 1}>
                &laquo; Anterior
            </button>
            {paginas.map(p => (
                <button 
                    key={p} 
                    onClick={() => onPageChange(p)}
                    className={p === currentPage ? styles.activePage : ''}
                >
                    {p}
                </button>
            ))}
            <button onClick={() => onPageChange(currentPage + 1)} disabled={currentPage === totalPages}>
                Próxima &raquo;
            </button>
        </div>
    );
};

export default function AdminDashboardPage() {
    const [pedidos, setPedidos] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filtroStatus, setFiltroStatus] = useState(''); // Armazena o valor REAL do status para a API
    
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalPedidos, setTotalPedidos] = useState(0);
    const limit = 15; // Define quantos itens por página

    const fetchPedidos = useCallback(async () => {
        setLoading(true);
        setError('');
        try {
            const params = new URLSearchParams({ page: currentPage, limit });
            if (filtroStatus) {
                params.append('status', filtroStatus);
            }
            
            const { data } = await api.get(`/admin/pedidos?${params.toString()}`);
            
            setPedidos(data.pedidos);
            setTotalPages(data.totalPages);
            setTotalPedidos(data.totalPedidos);
            
        } catch (err) {
            setError('Falha ao carregar os pedidos. Tente novamente mais tarde.');
            console.error("Erro ao buscar pedidos:", err);
        } finally {
            setLoading(false);
        }
    }, [currentPage, filtroStatus]);

    useEffect(() => {
        fetchPedidos();
    }, [fetchPedidos]);

    const handleFilterChange = (statusValue) => {
        setFiltroStatus(statusValue);
        setCurrentPage(1); // Sempre volta para a página 1 ao aplicar um novo filtro
    };
    
    return (
        <AdminLayout>
            <h1 className={styles.title}>Dashboard de Pedidos ({totalPedidos})</h1>
            
            <div className={styles.filters}>
                {Object.entries(filterButtons).map(([text, value]) => (
                    <button
                        key={text}
                        onClick={() => handleFilterChange(value)}
                        className={filtroStatus === value ? styles.active : ''}
                    >
                        {text}
                    </button>
                ))}
            </div>

            {loading ? (
                 <div className={styles.loadingState}>Carregando pedidos...</div>
            ) : error ? (
                <div className={styles.errorState}>{error}</div>
            ) : (
                <>
                    <div className={styles.tableContainer}>
                        <table className={styles.pedidosTable}>
                            <thead>
                                <tr>
                                    <th>Protocolo</th>
                                    <th>Data</th>
                                    <th>Cliente</th>
                                    <th>Valor</th>
                                    <th>Status</th>
                                    <th>Ações</th>
                                </tr>
                            </thead>
                            <tbody>
                                {pedidos.length > 0 ? (
                                    pedidos.map(pedido => (
                                        <tr key={pedido.id}>
                                            <td data-label="Protocolo">{pedido.protocolo || '-'}</td>
                                            <td data-label="Data">{new Date(pedido.createdAt).toLocaleDateString('pt-BR')}</td>
                                            <td data-label="Cliente">{pedido.cliente?.nome || 'Cliente não informado'}</td>
                                            <td data-label="Valor">R$ {parseFloat(pedido.valorTotal).toFixed(2).replace('.', ',')}</td>
                                            <td data-label="Status"><StatusBadge status={pedido.status} /></td>
                                            <td data-label="Ações">
                                                <Link href={`/admin/pedidos/${pedido.id}`} className={styles.actionButton}>
                                                    Gerenciar
                                                </Link>
                                            </td>
                                        </tr>
                                    ))
                                ) : (
                                    <tr>
                                        <td colSpan="6" className={styles.emptyState}>Nenhum pedido encontrado com este status.</td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                    <Paginacao currentPage={currentPage} totalPages={totalPages} onPageChange={setCurrentPage} />
                </>
            )}
        </AdminLayout>
    );
}