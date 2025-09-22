// Salve em: src/components/FaqAccordion/PlusMinusIcon.js

const PlusMinusIcon = ({ isOpen, className }) => (
  <svg
    className={className}
    width="20"
    height="20"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
  >
    {/* Linha horizontal, sempre visível */}
    <line x1="5" y1="12" x2="19" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    {/* Linha vertical, cuja rotação é controlada por CSS */}
    <line x1="12" y1="5" x2="12" y2="19" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export default PlusMinusIcon;