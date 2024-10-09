import { object, SchemaOf, string } from 'yup';
import { useTranslation } from 'react-i18next';

import { tlsConfigValidation } from '@/react/components/TLSFieldset/TLSFieldset';

import { metadataValidation } from '../../shared/MetadataFieldset/validation';
import { useNameValidation } from '../../shared/NameField';

import { FormValues } from './types';

export function useValidation(): SchemaOf<FormValues> {
  const { t } = useTranslation();

  return object({
    name: useNameValidation(),
    url: string().required(t('This field is required.')),
    tlsConfig: tlsConfigValidation(),
    meta: metadataValidation(),
  });
}
