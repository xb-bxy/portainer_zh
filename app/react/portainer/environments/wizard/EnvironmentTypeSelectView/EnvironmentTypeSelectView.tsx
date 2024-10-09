import { useState } from 'react';
import { useRouter } from '@uirouter/react';
import _ from 'lodash';
import { Wand2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { useAnalytics } from '@/react/hooks/useAnalytics';

import { Button } from '@@/buttons';
import { PageHeader } from '@@/PageHeader';
import { Widget, WidgetBody, WidgetTitle } from '@@/Widget';
import { FormSection } from '@@/form-components/FormSection';

import { EnvironmentSelector } from './EnvironmentSelector';
import {
  EnvironmentOptionValue,
  existingEnvironmentTypes,
  newEnvironmentTypes,
  environmentTypes,
} from './environment-types';

export function EnvironmentTypeSelectView() {
  const { t } = useTranslation(); // 引入翻译函数
  const [types, setTypes] = useState<EnvironmentOptionValue[]>([]);
  const { trackEvent } = useAnalytics();
  const router = useRouter();

  return (
    <>
      <PageHeader
        title="Quick Setup"
        breadcrumbs={[{ label: 'Environment Wizard' }]}
        reload
      />

      <div className="row">
        <div className="col-sm-12">
          <Widget>
            <WidgetTitle icon={Wand2} title={t('Environment Wizard')} />
            <WidgetBody>
              <div className="form-horizontal">
                <FormSection title="Select your environment(s)">
                  <p className="text-muted small">
                    {t(
                      'You can onboard different types of environments, select all that apply.'
                    )}
                  </p>
                  <p className="control-label !mb-2">
                    {t('Connect to existing environments')}
                  </p>
                  <EnvironmentSelector
                    value={types}
                    onChange={setTypes}
                    options={existingEnvironmentTypes}
                  />
                  <p className="control-label !mb-2">
                    {t('Set up new environments')}
                  </p>
                  <EnvironmentSelector
                    value={types}
                    onChange={setTypes}
                    options={newEnvironmentTypes}
                    hiddenSpacingCount={
                      existingEnvironmentTypes.length -
                      newEnvironmentTypes.length
                    }
                  />
                </FormSection>
              </div>
              <Button
                disabled={types.length === 0}
                data-cy="start-wizard-button"
                onClick={() => startWizard()}
                className="!ml-0"
              >
                {t('Start Wizard')}
              </Button>
            </WidgetBody>
          </Widget>
        </div>
      </div>
    </>
  );

  function startWizard() {
    if (types.length === 0) {
      return;
    }

    const steps = _.compact(
      types.map((id) => environmentTypes.find((eType) => eType.id === id))
    );

    trackEvent('endpoint-wizard-endpoint-select', {
      category: 'portainer',
      metadata: {
        environment: steps.map((step) => step.label).join('/'),
      },
    });

    router.stateService.go('portainer.wizard.endpoints.create', {
      envType: types,
    });
  }
}
