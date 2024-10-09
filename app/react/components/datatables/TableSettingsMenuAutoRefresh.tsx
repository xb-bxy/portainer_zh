import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { useState } from 'react';
import { Check } from 'lucide-react';

import { Checkbox } from '@@/form-components/Checkbox';
import { Icon } from '@@/Icon';

import styles from './TableSettingsMenuAutoRefresh.module.css';

interface Props {
  onChange(value: number): void;
  value: number;
}

export function TableSettingsMenuAutoRefresh({ onChange, value }: Props) {
  const { t } = useTranslation();
  const [isCheckVisible, setIsCheckVisible] = useState(false);

  const isEnabled = value > 0;

  return (
    <>
      <Checkbox
        id="settings-auto-refresh"
        data-cy="settings-auto-refresh"
        label="Auto refresh"
        checked={isEnabled}
        onChange={(e) => onChange(e.target.checked ? 10 : 0)}
      />

      {isEnabled && (
        <div>
          <label htmlFor="settings_refresh_rate">{t('Refresh rate')}</label>
          <select
            data-cy="settings-refresh-rate"
            id="settings_refresh_rate"
            className="small-select"
            value={value}
            onChange={(e) => handleChange(e.target.value)}
          >
            <option value={10}>{t('10s')}</option>
            <option value={30}>{t('30s')}</option>
            <option value={60}>{t('1min')}</option>
            <option value={120}>{t('2min')}</option>
            <option value={300}>{t('5min')}</option>
          </select>
          <span
            className={clsx(
              isCheckVisible ? styles.alertVisible : styles.alertHidden,
              styles.check
            )}
            onTransitionEnd={() => setIsCheckVisible(false)}
          >
            <Icon icon={Check} className="!ml-1" mode="success" />
          </span>
        </div>
      )}
    </>
  );

  function handleChange(value: string) {
    onChange(Number(value));
    setIsCheckVisible(true);
  }
}
