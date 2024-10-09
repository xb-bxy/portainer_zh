import { useTranslation } from 'react-i18next';
import { HelpCircle } from 'lucide-react';
import { ReactNode, useMemo } from 'react';
import sanitize from 'sanitize-html';
import clsx from 'clsx';

import { TooltipWithChildren, Position } from '../TooltipWithChildren';

type Size = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

const sizeClasses: Record<Size, string> = {
  xs: 'text-xs',
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg',
  xl: 'text-xl',
};

export interface Props {
  position?: Position;
  message: ReactNode;
  className?: string;
  setHtmlMessage?: boolean;
  size?: Size;
}

export function Tooltip({
  message,
  position = 'bottom',
  className,
  setHtmlMessage,
  size = 'md',
}: Props) {
  const { t } = useTranslation();
  const translatedMessage = typeof message === 'string' ? t(message) : message;

  // allow angular views to set html messages for the tooltip
  const htmlMessage = useMemo(() => {
    if (setHtmlMessage && typeof translatedMessage === 'string') {
      // eslint-disable-next-line react/no-danger
      return (
        <div
          dangerouslySetInnerHTML={{ __html: sanitize(translatedMessage) }}
        />
      );
    }
    return null;
  }, [setHtmlMessage, translatedMessage]);
  return (
    <span className={clsx('ml-1 inline-flex items-center', sizeClasses[size])}>
      <TooltipWithChildren
        message={htmlMessage || translatedMessage}
        position={position}
        className={className}
      >
        <HelpCircle className="lucide" />
      </TooltipWithChildren>
    </span>
  );
}
