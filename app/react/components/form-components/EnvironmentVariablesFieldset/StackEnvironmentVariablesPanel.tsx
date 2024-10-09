import { ComponentProps } from 'react';
import { useTranslation } from 'react-i18next';

import { Alert } from '@@/Alert';
import { useDocsUrl } from '@@/PageHeader/ContextHelp/ContextHelp';

import { EnvironmentVariablesFieldset } from './EnvironmentVariablesFieldset';
import { EnvironmentVariablesPanel } from './EnvironmentVariablesPanel';

type FieldsetProps = ComponentProps<typeof EnvironmentVariablesFieldset>;

export function StackEnvironmentVariablesPanel({
  onChange,
  values,
  errors,
  isFoldable = false,
  showHelpMessage,
}: {
  isFoldable?: boolean;
  showHelpMessage?: boolean;
} & FieldsetProps) {
  const { t } = useTranslation();

  return (
    <EnvironmentVariablesPanel
      explanation={
        <div>
          {t('You may use')}{' '}
          <a
            href={`${useDocsUrl(
              '/user/docker/stacks/add#environment-variables'
            )}`}
            target="_blank"
            data-cy="stack-env-vars-help-link"
            rel="noreferrer noopener"
          >
            {t('environment variables in your compose file')}
          </a>
          {t(
            '. The environment variable values set below will be used as substitutions in the compose file. Note that you may also reference a stack.env file in your compose file. A stack.env file contains the environment variables and their values (e.g. TAG=v1.5).'
          )}
        </div>
      }
      onChange={onChange}
      values={values}
      errors={errors}
      isFoldable={isFoldable}
      showHelpMessage={showHelpMessage}
      alertMessage={
        <div className="flex p-4">
          <Alert color="info" className="col-sm-12">
            <div>
              <p>
                <strong>{t('stack.env file operation')}</strong>
              </p>
              <div>
                {t('When deploying via')} <strong>{t('Repository')}</strong>
                {t(', the stack.env file must already reside in the Git repo.')}
              </div>
              <div>
                {t('When deploying via')} <strong>{t('Web editor')}</strong>,{' '}
                <strong>{t('Upload')}</strong> {t('or')}{' '}
                <strong>{t('Custom template deployment')}</strong>
                {t(
                  ', the stack.env file is auto created from what you set below.'
                )}
              </div>
            </div>
          </Alert>
        </div>
      }
    />
  );
}
