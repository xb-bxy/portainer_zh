import i18n from 'i18next';
import { Field, useField } from 'formik';
import { string } from 'yup';
import { useTranslation } from 'react-i18next';

import { FormControl } from '@@/form-components/FormControl';
import { Input } from '@@/form-components/Input';
import { isValidUrl } from '@@/form-components/validate-url';

interface Props {
  fieldName: string;
  readonly?: boolean;
  required?: boolean;
  tooltip?: string;
}

export function PortainerUrlField({
  fieldName,
  readonly,
  required,
  tooltip,
}: Props) {
  const { t } = useTranslation();
  const [, metaProps] = useField(fieldName);
  const id = `${fieldName}-input`;

  return (
    <FormControl
      label="Portainer API server URL"
      tooltip={tooltip}
      required
      errors={metaProps.error}
      inputId={id}
    >
      <Field
        id={id}
        name={fieldName}
        as={Input}
        placeholder={t('https://portainer.mydomain.tld')}
        required={required}
        data-cy="endpointCreate-portainerServerUrlInput"
        readOnly={readonly}
      />
    </FormControl>
  );
}

export function validation() {
  return string()
    .required(i18n.t('API server URL is required'))
    .test(
      i18n.t('valid API server URL'),
      i18n.t(
        'The API server URL must be a valid URL (localhost cannot be used)'
      ),
      (value) =>
        isValidUrl(
          value,
          (url) => !!url.hostname && url.hostname !== 'localhost'
        )
    );
}

/**
 * Returns a URL that can be used as a default value for the Portainer server API URL
 * based on the current window location.
 * Used for Edge Compute.
 *
 */
export function buildDefaultValue() {
  return `${window.location.protocol}//${window.location.host}`;
}
