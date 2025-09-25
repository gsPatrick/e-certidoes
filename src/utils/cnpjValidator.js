// Salve em: src/utils/cnpjValidator.js

/**
 * Valida um número de CNPJ.
 * @param {string} cnpj - O CNPJ a ser validado (pode conter pontos, barra e hífen).
 * @returns {boolean} - Retorna true se o CNPJ for válido, false caso contrário.
 */
export const isValidCNPJ = (cnpj) => {
  if (typeof cnpj !== 'string') return false;

  // Remove caracteres não numéricos
  const cleanedCnpj = cnpj.replace(/[^\d]/g, '');

  // Verifica se tem 14 dígitos ou se é uma sequência de dígitos repetidos
  if (cleanedCnpj.length !== 14 || /^(\d)\1{13}$/.test(cleanedCnpj)) {
    return false;
  }

  let length = cleanedCnpj.length - 2;
  let numbers = cleanedCnpj.substring(0, length);
  const digits = cleanedCnpj.substring(length);
  let sum = 0;
  let pos = length - 7;

  for (let i = length; i >= 1; i--) {
    sum += parseInt(numbers.charAt(length - i), 10) * pos--;
    if (pos < 2) {
      pos = 9;
    }
  }

  let result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(digits.charAt(0), 10)) {
    return false;
  }

  length = length + 1;
  numbers = cleanedCnpj.substring(0, length);
  sum = 0;
  pos = length - 7;

  for (let i = length; i >= 1; i--) {
    sum += parseInt(numbers.charAt(length - i), 10) * pos--;
    if (pos < 2) {
      pos = 9;
    }
  }

  result = sum % 11 < 2 ? 0 : 11 - (sum % 11);
  if (result !== parseInt(digits.charAt(1), 10)) {
    return false;
  }

  return true;
};