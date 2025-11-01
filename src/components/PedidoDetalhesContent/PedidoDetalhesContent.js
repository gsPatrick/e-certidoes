// Crie em: src/components/PedidoDetalhesContent/PedidoDetalhesContent.js
import styles from './PedidoDetalhesContent.module.css';

// Chaves que são estruturais e não devem aparecer na lista principal de "Detalhes"
const structuredKeys = new Set([
    'formato', 'apostilamento_digital', 'apostilamento_fisico', 'apostilamento', 
    'inteiro_teor', 'tipo_inteiro_teor', 'aviso_recebimento', 'sedex', 'localizar_pra_mim',
    'requerente_nome', 'requerente_cpf', 'requerente_email', 'requerente_telefone', 'requerente_rg',
    'aceite_lgpd', 'ciente', 'tipo_pesquisa', 'tipo_pessoa'
]);

const formatLabel = (key) => key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());

const DetailItem = ({ label, value }) => {
    if (!value && typeof value !== 'boolean') return null;
    const displayValue = typeof value === 'boolean' ? (value ? 'Sim' : 'Não') : String(value);
    return (
        <div className={styles.formDataItem}>
            <dt>{label}</dt>
            <dd>{displayValue}</dd>
        </div>
    );
};

export default function PedidoDetalhesContent({ item }) {
    const { nomeProduto, dadosFormulario, slugProduto } = item;

    // 1. Filtra apenas os detalhes específicos da certidão
    const specificDetails = Object.entries(dadosFormulario)
        .filter(([key, value]) => {
            if (!value || structuredKeys.has(key)) return false;
            if (key === 'tempo_pesquisa' && !slugProduto.includes('protesto')) return false;
            return true;
        });
    
    // 2. Agrupa os serviços adicionais para exibição
    const servicosAdicionais = [
        { key: 'apostilamento', label: 'Apostilamento' },
        { key: 'apostilamento_digital', label: 'Apostilamento Digital' },
        { key: 'apostilamento_fisico', label: 'Apostilamento Físico' },
        { key: 'inteiro_teor', label: 'Inteiro Teor' },
        { key: 'aviso_recebimento', label: 'Aviso de Recebimento' },
        { key: 'sedex', label: 'Envio por SEDEX' },
        { key: 'localizar_pra_mim', label: 'Serviço "Localizar pra mim"' },
    ].filter(servico => dadosFormulario[servico.key]);

    return (
        <div className={styles.wrapper}>
            {/* SEÇÃO 1: DETALHES DO PRODUTO */}
            <h3 className={styles.itemName}>{nomeProduto}</h3>
            <dl className={styles.formDataList}>
                {specificDetails.map(([key, value]) => (
                    <DetailItem key={key} label={formatLabel(key)} value={value} />
                ))}
            </dl>

            {/* SEÇÃO 2: OPÇÕES E SERVIÇOS */}
            <h4 className={styles.sectionTitle}>Opções e Serviços</h4>
            <dl className={styles.formDataList}>
                <DetailItem label="Formato" value={dadosFormulario.formato} />
                {dadosFormulario.tipo_inteiro_teor && <DetailItem label="Tipo de Inteiro Teor" value={dadosFormulario.tipo_inteiro_teor} />}
                {servicosAdicionais.map(servico => (
                    <DetailItem key={servico.key} label={servico.label} value="Sim" />
                ))}
            </dl>
            
            {/* SEÇÃO 3: DADOS DO SOLICITANTE */}
            <h4 className={styles.sectionTitle}>Dados do Solicitante</h4>
            <dl className={styles.formDataList}>
                <DetailItem label="Nome" value={dadosFormulario.requerente_nome} />
                <DetailItem label="CPF" value={dadosFormulario.requerente_cpf} />
                <DetailItem label="E-mail" value={dadosFormulario.requerente_email} />
                <DetailItem label="Telefone" value={dadosFormulario.requerente_telefone} />
                <DetailItem label="RG" value={dadosFormulario.requerente_rg} />
            </dl>
        </div>
    );
}