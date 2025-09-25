// Salve em: src/app/admin/pedidos/[id]/page.js
'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import api from '@/services/api';
import AdminLayout from '../../AdminLayout';
import PageLoader from '@/components/PageLoader/PageLoader';
import styles from './GerenciarPedido.module.css';

// Mapeamento para os status do PEDIDO, dando controle total ao admin
const statusOptions = {
    'Aguardando Pagamento': 'Aguardando Pagamento',
    'Processando': 'Processando',
    'Busca em Andamento': 'Busca em Andamento',
    'Concluído': 'Concluído',
    'Cancelado': 'Cancelado'
};

// Mapeamento para os status do PAGAMENTO (para exibição)
const paymentStatusMap = {
    'aprovado': { text: 'Aprovado', className: styles.statusAprovado },
    'pendente': { text: 'Pendente', className: styles.statusPendentePg },
    'recusado': { text: 'Recusado', className: styles.statusRecusado },
    'estornado': { text: 'Estornado', className: styles.statusEstornado }
};

export default function GerenciarPedidoPage() {
    const [pedido, setPedido] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    // Estados para os campos do formulário
    const [status, setStatus] = useState('');
    const [codigoRastreio, setCodigoRastreio] = useState('');
    const [observacoes, setObservacoes] = useState('');
    const [arquivo, setArquivo] = useState(null);

    // Estados para controle de ações e feedback
    const [isSaving, setIsSaving] = useState(false);
    const [isRefunding, setIsRefunding] = useState(false);

    const params = useParams();
    const router = useRouter();
    const pedidoId = params.id;

    const fetchPedido = useCallback(async () => {
        setLoading(true);
        try {
            const { data } = await api.get(`/admin/pedidos/${pedidoId}`);
            setPedido(data);
            setStatus(data.status);
            setCodigoRastreio(data.codigoRastreio || '');
            setObservacoes(data.observacoesAdmin || '');
        } catch (err) {
            setError('Pedido não encontrado ou falha ao carregar os dados.');
            console.error("Erro ao buscar pedido:", err);
        } finally {
            setLoading(false);
        }
    }, [pedidoId]);

    useEffect(() => {
        if (pedidoId) {
            fetchPedido();
        }
    }, [pedidoId, fetchPedido]);

    const handleSalvarAlteracoes = async () => {
        if (!confirm('Você tem certeza que deseja salvar estas alterações?')) return;

        setIsSaving(true);
        try {
            const updateData = { status, codigoRastreio, observacoesAdmin: observacoes };
            await api.put(`/admin/pedidos/${pedidoId}`, updateData);

            if (arquivo) {
                const formData = new FormData();
                formData.append('arquivoCertidao', arquivo);
                await api.post(`/admin/pedidos/${pedidoId}/upload`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
            }

            alert('Pedido atualizado com sucesso!');
            await fetchPedido(); 
            setArquivo(null); 
            const uploadInput = document.getElementById('upload');
            if(uploadInput) uploadInput.value = null;

        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Ocorreu um erro ao atualizar o pedido.';
            alert(`Erro: ${errorMessage}`);
        } finally {
            setIsSaving(false);
        }
    };

    const handleEstornarPedido = async () => {
        if (!confirm('ATENÇÃO: Esta ação irá estornar o pagamento do cliente no Mercado Pago e não poderá ser desfeita. Deseja continuar?')) return;

        setIsRefunding(true);
        try {
            await api.post(`/admin/pedidos/${pedidoId}/estornar`);
            alert('Pagamento estornado com sucesso! O pedido foi marcado como Cancelado.');
            router.push('/admin/dashboard');
        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Ocorreu um erro ao processar o estorno.';
            alert(`Erro: ${errorMessage}`);
        } finally {
            setIsRefunding(false);
        }
    };
    
    const formatLabel = (key) => key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

    if (loading) return <AdminLayout><PageLoader /></AdminLayout>;
    if (error) return <AdminLayout><div>{error}</div></AdminLayout>;
    if (!pedido) return null;

    const arquivosAdmin = pedido.arquivos?.filter(a => a.tipo === 'certidao') || [];
    const arquivosCliente = pedido.arquivos?.filter(a => a.tipo === 'comprovante') || [];
    const podeEstornar = pedido.pagamento?.status === 'aprovado' && pedido.status !== 'Cancelado';
    const paymentStatusInfo = pedido.pagamento ? paymentStatusMap[pedido.pagamento.status] : null;

    return (
        <AdminLayout>
            <div className={styles.header}>
                <Link href="/admin/dashboard" className={styles.backLink}>&larr; Voltar para a lista de pedidos</Link>
                <h1 className={styles.title}>Gerenciar Pedido <span>#{pedido.protocolo}</span></h1>
            </div>

            <div className={styles.grid}>
                <div className={styles.pedidoDetails}>
                    <div className={styles.card}>
                        <h2 className={styles.cardTitle}>Detalhes do Cliente</h2>
                        <div className={styles.cardContent}>
                            <p><strong>Nome:</strong> {pedido.dadosCliente?.nome} {pedido.dadosCliente?.sobrenome}</p>
                            <p><strong>Email:</strong> {pedido.dadosCliente?.email}</p>
                            <p><strong>CPF:</strong> {pedido.dadosCliente?.cpf}</p>
                            <p><strong>Telefone:</strong> {pedido.dadosCliente?.telefone}</p>
                        </div>
                    </div>
                    
                    {pedido.dadosCliente?.cep && (
                        <div className={styles.card}>
                            <h2 className={styles.cardTitle}>Endereço de Entrega</h2>
                            <div className={styles.cardContent}>
                                <p>{pedido.dadosCliente.endereco}, {pedido.dadosCliente.numero} {pedido.dadosCliente.complemento}</p>
                                <p>{pedido.dadosCliente.bairro}, {pedido.dadosCliente.cidade} - {pedido.dadosCliente.estado}</p>
                                <p><strong>CEP:</strong> {pedido.dadosCliente.cep}</p>
                            </div>
                        </div>
                    )}

                    <div className={styles.card}>
                        <h2 className={styles.cardTitle}>Serviço(s) Contratado(s)</h2>
                        <div className={styles.cardContent}>
                            {pedido.itens.map((item, index) => (
                                <div key={index} className={styles.itemNameWrapper}>
                                    <h3 className={styles.itemName}>{item.nomeProduto}</h3>
                                    <dl className={styles.formDataList}>
                                        {Object.entries(item.dadosFormulario).map(([key, value]) => (value && (
                                            <div key={key} className={styles.formDataItem}>
                                                <dt>{formatLabel(key)}</dt>
                                                <dd>{String(value)}</dd>
                                            </div>
                                        )))}
                                    </dl>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    {arquivosCliente.length > 0 && (
                        <div className={styles.card}>
                            <h2 className={styles.cardTitle}>Documentos Enviados pelo Cliente</h2>
                            <div className={styles.cardContent}>
                                <ul className={styles.fileDownloadList}>
                                    {arquivosCliente.map(arq => (
                                        <li key={arq.id}>
                                            <span>{arq.nomeOriginal}</span>
                                            <a href={`${process.env.NEXT_PUBLIC_API_URL}/api/pedidos/${pedido.id}/arquivos/${arq.id}/download`} download rel="noopener noreferrer" className={styles.downloadLink}>Baixar</a>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </div>
                    )}
                </div>

                <aside className={styles.adminActions}>
                    {pedido.pagamento && (
                        <div className={`${styles.card} ${styles.paymentStatusCard}`}>
                            <h2 className={styles.cardTitle}>Status do Pagamento</h2>
                            <div className={styles.cardContent}>
                                <div className={styles.paymentStatusContent}>
                                    <span className={`${styles.paymentBadge} ${paymentStatusInfo?.className}`}>
                                        {paymentStatusInfo?.text || 'Indefinido'}
                                    </span>
                                    <span>Método: {pedido.pagamento.metodo || 'N/A'}</span>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className={styles.card}>
                        <h2 className={styles.cardTitle}>Ações do Administrador</h2>
                        <div className={styles.cardContent}>
                            <div className={styles.formGroup}>
                                <label htmlFor="status">Alterar Status do Pedido</label>
                                <select id="status" value={status} onChange={(e) => setStatus(e.target.value)} className={styles.select}>
                                    {Object.entries(statusOptions).map(([value, text]) => (
                                        <option key={value} value={value}>{text}</option>
                                    ))}
                                </select>
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="codigoRastreio">Código de Rastreio</label>
                                <input type="text" id="codigoRastreio" value={codigoRastreio} onChange={(e) => setCodigoRastreio(e.target.value)} className={styles.input} />
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="observacoes">Observações (visível para o cliente)</label>
                                <textarea id="observacoes" value={observacoes} onChange={(e) => setObservacoes(e.target.value)} rows="4" className={styles.textarea}></textarea>
                            </div>
                            <div className={styles.formGroup}>
                                <label htmlFor="upload">Enviar Certidão Finalizada (PDF)</label>
                                <input type="file" id="upload" onChange={(e) => setArquivo(e.target.files[0])} className={styles.input} accept=".pdf"/>
                                {arquivosAdmin.length > 0 && (
                                    <div className={styles.fileList}><p>Certidões já enviadas:</p><ul>{arquivosAdmin.map(arq => <li key={arq.id}>{arq.nomeOriginal}</li>)}</ul></div>
                                )}
                            </div>
                        </div>
                        <div className={styles.cardFooter}>
                            <button onClick={handleSalvarAlteracoes} className={styles.saveButton} disabled={isSaving || isRefunding}>
                                {isSaving ? 'Salvando...' : 'Salvar Alterações'}
                            </button>
                        </div>
                        
                        {podeEstornar && (
                             <div className={`${styles.cardFooter} ${styles.dangerZone}`}>
                                <button onClick={handleEstornarPedido} className={styles.refundButton} disabled={isSaving || isRefunding}>
                                    {isRefunding ? 'Estornando...' : 'Estornar Pagamento'}
                                </button>
                            </div>
                        )}
                    </div>
                </aside>
            </div>
        </AdminLayout>
    );
}