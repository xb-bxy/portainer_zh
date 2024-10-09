import { useTranslation } from 'react-i18next';
import { ComponentProps, InputHTMLAttributes } from 'react';
import clsx from 'clsx';

import { AutomationTestingProps } from '@/types';

import { InputGroup } from '../InputGroup';

export function InputLabeled({
  label,
  className,
  size,
  needsDeletion,
  id,
  required,
  disabled,
  placeholder,
  ...props
}: {
  label: string;
  className?: string;
  size?: ComponentProps<typeof InputGroup>['size'];
  needsDeletion?: boolean;
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'size' | 'children'> &
  AutomationTestingProps) {
  const { t } = useTranslation();
  const translatedLabel = t(label);
  const translatedPlaceholder =
    typeof placeholder === 'string' ? t(placeholder) : placeholder;
  return (
    <InputGroup
      className={clsx(className, needsDeletion && 'striked')}
      size={size}
    >
      <InputGroup.Addon as="label" htmlFor={id} required={required}>
        {translatedLabel}
      </InputGroup.Addon>
      <InputGroup.Input
        // eslint-disable-next-line react/jsx-props-no-spreading
        {...props}
        placeholder={translatedPlaceholder}
        disabled={disabled || needsDeletion}
        id={id}
      />
    </InputGroup>
  );
}
