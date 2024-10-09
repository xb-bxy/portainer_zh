import { useTranslation } from 'react-i18next';
import { PropsWithChildren } from 'react';
import { X } from 'lucide-react';

import { Widget, WidgetBody } from './Widget';
import { Button } from './buttons';

interface Props {
  title?: string;
  onDismiss?(): void;
  bodyClassName?: string;
  wrapperStyle?: Record<string, string>;
}

export function InformationPanel({
  title,
  onDismiss,
  wrapperStyle,
  bodyClassName,
  children,
}: PropsWithChildren<Props>) {
  const { t } = useTranslation();
  const translatedTitle = typeof title === 'string' ? t(title) : title;
  return (
    <Widget>
      <WidgetBody className={bodyClassName}>
        <div style={wrapperStyle}>
          {translatedTitle && (
            <div className="form-section-title">
              <span>{translatedTitle}</span>
              {!!onDismiss && (
                <span className="small" style={{ float: 'right' }}>
                  <Button
                    color="link"
                    icon={X}
                    onClick={() => onDismiss()}
                    data-cy="dismiss-information-panel-button"
                  >
                    {t('dismiss')}
                  </Button>
                </span>
              )}
            </div>
          )}
          <div>{children}</div>
        </div>
      </WidgetBody>
    </Widget>
  );
}
