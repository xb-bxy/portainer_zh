import { useTranslation } from 'react-i18next';
import { useRouter } from '@uirouter/react';
import { PropsWithChildren } from 'react';
import { RefreshCw } from 'lucide-react';

import { dispatchCacheRefreshEvent } from '@/portainer/services/http-request.helper';

import { Button } from '../buttons';

import { Breadcrumbs } from './Breadcrumbs';
import { Crumb } from './Breadcrumbs/Breadcrumbs';
import { HeaderContainer } from './HeaderContainer';
import { HeaderTitle } from './HeaderTitle';

interface Props {
  id?: string;
  reload?: boolean;
  loading?: boolean;
  onReload?(): Promise<void> | void;
  breadcrumbs?: (Crumb | string)[] | string;
  title: string;
}

export function PageHeader({
  id,
  title,
  breadcrumbs = [],
  reload,
  loading,
  onReload,
  children,
}: PropsWithChildren<Props>) {
  const { t } = useTranslation();
  const translatedTitle = t(title);
  // const translatedBreadcrumbs = Array.isArray(breadcrumbs)
  //   ? breadcrumbs.map((breadcrumb) =>
  //       typeof breadcrumb === 'string'
  //         ? t(breadcrumb)
  //         : { ...breadcrumb, label: t(breadcrumb.label) }
  //     )
  //   : t(breadcrumbs);
  const translatedBreadcrumbs = Array.isArray(breadcrumbs)
    ? breadcrumbs.map((breadcrumb) => {
        if (typeof breadcrumb === 'string') {
          return t(breadcrumb);
        }
        if (typeof breadcrumb === 'object' && breadcrumb.label) {
          return { ...breadcrumb, label: t(breadcrumb.label) };
        }
        return breadcrumb;
      })
    : t(breadcrumbs);

  const router = useRouter();

  return (
    <HeaderContainer id={id}>
      <Breadcrumbs breadcrumbs={translatedBreadcrumbs} />

      <HeaderTitle title={translatedTitle}>
        {reload && (
          <Button
            color="none"
            size="large"
            onClick={onClickedRefresh}
            className="m-0 p-0 focus:text-inherit"
            disabled={loading}
            title="Refresh page"
            data-cy="refresh-page-button"
          >
            <RefreshCw className="icon" />
          </Button>
        )}
        {children}
      </HeaderTitle>
    </HeaderContainer>
  );

  function onClickedRefresh() {
    dispatchCacheRefreshEvent();
    return onReload ? onReload() : router.stateService.reload();
  }
}
