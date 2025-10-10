// Salve em: src/components/MultiStepForm/SummarySidebar.js
'use client';
import styles from './SummarySidebar.module.css';

const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
        <polyline points="20 6 9 17 4 12"></polyline>
    </svg>
);

export default function SummarySidebar({ productData, formData, finalPrice, currentStep, formSteps, goToStep }) {
  
  // Função para renderizar o conteúdo de resumo de cada etapa pelo TÍTULO
  const renderStepSummary = (stepTitle) => {
    // Switch case para lidar com variações de títulos (ex: "Localização" ou "Localização do Cartório")
    switch(stepTitle.toLowerCase()) {
      case 'localização':
      case 'localização do cartório':
        return (
          <div className={styles.summaryContent}>
            <p>{formData.cidade || 'Não preenchido'}</p>
            <small>{formData.estado || ''}</small>
            <small>{formData.cartorio || formData.cartorio_manual || (formData.nao_sei_cartorio ? 'Busca será realizada' : '')}</small>
          </div>
        );
      case 'dados da certidão':
        const certidaoLabel = formData.tipo_certidao || productData.name;
        const matricula = formData.matricula || formData.numero_matricula;
        const nomePessoa = formData.nome_pessoa || formData.razao_social || formData.nome_completo_registrado || formData.nome_outorgante;
        return (
          <div className={styles.summaryContent}>
             <p>{certidaoLabel}</p>
             {matricula && <small>Matrícula: {matricula}</small>}
             {nomePessoa && <small>{nomePessoa}</small>}
          </div>
        );
      case 'formato':
        return (
            <div className={styles.summaryContent}>
                <p>{formData.formato || 'Não preenchido'}</p>
                <small>Forma de envio do documento</small>
            </div>
        );
      
      // =======================================================
      // === ATUALIZAÇÃO COMPLETA PARA SERVIÇOS ADICIONAIS ===
      // =======================================================
      case 'serviços adicionais':
        const adicionais = [];
        if (formData.apostilamento_digital) adicionais.push('Apostilamento Digital');
        if (formData.apostilamento_fisico) adicionais.push('Apostilamento Físico');
        if (formData.apostilamento) adicionais.push('Apostilamento');
        if (formData.inteiro_teor) adicionais.push(`Inteiro Teor (${formData.tipo_inteiro_teor || 'N/A'})`);
        if (formData.reconhecimento_firma) adicionais.push('Reconhecimento de Firma');
        if (formData.aviso_recebimento) adicionais.push('Aviso de Recebimento');
        
        return (
            <div className={styles.summaryContent}>
                <p>{adicionais.length > 0 ? adicionais.join(', ') : 'Nenhum'}</p>
                <small>Serviços extras contratados</small>
            </div>
        );
      // =======================================================

      case 'endereço':
        const endereco = formData.endereco_inter ? 
            `${formData.cidade_inter || ''}, ${formData.pais_nome || ''}` : 
            `${formData.cidade || ''}, ${formData.estado || ''}`;
        return (
            <div className={styles.summaryContent}>
                <p>{endereco}</p>
                <small>Local de entrega</small>
            </div>
        )

      case 'identificação':
        return (
             <div className={styles.summaryContent}>
                <p>{formData.requerente_nome || 'Não preenchido'}</p>
                <small>{formData.requerente_email || ''}</small>
            </div>
        )
      default:
        // Tenta encontrar um resumo genérico para outras etapas
        const genericKey = Object.keys(formData).find(key => stepTitle.toLowerCase().includes(key.toLowerCase()));
        if(genericKey && formData[genericKey]){
            return (
                <div className={styles.summaryContent}>
                    <p>{String(formData[genericKey])}</p>
                </div>
            )
        }
        return null;
    }
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
          {formSteps.slice(0, currentStep).map((stepTitle, index) => {
            const summaryContent = renderStepSummary(stepTitle);
            // Não renderiza a etapa na sidebar se não houver um resumo definido para ela
            if (!summaryContent) return null;

            return (
              <div key={index} className={styles.summaryStep}>
                <div className={styles.summaryStepHeader}>
                  <div className={styles.stepTitle}>
                    <span className={styles.completedIcon}><CheckIcon /></span>
                    <span>{index + 1}. {stepTitle.toUpperCase()}</span>
                  </div>
                  <button onClick={() => goToStep(index)} className={styles.editLink}>editar</button>
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