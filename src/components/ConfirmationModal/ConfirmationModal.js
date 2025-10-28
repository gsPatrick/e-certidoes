// Salve em: src/components/ConfirmationModal/ConfirmationModal.js
'use client';

import styles from './ConfirmationModal.module.css';
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
    if (key === 'estado_cartorio') return 'Estado do Cartório'; // NOVO
    if (key === 'cidade_cartorio') return 'Cidade do Cartório'; // NOVO
    if (key === 'estado_entrega') return 'Estado de Entrega'; // NOVO
    if (key === 'cidade_entrega') return 'Cidade de Entrega'; // NOVO
    if (key === 'estado_matricula') return 'Estado da Matrícula'; // NOVO
    if (key === 'cidade_matricula') return 'Cidade da Matrícula'; // NOVO
    if (key === 'nome_completo_contato') return 'Nome Completo'; // Para Consulta Jurídica
    if (key === 'email_contato') return 'E-mail'; // Para Consulta Jurídica
    if (key === 'telefone_contato') return 'Telefone'; // Para Consulta Jurídica
    if (key === 'assunto_contato') return 'Assunto'; // Para Consulta Jurídica
    if (key === 'mensagem_contato') return 'Mensagem'; // Para Consulta Jurídica


    return key
        .replace(/_/g, ' ')
        .replace(/\b\w/g, char => char.toUpperCase());
};

const toSlug = (str) => {
    if (!str) return '';
    return str.toLowerCase().replace(/ /g, '-').replace(/[^\w-]+/g, '');
};

// Componente para renderizar uma linha de detalhe, ocultando valores vazios
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

// Componente para renderizar APENAS os detalhes específicos da certidão
const DynamicProductDetails = ({ formData, item }) => {
    const slug = item?.slug;

    // Lista de chaves que são exibidas em outras seções e devem ser ignoradas aqui
    const excludeKeys = new Set([
        'requerente_nome', 'requerente_cpf', 'requerente_email', 'requerente_telefone', 'requerente_rg',
        'requerente_cep', 'requerente_endereco', 'requerente_numero', 'requerente_complemento', 'requerente_bairro', 'requerente_cidade', 'requerente_estado',
        'formato', 'cep', 'bairro', 'endereco', 'numero', 'complemento',
        'entrega_internacional_correios', 'entrega_internacional_dhl', 'pais', 'pais_nome', 'estado_inter', 'cidade_inter', 'cep_inter', 'endereco_inter',
        'apostilamento_digital', 'apostilamento_fisico', 'apostilamento', 'inteiro_teor', 'aviso_recebimento',
        'tipo_inteiro_teor', 'inteiro_teor_nacionalidade', 'inteiro_teor_estado_civil', 'inteiro_teor_profissao', 'inteiro_teor_parentesco',
        'tipo_pesquisa', 'tipo_pessoa', 'aceite_lgpd', 'ciente', 'localizar_pra_mim', 'todos_cartorios_protesto',
        'tipo_certidao', // Removido para ser tratado de forma especial
        // Novos campos de localização que serão tratados separadamente ou já foram
        'estado_cartorio', 'cidade_cartorio', 'estado_entrega', 'cidade_entrega', 'estado_matricula', 'cidade_matricula',
    ]);

    const specificDetails = Object.entries(formData)
        .filter(([key, value]) => {
            if (value === '' || value === null || value === false) return false;
            if (key === 'tempo_pesquisa' && slug !== toSlug('Certidão de Protesto')) return false; // Regra específica
            if (excludeKeys.has(key)) return false; // Regra de exclusão
            return true;
        });

    if (specificDetails.length === 0 && !formData.tipo_certidao && !formData.cartorio && !formData.cartorio_manual && !formData.numero_matricula) {
        return <p className={styles.noDetails}>Nenhum detalhe adicional informado.</p>;
    }

    return (
        <>
            <DetailRow 
                label={item.category.includes('Pesquisa') ? 'Tipo de Pesquisa' : 'Tipo de Certidão'}
                value={item.name}
            />
            {/* Adiciona a exibição do cartório se presente */}
            {(formData.cartorio || formData.cartorio_manual) && (
                <DetailRow label="Cartório Selecionado" value={formData.cartorio || formData.cartorio_manual} />
            )}
            {/* Adiciona o número da matrícula se presente */}
            {formData.numero_matricula && (
                <DetailRow label="Número da Matrícula" value={formData.numero_matricula} />
            )}

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

  // Ajustado para usar os novos nomes de campos
  const enderecoCompleto = [formData.endereco, formData.numero, formData.complemento, formData.bairro, `${formData.cidade_entrega || ''}/${formData.estado_entrega || ''}`, formData.cep].filter(Boolean).join(', ');
  const enderecoInternacional = [formData.endereco_inter, formData.cidade_inter, formData.estado_inter, formData.pais_nome, formData.cep_inter].filter(Boolean).join(', ');
  
  // Ajustado para usar os novos nomes de campos
  let localizacaoCartorio = '';
  if (formData.estado_cartorio && formData.cidade_cartorio) {
      localizacaoCartorio = `${formData.cidade_cartorio} - ${formData.estado_cartorio}`;
  } else if (formData.estado_matricula && formData.cidade_matricula) {
      localizacaoCartorio = `${formData.cidade_matricula} - ${formData.estado_matricula}`;
  }


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
            {localizacaoCartorio && <DetailRow label="Localização do Cartório" value={localizacaoCartorio} />} {/* NOVO LABEL */}
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
            <DetailRow label="RG" value={formData.requerente_rg} />
            {/* Ajustado para usar os novos nomes de campos, se houver endereço do requerente */}
            { (formData.requerente_endereco || formData.requerente_cidade_entrega) && (
                <DetailRow label="Endereço Solicitante" value={[formData.requerente_endereco, formData.requerente_numero, formData.requerente_bairro, `${formData.requerente_cidade_entrega || ''}/${formData.requerente_estado_entrega || ''}`].filter(Boolean).join(', ')} />
            )}
          </div>

          <div className={`${styles.section} ${styles.summarySection}`}>
            <h4>Resumo Financeiro</h4>
            <DetailRow 
              label={`Valor do Serviço (${item.name})`} 
              value={`R$ ${valorServico > 0 ? valorServico.toFixed(2).replace('.', ',') : '0,00'}`} 
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