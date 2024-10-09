import { useTranslation } from 'react-i18next';

import { Authorized } from '@/react/hooks/useUser';

import { TextTip } from '@@/Tip/TextTip';

interface Props {
  showSystemResources?: boolean;
}

export function SystemResourceDescription({ showSystemResources }: Props) {
  const { t } = useTranslation();
  return showSystemResources === false ? (
    <Authorized authorizations="K8sAccessSystemNamespaces" adminOnlyCE>
      <TextTip color="blue" className="!mb-0">
        {t(
          'System resources are hidden, this can be changed in the table settings'
        )}
      </TextTip>
    </Authorized>
  ) : null;
}
