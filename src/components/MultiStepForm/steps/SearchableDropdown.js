// Salve em: src/components/MultiStepForm/steps/SearchableDropdown.js
'use client';

import { useState, useEffect, useRef } from 'react';
import styles from './SearchableDropdown.module.css';

export default function SearchableDropdown({ options, value, onChange, placeholder, disabled, loading }) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(value || '');
  const dropdownRef = useRef(null);

  // Sincroniza o valor interno com a prop externa
  useEffect(() => {
    setSearchTerm(value || '');
  }, [value]);

  // Filtra as opções com base na busca
  const filteredOptions = options.filter(option =>
    option.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInputChange = (e) => {
    setSearchTerm(e.target.value);
    if (!isOpen) {
      setIsOpen(true);
    }
  };

  const handleOptionClick = (option) => {
    setSearchTerm(option);
    onChange(option); // Notifica o componente pai da mudança
    setIsOpen(false);
  };

  // Fecha o dropdown se o usuário clicar fora dele
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
        setSearchTerm(value || ''); // Restaura o valor selecionado se fechar sem escolher
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [value]);

  return (
    <div className={styles.dropdownContainer} ref={dropdownRef}>
      <input
        type="text"
        className={styles.input}
        value={searchTerm}
        onChange={handleInputChange}
        onFocus={() => setIsOpen(true)}
        placeholder={disabled ? 'Selecione a opção anterior' : (loading ? 'Carregando...' : placeholder)}
        disabled={disabled || loading}
      />
      {isOpen && !disabled && (
        <ul className={styles.optionsList}>
          {loading ? (
            <li className={styles.noOptions}>Carregando...</li>
          ) : filteredOptions.length > 0 ? (
            filteredOptions.map((option) => (
              <li
                key={option}
                className={styles.optionItem}
                onClick={() => handleOptionClick(option)}
              >
                {option}
              </li>
            ))
          ) : (
            <li className={styles.noOptions}>Nenhum resultado encontrado</li>
          )}
        </ul>
      )}
    </div>
  );
}