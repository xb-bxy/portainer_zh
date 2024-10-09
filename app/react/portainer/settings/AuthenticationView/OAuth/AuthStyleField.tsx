import { useTranslation } from 'react-i18next';

import { Options } from '@/react/edge/components/useIntervalOptions';
import { OAuthStyle } from '@/react/portainer/settings/types';

import { FormControl, Size } from '@@/form-components/FormControl';
import { Select } from '@@/form-components/Input';

interface Props {
  value: OAuthStyle;
  onChange(value: OAuthStyle): void;
  label?: string;
  tooltip?: string;
  readonly?: boolean;
  size?: Size;
}

// The options are based on oauth2 lib definition @https://pkg.go.dev/golang.org/x/oauth2#AuthStyle
export const authStyleOptions: Options = [
  { label: 'Auto Detect', value: OAuthStyle.AutoDetect, isDefault: true },
  { label: 'In Params', value: OAuthStyle.InParams },
  { label: 'In Header', value: OAuthStyle.InHeader },
];

export function AuthStyleField({
  value,
  readonly = false,
  onChange,
  label = 'Auth Style',
  tooltip = 'Auth Style specifies how the endpoint wants the client ID & client secret sent.',
  size = 'small',
}: Props) {
  const { t } = useTranslation();
  const translatedLabel = t(label);
  const translatedTooltip = t(tooltip);
  return (
    <FormControl
      inputId="oauth_authstyle"
      label={translatedLabel}
      tooltip={translatedTooltip}
      size={size}
    >
      <Select
        value={value}
        onChange={(e) => {
          onChange(parseInt(e.currentTarget.value, 10));
        }}
        options={authStyleOptions}
        disabled={readonly}
        id="oauth_authstyle"
        data-cy="setting-oauth-authstyle-select"
      />
    </FormControl>
  );
}
