import { useTranslation } from 'react-i18next';

import { InformationPanel } from '@@/InformationPanel';
import { Link } from '@@/Link';
import { TextTip } from '@@/Tip/TextTip';

export function NoEnvironmentsInfoPanel({ isAdmin }: { isAdmin: boolean }) {
  const { t } = useTranslation();

  return (
    <div className="row">
      <div className="col-sm-12">
        <InformationPanel title={t('no_environments_info_panel.information')}>
          <TextTip>
            {isAdmin ? (
              <span>
                {t('no_environments_info_panel.no_env_admin')}{' '}
                <Link
                  to="portainer.wizard.endpoints"
                  data-cy="wizard-add-environments-link"
                >
                  {t('no_environments_info_panel.environment_wizard')}
                </Link>{' '}
                {t('no_environments_info_panel.to_add_env')}
              </span>
            ) : (
              <span>{t('no_environments_info_panel.no_access')}</span>
            )}
          </TextTip>
        </InformationPanel>
      </div>
    </div>
  );
}
