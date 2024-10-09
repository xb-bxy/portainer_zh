import { boolean, object, SchemaOf, string } from 'yup';
import { useTranslation } from 'react-i18next';

import { metadataValidation } from '../../shared/MetadataFieldset/validation';
import { useNameValidation } from '../../shared/NameField';

import { FormValues } from './types';

export function useValidation(): SchemaOf<FormValues> {
  const { t } = useTranslation();

  return object({
    name: useNameValidation(),
    meta: metadataValidation(),
    overridePath: boolean().default(false),
    socketPath: string()
      .default('')
      .when('overridePath', (overridePath, schema) =>
        overridePath
          ? schema.required(
              t('Socket Path is required when override path is enabled')
            )
          : schema
      ),
  });
}
