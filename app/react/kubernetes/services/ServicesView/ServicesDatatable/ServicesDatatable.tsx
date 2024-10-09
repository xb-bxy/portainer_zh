import { Shuffle } from 'lucide-react';
import { useRouter } from '@uirouter/react';
import clsx from 'clsx';
import { Row } from '@tanstack/react-table';
import { useMemo } from 'react';

import { Namespaces } from '@/react/kubernetes/namespaces/types';
import { useEnvironmentId } from '@/react/hooks/useEnvironmentId';
import { Authorized, useAuthorizations } from '@/react/hooks/useUser';
import { notifyError, notifySuccess } from '@/portainer/services/notifications';
import { pluralize } from '@/portainer/helpers/strings';
import {
  DefaultDatatableSettings,
  TableSettings as KubeTableSettings,
} from '@/react/kubernetes/datatables/DefaultDatatableSettings';
import { useKubeStore } from '@/react/kubernetes/datatables/default-kube-datatable-store';
import { SystemResourceDescription } from '@/react/kubernetes/datatables/SystemResourceDescription';
import { useNamespacesQuery } from '@/react/kubernetes/namespaces/queries/useNamespacesQuery';
import { CreateFromManifestButton } from '@/react/kubernetes/components/CreateFromManifestButton';

import { Datatable, Table, TableSettingsMenu } from '@@/datatables';
import { DeleteButton } from '@@/buttons/DeleteButton';
import {
  type FilteredColumnsTableSettings,
  filteredColumnsSettings,
} from '@@/datatables/types';
import { mergeOptions } from '@@/datatables/extend-options/mergeOptions';
import { withColumnFilters } from '@@/datatables/extend-options/withColumnFilters';

import {
  useMutationDeleteServices,
  useServicesForCluster,
} from '../../service';
import { Service } from '../../types';

import { columns } from './columns';

const storageKey = 'k8sServicesDatatable';
interface TableSettings
  extends KubeTableSettings,
    FilteredColumnsTableSettings {}

export function ServicesDatatable() {
  const tableState = useKubeStore<TableSettings>(
    storageKey,
    undefined,
    (set) => ({
      ...filteredColumnsSettings(set),
    })
  );
  const environmentId = useEnvironmentId();
  const { data: namespaces, ...namespacesQuery } =
    useNamespacesQuery(environmentId);
  const namespaceNames = (namespaces && Object.keys(namespaces)) || [];
  const { data: services, ...servicesQuery } = useServicesForCluster(
    environmentId,
    namespaceNames,
    {
      autoRefreshRate: tableState.autoRefreshRate * 1000,
      lookupApplications: true,
    }
  );

  const { authorized: canWrite } = useAuthorizations(['K8sServiceW']);
  const readOnly = !canWrite;
  const { authorized: canAccessSystemResources } = useAuthorizations(
    'K8sAccessSystemNamespaces'
  );

  const filteredServices = services?.filter(
    (service) =>
      (canAccessSystemResources && tableState.showSystemResources) ||
      !namespaces?.[service.Namespace].IsSystem
  );

  const servicesWithIsSystem = useServicesRowData(
    filteredServices || [],
    namespaces
  );

  return (
    <Datatable
      dataset={servicesWithIsSystem || []}
      columns={columns}
      settingsManager={tableState}
      isLoading={servicesQuery.isLoading || namespacesQuery.isLoading}
      title="Services"
      titleIcon={Shuffle}
      getRowId={(row) => row.UID}
      isRowSelectable={(row) => !namespaces?.[row.original.Namespace].IsSystem}
      disableSelect={readOnly}
      renderTableActions={(selectedRows) => (
        <TableActions selectedItems={selectedRows} />
      )}
      renderTableSettings={() => (
        <TableSettingsMenu>
          <DefaultDatatableSettings settings={tableState} />
        </TableSettingsMenu>
      )}
      description={
        <SystemResourceDescription
          showSystemResources={
            tableState.showSystemResources || !canAccessSystemResources
          }
        />
      }
      renderRow={servicesRenderRow}
      data-cy="k8s-services-datatable"
      extendTableOptions={mergeOptions(
        withColumnFilters(tableState.columnFilters, tableState.setColumnFilters)
      )}
    />
  );
}

// useServicesRowData appends the `isSystem` property to the service data
function useServicesRowData(
  services: Service[],
  namespaces?: Namespaces
): Service[] {
  return useMemo(
    () =>
      services.map((service) => ({
        ...service,
        IsSystem: namespaces ? namespaces?.[service.Namespace].IsSystem : false,
      })),
    [services, namespaces]
  );
}

// needed to apply custom styling to the row cells and not globally.
// required in the AC's for this ticket.
function servicesRenderRow(row: Row<Service>, highlightedItemId?: string) {
  return (
    <Table.Row<Service>
      cells={row.getVisibleCells()}
      className={clsx('[&>td]:!py-4 [&>td]:!align-top', {
        active: highlightedItemId === row.id,
      })}
    />
  );
}

interface SelectedService {
  Namespace: string;
  Name: string;
}

type TableActionsProps = {
  selectedItems: Service[];
};

function TableActions({ selectedItems }: TableActionsProps) {
  const environmentId = useEnvironmentId();
  const deleteServicesMutation = useMutationDeleteServices(environmentId);
  const router = useRouter();

  return (
    <Authorized authorizations="K8sServicesW">
      <DeleteButton
        disabled={selectedItems.length === 0}
        onConfirmed={() => handleRemoveClick(selectedItems)}
        confirmMessage={
          <>
            <p>{`Are you sure you want to remove the selected ${pluralize(
              selectedItems.length,
              'service'
            )}?`}</p>
            <ul className="pl-6">
              {selectedItems.map((s, index) => (
                <li key={index}>
                  {s.Namespace}/{s.Name}
                </li>
              ))}
            </ul>
          </>
        }
        data-cy="k8s-remove-services-button"
      />

      <CreateFromManifestButton data-cy="k8s-create-service-button" />
    </Authorized>
  );

  async function handleRemoveClick(services: SelectedService[]) {
    const payload: Record<string, string[]> = {};
    services.forEach((service) => {
      payload[service.Namespace] = payload[service.Namespace] || [];
      payload[service.Namespace].push(service.Name);
    });

    deleteServicesMutation.mutate(
      { environmentId, data: payload },
      {
        onSuccess: () => {
          notifySuccess(
            'Services successfully removed',
            services.map((s) => `${s.Namespace}/${s.Name}`).join(', ')
          );
          router.stateService.reload();
        },
        onError: (error) => {
          notifyError(
            'Unable to delete service(s)',
            error as Error,
            services.map((s) => `${s.Namespace}/${s.Name}`).join(', ')
          );
        },
      }
    );
  }
}