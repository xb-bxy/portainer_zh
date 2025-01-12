import i18n from 'i18next';
import { Field, useField } from 'formik';
import { string } from 'yup';

import { FormControl } from '@@/form-components/FormControl';
import { Input } from '@@/form-components/Input';

interface Props {
  fieldName: string;
  readonly?: boolean;
  required?: boolean;
}

export function PortainerTunnelAddrField({
  fieldName,
  readonly,
  required,
}: Props) {
  const [, metaProps] = useField(fieldName);
  const id = `${fieldName}-input`;

  return (
    <FormControl
      label="Portainer tunnel server address"
      tooltip="Address of this Portainer instance that will be used by Edge agents to establish a reverse tunnel."
      required
      errors={metaProps.error}
      inputId={id}
    >
      <Field
        id={id}
        name={fieldName}
        as={Input}
        placeholder="portainer.mydomain.tld"
        required={required}
        readOnly={readonly}
      />
    </FormControl>
  );
}

export function validation() {
  return string()
    .required(i18n.t('portainerTunnelAddrField.validation.required'))
    .test(
      i18n.t('valid tunnel server URL'),
      i18n.t('portainerTunnelAddrField.validation.invalidUrl'),
      (value) => {
        if (!value) {
          return false;
        }

        return !value.startsWith('localhost');
      }
    );
}

/**
 * Returns an address that can be used as a default value for the Portainer tunnel server address
 * based on the current window location.
 * Used for Edge Compute.
 *
 */
export function buildDefaultValue() {
  return `${window.location.hostname}:8000`;
}
