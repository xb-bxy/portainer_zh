import { useTranslation } from 'react-i18next';
import { useMemo, useState, useEffect } from 'react';
import _ from 'lodash';

import { useSettings } from '@/react/portainer/settings/queries';

type Option = {
  label: string;
  value: number;
};

type DefaultOption = Option & { isDefault: true };

export type Options = [DefaultOption, ...Option[]];

export function useIntervalOptions(
  fieldName:
    | 'Edge.PingInterval'
    | 'Edge.SnapshotInterval'
    | 'Edge.CommandInterval'
    | 'EdgeAgentCheckinInterval',
  initialOptions: Options,
  isDefaultHidden: boolean
) {
  const { t } = useTranslation();
  // 使用 useMemo 来确保 translatedOptions 仅在初始选项更改或翻译时重新计算
  const translatedOptions = useMemo(
    () =>
      initialOptions.map((option) => ({
        ...option,
        label: t(option.label),
      })),
    [initialOptions, t]
  );
  const [{ value: defaultValue }] = translatedOptions;
  const [options, setOptions] = useState<Option[]>(translatedOptions);

  const settingsQuery = useSettings(
    (settings) => _.get(settings, fieldName, 0) as number,
    !isDefaultHidden
  );

  useEffect(() => {
    if (isDefaultHidden) {
      setOptions(translatedOptions.slice(1));
    }

    if (
      typeof settingsQuery.data !== 'undefined' &&
      settingsQuery.data !== defaultValue
    ) {
      setOptions((options) => {
        let label = `${settingsQuery.data} seconds`;
        const option = options.find((o) => o.value === settingsQuery.data);
        if (option) {
          label = option.label;
        }

        return [
          {
            value: defaultValue,
            label: `Use default interval (${label})`,
          },
          ...options.slice(1),
        ];
      });
    }
  }, [
    settingsQuery.data,
    setOptions,
    isDefaultHidden,
    translatedOptions,
    defaultValue,
  ]);

  return options;
}
