import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { ReactNode } from 'react';

import { ModalType } from './types';
import { useModalContext } from './Modal';
import styles from './ModalHeader.module.css';

interface Props {
  title: ReactNode;
  modalType?: ModalType;
}

export function ModalHeader({ title, modalType }: Props) {
  const { t } = useTranslation();
  const translatedTitle = typeof title === 'string' ? t(title) : title;
  useModalContext();

  return (
    <div className={styles.modalHeader}>
      {modalType && (
        <div
          className={clsx({
            [styles.backgroundError]: modalType === ModalType.Destructive,
            [styles.backgroundWarning]: modalType === ModalType.Warn,
          })}
        />
      )}
      {typeof translatedTitle === 'string' ? (
        <h5 className="m-0 font-bold">{translatedTitle}</h5>
      ) : (
        translatedTitle
      )}
    </div>
  );
}
