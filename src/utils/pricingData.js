// Salve em: src/utils/pricingData.js

/**
 * ATENÇÃO: Este arquivo centraliza todas as tabelas de preços e taxas do sistema.
 * As modificações aqui refletirão nos cálculos de preço em todo o site.
 * 
 * Estrutura:
 * - custas_cartorios: Preços base para certidões de Registro de Imóveis (Matrícula, Ônus, etc.).
 * - registro_imoveis_pesquisas: Preços para serviços de pesquisa de imóveis.
 * - tabelionato_registro_civil: Preços por estado para certidões de Notas e Registro Civil.
 * - protesto_por_estado: Preços base para a Certidão de Protesto, variando por estado.
 * - certidoes_adm_publica: Preços para certidões Federais, Estaduais e Municipais.
 * - taxas_servicos: Valores padronizados para todos os serviços adicionais e taxas do site.
 */

export const pricingData = {
  // --- SEÇÃO 1: CUSTAS DE REGISTRO DE IMÓVEIS ---
  "custas_cartorios": {
    "descricao": "Custas das Certidões dos Cartórios de Registro de Imóveis",
    "tabela": [
      { "estado": "SP", "matricula_inteiro_teor": 193.30, "onus_e_acoes": 223.65 },
      { "estado": "RS", "matricula_inteiro_teor": 193.30, "onus_e_acoes": 277.30 },
      { "estado": "SC", "matricula_inteiro_teor": 158.30, "onus_e_acoes": 229.65 }
    ]
  },

  // --- SEÇÃO 2: PESQUISAS DE REGISTRO DE IMÓVEIS ---
  "registro_imoveis_pesquisas": {
    "descricao": "Tabela do Registro de Imóveis + Pesquisas",
    "tabela": [
      { "estado": "SP", "certidao_imovel": 214.30, "visualizacao_matricula": 82.30, "pesquisa_previa": 67.30, "pesquisa_qualificada": 7.43 },
      { "estado": "RS", "certidao_imovel": 214.30, "visualizacao_matricula": 86.30, "pesquisa_previa": 124.30, "pesquisa_qualificada": 27.41 },
      { "estado": "SC", "certidao_imovel": 194.30, "visualizacao_matricula": 76.30, "pesquisa_previa": 81.30, "pesquisa_qualificada": 11.26 }
    ]
  },
  
  // --- SEÇÃO 3: PREÇOS POR ESTADO PARA NOTAS E REGISTRO CIVIL ---
  "tabelionato_registro_civil": {
    "descricao": "Preços base para certidões de Tabelionato de Notas (Escrituras) e Registro Civil (Nascimento, Casamento, Óbito) por estado.",
    "tabela": [
      { "estado": "SP", "valor": 227.20 },
      { "estado": "RS", "valor": 227.20 },
      { "estado": "SC", "valor": 227.20 },
      { "estado": "PR", "valor": 227.20 },
      { "estado": "RJ", "valor": 364.65 },
      { "estado": "ES", "valor": 227.20 },
      { "estado": "MG", "valor": 227.20 },
      { "estado": "MS", "valor": 227.65 },
      { "estado": "MT", "valor": 227.20 },
      { "estado": "BA", "valor": 287.20 },
      { "estado": "DF", "valor": 167.65 },
      { "estado": "GO", "valor": 227.20 },
      { "estado": "TO", "valor": 227.20 },
      { "estado": "RO", "valor": 227.20 },
      { "estado": "AC", "valor": 227.20 },
      { "estado": "SE", "valor": 227.20 },
      { "estado": "AL", "valor": 227.20 },
      { "estado": "PE", "valor": 227.20 },
      { "estado": "PB", "valor": 257.65 },
      { "estado": "RN", "valor": 227.20 },
      { "estado": "CE", "valor": 237.65 },
      { "estado": "PI", "valor": 227.20 },
      { "estado": "MA", "valor": 227.20 },
      { "estado": "PA", "valor": 227.20 },
      { "estado": "AP", "valor": 227.20 },
      { "estado": "AM", "valor": 227.65 },
      { "estado": "RR", "valor": 227.20 }
    ]
  },

  // --- SEÇÃO 4: TABELA DE PREÇOS PARA CARTÓRIO DE PROTESTO ---
  "protesto_por_estado": {
    "descricao": "Custo base para uma certidão de protesto por estado. Se a cidade tiver múltiplos cartórios e o cliente selecionar 'todos', este valor será multiplicado.",
    "tabela": [
        { "estado": "AC", "valor": 167.70 },
        { "estado": "AL", "valor": 167.70 },
        { "estado": "AP", "valor": 187.70 },
        { "estado": "AM", "valor": 137.70 },
        { "estado": "BA", "valor": 127.70 },
        { "estado": "CE", "valor": 127.70 },
        { "estado": "DF", "valor": 147.70 },
        { "estado": "ES", "valor": 167.70 },
        { "estado": "GO", "valor": 157.70 },
        { "estado": "MA", "valor": 167.70 },
        { "estado": "MS", "valor": 127.70 },
        { "estado": "MT", "valor": 137.70 },
        { "estado": "MG", "valor": 147.70 },
        { "estado": "PA", "valor": 177.70 },
        { "estado": "PB", "valor": 167.70 },
        { "estado": "PR", "valor": 127.70 },
        { "estado": "PE", "valor": 137.70 },
        { "estado": "PI", "valor": 167.70 },
        { "estado": "RJ", "valor": 137.70 },
        { "estado": "RN", "valor": 167.70 },
        { "estado": "RS", "valor": 137.70 },
        { "estado": "RO", "valor": 137.70 },
        { "estado": "RR", "valor": 167.70 },
        { "estado": "SC", "valor": 127.70 },
        { "estado": "SP", "valor": 127.70 },
        { "estado": "SE", "valor": 137.70 },
        { "estado": "TO", "valor": 167.70 }
    ]
  },

  // --- SEÇÃO 5: PREÇOS PARA CERTIDÕES DA ADMINISTRAÇÃO PÚBLICA ---
  "certidoes_adm_publica": {
    "descricao": "Preços fixos para certidões Federais, Estaduais e Municipais.",
    "tabela": [
      { "esfera": "Federal", "valor": 43.70 },
      { "esfera": "Estadual", "valor": 43.70 },
      { "esfera": "Municipal", "valor": 77.30 }
    ]
  },

  // --- SEÇÃO 6: TAXAS PADRONIZADAS DE SERVIÇOS E ACRÉSCIMOS ---
  "taxas_servicos": {
    "descricao": "Valores fixos para serviços adicionais aplicáveis a todo o site.",
    "custo_papel": 40.00,             // Acréscimo para qualquer certidão física/impressa
    "apostilamento": 290.00,           // Valor único para apostilamento (digital ou físico)
    "aviso_recebimento": 35.00,        // Custo do serviço de A.R. dos Correios
    "acrescimo_condominio": 300.00     // Acréscimo específico para a Certidão de Condomínio
  }
};

