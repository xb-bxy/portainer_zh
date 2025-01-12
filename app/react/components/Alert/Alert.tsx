import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { AlertCircle, AlertTriangle, CheckCircle, XCircle } from 'lucide-react';
import { PropsWithChildren, ReactNode } from 'react';

import { Icon } from '@@/Icon';

type AlertType = 'success' | 'error' | 'info' | 'warn';

const alertSettings: Record<
  AlertType,
  { container: string; header: string; body: string; icon: ReactNode }
> = {
  success: {
    container:
      'border-green-4 bg-green-2 th-dark:bg-green-3 th-dark:border-green-5',
    header: 'text-green-8',
    body: 'text-green-7',
    icon: CheckCircle,
  },
  error: {
    container:
      'border-error-4 bg-error-2 th-dark:bg-error-3 th-dark:border-error-5',
    header: 'text-error-8',
    body: 'text-error-7',
    icon: XCircle,
  },
  info: {
    container:
      'border-blue-4 bg-blue-2 th-dark:bg-blue-3 th-dark:border-blue-5',
    header: 'text-blue-8',
    body: 'text-blue-7',
    icon: AlertCircle,
  },
  warn: {
    container:
      'border-warning-4 bg-warning-2 th-dark:bg-warning-3 th-dark:border-warning-5',
    header: 'text-warning-8',
    body: 'text-warning-7',
    icon: AlertTriangle,
  },
};

export function Alert({
  color,
  title,
  className,
  children,
}: PropsWithChildren<{
  color: AlertType;
  title?: string;
  className?: string;
}>) {
  const { t } = useTranslation();
  const translatedTitle = typeof title === 'string' ? t(title) : title;
  const { container, header, body, icon } = alertSettings[color];

  return (
    <AlertContainer className={clsx(container, className)}>
      {translatedTitle ? (
        <>
          <AlertHeader className={header}>
            <Icon icon={icon} />
            {translatedTitle}
          </AlertHeader>
          <AlertBody className={body} hasTitle={!!translatedTitle}>
            {children}
          </AlertBody>
        </>
      ) : (
        <AlertBody
          className={clsx(body, 'flex items-start gap-2')}
          hasTitle={!!translatedTitle}
        >
          <Icon icon={icon} className="!mt-0.5 flex-none" /> {children}
        </AlertBody>
      )}
    </AlertContainer>
  );
}

function AlertContainer({
  className,
  children,
}: PropsWithChildren<{ className?: string }>) {
  return (
    <div className={clsx('rounded-md border-2 border-solid', 'p-3', className)}>
      {children}
    </div>
  );
}

function AlertHeader({
  className,
  children,
}: PropsWithChildren<{ className?: string }>) {
  return (
    <h4
      className={clsx(
        'text-base',
        '!m-0 mb-2 flex items-center gap-2',
        className
      )}
    >
      {children}
    </h4>
  );
}

function AlertBody({
  className,
  hasTitle,
  children,
}: PropsWithChildren<{ className?: string; hasTitle: boolean }>) {
  return (
    <div className={clsx('text-sm', className, { 'ml-6': hasTitle })}>
      {children}
    </div>
  );
}
