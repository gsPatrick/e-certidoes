// Salve em: src/components/MultiStepForm/StepProgressBar.js
'use client';
import styles from './StepProgressBar.module.css';

const StepProgressBar = ({ steps, currentStep }) => {
  return (
    <div className={styles.progressBarContainer}>
      <div className={styles.progressLine} style={{ width: `${(currentStep / (steps.length - 1)) * 100}%` }}></div>
      {steps.map((step, index) => {
        const isCompleted = index < currentStep;
        const isActive = index === currentStep;

        return (
          <div key={index} className={styles.stepItem}>
            <div className={`${styles.stepCircle} ${isActive ? styles.active : ''} ${isCompleted ? styles.completed : ''}`}>
              {isCompleted ? '✓' : index + 1}
            </div>
            <p className={`${styles.stepLabel} ${isActive || isCompleted ? styles.labelActive : ''}`}>
              {step.title}
            </p>
          </div>
        );
      })}
    </div>
  );
};

export default StepProgressBar;