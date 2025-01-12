import { useTranslation } from 'react-i18next';

import { useStateWrapper } from '@/react/hooks/useStateWrapper';

import { FormControl } from '@@/form-components/FormControl';
import { TextTip } from '@@/Tip/TextTip';
import { Input } from '@@/form-components/Input';

import { GitFormModel } from '../types';
import { isBE } from '../../feature-flags/feature-flags.service';

import { PathSelector } from './PathSelector';

interface Props {
  errors?: string;
  value: string;
  onChange(value: string): void;
  isCompose: boolean;
  model: GitFormModel;
  isDockerStandalone: boolean;
  createdFromCustomTemplateId?: number;
}

export function ComposePathField({
  value,
  onChange,
  isCompose,
  model,
  isDockerStandalone,
  errors,
  createdFromCustomTemplateId,
}: Props) {
  const { t } = useTranslation();
  const [inputValue, updateInputValue] = useStateWrapper(value, onChange);

  return (
    <div className="form-group">
      <span className="col-sm-12">
        <TextTip color="blue" className="mb-2">
          <span>
            {t('indicatePath', {
              fileType: isCompose ? t('Compose') : t('Manifest'),
            })}
          </span>
          {isDockerStandalone && (
            <span className="ml-2">
              {t(
                'To enable rebuilding of an image if already present on Docker standalone environments, include'
              )}
              <code>pull_policy: build</code> {t('in your compose file as per')}{' '}
              <a href="https://docs.docker.com/compose/compose-file/#pull_policy">
                {t('Docker documentation')}
              </a>
              .
            </span>
          )}
        </TextTip>
      </span>
      <div className="col-sm-12">
        <FormControl
          label={isCompose ? 'Compose path' : 'Manifest path'}
          inputId="stack_repository_path"
          required
          errors={errors}
        >
          {isBE ? (
            <PathSelector
              value={value}
              onChange={onChange}
              placeholder={isCompose ? 'docker-compose.yml' : 'manifest.yml'}
              model={model}
              inputId="stack_repository_path"
              createdFromCustomTemplateId={createdFromCustomTemplateId}
            />
          ) : (
            <Input
              value={inputValue}
              data-cy="stack-repository-path-input"
              onChange={(e) => {
                updateInputValue(e.target.value);
              }}
              placeholder={isCompose ? 'docker-compose.yml' : 'manifest.yml'}
              id="stack_repository_path"
            />
          )}
        </FormControl>
      </div>
    </div>
  );
}
