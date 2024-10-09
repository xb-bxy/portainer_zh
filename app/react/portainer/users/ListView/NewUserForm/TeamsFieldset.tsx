import { useFormikContext } from 'formik';
import { useTranslation } from 'react-i18next';

import { useCurrentUser } from '@/react/hooks/useUser';
import { usePublicSettings } from '@/react/portainer/settings/queries';

import { TextTip } from '@@/Tip/TextTip';
import { Link } from '@@/Link';

import { useTeams } from '../../teams/queries';

import { AdminSwitch } from './AdminSwitch';
import { FormValues } from './FormValues';
import { TeamsField } from './TeamsField';

export function TeamsFieldset() {
  const { values } = useFormikContext<FormValues>();
  const { isPureAdmin } = useCurrentUser();
  const teamsQuery = useTeams(!isPureAdmin);
  const settingsQuery = usePublicSettings();

  if (!teamsQuery.data || !settingsQuery.data) {
    return null;
  }

  const { TeamSync: teamSync } = settingsQuery.data;

  return (
    <>
      {isPureAdmin && <AdminSwitch />}

      {!values.isAdmin && (
        <TeamsField teams={teamsQuery.data} disabled={teamSync} />
      )}

      {teamSync && <TeamSyncMessage />}

      {isPureAdmin && !values.isAdmin && values.teams.length === 0 && (
        <NoTeamSelected />
      )}
    </>
  );
}

function TeamSyncMessage() {
  const { t } = useTranslation(); // 引入翻译函数
  return (
    <div className="form-group">
      <div className="col-sm-12">
        <TextTip color="orange">
          {t(
            'The team leader feature is disabled as external authentication is currently enabled with team sync.'
          )}
        </TextTip>
      </div>
    </div>
  );
}

function NoTeamSelected() {
  const { t } = useTranslation(); // 引入翻译函数
  return (
    <div className="form-group">
      <div className="col-sm-12">
        <TextTip color="blue">
          {t(
            "Note: non-administrator users who aren't in a team don't have access to any environments by default. Head over to the"
          )}{' '}
          <Link to="portainer.endpoints" data-cy="env-link">
            {t('Environments view')}
          </Link>{' '}
          {t('to manage their accesses.')}
        </TextTip>
      </div>
    </div>
  );
}
