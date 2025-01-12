import { useTranslation } from 'react-i18next';
import { AlertTriangle, Check } from 'lucide-react';

import { usePublicSettings } from '@/react/portainer/settings/queries';

import { Icon } from '@@/Icon';

interface Props {
  passwordValid: boolean;
  forceChangePassword?: boolean;
}

export function PasswordCheckHint({
  passwordValid,
  forceChangePassword,
}: Props) {
  const { t } = useTranslation();
  const settingsQuery = usePublicSettings();
  const minPasswordLength = settingsQuery.data?.RequiredPasswordLength;

  return (
    <div>
      <p className="text-warning vertical-center">
        <Icon icon={AlertTriangle} className="icon-warning" />
        {forceChangePassword &&
          'An administrator has changed your password requirements, '}
        {t('The password must be at least')} {minPasswordLength}{' '}
        {t('characters long.')}
        {passwordValid && (
          <Icon icon={Check} className="!ml-1" mode="success" />
        )}
      </p>
    </div>
  );
}
