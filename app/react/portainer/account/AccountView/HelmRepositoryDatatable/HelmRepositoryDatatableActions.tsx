import { useRouter } from '@uirouter/react';
import { useTranslation } from 'react-i18next';

import { pluralize } from '@/portainer/helpers/strings';

import { AddButton } from '@@/buttons';
import { DeleteButton } from '@@/buttons/DeleteButton';

import { HelmRepository } from './types';
import { useDeleteHelmRepositoriesMutation } from './helm-repositories.service';

interface Props {
  selectedItems: HelmRepository[];
}

export function HelmRepositoryDatatableActions({ selectedItems }: Props) {
  const { t } = useTranslation();
  const router = useRouter();
  const deleteHelmRepoMutation = useDeleteHelmRepositoriesMutation();

  return (
    <>
      <DeleteButton
        disabled={selectedItems.length === 0}
        onConfirmed={() => onDeleteClick(selectedItems)}
        confirmMessage={t('helm_repository.delete_confirm', {
          count: selectedItems.length,
          repository: pluralize(
            selectedItems.length,
            t('repository'),
            t('repositories')
          ),
        })}
        data-cy="credentials-deleteButton"
      />
      <AddButton
        to="portainer.account.createHelmRepository"
        data-cy="credentials-addButton"
      >
        {t('Add Helm repository')}
      </AddButton>
    </>
  );

  async function onDeleteClick(selectedItems: HelmRepository[]) {
    deleteHelmRepoMutation.mutate(selectedItems, {
      onSuccess: () => {
        router.stateService.reload();
      },
    });
  }
}
