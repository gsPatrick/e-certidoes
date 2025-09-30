// Salve em: src/components/MultiStepForm/SummarySidebar.js
'use client';
import styles from './SummarySidebar.module.css';

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
);

export default function SummarySidebar({ productData, formData, finalPrice, currentStep, formSteps, goToStep }) {
  
  // Função para encontrar o índice de uma etapa pelo título
  const findStepIndex = (title) => formSteps.findIndex(step => step === title);

  // Função para renderizar o conteúdo de resumo de cada etapa pelo TÍTULO
  const renderStepSummary = (stepTitle) => {
    switch(stepTitle) {
      case 'Cartório':
        return (
          <div className={styles.summaryContent}>
            <p>{formData.cidade || 'Não preenchido'}</p>
            <small>{formData.estado || ''}</small>
            <small>{formData.cartorio || ''}</small>
          </div>
        );
      case 'Dados da Certidão':
        return (
          <div className={styles.summaryContent}>
             <p>{formData.tipo_certidao || 'Não preenchido'}</p>
             <small>Tipo de Certidão de Imóvel</small>
             {formData.matricula && <small>Matrícula: {formData.matricula}</small>}
          </div>
        );
      case 'Formato':
        return (
            <div className={styles.summaryContent}>
                <p>{formData.formato || 'Não preenchido'}</p>
                <small>Forma de envio do documento</small>
            </div>
        );
      // === NOVO RESUMO PARA SERVIÇOS ADICIONAIS ===
      case 'Serviços Adicionais':
        const adicionais = [];
        if (formData.apostilamento) adicionais.push('Apostilamento');
        if (formData.aviso_recebimento) adicionais.push('Aviso de Recebimento');
        
        return (
            <div className={styles.summaryContent}>
                <p>{adicionais.length > 0 ? adicionais.join(', ') : 'Nenhum'}</p>
                <small>Serviços extras contratados</small>
            </div>
        );
      case 'Identificação':
        return (
             <div className={styles.summaryContent}>
                <p>{formData.requerente_nome || 'Não preenchido'}</p>
                <small>{formData.requerente_email || ''}</small>
            </div>
        )
      default:
        return null;
    }
  };

  return (
    <aside className={styles.summarySidebar}>
      <div className={styles.summaryBox}>
        <div className={styles.summaryHeader}>
          <span className={styles.stepIndicator}>{currentStep + 1} de {formSteps.length}</span>
          <h4 className={styles.productTitle}>{productData?.name || 'Certidão de Imóvel'}</h4>
          <div className={styles.priceDisplay}>R$ {finalPrice?.toFixed(2).replace('.', ',') || '0,00'}</div>
          <p className={styles.priceDetails}>Este valor inclui todas as custas do documento e a taxa de serviço.</p>
        </div>
        
        <div className={styles.summaryBody}>
          {formSteps.slice(0, currentStep).map((stepTitle, index) => (
            <div key={index} className={styles.summaryStep}>
              <div className={styles.summaryStepHeader}>
                <div className={styles.stepTitle}>
                  <span className={styles.completedIcon}><CheckIcon /></span>
                  <span>{index + 1}. {stepTitle.toUpperCase()}</span>
                </div>
                <button onClick={() => goToStep(index)} className={styles.editLink}>editar</button>
              </div>
              {renderStepSummary(stepTitle)}
            </div>
          ))}
        </div>
      </div>
    </aside>
  );
}