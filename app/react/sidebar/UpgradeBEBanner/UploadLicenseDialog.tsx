import { useTranslation } from 'react-i18next';
import i18n from 'i18next';
import { Field, Form, Formik } from 'formik';
import { object, SchemaOf, string } from 'yup';

import { useUpgradeEditionMutation } from '@/react/portainer/system/useUpgradeEditionMutation';
import { notifySuccess } from '@/portainer/services/notifications';
import { useAnalytics } from '@/react/hooks/useAnalytics';

import { Button, LoadingButton } from '@@/buttons';
import { FormControl } from '@@/form-components/FormControl';
import { Input } from '@@/form-components/Input';
import { Modal } from '@@/modals/Modal';
import { Alert } from '@@/Alert';

interface FormValues {
  license: string;
}

const initialValues: FormValues = {
  license: '',
};

export function UploadLicenseDialog({
  onDismiss,
  goToLoading,
  goToGetLicense,
  isGetLicenseSubmitted,
}: {
  onDismiss: () => void;
  goToLoading: () => void;
  goToGetLicense: () => void;
  isGetLicenseSubmitted: boolean;
}) {
  const { t } = useTranslation();
  const upgradeMutation = useUpgradeEditionMutation();
  const { trackEvent } = useAnalytics();

  return (
    <Modal
      onDismiss={onDismiss}
      aria-label="Upgrade Portainer to Business Edition"
    >
      <Modal.Header
        title={
          <h4 className="text-xl font-medium">{t('Upgrade Portainer')}</h4>
        }
      />
      <Formik
        initialValues={initialValues}
        onSubmit={handleSubmit}
        validationSchema={validation}
        validateOnMount
      >
        {({ errors }) => (
          <Form noValidate>
            <Modal.Body>
              {!isGetLicenseSubmitted ? (
                <p className="font-semibold text-gray-7">
                  {t('Please enter your Portainer License below')}
                </p>
              ) : (
                <div className="mb-4">
                  <Alert color="success" title="License successfully sent">
                    {t(
                      'Please check your email and copy your license into the field below to upgrade Portainer.'
                    )}
                  </Alert>
                </div>
              )}

              <FormControl
                label="License"
                errors={errors.license}
                required
                size="vertical"
              >
                <Field name="license" as={Input} required />
              </FormControl>
            </Modal.Body>
            <Modal.Footer>
              <div className="flex w-full gap-2 [&>*]:w-1/2">
                <Button
                  color="default"
                  data-cy="get-license-button"
                  size="medium"
                  className="w-full"
                  onClick={goToGetLicense}
                >
                  {t('Get a license')}
                </Button>
                <LoadingButton
                  color="primary"
                  data-cy="start-upgrade-button"
                  size="medium"
                  loadingText="Validating License"
                  isLoading={upgradeMutation.isLoading}
                >
                  {t('Start upgrade')}
                </LoadingButton>
              </div>
            </Modal.Footer>
          </Form>
        )}
      </Formik>
    </Modal>
  );

  function handleSubmit(values: FormValues) {
    upgradeMutation.mutate(values, {
      onSuccess() {
        trackEvent('portainer-upgrade-license-key-provided', {
          category: 'portainer',
          metadata: {
            Upgrade: 'true',
          },
        });

        notifySuccess('Starting upgrade', 'License validated successfully');
        goToLoading();
      },
    });
  }
}

function validation(): SchemaOf<FormValues> {
  return object().shape({
    license: string()
      .required(i18n.t('License is required'))
      .matches(/^\d-.+/, i18n.t('License is invalid')),
  });
}
