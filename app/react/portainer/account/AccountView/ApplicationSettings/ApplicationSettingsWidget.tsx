import { useTranslation } from 'react-i18next';
import { Settings } from 'lucide-react';

import { Widget, WidgetBody, WidgetTitle } from '@@/Widget';

import { ApplicationSettingsForm } from './ApplicationSettingsForm';

export function ApplicationSettingsWidget() {
  const { t } = useTranslation();

  return (
    <div className="row">
      <div className="col-sm-12">
        <Widget>
          <WidgetTitle icon={Settings} title={t('Application settings')} />
          <WidgetBody>
            <ApplicationSettingsForm />
          </WidgetBody>
        </Widget>
      </div>
    </div>
  );
}
