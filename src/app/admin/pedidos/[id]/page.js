// Salve em: src/app/admin/pedidos/[id]/page.js
'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import api from '@/services/api'; // Sua instância do Axios
import AdminLayout from '../../AdminLayout';
import PageLoader from '@/components/PageLoader/PageLoader'; // Loader para feedback visual
import styles from './GerenciarPedido.module.css';

export default function GerenciarPedidoPage() {
    const [pedido, setPedido] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    // Estados para os campos do formulário controlados
    const [status, setStatus] = useState('');
    const [codigoRastreio, setCodigoRastreio] = useState('');
    const [observacoes, setObservacoes] = useState('');
    const [arquivo, setArquivo] = useState(null);

    const [isSaving, setIsSaving] = useState(false);
    const params = useParams();
    const router = useRouter();

    useEffect(() => {
        const pedidoId = params.id;
        if (pedidoId) {
            setLoading(true);
            api.get(`/admin/pedidos/${pedidoId}`)
                .then(response => {
                    const data = response.data;
                    setPedido(data);
                    // Popula os estados do formulário com os dados recebidos da API
                    setStatus(data.status);
                    setCodigoRastreio(data.codigoRastreio || '');
                    setObservacoes(data.observacoesAdmin || '');
                })
                .catch(err => {
                    setError('Pedido não encontrado ou falha ao carregar os dados.');
                    console.error("Erro ao buscar pedido:", err);
                })
                .finally(() => setLoading(false));
        }
    }, [params.id]);

    const handleSalvarAlteracoes = async () => {
        if (!confirm('Você tem certeza que deseja salvar estas alterações?')) {
            return;
        }

        setIsSaving(true);
        const pedidoId = params.id;
        
        try {
            // 1. Atualiza os dados de texto do pedido (status, rastreio, observações)
            const updateData = { status, codigoRastreio, observacoesAdmin: observacoes };
            await api.put(`/admin/pedidos/${pedidoId}`, updateData);

            // 2. Se um novo arquivo foi selecionado, faz o upload
            if (arquivo) {
                const formData = new FormData();
                formData.append('arquivoCertidao', arquivo);
                
                await api.post(`/admin/pedidos/${pedidoId}/upload`, formData, {
                    headers: { 'Content-Type': 'multipart/form-data' },
                });
            }

            alert('Pedido atualizado com sucesso!');
            router.push('/admin/dashboard'); // Redireciona para o dashboard após o sucesso

        } catch (err) {
            const errorMessage = err.response?.data?.message || 'Ocorreu um erro ao atualizar o pedido.';
            alert(`Erro: ${errorMessage}`);
            console.error("Erro ao salvar alterações:", err);
        } finally {
            setIsSaving(false);
        }
    };

    const formatLabel = (key) => {
        if (key === 'cartorio_manual') return 'Cartório (Informado Manualmente)';
        return key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
    };

    if (loading) return <AdminLayout><PageLoader /></AdminLayout>;
    if (error) return <AdminLayout><div>{error}</div></AdminLayout>;
    if (!pedido) return null; // Não renderiza nada se o pedido não for encontrado

    return (
        <AdminLayout>
            <div className={styles.header}>
                <Link href="/admin/dashboard" className={styles.backLink}>&larr; Voltar para a lista de pedidos</Link>
                <h1 className={styles.title}>Gerenciar Pedido <span>#{pedido.protocolo}</span></h1>
            </div>

            <div className={styles.grid}>
                {/* Coluna Esquerda: Detalhes do Pedido */}
                <div className={styles.pedidoDetails}>
                    <div className={styles.card}>
                        <h2 className={styles.cardTitle}>Detalhes do Cliente</h2>
                        <div className={styles.cardContent}>
                            <p><strong>Nome:</strong> {pedido.cliente.nome}</p>
                            <p><strong>Email:</strong> {pedido.cliente.email}</p>
                            <p><strong>CPF:</strong> {pedido.dadosCliente?.cpf || 'Não informado'}</p>
                            <p><strong>Telefone:</strong> {pedido.dadosCliente?.telefone || 'Não informado'}</p>
                        </div>
                    </div>

                    <div className={styles.card}>
                        <h2 className={styles.cardTitle}>Endereço de Entrega</h2>
                        <div className={styles.cardContent}>
                            {pedido.dadosCliente ? (
                                <>
                                    <p>{pedido.dadosCliente.endereco}, {pedido.dadosCliente.numero} {pedido.dadosCliente.complemento}</p>
                                    <p>{pedido.dadosCliente.bairro}, {pedido.dadosCliente.cidade} - {pedido.dadosCliente.estado}</p>
                                    <p><strong>CEP:</strong> {pedido.dadosCliente.cep}</p>
                                </>
                            ) : <p>Endereço não informado.</p>}
                        </div>
                    </div>

                    <div className={styles.card}>
                        <h2 className={styles.cardTitle}>Serviço Contratado</h2>
                        <div className={styles.cardContent}>
                            {pedido.itens.map((item, index) => (
                                <div key={index}>
                                    <h3 className={styles.itemName}>{item.nome}</h3>
                                    <dl className={styles.formDataList}>
                                        {Object.entries(item.dadosFormulario).map(([key, value]) => (
                                            value && (
                                                <div key={key}>
                                                    <dt>{formatLabel(key)}</dt>
                                                    <dd>{value}</dd>
                                                </div>
                                            )
                                        ))}
                                    </dl>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Coluna Direita: Ações do Admin */}
                <div className={styles.adminActions}>
                    <div className={styles.card}>
                        <h2 className={styles.cardTitle}>Ações do Administrador</h2>
                        <div className={styles.cardContent}>
                            <div className={styles.formGroup}>
                                <label htmlFor="status">Alterar Status do Pedido</label>
                                <select id="status" value={status} onChange={(e) => setStatus(e.target.value)} className={styles.select}>
                                    <option value="Processando">Processando</option>
                                    <option value="Busca em Andamento">Busca em Andamento</option>
                                    <option value="Concluído">Concluído</option>
                                    <option value="Cancelado">Cancelado</option>
                                </select>
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="codigoRastreio">Código de Rastreio (se aplicável)</label>
                                <input type="text" id="codigoRastreio" value={codigoRastreio} onChange={(e) => setCodigoRastreio(e.target.value)} className={styles.input} />
                            </div>

                            <div className={styles.formGroup}>
                                <label htmlFor="observacoes">Observações para o Cliente</label>
                                <textarea id="observacoes" value={observacoes} onChange={(e) => setObservacoes(e.target.value)} rows="4" className={styles.textarea} placeholder="Esta mensagem aparecerá na área do cliente."></textarea>
                            </div>
                            
                            <div className={styles.formGroup}>
                                <label htmlFor="upload">Enviar Novo Documento (Certidão)</label>
                                <input type="file" id="upload" onChange={(e) => setArquivo(e.target.files[0])} className={styles.input} accept=".pdf" />
                                {pedido.arquivos && pedido.arquivos.length > 0 && (
                                    <div className={styles.fileList}>
                                        <p>Arquivos existentes no pedido:</p>
                                        <ul>
                                            {pedido.arquivos.map(arq => <li key={arq.id}>{arq.nomeOriginal}</li>)}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className={styles.cardFooter}>
                            <button onClick={handleSalvarAlteracoes} className={styles.saveButton} disabled={isSaving}>
                                {isSaving ? 'Salvando...' : 'Salvar Alterações'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </AdminLayout>
    );
}