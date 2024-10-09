import { SchemaOf, bool, boolean, number, object, string } from 'yup';
import i18next from 'i18next';

import { isValidUrl } from '@@/form-components/validate-url';

import { Values } from './types';

export function validation(): SchemaOf<Values> {
  return object({
    edgeAgentCheckinInterval: number().required(),
    enableTelemetry: bool().default(false),
    loginBannerEnabled: boolean().default(false),
    loginBanner: string()
      .default('')
      .when('loginBannerEnabled', {
        is: true,
        then: (schema) =>
          schema.required(i18next.t('Login banner is required when enabled')),
      }),
    logoEnabled: boolean().default(false),
    logo: string()
      .default('')
      .when('logoEnabled', {
        is: true,
        then: (schema) =>
          schema
            .required(i18next.t('Logo url is required when enabled'))
            .test(
              i18next.t('valid-url'),
              i18next.t('Must be a valid URL'),
              (value) => isValidUrl(value)
            ),
      }),
    snapshotInterval: string().required(
      i18next.t('Snapshot interval is required')
    ),
    templatesUrl: string()
      .default('')
      .test(
        i18next.t('valid-url'),
        i18next.t('Must be a valid URL'),
        (value) => !value || isValidUrl(value)
      ),
  });
}
