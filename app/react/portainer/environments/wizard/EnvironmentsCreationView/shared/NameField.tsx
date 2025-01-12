import { useField } from 'formik';
import { useTranslation } from 'react-i18next';
import { string } from 'yup';

import { getEnvironments } from '@/react/portainer/environments/environment.service';
import { useDebounce } from '@/react/hooks/useDebounce';

import { FormControl } from '@@/form-components/FormControl';
import { Input } from '@@/form-components/Input';
import { useCachedValidation } from '@@/form-components/useCachedTest';

interface Props {
  readonly?: boolean;
  tooltip?: string;
  placeholder?: string;
}

export function NameField({
  readonly,
  tooltip,
  placeholder = 'e.g. docker-prod01 / kubernetes-cluster01',
}: Props) {
  const { t } = useTranslation();
  const [{ value }, meta, { setValue }] = useField('name');

  const id = 'name-input';

  const [debouncedValue, setDebouncedValue] = useDebounce(value, setValue);

  return (
    <FormControl
      label="Name"
      required
      errors={meta.error}
      inputId={id}
      tooltip={tooltip}
    >
      <Input
        id={id}
        data-cy="environmentCreate-nameInput"
        name="name"
        onChange={(e) => setDebouncedValue(e.target.value)}
        value={debouncedValue}
        placeholder={t(placeholder)}
        readOnly={readonly}
      />
    </FormControl>
  );
}

export async function isNameUnique(name = '') {
  if (!name) {
    return true;
  }

  try {
    const result = await getEnvironments({
      limit: 1,
      query: { name, excludeSnapshots: true },
    });
    return (
      result.totalCount === 0 || result.value.every((e) => e.Name !== name)
    );
  } catch (e) {
    // if backend fails to respond, assume name is unique, name validation happens also in the backend
    return true;
  }
}

export function useNameValidation() {
  const { t } = useTranslation();
  const uniquenessTest = useCachedValidation(isNameUnique);

  return string()
    .required(t('Name is required'))
    .test(t('unique-name'), t('Name should be unique'), uniquenessTest);
}
