import { mixed, object, SchemaOf, string } from 'yup';
import i18next from 'i18next';

import { CreateAgentEnvironmentValues } from '@/react/portainer/environments/environment.service/create';

import { metadataValidation } from '../MetadataFieldset/validation';
import { useNameValidation } from '../NameField';

export function useValidation(): SchemaOf<CreateAgentEnvironmentValues> {
  return object({
    name: useNameValidation(),
    environmentUrl: environmentValidation(),
    meta: metadataValidation(),
    containerEngine: mixed().oneOf(['docker', 'podman']),
  });
}

function environmentValidation() {
  return string()
    .required(i18next.t('This field is required'))
    .test(
      i18next.t('address'),
      i18next.t(
        'Environment address must be of the form <IP>:<PORT> or <HOST>:<PORT>.'
      ),
      (environmentUrl) => validateAddress(environmentUrl)
    );
}

export function validateAddress(address: string | undefined) {
  if (typeof address === 'undefined') {
    return false;
  }

  if (address.indexOf('://') > -1) {
    return false;
  }

  const [host, port] = address.split(':');

  if (
    host.length === 0 ||
    Number.isNaN(parseInt(port, 10)) ||
    port.match(/^[0-9]+$/) == null ||
    parseInt(port, 10) < 1 ||
    parseInt(port, 10) > 65535
  ) {
    return false;
  }

  return true;
}
