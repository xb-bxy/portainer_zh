import { SchemaOf, object, string, boolean } from 'yup';
import i18next from 'i18next';

import { nanNumberSchema } from '@/react-tools/yup-schemas';

import { isValidUrl } from '@@/form-components/validate-url';

import { FormValues } from './types';

export function validation(): SchemaOf<FormValues> {
  return object().shape({
    helmRepositoryUrl: string()
      .default('')
      .test(
        i18next.t('valid-url'),
        i18next.t('Invalid URL'),
        (value) => !value || isValidUrl(value)
      ),
    kubeconfigExpiry: string().required(),
    globalDeploymentOptions: object().shape({
      hideAddWithForm: boolean().required(),
      perEnvOverride: boolean().required(),
      hideWebEditor: boolean().required(),
      hideFileUpload: boolean().required(),
      requireNoteOnApplications: boolean().required(),
      hideStacksFunctionality: boolean().required(),
      minApplicationNoteLength: nanNumberSchema(i18next.t('Must be a number'))
        .default(0)
        .when('requireNoteOnApplications', {
          is: true,
          then: (schema) =>
            schema
              .required()
              .min(1, i18next.t('minMaxValue', { min: 1, max: 9999 }))
              .max(9999, i18next.t('minMaxValue', { min: 1, max: 9999 })),
        }),
    }),
  });
}
