// Salve em: src/utils/validators.js
// Este arquivo combina os validadores de CPF e CNPJ em um único local.

/**
 * Valida um número de CPF.
 * @param {string | undefined | null} cpf - O CPF a ser validado (pode conter pontos e hífen).
 * @returns {boolean} - Retorna true se o CPF for válido, false caso contrário.
 */
export const isValidCPF = (cpf) => {
  if (typeof cpf !== 'string') return false;

  // Remove caracteres não numéricos
  const cleanedCpf = cpf.replace(/[^\d]/g, '');

  // Verifica se tem 11 dígitos ou se é uma sequência de dígitos repetidos
  if (cleanedCpf.length !== 11 || /^(\d)\1{10}$/.test(cleanedCpf)) {
    return false;
  }

  let sum = 0;
  let remainder;

  for (let i = 1; i <= 9; i++) {
    sum += parseInt(cleanedCpf.substring(i - 1, i), 10) * (11 - i);
  }

  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) {
    remainder = 0;
  }

  if (remainder !== parseInt(cleanedCpf.substring(9, 10), 10)) {
    return false;
  }

  sum = 0;
  for (let i = 1; i <= 10; i++) {
    sum += parseInt(cleanedCpf.substring(i - 1, i), 10) * (12 - i);
  }

  remainder = (sum * 10) % 11;
  if (remainder === 10 || remainder === 11) {
    remainder = 0;
  }

  if (remainder !== parseInt(cleanedCpf.substring(10, 11), 10)) {
    return false;
  }

  return true;
};


/**
 * Valida um número de CNPJ.
 * @param {string | undefined | null} cnpj - O CNPJ a ser validado (pode conter pontos, barra e hífen).
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