/**
 * Função auxiliar para buscar preços dinamicamente a partir das tabelas.
 * @param {string} tabela - O nome da chave da tabela em `pricingData` (ex: "protesto_por_estado").
 * @param {string} chaveBusca - O nome do campo a ser usado para encontrar a linha (ex: "estado").
 * @param {string} valorBusca - O valor a ser procurado na `chaveBusca` (ex: "SP").
 * @param {string} chaveRetorno - O nome do campo cujo valor deve ser retornado (ex: "valor").
 * @returns {number | null} - Retorna o preço encontrado ou null se não encontrar.
 */
export const getPrice = (tabela, chaveBusca, valorBusca, chaveRetorno) => {
    if (!pricingData[tabela] || !valorBusca) {
      console.warn(`Tabela de preços "${tabela}" ou valor de busca não fornecido.`);
      return null;
    }

    const dados = pricingData[tabela].tabela.find(item => item[chaveBusca] === valorBusca);
    
    if (!dados) {
      console.warn(`Nenhum preço encontrado em "${tabela}" para ${chaveBusca} = ${valorBusca}.`);
      return null;
    }

    return dados[chaveRetorno];
};

/**
 * Função auxiliar para buscar uma taxa de serviço padrão.
 * @param {string} taxa - O nome da chave da taxa em `taxas_servicos` (ex: "apostilamento").
 * @returns {number | null} - Retorna o valor da taxa ou null se não for encontrada.
 */
export const getTaxa = (taxa) => {
    if (pricingData.taxas_servicos && pricingData.taxas_servicos[taxa] !== undefined) {
        return pricingData.taxas_servicos[taxa];
    }
    console.warn(`Taxa de serviço "${taxa}" não encontrada.`);
    return null;
};