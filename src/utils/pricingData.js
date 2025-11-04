// Salve em: src/utils/pricingData.js

/**
 * ATENÇÃO: Este arquivo centraliza todas as tabelas de preços e taxas do sistema.
 * As modificações aqui refletirão nos cálculos de preço em todo o site.
 * 
 * Estrutura:
 * - custas_cartorios: Preços base para certidões de Registro de Imóveis (Matrícula, Ônus, etc.).
 * - registro_imoveis_pesquisas: Preços para serviços de pesquisa de imóveis. (TABELA ATUALIZADA)
 * - tabelionato_registro_civil: Preços por estado para certidões de Notas e Registro Civil. (TABELA ATUALIZADA)
 * - protesto_por_estado: Preços base para a Certidão de Protesto, variando por estado. (TABELA ATUALIZADA)
 * - certidoes_adm_publica: Preços para certidões Federais, Estaduais e Municipais.
 * - taxas_servicos: Valores padronizados para todos os serviços adicionais e taxas do site.
 */

export const pricingData = {
  // --- SEÇÃO 1: CUSTAS DE REGISTRO DE IMÓVEIS (Estrutura original mantida) ---
  "custas_cartorios": {
    "descricao": "Custas das Certidões dos Cartórios de Registro de Imóveis",
    "tabela": [
      { "estado": "SP", "matricula_inteiro_teor": 193.30, "onus_e_acoes": 223.65 },
      { "estado": "RS", "matricula_inteiro_teor": 193.30, "onus_e_acoes": 277.30 },
      { "estado": "SC", "matricula_inteiro_teor": 158.30, "onus_e_acoes": 229.65 }
    ]
  },

  // --- SEÇÃO 2: PESQUISAS DE REGISTRO DE IMÓVEIS (TABELA ATUALIZADA CONFORME PDF) ---
  "registro_imoveis_pesquisas": {
    "descricao": "Tabela do Registro de Imóveis + Pesquisas",
    "tabela": [
      { "estado": "SP", "certidao_imovel": 214.30, "visualizacao_matricula": 82.30, "pesquisa_previa": 67.30, "pesquisa_qualificada": 67.30 },
      { "estado": "RS", "certidao_imovel": 214.30, "visualizacao_matricula": 86.30, "pesquisa_previa": 124.30, "pesquisa_qualificada": 87.30 },
      { "estado": "SC", "certidao_imovel": 194.30, "visualizacao_matricula": 76.30, "pesquisa_previa": 81.30, "pesquisa_qualificada": 78.30 },
      { "estado": "PR", "certidao_imovel": 234.30, "visualizacao_matricula": 76.30, "pesquisa_previa": 98.30, "pesquisa_qualificada": 78.30 },
      { "estado": "RJ", "certidao_imovel": 274.30, "visualizacao_matricula": 98.30, "pesquisa_previa": 169.30, "pesquisa_qualificada": 108.30 },
      { "estado": "ES", "certidao_imovel": 249.65, "visualizacao_matricula": 78.30, "pesquisa_previa": 68.30, "pesquisa_qualificada": 68.30 },
      { "estado": "MG", "certidao_imovel": 214.30, "visualizacao_matricula": 69.30, "pesquisa_previa": 98.30, "pesquisa_qualificada": 78.30 },
      { "estado": "MS", "certidao_imovel": 214.30, "visualizacao_matricula": 79.30, "pesquisa_previa": 78.30, "pesquisa_qualificada": 78.30 },
      // *** VALORES REMOVIDOS CONFORME SOLICITADO ***
      { "estado": "MT", "certidao_imovel": 214.30, "visualizacao_matricula": 79.30, "pesquisa_previa": null, "pesquisa_qualificada": 88.30 },
      { "estado": "BA", "certidao_imovel": 324.30, "visualizacao_matricula": 98.30, "pesquisa_previa": null, "pesquisa_qualificada": 98.30 },
      { "estado": "GO", "certidao_imovel": 278.30, "visualizacao_matricula": 98.30, "pesquisa_previa": null, "pesquisa_qualificada": 88.30 },
      { "estado": "DF", "certidao_imovel": 198.30, "visualizacao_matricula": 78.30, "pesquisa_previa": 78.30, "pesquisa_qualificada": 78.30 },
      { "estado": "TO", "certidao_imovel": 208.30, "visualizacao_matricula": 78.30, "pesquisa_previa": null, "pesquisa_qualificada": 78.30 },
      { "estado": "RO", "certidao_imovel": 197.30, "visualizacao_matricula": 78.30, "pesquisa_previa": 78.30, "pesquisa_qualificada": 78.30 },
      { "estado": "AC", "certidao_imovel": 228.65, "visualizacao_matricula": 68.30, "pesquisa_previa": null, "pesquisa_qualificada": 68.30 },
      { "estado": "SE", "certidao_imovel": 228.30, "visualizacao_matricula": 84.30, "pesquisa_previa": null, "pesquisa_qualificada": 88.30 },
      { "estado": "AL", "certidao_imovel": 198.30, "visualizacao_matricula": 78.30, "pesquisa_previa": null, "pesquisa_qualificada": null },
      { "estado": "PE", "certidao_imovel": 214.30, "visualizacao_matricula": 78.30, "pesquisa_previa": null, "pesquisa_qualificada": 68.30 },
      { "estado": "PB", "certidao_imovel": 328.30, "visualizacao_matricula": 118.30, "pesquisa_previa": 118.30, "pesquisa_qualificada": 118.30 },
      { "estado": "RN", "certidao_imovel": 314.30, "visualizacao_matricula": 112.30, "pesquisa_previa": null, "pesquisa_qualificada": 83.30 },
      { "estado": "CE", "certidao_imovel": null, "visualizacao_matricula": 78.30, "pesquisa_previa": null, "pesquisa_qualificada": 78.30 },
      { "estado": "PI", "certidao_imovel": 214.65, "visualizacao_matricula": 98.30, "pesquisa_previa": 78.30, "pesquisa_qualificada": 98.30 },
      { "estado": "MA", "certidao_imovel": null, "visualizacao_matricula": 98.30, "pesquisa_previa": null, "pesquisa_qualificada": null },
      { "estado": "PA", "certidao_imovel": 214.30, "visualizacao_matricula": 98.30, "pesquisa_previa": null, "pesquisa_qualificada": 78.30 },
      { "estado": "AP", "certidao_imovel": 228.30, "visualizacao_matricula": null, "pesquisa_previa": null, "pesquisa_qualificada": null },
      { "estado": "AM", "certidao_imovel": 314.30, "visualizacao_matricula": 113.30, "pesquisa_previa": null, "pesquisa_qualificada": 118.30 },
      { "estado": "RR", "certidao_imovel": null, "visualizacao_matricula": 73.30, "pesquisa_previa": null, "pesquisa_qualificada": 78.30 }
    ]
  },
  
  // --- SEÇÃO 3: PREÇOS POR ESTADO PARA NOTAS E REGISTRO CIVIL (TABELA ATUALIZADA CONFORME PDF) ---
  "tabelionato_registro_civil": {
    "descricao": "Preços base para certidões de Tabelionato de Notas (Escrituras) e Registro Civil (Nascimento, Casamento, Óbito) por estado.",
    "tabela": [
      { "estado": "SP", "valor_notas": 227.20, "valor_civil": 227.20, "valor": 227.20 },
      { "estado": "RS", "valor_notas": 227.20, "valor_civil": 227.20, "valor": 227.20 },
      { "estado": "SC", "valor_notas": 227.20, "valor_civil": 227.20, "valor": 227.20 },
      { "estado": "PR", "valor_notas": 227.20, "valor_civil": 227.20, "valor": 227.20 },
      // *** VALORES CORRIGIDOS ***
      { "estado": "RJ", "valor_notas": 267.30, "valor_civil": 364.65, "valor": 364.65 },
      { "estado": "BA", "valor_notas": 287.20, "valor_civil": 357.20, "valor": 357.20 },
      { "estado": "TO", "valor_notas": 277.20, "valor_civil": 227.20, "valor": 227.20 },
      { "estado": "PA", "valor_notas": 227.20, "valor_civil": 357.65, "valor": 357.65 },
      { "estado": "ES", "valor_notas": 227.20, "valor_civil": 227.20, "valor": 227.20 },
      { "estado": "MG", "valor_notas": 227.20, "valor_civil": 237.65, "valor": 237.65 },
      { "estado": "MS", "valor_notas": 227.20, "valor_civil": 237.65, "valor": 237.65 },
      { "estado": "MT", "valor_notas": 227.20, "valor_civil": 237.65, "valor": 237.65 },
      { "estado": "DF", "valor_notas": 167.65, "valor_civil": 227.20, "valor": 227.20 },
      { "estado": "GO", "valor_notas": 227.20, "valor_civil": 237.65, "valor": 237.65 },
      { "estado": "RO", "valor_notas": 227.20, "valor_civil": 227.20, "valor": 227.20 },
      { "estado": "AC", "valor_notas": 227.20, "valor_civil": 227.20, "valor": 227.20 },
      { "estado": "SE", "valor_notas": 227.20, "valor_civil": 227.20, "valor": 227.20 },
      { "estado": "AL", "valor_notas": 227.20, "valor_civil": 227.20, "valor": 227.20 },
      { "estado": "PE", "valor_notas": 227.20, "valor_civil": 237.25, "valor": 237.25 },
      { "estado": "PB", "valor_notas": 227.20, "valor_civil": 257.65, "valor": 257.65 },
      { "estado": "RN", "valor_notas": 227.20, "valor_civil": 237.65, "valor": 237.65 },
      { "estado": "CE", "valor_notas": 227.20, "valor_civil": 237.65, "valor": 237.65 },
      { "estado": "PI", "valor_notas": 227.20, "valor_civil": 237.65, "valor": 237.65 },
      { "estado": "MA", "valor_notas": 227.20, "valor_civil": 237.65, "valor": 237.65 },
      { "estado": "AP", "valor_notas": 227.20, "valor_civil": 227.20, "valor": 227.20 },
      { "estado": "AM", "valor_notas": 227.20, "valor_civil": 237.65, "valor": 237.65 },
      { "estado": "RR", "valor_notas": 227.20, "valor_civil": 227.20, "valor": 227.20 }
    ]
  },

  // --- SEÇÃO 4: TABELA DE PREÇOS PARA CARTÓRIO DE PROTESTO (TABELA ATUALIZADA CONFORME PDF) ---
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

  // --- SEÇÃO 5: PREÇOS PARA CERTIDÕES DA ADMINISTRAÇÃO PÚBLICA (Estrutura original mantida) ---
  "certidoes_adm_publica": {
    "descricao": "Preços fixos para certidões Federais, Estaduais e Municipais.",
    "tabela": [
      { "esfera": "Federal", "valor": 43.70 },
      { "esfera": "Estadual", "valor": 43.70 },
      { "esfera": "Municipal", "valor": 77.30 }
    ]
  },

  // --- SEÇÃO 6: TAXAS PADRONIZADAS DE SERVIÇOS E ACRÉSCIMOS (Estrutura original mantida) ---
  "taxas_servicos": {
    "descricao": "Valores fixos para serviços adicionais aplicáveis a todo o site.",
    "custo_papel": 40.00,
    "apostilamento": 290.00,
    "aviso_recebimento": 35.00,
    "acrescimo_condominio": 300.00,
    "sedex": 68.00,
    "entrega_internacional_correios": 180.00,
    "entrega_internacional_dhl": 380.00
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