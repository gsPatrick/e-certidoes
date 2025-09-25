// Salve em: src/components/MultiStepForm/StepProgressBar.js
'use client';
import styles from './StepProgressBar.module.css';

const StepProgressBar = ({ steps, currentStep }) => {
  return (
    <div className={styles.progressBarContainer}>
      {steps.map((step, index) => {
        const stepIndex = index + 1;
        const isCompleted = stepIndex < currentStep;
        const isActive = stepIndex === currentStep;

        return (
          <div key={index} className={styles.stepItem}>
            <div className={`${styles.stepCircle} ${isActive ? styles.active : ''} ${isCompleted ? styles.completed : ''}`}>
              {isCompleted ? '✓' : stepIndex}
            </div>
            <p className={styles.stepLabel}>{step}</p>
          </div>
        );
      })}
    </div>
  );
};

export default StepProgressBar;