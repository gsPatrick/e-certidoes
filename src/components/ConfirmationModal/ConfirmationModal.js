// Salve em: src/components/ConfirmationModal/ConfirmationModal.js
'use client';

import styles from './ConfirmationModal.module.css';

// Componente auxiliar para não renderizar linhas vazias
const DetailRow = ({ label, value }) => {
    // Só renderiza a linha se o valor existir e não for " - /" ou similar
    if (!value || value.trim() === '-' || value.trim() === '/') return null;
    return (
        <div className={styles.detailItem}>
            <span className={styles.detailLabel}>{label}:</span>
            <span className={styles.detailValue}>{value}</span>
        </div>
    );
};

export default function ConfirmationModal({ orderDetails, onClose, onConfirm }) {
  if (!orderDetails) return null;

  const { cartItems, billingDetails, total } = orderDetails;
  const mainItem = cartItems[0];
  const formData = mainItem.formData;

  // Constrói a string de Serviços Adicionais
  const servicosAdicionais = [
    formData.apostilamento ? 'Apostilamento' : null,
    formData.aviso_recebimento ? 'Aviso de Recebimento' : null,
  ].filter(Boolean).join(', ') || 'Nenhum';

  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h3>Confirme seu Pedido</h3>
          <button onClick={onClose} className={styles.closeButton}>×</button>
        </div>
        
        <div className={styles.content}>
          {/* --- SEÇÃO 1: DADOS DA CERTIDÃO --- */}
          <div className={styles.section}>
            <h4>{mainItem.name.toUpperCase()}</h4>
            <DetailRow label="Matrícula" value={formData.matricula} />
            <DetailRow label="Localização" value={formData.cartorio ? `${formData.cartorio} - ${formData.cidade}/${formData.estado}` : ''} />
            <DetailRow label="Tipo de Certidão" value={formData.tipo_certidao} />
            {/* Adicione outros campos específicos da certidão aqui, se necessário */}
          </div>

          {/* --- SEÇÃO 2: OPÇÕES E ENTREGA --- */}
          <div className={styles.section}>
            <h4>Opções e Entrega</h4>
            <DetailRow label="Formato" value={formData.formato} />
            <DetailRow label="Serviços Adicionais" value={servicosAdicionais} />
            { (formData.formato?.includes('papel')) &&
                <DetailRow label="Endereço de Entrega" value={`${billingDetails.endereco || ''}, ${billingDetails.numero || ''} - ${billingDetails.bairro || ''}, ${billingDetails.cidade || ''}/${billingDetails.estado || ''}`} />
            }
          </div>

          {/* --- SEÇÃO 3: DADOS DO SOLICITANTE --- */}
          <div className={styles.section}>
            <h4>Dados do Solicitante</h4>
            {/* CORREÇÃO: Usando 'requerente_nome' que é o nome correto do campo */}
            <DetailRow label="Nome" value={formData.requerente_nome} />
            <DetailRow label="CPF" value={formData.requerente_cpf} />
            <DetailRow label="E-mail" value={formData.requerente_email} />
            <DetailRow label="Telefone" value={formData.requerente_telefone} />
          </div>

          {/* --- SEÇÃO 4: RESUMO FINANCEIRO --- */}
          <div className={`${styles.section} ${styles.summarySection}`}>
            <h4>Resumo Financeiro</h4>
            <DetailRow label="Subtotal dos Itens" value={`R$ ${mainItem.price.toFixed(2).replace('.', ',')}`} />
            <DetailRow label="Frete" value={"R$ 0,00"} />
            <div className={styles.totalRow}>
              <span className={styles.detailLabel}>TOTAL</span>
              <span className={styles.totalValue}>R$ {total.toFixed(2).replace('.', ',')}</span>
            </div>
          </div>
        </div>

        <div className={styles.footer}>
          <button onClick={onClose} className={styles.backButton}>Voltar e Editar</button>
          <button onClick={onConfirm} className={styles.confirmButton}>Confirmar e Pagar</button>
        </div>
      </div>
    </div>
  );
}