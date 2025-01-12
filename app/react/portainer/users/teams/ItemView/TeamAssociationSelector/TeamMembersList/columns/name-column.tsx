import { MinusCircle } from 'lucide-react';
import { CellContext } from '@tanstack/react-table';
import { useTranslation } from 'react-i18next';

import { User, UserId } from '@/portainer/users/types';
import { notifySuccess } from '@/portainer/services/notifications';
import {
  useRemoveMemberMutation,
  useTeamMemberships,
} from '@/react/portainer/users/teams/queries';

import { Button } from '@@/buttons';

import { useRowContext } from '../RowContext';

import { columnHelper } from './helper';

export const name = columnHelper.accessor('Username', {
  header: 'name',
  id: 'name',
  cell: NameCell,
});

export function NameCell({
  getValue,
  row: { original: user },
}: CellContext<User, string>) {
  const { t } = useTranslation();
  const name = getValue();
  const { disabled, teamId } = useRowContext();

  const membershipsQuery = useTeamMemberships(teamId);

  const removeMemberMutation = useRemoveMemberMutation(
    teamId,
    membershipsQuery.data
  );

  return (
    <>
      {name}

      <Button
        color="link"
        data-cy={`remove-member-${user.Username}`}
        className="space-left !p-0"
        onClick={() => handleRemoveMember(user.Id)}
        disabled={disabled}
        icon={MinusCircle}
      >
        {t('namecell.remove')}
      </Button>
    </>
  );

  function handleRemoveMember(userId: UserId) {
    removeMemberMutation.mutate([userId], {
      onSuccess() {
        notifySuccess(t('namecell.success'), name);
      },
    });
  }
}
