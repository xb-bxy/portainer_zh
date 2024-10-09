import { useTranslation } from 'react-i18next';
import { Field, useField } from 'formik';

import { TextTip } from '@@/Tip/TextTip';
import { FormControl } from '@@/form-components/FormControl';
import { FormSection } from '@@/form-components/FormSection';
import { Input } from '@@/form-components/Input';

export function HelmSection() {
  const { t } = useTranslation();
  const [{ name }, { error }] = useField<string>('helmRepositoryUrl');

  return (
    <FormSection title="Helm repository">
      <div className="mb-2">
        <TextTip color="blue">
          {t(
            'You can specify the URL to your own Helm repository here. See the'
          )}{' '}
          <a
            href="https://helm.sh/docs/topics/chart_repository/"
            target="_blank"
            rel="noreferrer"
          >
            {t('official documentation')}
          </a>{' '}
          {t('for more details.')}
        </TextTip>
      </div>

      <FormControl label="URL" errors={error} inputId="helm-repo-url">
        <Field
          as={Input}
          id="helm-repo-url"
          data-cy="helm-repo-url-input"
          name={name}
          placeholder={t('https://charts.bitnami.com/bitnami')}
        />
      </FormControl>
    </FormSection>
  );
}
