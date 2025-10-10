// Salve em: src/data/pricingData.js

export const pricingData = {
  "custas_cartorios": {
    "descricao": "Custas das Certidões dos Cartórios de Registro de Imóveis",
    "tabela": [
      { "estado": "SP", "matricula_inteiro_teor": 193.30, "demais_certidoes": 75.05, "onus_e_acoes": 223.65 },
      { "estado": "RS", "matricula_inteiro_teor": 193.30, "demais_certidoes": 76.40, "onus_e_acoes": 277.30 },
      { "estado": "SC", "matricula_inteiro_teor": 158.30, "demais_certidoes": 33.79, "onus_e_acoes": 229.65 }
    ]
  },
  "registro_imoveis_pesquisas": {
    "descricao": "Tabela do Registro de Imóveis + Pesquisas",
    "tabela": [
      { "estado": "SP", "certidao_imovel": 214.30, "visualizacao_matricula": 82.30, "pesquisa_previa": 67.30, "pesquisa_qualificada": 7.43 },
      { "estado": "RS", "certidao_imovel": 214.30, "visualizacao_matricula": 86.30, "pesquisa_previa": 124.30, "pesquisa_qualificada": 27.41 },
      { "estado": "SC", "certidao_imovel": 194.30, "visualizacao_matricula": 76.30, "pesquisa_previa": 81.30, "pesquisa_qualificada": 11.26 }
    ]
  },
  // *** NOVA SEÇÃO ADICIONADA ***
  "servicos_adicionais": {
    "descricao": "Custas para serviços adicionais (valores de exemplo)",
    "tabela": [
      { 
        "estado": "SP", 
        "apostilamento": 115.50, 
        "aviso_recebimento": 25.80, 
        "reconhecimento_firma": 30.10,
        "inteiro_teor_transcricao": 35.00,
        "inteiro_teor_reprografica": 45.00
      },
      { 
        "estado": "RS", 
        "apostilamento": 120.00, 
        "aviso_recebimento": 28.00, 
        "reconhecimento_firma": 32.50,
        "inteiro_teor_transcricao": 38.00,
        "inteiro_teor_reprografica": 48.00
      },
      { 
        "estado": "SC", 
        "apostilamento": 105.75, 
        "aviso_recebimento": 22.50, 
        "reconhecimento_firma": 28.00,
        "inteiro_teor_transcricao": 32.00,
        "inteiro_teor_reprografica": 42.00
      }
    ]
  }
};

// Função auxiliar para buscar preços
export const getDynamicPrice = (tabela, tipo, estado) => {
    if (!pricingData[tabela] || !estado) return null;

    const estadoData = pricingData[tabela].tabela.find(item => item.estado === estado);
    if (!estadoData) return null; // Retorna null se o estado não for encontrado

    return estadoData[tipo]; // Retorna undefined se o 'tipo' não existir, o que é tratado com '||'
};