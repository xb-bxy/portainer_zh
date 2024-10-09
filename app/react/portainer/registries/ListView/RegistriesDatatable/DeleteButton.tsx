import { useTranslation } from 'react-i18next';

import { pluralize } from '@/portainer/helpers/strings';
import { notifySuccess } from '@/portainer/services/notifications';

import { DeleteButton as BaseDeleteButton } from '@@/buttons/DeleteButton';

import { Registry } from '../../types/registry';

import { useDeleteRegistriesMutation } from './useDeleteRegistriesMutation';

export function DeleteButton({ selectedItems }: { selectedItems: Registry[] }) {
  const mutation = useDeleteRegistriesMutation();
  const { t } = useTranslation();

  const confirmMessage = getMessage(selectedItems.length);

  return (
    <BaseDeleteButton
      data-cy="registry-removeRegistryButton"
      disabled={selectedItems.length === 0}
      confirmMessage={confirmMessage}
      onConfirmed={handleDelete}
    />
  );

  function handleDelete() {
    mutation.mutate(
      selectedItems.map((item) => item.Id),
      {
        onSuccess() {
          notifySuccess(
            t('deleteButton.successTitle'),
            t('deleteButton.successMessage')
          );
        },
      }
    );
  }

  function getMessage(selectedCount: number) {
    const registriesMsg = pluralize(
      selectedCount,
      t('deleteButton.registry'),
      t('deleteButton.registries')
    );
    return t('deleteButton.confirmMessage', { registriesMsg });
  }
}
