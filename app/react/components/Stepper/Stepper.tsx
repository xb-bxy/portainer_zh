import { useTranslation } from 'react-i18next';
import clsx from 'clsx';

import styles from './Stepper.module.css';

export interface Step {
  label: string;
}

interface Props {
  currentStep: number;
  steps: Step[];
}

export function Stepper({ currentStep, steps }: Props) {
  const { t } = useTranslation();
  const translatedSteps = steps.map((step) => ({
    ...steps,
    label: t(step.label),
  }));
  return (
    <div className={styles.stepperWrapper}>
      {translatedSteps.map((step, index) => (
        <div
          key={step.label}
          className={clsx(styles.stepWrapper, {
            [styles.active]: index + 1 === currentStep,
            [styles.completed]: index + 1 < currentStep,
          })}
        >
          <div className={styles.step}>
            <div className={styles.stepCounter}>{index + 1}</div>
            <div className={styles.stepName}>{step.label}</div>
          </div>
        </div>
      ))}
    </div>
  );
}
