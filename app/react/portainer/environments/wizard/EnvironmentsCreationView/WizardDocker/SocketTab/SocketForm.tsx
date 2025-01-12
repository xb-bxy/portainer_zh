import { Field, Form, Formik, useFormikContext } from 'formik';
import { useReducer } from 'react';
import { Plug2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';

import { useCreateLocalDockerEnvironmentMutation } from '@/react/portainer/environments/queries/useCreateEnvironmentMutation';
import { notifySuccess } from '@/portainer/services/notifications';
import {
  ContainerEngine,
  Environment,
} from '@/react/portainer/environments/types';

import { LoadingButton } from '@@/buttons/LoadingButton';
import { FormControl } from '@@/form-components/FormControl';
import { Input } from '@@/form-components/Input';
import { SwitchField } from '@@/form-components/SwitchField';

import { NameField } from '../../shared/NameField';
import { MoreSettingsSection } from '../../shared/MoreSettingsSection';

import { useValidation } from './SocketForm.validation';
import { FormValues } from './types';

interface Props {
  onCreate(environment: Environment): void;
  containerEngine: ContainerEngine;
}

export function SocketForm({ onCreate, containerEngine }: Props) {
  const { t } = useTranslation();
  const [formKey, clearForm] = useReducer((state) => state + 1, 0);
  const initialValues: FormValues = {
    name: '',
    socketPath: '',
    overridePath: false,
    meta: { groupId: 1, tagIds: [] },
  };

  const mutation = useCreateLocalDockerEnvironmentMutation();
  const validation = useValidation();

  return (
    <Formik
      initialValues={initialValues}
      onSubmit={handleSubmit}
      validationSchema={validation}
      validateOnMount
      key={formKey}
    >
      {({ isValid, dirty }) => (
        <Form>
          <NameField />

          <OverrideSocketFieldset />

          <MoreSettingsSection />

          <div className="form-group">
            <div className="col-sm-12">
              <LoadingButton
                className="wizard-connect-button vertical-center"
                data-cy="docker-socket-connect-button"
                loadingText={t(
                  'socketForm.connecting',
                  'Connecting environment...'
                )}
                isLoading={mutation.isLoading}
                disabled={!dirty || !isValid}
                icon={Plug2}
              >
                {t('socketForm.connect', 'Connect')}
              </LoadingButton>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  );

  function handleSubmit(values: FormValues) {
    mutation.mutate(
      {
        name: values.name,
        socketPath: values.overridePath ? values.socketPath : '',
        meta: values.meta,
        containerEngine,
      },
      {
        onSuccess(environment) {
          notifySuccess(
            t('socketForm.successTitle', 'Environment created'),
            environment.Name
          );
          clearForm();
          onCreate(environment);
        },
      }
    );
  }
}

function OverrideSocketFieldset() {
  const { values, setFieldValue, errors } = useFormikContext<FormValues>();
  const { t } = useTranslation();

  return (
    <>
      <div className="form-group">
        <div className="col-sm-12">
          <SwitchField
            checked={values.overridePath}
            data-cy="create-docker-env-socket-override-switch"
            onChange={(checked) => setFieldValue('overridePath', checked)}
            label={t(
              'socketForm.overrideLabel',
              'Override default socket path'
            )}
            labelClass="col-sm-3 col-lg-2"
          />
        </div>
      </div>
      {values.overridePath && (
        <FormControl
          label={t('socketForm.socketPathLabel', 'Socket Path')}
          tooltip={t(
            'socketForm.socketPathTooltip',
            'Path to the Docker socket. Remember to bind-mount the socket, see the important notice above for more information.'
          )}
          errors={errors.socketPath}
        >
          <Field
            name="socketPath"
            as={Input}
            placeholder={t(
              'socketForm.socketPathPlaceholder',
              'e.g. /var/run/docker.sock (on Linux) or //./pipe/docker_engine (on Windows)'
            )}
          />
        </FormControl>
      )}
    </>
  );
}
