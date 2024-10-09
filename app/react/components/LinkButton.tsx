import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { ComponentProps } from 'react';

import { Button } from './buttons';
import { Link } from './Link';

export function LinkButton({
  to,
  params,
  disabled,
  className,
  children,
  title = '',
  'data-cy': dataCy,
  ...props
}: ComponentProps<typeof Button> & ComponentProps<typeof Link>) {
  const { t } = useTranslation();
  const translatedTitle = t(title);
  return (
    <Button
      title={translatedTitle}
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...props}
      className={clsx(className, 'no-link !m-0')}
      disabled={disabled}
      as={disabled ? 'span' : Link}
      props={{
        to,
        params,
      }}
      data-cy={dataCy}
    >
      {children}
    </Button>
  );
}