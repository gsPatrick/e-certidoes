// Salve em: src/app/admin/dashboard/page.js
'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import api from '@/services/api'; // Sua instância do Axios para chamadas de API
import AdminLayout from '../AdminLayout'; // O layout que protege a rota
import styles from './Dashboard.module.css';

// Componente auxiliar para exibir o status com cores
const StatusBadge = ({ status }) => {
    // Mapeia o status do pedido para uma classe CSS específica
    const statusClass = {
      'Aguardando Pagamento': styles.statusPendente,
      'Processando': styles.statusProcessando,
      'Busca em Andamento': styles.statusBusca,
      'Concluído': styles.statusConcluido,
      'Cancelado': styles.statusCancelado,
    }[status] || styles.statusDefault;
  
    return <span className={`${styles.statusBadge} ${statusClass}`}>{status}</span>;
};

export default function AdminDashboardPage() {
    // Estado para armazenar a lista de pedidos vinda da API
    const [pedidos, setPedidos] = useState([]);
    // Estado para controlar o loading da página
    const [loading, setLoading] = useState(true);
    // Estado para armazenar mensagens de erro
    const [error, setError] = useState('');
    // Estado para controlar o filtro de status selecionado
    const [filtroStatus, setFiltroStatus] = useState('Todos');

    // Hook que executa a busca dos pedidos assim que o componente é montado
    useEffect(() => {
        const fetchPedidos = async () => {
            try {
                // Faz a chamada GET para a rota de admin que lista todos os pedidos
                const { data } = await api.get('/admin/pedidos');
                // Armazena a lista de pedidos no estado
                setPedidos(data.pedidos);
            } catch (err) {
                // Em caso de erro, define uma mensagem amigável
                setError('Falha ao carregar os pedidos. Verifique a conexão com a API.');
                console.error("Erro ao buscar pedidos:", err);
            } finally {
                // Garante que o estado de loading seja desativado, com ou sem erro
                setLoading(false);
            }
        };
        fetchPedidos();
    }, []); // O array vazio [] garante que isso rode apenas uma vez

    // Otimização: a lista de pedidos filtrados só é recalculada se 'pedidos' ou 'filtroStatus' mudarem
    const pedidosFiltrados = useMemo(() => {
        if (filtroStatus === 'Todos') {
            return pedidos; // Se o filtro for 'Todos', retorna a lista completa
        }
        // Caso contrário, retorna apenas os pedidos que correspondem ao status do filtro
        return pedidos.filter(p => p.status === filtroStatus);
    }, [pedidos, filtroStatus]);

    // Renderiza um estado de carregamento enquanto a API não responde
    if (loading) {
        return (
            <AdminLayout>
                <div className={styles.loadingState}>Carregando pedidos...</div>
            </AdminLayout>
        );
    }

    // Renderiza uma mensagem de erro se a chamada à API falhar
    if (error) {
        return (
            <AdminLayout>
                <div className={styles.errorState}>{error}</div>
            </AdminLayout>
        );
    }
    
    // Renderização principal do componente
    return (
        <AdminLayout>
            <h1 className={styles.title}>Dashboard de Pedidos</h1>
            
            {/* Botões para filtrar a tabela por status */}
            <div className={styles.filters}>
                <button onClick={() => setFiltroStatus('Todos')} className={filtroStatus === 'Todos' ? styles.active : ''}>Todos</button>
                <button onClick={() => setFiltroStatus('Aguardando Pagamento')} className={filtroStatus === 'Aguardando Pagamento' ? styles.active : ''}>Aguardando Pagamento</button>
                <button onClick={() => setFiltroStatus('Processando')} className={filtroStatus === 'Processando' ? styles.active : ''}>Processando</button>
                <button onClick={() => setFiltroStatus('Busca em Andamento')} className={filtroStatus === 'Busca em Andamento' ? styles.active : ''}>Busca em Andamento</button>
                <button onClick={() => setFiltroStatus('Concluído')} className={filtroStatus === 'Concluído' ? styles.active : ''}>Concluídos</button>
                <button onClick={() => setFiltroStatus('Cancelado')} className={filtroStatus === 'Cancelado' ? styles.active : ''}>Cancelados</button>
            </div>

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
                        {pedidosFiltrados.length > 0 ? (
                            // Mapeia a lista de pedidos filtrados para criar as linhas da tabela
                            pedidosFiltrados.map(pedido => (
                                <tr key={pedido.id}>
                                    <td data-label="Protocolo">{pedido.protocolo || '-'}</td>
                                    <td data-label="Data">{new Date(pedido.createdAt).toLocaleDateString('pt-BR')}</td>
                                    {/* Usa o optional chaining (?.) para evitar erro se o cliente for nulo */}
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
                            // Exibe uma mensagem se não houver pedidos com o filtro selecionado
                            <tr>
                                <td colSpan="6" className={styles.emptyState}>Nenhum pedido encontrado com este status.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </AdminLayout>
    );
}