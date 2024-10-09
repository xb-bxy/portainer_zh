import { useMemo, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { useCurrentUser } from '@/react/hooks/useUser';
import helm from '@/assets/ico/vendor/helm.svg?c';
import { isPureAdmin } from '@/portainer/users/user.helpers';

import { Link } from '@@/Link';
import { Datatable } from '@@/datatables';
import { createPersistedStore } from '@@/datatables/types';
import { useTableState } from '@@/datatables/useTableState';
import { TextTip } from '@@/Tip/TextTip';

import { columns } from './columns';
import { HelmRepositoryDatatableActions } from './HelmRepositoryDatatableActions';
import { useHelmRepositories } from './helm-repositories.service';
import { HelmRepository } from './types';

const storageKey = 'helmRepository';

const settingsStore = createPersistedStore(storageKey);

export function HelmRepositoryDatatable() {
  const { user } = useCurrentUser();
  const helmReposQuery = useHelmRepositories(user.Id);

  const isAdminUser = isPureAdmin(user);

  const tableState = useTableState(settingsStore, storageKey);

  const helmRepos = useMemo(() => {
    const helmRepos = [];
    if (helmReposQuery.data?.GlobalRepository) {
      const helmrepository: HelmRepository = {
        Global: true,
        URL: helmReposQuery.data.GlobalRepository,
        Id: 0,
        UserId: 0,
      };
      helmRepos.push(helmrepository);
    }
    return [...helmRepos, ...(helmReposQuery.data?.UserRepositories ?? [])];
  }, [
    helmReposQuery.data?.GlobalRepository,
    helmReposQuery.data?.UserRepositories,
  ]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      const regEx = /#!.*#(.*)/;
      const match = window.location.hash.match(regEx);
      if (match && match[1]) {
        document.getElementById(match[1])?.scrollIntoView();
      }
    }, 1000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <Datatable
      getRowId={(row) => String(row.Id)}
      dataset={helmRepos}
      description={<HelmDatatableDescription isAdmin={isAdminUser} />}
      settingsManager={tableState}
      columns={columns}
      title="Helm repositories"
      titleIcon={helm}
      titleId="helm-repositories"
      renderTableActions={(selectedRows) => (
        <HelmRepositoryDatatableActions selectedItems={selectedRows} />
      )}
      isLoading={helmReposQuery.isLoading}
      isRowSelectable={(row) => !row.original.Global}
      data-cy="helm-repositories-datatable"
    />
  );
}

function HelmDatatableDescription({ isAdmin }: { isAdmin: boolean }) {
  const { t } = useTranslation();

  return (
    <TextTip color="blue" className="mb-3">
      {isAdmin ? (
        <span>
          {t('helm_repository.admin_description.part1')}{' '}
          <Link
            to="portainer.settings"
            params={{ '#': 'kubernetes-settings' }}
            data-cy="k8s-globally-select-repo-link"
          >
            {t('helm_repository.admin_description.part2')}
          </Link>{' '}
          {t('helm_repository.admin_description.part3')}
        </span>
      ) : (
        <span>{t('helm_repository.user_description')}</span>
      )}
    </TextTip>
  );
}
