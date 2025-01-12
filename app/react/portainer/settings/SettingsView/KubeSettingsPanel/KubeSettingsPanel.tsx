import { Form, Formik } from 'formik';
import { useQueryClient } from '@tanstack/react-query';
import { useTranslation } from 'react-i18next';

import kubeIcon from '@/assets/ico/kube.svg?c';
import { notifySuccess } from '@/portainer/services/notifications';
import { useEnvironmentId } from '@/react/hooks/useEnvironmentId';

import { LoadingButton } from '@@/buttons';
import { Widget } from '@@/Widget';

import { useUpdateSettingsMutation } from '../../queries';
import { Settings } from '../../types';

import { HelmSection } from './HelmSection';
import { KubeConfigSection } from './KubeConfigSection';
import { FormValues } from './types';
import { DeploymentOptionsSection } from './DeploymentOptionsSection';
import { validation } from './validation';

export function KubeSettingsPanel({ settings }: { settings: Settings }) {
  const { t } = useTranslation();
  const queryClient = useQueryClient();
  const environmentId = useEnvironmentId(false);
  const mutation = useUpdateSettingsMutation();

  const initialValues: FormValues = {
    helmRepositoryUrl: settings.HelmRepositoryURL || '',
    kubeconfigExpiry: settings.KubeconfigExpiry || '0',
    globalDeploymentOptions: {
      ...{
        requireNoteOnApplications: false,
        minApplicationNoteLength: 0,
        hideAddWithForm: false,
        hideFileUpload: false,
        hideWebEditor: false,
        perEnvOverride: false,
        hideStacksFunctionality: false,
      },
      ...settings.GlobalDeploymentOptions,
    },
  };

  return (
    <Widget id="kubernetes-settings">
      <Widget.Title icon={kubeIcon} title={t('Kubernetes settings')} />
      <Widget.Body>
        <Formik
          initialValues={initialValues}
          onSubmit={handleSubmit}
          validationSchema={validation}
          validateOnMount
        >
          {() => (
            <Form className="form-horizontal">
              <HelmSection />
              <KubeConfigSection />
              <DeploymentOptionsSection />

              <div className="form-group">
                <div className="col-sm-12">
                  <LoadingButton
                    isLoading={mutation.isLoading}
                    data-cy="save-kubernetes-settings-button"
                    loadingText="Saving"
                    className="!ml-0"
                  >
                    {t('Save Kubernetes settings')}
                  </LoadingButton>
                </div>
              </div>
            </Form>
          )}
        </Formik>
      </Widget.Body>
    </Widget>
  );

  function handleSubmit(values: FormValues) {
    mutation.mutate(
      {
        HelmRepositoryURL: values.helmRepositoryUrl,
        KubeconfigExpiry: values.kubeconfigExpiry,
        GlobalDeploymentOptions: {
          ...values.globalDeploymentOptions,
          requireNoteOnApplications:
            values.globalDeploymentOptions.requireNoteOnApplications,
          minApplicationNoteLength: values.globalDeploymentOptions
            .requireNoteOnApplications
            ? values.globalDeploymentOptions.minApplicationNoteLength
            : 0,
        },
      },
      {
        async onSuccess() {
          if (environmentId) {
            await queryClient.invalidateQueries([
              'environments',
              environmentId,
              'deploymentOptions',
            ]);
          }
          notifySuccess('Success', 'Kubernetes settings updated');
        },
      }
    );
  }
}
