import i18n from 'i18next';
import { useQueryClient, useMutation } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next'; // 导入 useTranslation

import axios, { parseAxiosError } from '@/portainer/services/axios';
import { withGlobalError, withInvalidate } from '@/react-tools/react-query';
import { userQueryKeys } from '@/portainer/users/queries/queryKeys';
import { buildUrl } from '@/portainer/users/user.service';
import { Role, User } from '@/portainer/users/types';

import { TeamId, TeamRole } from '../teams/types';
import { createTeamMembership } from '../teams/queries';

interface CreateUserPayload {
  username: string;
  password: string;
  role: Role;
  teams: Array<TeamId>;
}

export function useCreateUserMutation() {
  const queryClient = useQueryClient();
  const { t } = useTranslation(); // 使用 useTranslation 钩子

  return useMutation({
    mutationFn: async (values: CreateUserPayload) => {
      const user = await createUser(values);
      return Promise.all(
        values.teams.map((id) =>
          createTeamMembership(user.Id, id, TeamRole.Member)
        )
      );
    },
    ...withInvalidate(queryClient, [userQueryKeys.base()]),
    ...withGlobalError(t('newUserForm.createUserError')), // 使用翻译键
  });
}

async function createUser(payload: CreateUserPayload) {
  try {
    const { data } = await axios.post<User>(buildUrl(), payload);
    return data;
  } catch (err) {
    throw parseAxiosError(err, i18n.t('newUserForm.createUserError')); // 使用翻译键
  }
}
