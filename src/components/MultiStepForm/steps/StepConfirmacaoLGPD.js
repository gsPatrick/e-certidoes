// Salve em: src/components/MultiStepForm/steps/StepConfirmacaoLGPD.js
'use client';

import styles from './StepConfirmacaoLGPD.module.css';

export default function StepConfirmacaoLGPD({ formData, handleChange }) {
    return (
        <div className={styles.termsWrapper}>
            <h3 className={styles.stepTitle}>Termos de Uso e Declaração de Ciência (LGPD)</h3>
            <div className={styles.termsContainer}>
                <p><strong>Prezado (a),</strong></p>
                <p>
                    Ao prosseguir, você concorda ser plenamente capaz para os atos da vida civil e caso represente
                    pessoa jurídica, ter poderes para representá-la perante a e-Certidões.
                </p>
                <p>Assim, declara sob as penas da Lei que:</p>
                <ul className={styles.termsList}>
                    <li>
                        <strong>a)</strong> Tem ciência que a e-Certidões atua em conformidade com a Lei Geral de Proteção de Dados
                        (Lei nº 13.709 de 2018), de maneira que ela não salva nem tem acesso aos dados a serem fornecidos
                        na pesquisa que fará.
                    </li>
                    <li>
                        <strong>b)</strong> Tem ciência de seu compromisso em utilizar a pesquisa em conformidade com a legislação nacional.
                    </li>
                    <li>
                        <strong>c)</strong> Possuir autorização legal para tratar os dados pessoais de terceiros apontadas na pesquisa, seja
                        para cumprimento de obrigações contratuais ou pré-contratuais, nos termos do inciso V, do art. 7 da
                        LGPD, seja para exercício regular de direito em procedimento judicial, administrativo ou arbitral nos
                        termos do inciso VI do art. 7 da LGPD, seja para proteção de crédito, nos termos do inciso X, do
                        art. 7 da LGPD.
                    </li>
                    <li>
                        <strong>d)</strong> Que todas as eventuais dúvidas que possua, questionou advogado próprio, de sua confiança, que
                        lhe esclareceu e indicou se pode ou não utilizar os serviços da e-Certidões.
                    </li>
                    <li>
                        <strong>e)</strong> DESONERA a e-Certidões, inclusive se responsabilizando em sede de regresso, de qualquer
                        ilícito que cometa ou seja acusado de cometer em relação aos dados pessoais da pesquisa.
                    </li>
                </ul>
            </div>
            <div className={styles.agreementCheckbox}>
                <label>
                    <input
                        type="checkbox"
                        name="aceite_lgpd"
                        checked={!!formData.aceite_lgpd}
                        onChange={handleChange}
                        required
                    />
                    Concordo com os termos e desejo prosseguir
                </label>
            </div>
        </div>
    );
}