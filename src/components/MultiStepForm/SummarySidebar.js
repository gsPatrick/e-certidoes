// Salve em: src/components/MultiStepForm/SummarySidebar.js
'use client';

import styles from './SummarySidebar.module.css';
import { getTaxa } from '@/utils/pricingData';

// Função para formatar as chaves do objeto em labels legíveis
const formatLabel = (key) => {
    if (key === 'pais_nome') return 'País';
    if (key === 'cep_inter') return 'CEP Internacional';
    if (key === 'cidade_inter') return 'Cidade Internacional';
    if (key === 'estado_inter') return 'Estado Internacional';
    if (key === 'endereco_inter') return 'Endereço Internacional';
    if (key === 'cpf_cnpj') return 'CPF/CNPJ';
    if (key === 'cpf_cnpj_pesquisa') return 'CPF/CNPJ da Pesquisa';
    if (key === 'cpf_cnpj_escritura') return 'CPF/CNPJ da Escritura';
    if (key === 'estado_cartorio') return 'Estado do Cartório';
    if (key === 'cidade_cartorio') return 'Cidade do Cartório';
    if (key === 'estado_entrega') return 'Estado de Entrega';
    if (key === 'cidade_entrega') return 'Cidade de Entrega';
    if (key === 'estado_matricula') return 'Estado da Matrícula';
    if (key === 'cidade_matricula') return 'Cidade da Matrícula';
    if (key === 'nome_completo_contato') return 'Nome Completo';
    if (key === 'email_contato') return 'E-mail';
    if (key === 'telefone_contato') return 'Telefone';
    if (key === 'assunto_contato') return 'Assunto';
    if (key === 'mensagem_contato') return 'Mensagem';


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
    // ===================================
    // === AQUI ESTÁ A CORREÇÃO DIRETA ===
    // ===================================
    const CUSTO_SEDEX = 68.00;
    const CUSTO_TEOR_TRANSCRICAO = 30.00;
    const CUSTO_TEOR_REPROGRAFICA = 40.00;
    
    const excludeKeys = new Set(['tipo_pessoa', 'tipo_pesquisa', 'aceite_lgpd', 'ciente']);
    
    const getRelevantKeysForStep = (title) => {
        switch(title.toLowerCase()) {
            case 'localização': 
                if (productData.slug === 'visualizacao-de-matricula') {
                    return ['estado_matricula', 'cidade_matricula', 'cartorio', 'numero_matricula'];
                }
                return ['estado_cartorio', 'cidade_cartorio', 'cartorio', 'cartorio_manual', 'nao_sei_cartorio', 'anexo_busca_nome'];
            case 'dados da certidão': 
                const keys = Object.keys(formData).filter(k => 
                    !['estado_cartorio', 'cidade_cartorio', 'cartorio', 'formato', 'requerente_nome', 'requerente_cpf', 'requerente_email', 'requerente_telefone', 'requerente_rg', 'requerente_cep', 'requerente_endereco', 'requerente_numero', 'requerente_complemento', 'requerente_bairro', 'requerente_cidade', 'requerente_estado',
                    'estado_entrega', 'cidade_entrega', 'cep', 'endereco', 'numero', 'complemento', 'bairro',
                    'estado_matricula', 'cidade_matricula', 'numero_matricula',
                    'pais_nome', 'cep_inter', 'estado_inter', 'cidade_inter', 'endereco_inter', 'entrega_internacional_correios', 'entrega_internacional_dhl',
                    ].includes(k) && 
                    !k.startsWith('apostilamento') && !k.startsWith('aviso') && !k.startsWith('inteiro_teor') && !k.startsWith('localizar_pra_mim') && !k.startsWith('sedex')
                );
                if (productData.category !== 'Cartório de Registro Civil') {
                    keys.unshift('tipo_certidao');
                }
                return keys;
            case 'formato': return ['formato'];
            case 'serviços adicionais': return ['apostilamento_digital', 'apostilamento_fisico', 'apostilamento', 'inteiro_teor', 'tipo_inteiro_teor', 'aviso_recebimento', 'localizar_pra_mim', 'sedex'];
            case 'endereço': return ['cep', 'endereco', 'numero', 'complemento', 'bairro', 'cidade_entrega', 'estado_entrega', 'entrega_internacional_correios', 'entrega_internacional_dhl', 'pais_nome', 'cep_inter', 'estado_inter', 'cidade_inter', 'endereco_inter'];
            case 'identificação': return ['requerente_nome', 'requerente_cpf', 'requerente_email', 'requerente_telefone', 'requerente_rg'];
            case 'dados para contato': return ['nome_completo_contato', 'email_contato', 'telefone_contato', 'assunto_contato', 'mensagem_contato'];
            default: return [];
        }
    };
    
    const relevantKeys = getRelevantKeysForStep(stepTitle);
    const details = relevantKeys.map(key => {
        if (excludeKeys.has(key) || !formData[key]) return null;

        if (key === 'tipo_certidao') {
            const label = productData.category.includes('Pesquisa') ? 'Tipo de Pesquisa' : 'Tipo de Certidão';
            const value = productData.name;
            return <DetailItem key={key} label={label} value={value} />;
        }

        if (key === 'tempo_pesquisa' && productData.slug !== 'certidao-de-protesto') {
            return null;
        }

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
            if (key === 'sedex') {
                 return <PriceDetailItem key={key} label="Sedex" value={CUSTO_SEDEX} />;
            }
        }
        
        const label = formatLabel(key);
        return <DetailItem key={key} label={label} value={formData[key]} />;
    }).filter(Boolean);

    if (stepTitle.toLowerCase() === 'formato' && (formData.formato === 'Certidão em papel' || formData.formato === 'Certidão Transcrita' || formData.formato === 'Certidão Reprográfica')) {
        details.push(<PriceDetailItem key="custo_papel" label="Custo de Envio (Papel)" value={CUSTO_PAPEL} />);
    }

    if (details.length === 0) return null;

    return <ul className={styles.summaryContentList}>{details}</ul>;
  };

  const toSlug = (str) => {
    if (!str) return '';
    return str.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
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