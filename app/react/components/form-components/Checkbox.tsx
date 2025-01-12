import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import {
  forwardRef,
  useRef,
  useEffect,
  MutableRefObject,
  ChangeEventHandler,
  HTMLProps,
} from 'react';

interface Props extends HTMLProps<HTMLInputElement> {
  checked?: boolean;
  indeterminate?: boolean;
  title?: string;
  label?: string;
  id?: string;
  className?: string;
  role?: string;
  onChange?: ChangeEventHandler<HTMLInputElement>;
  bold?: boolean;
  'data-cy': string;
}

export const Checkbox = forwardRef<HTMLInputElement, Props>(
  (
    {
      indeterminate,
      title,
      label,
      id,
      checked,
      onChange,
      bold = true,
      'data-cy': dataCy,
      ...props
    }: Props,
    ref
  ) => {
    const { t } = useTranslation();
    const translatedLabel = typeof label === 'string' ? t(label) : label;
    const defaultRef = useRef<HTMLInputElement>(null);
    let resolvedRef = ref as MutableRefObject<HTMLInputElement | null>;
    if (!ref) {
      resolvedRef = defaultRef;
    }

    useEffect(() => {
      if (resolvedRef === null || resolvedRef.current === null) {
        return;
      }

      if (typeof indeterminate !== 'undefined') {
        resolvedRef.current.indeterminate = indeterminate;
      }
    }, [resolvedRef, indeterminate]);

    return (
      <div
        className="md-checkbox flex items-center"
        title={title || translatedLabel}
      >
        <input
          id={id}
          type="checkbox"
          ref={resolvedRef}
          onChange={onChange}
          checked={checked}
          data-cy={dataCy}
          // eslint-disable-next-line react/jsx-props-no-spreading
          {...props}
        />
        <label htmlFor={id} className={clsx('m-0', { '!font-normal': !bold })}>
          {translatedLabel}
        </label>
      </div>
    );
  }
);
