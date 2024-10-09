import { useTranslation } from 'react-i18next';

import { User, UserId } from '@/portainer/users/types';

import { Select } from '@@/form-components/ReactSelect';

interface Props {
  name?: string;
  value: UserId[];
  onChange(value: UserId[]): void;
  users: User[];
  dataCy: string;
  inputId?: string;
  placeholder?: string;
  disabled?: boolean;
}

export function UsersSelector({
  name,
  value,
  onChange,
  users,
  dataCy,
  inputId,
  placeholder,
  disabled,
}: Props) {
  const { t } = useTranslation();
  const translatedPlaceholder =
    typeof placeholder === 'string' ? t(placeholder) : placeholder;
  return (
    <Select
      isMulti
      name={name}
      getOptionLabel={(user) => user.Username}
      getOptionValue={(user) => `${user.Id}`}
      options={users}
      value={users.filter((user) => value.includes(user.Id))}
      closeMenuOnSelect={false}
      onChange={(selectedUsers) =>
        onChange(selectedUsers.map((user) => user.Id))
      }
      data-cy={dataCy}
      inputId={inputId}
      placeholder={translatedPlaceholder}
      isDisabled={disabled}
    />
  );
}
