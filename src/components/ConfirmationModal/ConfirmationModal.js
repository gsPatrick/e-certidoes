// Salve em: src/components/ConfirmationModal/ConfirmationModal.js
'use client';

import styles from './ConfirmationModal.module.css';
import { getTaxa } from '@/utils/pricingData'; // Importa a função de buscar taxas

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

// Componente para renderizar uma linha de detalhe
const DetailRow = ({ label, value }) => {
    if (value === null || value === undefined || value === '' || value === false) {
        return null;
    }
    const displayValue = typeof value === 'boolean' ? 'Sim' : String(value);
    
    return (
        <div className={styles.detailItem}>
            <span className={styles.detailLabel}>{label}:</span>
            <span className={styles.detailValue}>{displayValue}</span>
        </div>
    );
};

// ====================================================================
// === COMPONENTE ATUALIZADO PARA LÓGICA CONDICIONAL ===
// ====================================================================
const DynamicProductDetails = ({ formData, item }) => {
    const slug = item?.slug;

    const excludeKeys = new Set([
        'requerente_nome', 'requerente_cpf', 'requerente_email', 'requerente_telefone',
        'formato', 'cep', 'estado', 'cidade', 'bairro', 'endereco', 'numero', 'complemento',
        'entrega_internacional_correios', 'entrega_internacional_dhl', 'pais', 'pais_nome', 'estado_inter', 'cidade_inter', 'cep_inter', 'endereco_inter',
        'apostilamento_digital', 'apostilamento_fisico', 'apostilamento', 'inteiro_teor', 'aviso_recebimento',
        'tipo_inteiro_teor', 'inteiro_teor_nacionalidade', 'inteiro_teor_estado_civil', 'inteiro_teor_profissao', 'inteiro_teor_parentesco',
        'tipo_pesquisa', 'tipo_pessoa', 'aceite_lgpd', 'ciente', 'localizar_pra_mim', 'todos_cartorios_protesto',
    ]);

    const specificDetails = Object.entries(formData)
        .filter(([key, value]) => {
            // 1. Regra geral: ignora valores vazios/nulos
            if (value === '' || value === null || value === false) {
                return false;
            }
            // 2. Regra específica: só mostra 'tempo_pesquisa' se for Certidão de Protesto
            if (key === 'tempo_pesquisa') {
                return slug === 'certidao-de-protesto';
            }
            // 3. Regra de exclusão padrão
            if (excludeKeys.has(key)) {
                return false;
            }
            // 4. Se passou por todas as regras, mostra o campo
            return true;
        });

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
// ====================================================================

export default function ConfirmationModal({ orderDetails, onClose, onConfirm }) {
  if (!orderDetails) return null;

  const { item, total } = orderDetails;
  const { formData } = item;

  const CUSTO_ENVIO_FISICO = getTaxa('custo_papel') || 0;
  const CUSTO_APOSTILAMENTO = getTaxa('apostilamento') || 0;
  const CUSTO_AR = getTaxa('aviso_recebimento') || 0;
  const ACRESCIMO_CONDOMINIO = getTaxa('acrescimo_condominio') || 0;
  
  const CUSTO_TEOR_TRANSCRICAO = 30.00;
  const CUSTO_TEOR_REPROGRAFICA = 40.00;

  let custoInteiroTeor = 0;
  if (formData.inteiro_teor) {
      custoInteiroTeor = formData.tipo_inteiro_teor === 'Reprográfica' ? CUSTO_TEOR_REPROGRAFICA : CUSTO_TEOR_TRANSCRICAO;
  }
  
  const custoTotalAdicionais = 
      ((formData.apostilamento_digital || formData.apostilamento_fisico || formData.apostilamento) ? CUSTO_APOSTILAMENTO : 0) +
      custoInteiroTeor +
      (formData.aviso_recebimento ? CUSTO_AR : 0) +
      (formData.formato === 'Certidão em papel' ? CUSTO_ENVIO_FISICO : 0) +
      (item.name.includes('Condomínio') ? ACRESCIMO_CONDOMINIO : 0) +
      (formData.localizar_pra_mim ? 99.90 : 0);

  let custoProtesto = 0;
  if (item.slug === 'certidao-de-protesto' && formData.tempo_pesquisa === '10 anos') {
    custoProtesto += 50.00;
  }

  const valorServico = total - custoTotalAdicionais - custoProtesto;

  const enderecoCompleto = [formData.endereco, formData.numero, formData.complemento, formData.bairro, `${formData.cidade || ''}/${formData.estado || ''}`, formData.cep].filter(Boolean).join(', ');
  const enderecoInternacional = [formData.endereco_inter, formData.cidade_inter, formData.estado_inter, formData.pais_nome, formData.cep_inter].filter(Boolean).join(', ');

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
            {/* Passando o 'item' para o componente de detalhes */}
            <DynamicProductDetails formData={formData} item={item} />
          </div>

          <div className={styles.section}>
            <h4>Opções e Entrega</h4>
            <DetailRow label="Formato" value={formData.formato} />
            { (formData.formato === 'Certidão em papel' && enderecoCompleto) &&
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
            {item.name.includes('Condomínio') && <DetailRow label="Acréscimo (Condomínio)" value={`R$ ${ACRESCIMO_CONDOMINIO.toFixed(2).replace('.', ',')}`} />}
            {formData.formato === 'Certidão em papel' && <DetailRow label="Custo de Envio (Documento Físico)" value={`R$ ${CUSTO_ENVIO_FISICO.toFixed(2).replace('.', ',')}`} />}
            {(formData.apostilamento_digital || formData.apostilamento_fisico || formData.apostilamento) && <DetailRow label="Serviço Adicional: Apostilamento" value={`R$ ${CUSTO_APOSTILAMENTO.toFixed(2).replace('.', ',')}`} />}
            {formData.inteiro_teor && (
                <DetailRow 
                    label={`Serviço Adicional: Inteiro Teor (${formData.tipo_inteiro_teor})`} 
                    value={`R$ ${custoInteiroTeor.toFixed(2).replace('.', ',')}`} 
                />
            )}
            {formData.aviso_recebimento && <DetailRow label="Serviço Adicional: Aviso de Recebimento (A.R.)" value={`R$ ${CUSTO_AR.toFixed(2).replace('.', ',')}`} />}
            {formData.localizar_pra_mim && <DetailRow label="Serviço Adicional: Localizar pra mim" value="R$ 99,90" />}
            {item.slug === 'certidao-de-protesto' && formData.tempo_pesquisa === '10 anos' && <DetailRow label="Acréscimo: Pesquisa por 10 anos" value="R$ 50,00" />}
            
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