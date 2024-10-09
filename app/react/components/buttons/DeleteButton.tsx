import { useTranslation } from 'react-i18next';
import { Trash2 } from 'lucide-react';
import { ComponentProps, PropsWithChildren, ReactNode } from 'react';

import { AutomationTestingProps } from '@/types';

import { confirmDelete } from '@@/modals/confirm';

import { Button } from './Button';

type ConfirmOrClick =
  | {
      confirmMessage: ReactNode;
      onConfirmed(): Promise<void> | void;
      onClick?: never;
    }
  | {
      confirmMessage?: never;
      onConfirmed?: never;
      /** if onClick is set, will skip confirmation (confirmation should be done on the parent) */
      onClick(): void;
    };

export function DeleteButton({
  disabled,
  size,
  children,
  'data-cy': dataCy,
  ...props
}: PropsWithChildren<
  AutomationTestingProps &
    ConfirmOrClick & {
      size?: ComponentProps<typeof Button>['size'];
      disabled?: boolean;
    }
>) {
  const { t } = useTranslation();
  const { confirmMessage } = props;
  const translatedConfirmMessage =
    typeof confirmMessage === 'string' ? t(confirmMessage) : confirmMessage;
  return (
    <Button
      size={size}
      color="dangerlight"
      disabled={disabled}
      onClick={() => handleClick()}
      icon={Trash2}
      className="!m-0"
      data-cy={dataCy}
    >
      {children || 'Remove'}
    </Button>
  );

  async function handleClick() {
    const { onConfirmed, onClick } = props;
    if (onClick) {
      return onClick();
    }

    if (!(await confirmDelete(translatedConfirmMessage))) {
      return undefined;
    }

    return onConfirmed();
  }
}
