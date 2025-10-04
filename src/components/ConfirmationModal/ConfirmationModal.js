// Salve em: src/components/ConfirmationModal/ConfirmationModal.js
'use client';

import styles from './ConfirmationModal.module.css';

// Função para formatar as chaves do objeto em labels legíveis
const formatLabel = (key) => {
    return key
        .replace(/_/g, ' ') // Substitui underscores por espaços
        .replace(/\b\w/g, char => char.toUpperCase()); // Capitaliza a primeira letra de cada palavra
};

// Componente para renderizar uma linha de detalhe, tratando valores nulos/booleanos
const DetailRow = ({ label, value }) => {
    if (value === null || value === undefined || value === '' || value === false) {
        return null; // Não renderiza se o valor for "falsy" (exceto 0)
    }
    const displayValue = typeof value === 'boolean' ? 'Sim' : String(value);
    
    return (
        <div className={styles.detailItem}>
            <span className={styles.detailLabel}>{label}:</span>
            <span className={styles.detailValue}>{displayValue}</span>
        </div>
    );
};

// Componente para renderizar os detalhes específicos do produto de forma dinâmica
const DynamicProductDetails = ({ formData }) => {
    // Lista de chaves que já são tratadas em seções específicas do modal
    const excludeKeys = new Set([
        // Dados do solicitante
        'requerente_nome', 'requerente_cpf', 'requerente_email', 'requerente_telefone',
        // Opções de entrega e formato
        'formato', 'cep', 'estado', 'cidade', 'bairro', 'endereco', 'numero', 'complemento',
        'entrega_internacional_correios', 'entrega_internacional_dhl', 'pais', 'estado_inter', 'cidade_inter', 'cep_inter', 'endereco_inter',
        // Serviços adicionais (já tratados no resumo financeiro)
        'apostilamento_digital', 'apostilamento_fisico', 'inteiro_teor', 'reconhecimento_firma', 'aviso_recebimento',
        'tipo_inteiro_teor', 'inteiro_teor_nacionalidade', 'inteiro_teor_estado_civil', 'inteiro_teor_profissao', 'inteiro_teor_parentesco',
        // Metadados do formulário
        'tipo_pesquisa', 'tipo_pessoa', 'aceite_lgpd', 'ciente',
    ]);

    const specificDetails = Object.entries(formData)
        .filter(([key, value]) => !excludeKeys.has(key) && value !== '' && value !== null && value !== false);

    if (specificDetails.length === 0) {
        return <p className={styles.noDetails}>Nenhum detalhe adicional informado.</p>;
    }

    return (
        <>
            {specificDetails.map(([key, value]) => (
                <DetailRow key={key} label={formatLabel(key)} value={value} />
            ))}
        </>
    );
};

