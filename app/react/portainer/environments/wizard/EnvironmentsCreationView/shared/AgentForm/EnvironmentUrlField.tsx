import { Field, useField } from 'formik';
import { useTranslation } from 'react-i18next';

import { FormControl } from '@@/form-components/FormControl';
import { Input } from '@@/form-components/Input';

export function EnvironmentUrlField({
  placeholderPort = '9001',
}: {
  placeholderPort?: string;
}) {
  const [, meta] = useField('environmentUrl');
  const { t } = useTranslation();

  return (
    <FormControl
      label="Environment address"
      errors={meta.error}
      required
      inputId="environment-url-field"
      tooltip="<HOST>:<PORT> or <IP>:<PORT>"
    >
      <Field
        id="environment-url-field"
        name="environmentUrl"
        as={Input}
        placeholder={t('environmentUrlField.placeholder', {
          placeholderPort,
        })}
        data-cy="endpointCreate-endpointUrlAgentInput"
      />
    </FormControl>
  );
}
