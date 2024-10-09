import { SchemaOf, object, string, boolean } from 'yup';
import i18n from 'i18next';

import { BackupFileSettings } from './types';

export function validationSchema(): SchemaOf<BackupFileSettings> {
  return object({
    passwordProtect: boolean().default(false),
    password: string()
      .default('')
      .when('passwordProtect', {
        is: true,
        then: (schema) => schema.required(i18n.t('validation.required')),
      }),
  });
}