export default function ConfirmationModal({ orderDetails, onClose, onConfirm }) {
  if (!orderDetails) return null;

  const { item, total } = orderDetails;
  const { formData } = item;

  // --- LÓGICA DE DETALHAMENTO FINANCEIRO ---
  const CUSTO_PAPEL = 20.00;
  const CUSTO_APOSTILAMENTO = 100.00;
  const CUSTO_AR = 15.00;
  const CUSTO_RECONHECIMENTO_FIRMA = 25.00;
  const CUSTO_TEOR_TRANSCRICAO = 30.00;
  const CUSTO_TEOR_REPROGRAFICA = 40.00;

  let custoInteiroTeor = 0;
  if (formData.inteiro_teor) {
      custoInteiroTeor = formData.tipo_inteiro_teor === 'Reprográfica' ? CUSTO_TEOR_REPROGRAFICA : CUSTO_TEOR_TRANSCRICAO;
  }
  
  const custoTotalAdicionais = 
      (formData.apostilamento_digital ? CUSTO_APOSTILAMENTO : 0) +
      (formData.apostilamento_fisico ? CUSTO_APOSTILAMENTO : 0) +
      custoInteiroTeor +
      (formData.reconhecimento_firma ? CUSTO_RECONHECIMENTO_FIRMA : 0) +
      (formData.aviso_recebimento ? CUSTO_AR : 0) +
      (formData.formato === 'Certidão em papel' ? CUSTO_PAPEL : 0);
      
  const valorServico = total - custoTotalAdicionais;

  const enderecoCompleto = [
    formData.endereco, formData.numero, formData.complemento, formData.bairro,
    `${formData.cidade || ''}/${formData.estado || ''}`, formData.cep
  ].filter(Boolean).join(', ');
  
  const enderecoInternacional = [
      formData.endereco_inter, formData.cidade_inter, formData.estado_inter,
      formData.pais, formData.cep_inter
  ].filter(Boolean).join(', ');

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h3>Confirme seu Pedido</h3>
          <button onClick={onClose} className={styles.closeButton}>×</button>
        </div>
        
        <div className={styles.content}>
          <div className={styles.section}>
            <h4>{item.name.toUpperCase()}</h4>
            <DynamicProductDetails formData={formData} />
          </div>

          <div className={styles.section}>
            <h4>Opções e Entrega</h4>
            <DetailRow label="Formato" value={formData.formato} />
            { (formData.formato === 'Certidão em papel') &&
                <DetailRow label="Endereço de Entrega" value={enderecoCompleto} />
            }
            { (formData.entrega_internacional_correios || formData.entrega_internacional_dhl) &&
                <DetailRow label="Endereço Internacional" value={enderecoInternacional} />
            }
          </div>

          <div className={styles.section}>
            <h4>Dados do Solicitante</h4>
            <DetailRow label="Nome" value={formData.requerente_nome} />
            <DetailRow label="CPF" value={formData.requerente_cpf} />
            <DetailRow label="E-mail" value={formData.requerente_email} />
            <DetailRow label="Telefone" value={formData.requerente_telefone} />
          </div>

          <div className={`${styles.section} ${styles.summarySection}`}>
            <h4>Resumo Financeiro</h4>
            <DetailRow 
              label={`Valor do Serviço (${item.name})`} 
              value={`R$ ${valorServico.toFixed(2).replace('.', ',')}`} 
            />
            {formData.formato === 'Certidão em papel' && <DetailRow label="Custo de Envio (Documento Físico)" value={`R$ ${CUSTO_PAPEL.toFixed(2).replace('.', ',')}`} />}
            {formData.apostilamento_digital && <DetailRow label="Serviço Adicional: Apostilamento Digital" value={`R$ ${CUSTO_APOSTILAMENTO.toFixed(2).replace('.', ',')}`} />}
            {formData.apostilamento_fisico && <DetailRow label="Serviço Adicional: Apostilamento" value={`R$ ${CUSTO_APOSTILAMENTO.toFixed(2).replace('.', ',')}`} />}
            
            {formData.inteiro_teor && (
                <DetailRow 
                    label={`Serviço Adicional: Inteiro Teor (${formData.tipo_inteiro_teor})`} 
                    value={`R$ ${custoInteiroTeor.toFixed(2).replace('.', ',')}`} 
                />
            )}
            
            {formData.reconhecimento_firma && <DetailRow label="Serviço Adicional: Reconhecimento de Firma" value={`R$ ${CUSTO_RECONHECIMENTO_FIRMA.toFixed(2).replace('.', ',')}`} />}
            {formData.aviso_recebimento && <DetailRow label="Serviço Adicional: Aviso de Recebimento (A.R.)" value={`R$ ${CUSTO_AR.toFixed(2).replace('.', ',')}`} />}
            
            <div className={styles.totalRow}>
              <span className={styles.detailLabel}>TOTAL</span>
              <span className={styles.totalValue}>R$ {total.toFixed(2).replace('.', ',')}</span>
            </div>
          </div>
        </div>

        <div className={styles.footer}>
          <button onClick={onClose} className={styles.backButton}>Voltar e Editar</button>
          <button onClick={onConfirm} className={styles.confirmButton}>Confirmar e Ir para Pagamento</button>
        </div>
      </div>
    </div>
  );
}