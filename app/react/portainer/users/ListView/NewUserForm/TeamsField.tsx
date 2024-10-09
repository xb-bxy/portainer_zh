import { useField } from 'formik';
import { useTranslation } from 'react-i18next';

import { Link } from '@@/Link';
import { TeamsSelector } from '@@/TeamsSelector';
import { FormControl } from '@@/form-components/FormControl';

import { Team } from '../../teams/types';

import { FormValues } from './FormValues';

export function TeamsField({
  teams,
  disabled,
}: {
  teams: Array<Team>;
  disabled?: boolean;
}) {
  const { t } = useTranslation();
  const [{ name, value }, { error }, { setValue }] =
    useField<FormValues['teams']>('teams');

  return (
    <FormControl label="Add to team(s)" inputId="teams-field" errors={error}>
      {teams.length > 0 ? (
        <TeamsSelector
          dataCy="user-teamSelect"
          onChange={(value) => setValue(value)}
          value={value}
          name={name}
          teams={teams}
          inputId="teams-field"
          disabled={disabled}
        />
      ) : (
        <span className="small text-muted">
          {t(
            "You don't seem to have any teams to add users into. Head over to the"
          )}{' '}
          <Link to="portainer.teams" data-cy="teams-view-link">
            {t('Teams view')}
          </Link>{' '}
          {t('to create some.')}
        </span>
      )}
    </FormControl>
  );
}
