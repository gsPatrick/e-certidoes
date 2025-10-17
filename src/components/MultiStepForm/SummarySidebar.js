// Salve em: src/components/MultiStepForm/SummarySidebar.js
'use client';

import styles from './SummarySidebar.module.css';
import { getTaxa } from '@/utils/pricingData';

// --- FUNÇÃO CORRETIVA ADICIONADA AQUI ---
// Função para formatar as chaves do objeto em labels legíveis
const formatLabel = (key) => {
    if (key === 'pais_nome') return 'País';
    if (key === 'cep_inter') return 'CEP Internacional';
    if (key === 'cidade_inter') return 'Cidade Internacional';
    if (key === 'estado_inter') return 'Estado Internacional';
    if (key === 'endereco_inter') return 'Endereço Internacional';

    return key
        .replace(/_/g, ' ')
        .replace(/\b\w/g, char => char.toUpperCase());
};

// Ícone de check para etapas concluídas
const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
);

// Componente para exibir um item de detalhe (label + valor)
const DetailItem = ({ label, value }) => {
    if (!value && typeof value !== 'boolean') return null;
    const displayValue = typeof value === 'boolean' ? (value ? 'Sim' : 'Não') : value;
    return (
        <li className={styles.detailItem}>
            <span className={styles.detailLabel}>{label}:</span>
            <span className={styles.detailValue}>{displayValue}</span>
        </li>
    );
};

// Componente para exibir um item de detalhe com preço
const PriceDetailItem = ({ label, value }) => {
    if (!value && value !== 0) return null;
    return (
        <li className={styles.detailItem}>
            <span className={styles.detailLabel}>{label}:</span>
            <span className={`${styles.detailValue} ${styles.priceValue}`}>R$ {value.toFixed(2).replace('.', ',')}</span>
        </li>
    );
};


export default function SummarySidebar({ productData, formData, finalPrice, currentStep, formSteps, goToStep }) {
  
  const renderStepSummary = (stepTitle) => {
    const CUSTO_PAPEL = getTaxa('custo_papel') || 0;
    const CUSTO_APOSTILAMENTO = getTaxa('apostilamento') || 0;
    const CUSTO_AR = getTaxa('aviso_recebimento') || 0;
    const CUSTO_TEOR_TRANSCRICAO = 30.00;
    const CUSTO_TEOR_REPROGRAFICA = 40.00;
    
    const excludeKeys = new Set(['tipo_pessoa', 'tipo_pesquisa', 'aceite_lgpd', 'ciente']);
    
    const getRelevantKeysForStep = (title) => {
        switch(title.toLowerCase()) {
            case 'localização': return ['estado', 'cidade', 'cartorio', 'cartorio_manual', 'nao_sei_cartorio', 'anexo_busca_nome'];
            case 'dados da certidão': return Object.keys(formData).filter(k => !['estado', 'cidade', 'cartorio', 'formato', 'requerente_nome', 'requerente_cpf', 'requerente_email', 'requerente_telefone', 'requerente_rg', 'requerente_cep', 'requerente_endereco', 'requerente_numero', 'requerente_complemento', 'requerente_bairro', 'requerente_cidade', 'requerente_estado'].includes(k) && !k.startsWith('apostilamento') && !k.startsWith('aviso') && !k.startsWith('inteiro_teor'));
            case 'formato': return ['formato'];
            case 'serviços adicionais': return ['apostilamento_digital', 'apostilamento_fisico', 'apostilamento', 'inteiro_teor', 'tipo_inteiro_teor', 'aviso_recebimento', 'localizar_pra_mim'];
            case 'endereço': return ['cep', 'endereco', 'numero', 'complemento', 'bairro', 'cidade', 'estado', 'entrega_internacional_correios', 'entrega_internacional_dhl', 'pais_nome', 'cep_inter', 'estado_inter', 'cidade_inter', 'endereco_inter'];
            case 'identificação': return ['requerente_nome', 'requerente_cpf', 'requerente_email', 'requerente_telefone', 'requerente_rg'];
            default: return [];
        }
    };
    
    const relevantKeys = getRelevantKeysForStep(stepTitle);
    const details = relevantKeys.map(key => {
        if (excludeKeys.has(key) || !formData[key]) return null;

        if (stepTitle.toLowerCase() === 'serviços adicionais') {
            if (key === 'apostilamento' || key === 'apostilamento_digital' || key === 'apostilamento_fisico') {
                return <PriceDetailItem key={key} label={formatLabel(key)} value={CUSTO_APOSTILAMENTO} />;
            }
            if (key === 'aviso_recebimento') {
                return <PriceDetailItem key={key} label="Aviso de Recebimento" value={CUSTO_AR} />;
            }
            if (key === 'inteiro_teor') {
                const custo = formData.tipo_inteiro_teor === 'Reprográfica' ? CUSTO_TEOR_REPROGRAFICA : CUSTO_TEOR_TRANSCRICAO;
                return <PriceDetailItem key={key} label="Inteiro Teor" value={custo} />;
            }
            if (key === 'localizar_pra_mim') {
                 return <PriceDetailItem key={key} label="Localizar pra mim" value={99.90} />;
            }
        }
        
        const label = formatLabel(key); // Esta linha agora funciona
        return <DetailItem key={key} label={label} value={formData[key]} />;
    }).filter(Boolean);

    if (stepTitle.toLowerCase() === 'formato' && formData.formato === 'Certidão em papel') {
        details.push(<PriceDetailItem key="custo_papel" label="Custo de Envio (Papel)" value={CUSTO_PAPEL} />);
    }

    if (details.length === 0) return null;

    return <ul className={styles.summaryContentList}>{details}</ul>;
  };

  return (
    <aside className={styles.summarySidebar}>
      <div className={styles.summaryBox}>
        <div className={styles.summaryHeader}>
          <span className={styles.stepIndicator}>{currentStep + 1} de {formSteps.length}</span>
          <h4 className={styles.productTitle}>{productData?.name || 'Certidão'}</h4>
          <div className={styles.priceDisplay}>R$ {finalPrice?.toFixed(2).replace('.', ',') || '0,00'}</div>
          <p className={styles.priceDetails}>Este valor pode incluir custas do cartório, taxas de serviço e serviços adicionais.</p>
        </div>
        
        <div className={styles.summaryBody}>
          {formSteps.slice(0, currentStep + 1).map((stepTitle, index) => {
            const isCompleted = index < currentStep;
            const summaryContent = renderStepSummary(stepTitle);
            
            if (!summaryContent && isCompleted) return null;

            return (
              <div key={index} className={styles.summaryStep}>
                <div className={styles.summaryStepHeader}>
                  <div className={styles.stepTitle}>
                    {isCompleted && <span className={styles.completedIcon}><CheckIcon /></span>}
                    <span>{index + 1}. {stepTitle.toUpperCase()}</span>
                  </div>
                  {isCompleted && <button onClick={() => goToStep(index)} className={styles.editLink}>editar</button>}
                </div>
                {summaryContent}
              </div>
            )
          })}
        </div>
      </div>
    </aside>
  );
}