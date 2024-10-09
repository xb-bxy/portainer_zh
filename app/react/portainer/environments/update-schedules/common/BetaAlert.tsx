import { useTranslation } from 'react-i18next';
import { ReactNode } from 'react';

import betaIcon from '@/assets/ico/beta.svg?c';

import { TextTip } from '@@/Tip/TextTip';

interface Props {
  message: ReactNode;
  className?: string;
  isHtml?: boolean;
}

export function BetaAlert({ message, className, isHtml }: Props) {
  const { t } = useTranslation();
  const translatedMessage = typeof message === 'string' ? t(message) : message;
  return (
    <TextTip icon={betaIcon} className={className}>
      <div className="text-warning">
        {isHtml && typeof translatedMessage === 'string' ? (
          // eslint-disable-next-line react/no-danger
          <span dangerouslySetInnerHTML={{ __html: translatedMessage }} />
        ) : (
          translatedMessage
        )}
      </div>
    </TextTip>
  );
}
