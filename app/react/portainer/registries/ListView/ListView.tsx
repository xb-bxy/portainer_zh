import { useTranslation } from 'react-i18next';

import { PageHeader } from '@@/PageHeader';
import { InformationPanel } from '@@/InformationPanel';

import { RegistriesDatatable } from './RegistriesDatatable';

export function ListView() {
  const { t } = useTranslation();
  return (
    <>
      <PageHeader title="Registries" breadcrumbs="Registry management" reload />

      <div className="row">
        <div className="col-sm-12">
          <InformationPanel title="Information">
            <span className="small text-muted">
              {t(
                'View registries via an environment to manage access for user(s) and/or team(s)'
              )}
            </span>
          </InformationPanel>
        </div>
      </div>

      <RegistriesDatatable />
    </>
  );
}
