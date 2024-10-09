import i18next from 'i18next';
import { object, string } from 'yup';

import { isValidUrl } from '@@/form-components/validate-url';

export function noDuplicateURLsSchema(urls: string[]) {
  return string()
    .required(i18next.t('URL is required'))
    .test(
      i18next.t('not existing name'),
      i18next.t('URL is already added'),
      (newName) => urls.every((name) => name !== newName)
    );
}

export function validationSchema(urls: string[]) {
  return object().shape({
    URL: noDuplicateURLsSchema(urls)
      .test(
        i18next.t('valid-url'),
        i18next.t('Invalid URL'),
        (value) => !value || isValidUrl(value)
      )
      .required(i18next.t('URL is required')),
  });
}
