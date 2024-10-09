import { SchemaOf, array, boolean, number, object, ref, string } from 'yup';
import { useMemo } from 'react';
import { useTranslation } from 'react-i18next';
import i18n from 'i18next';

import { usePublicSettings } from '@/react/portainer/settings/queries';
import { AuthenticationMethod } from '@/react/portainer/settings/types';
import { useUsers } from '@/portainer/users/queries';

import { FormValues } from './FormValues';

export function useValidation(): SchemaOf<FormValues> {
  const { t } = useTranslation();
  const usersQuery = useUsers(true);
  const settingsQuery = usePublicSettings();

  const authMethod =
    settingsQuery.data?.AuthenticationMethod ?? AuthenticationMethod.Internal;

  return useMemo(() => {
    const users = usersQuery.data ?? [];

    const base = object({
      username: string()
        .required(t('Username is required'))
        .test({
          name: 'unique',
          message: t('Username is already taken'),
          test: (value) => users.every((u) => u.Username !== value),
        }),
      password: string().default(''),
      confirmPassword: string().default(''),
      isAdmin: boolean().default(false),
      teams: array(number().required()).required(),
    });

    if (authMethod === AuthenticationMethod.Internal) {
      return base.concat(
        passwordValidation(settingsQuery.data?.RequiredPasswordLength)
      );
    }

    return base;
  }, [
    authMethod,
    settingsQuery.data?.RequiredPasswordLength,
    usersQuery.data,
    t,
  ]);
}

function passwordValidation(minLength: number | undefined = 12) {
  return object({
    password: string()
      .required(i18n.t('Password is required'))
      .min(
        minLength,
        ({ value, min }) =>
          i18n.t('passwordMinLength', { min, current: value.length }) // 使用翻译键
      ),
    confirmPassword: string().oneOf(
      [ref('password'), null],
      i18n.t('Passwords must match') // 使用翻译键
    ),
  });
}
