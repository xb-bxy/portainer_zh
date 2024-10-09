import { useMutation } from '@tanstack/react-query';
import { saveAs } from 'file-saver';
import { useTranslation } from 'react-i18next';

import axios, { parseAxiosError } from '@/portainer/services/axios';

import { Query } from './useActivityLogs';

export function useExportMutation() {
  const { t } = useTranslation();

  return useMutation({
    mutationFn: (query: Omit<Query, 'limit'>) => exportActivityLogs(query, t),
  });
}

async function exportActivityLogs(
  query: Omit<Query, 'limit'>,
  t: (key: string) => string
) {
  try {
    const { data, headers } = await axios.get<Blob>('/useractivity/logs.csv', {
      params: { ...query, limit: 2000 },
      responseType: 'blob',
      headers: {
        'Content-type': 'text/csv',
      },
    });

    const contentDispositionHeader = headers['content-disposition'] || '';
    const filename =
      contentDispositionHeader.replace('attachment; filename=', '').trim() ||
      'logs.csv';
    saveAs(data, filename);
  } catch (err) {
    throw parseAxiosError(err, t('Failed loading user activity logs csv'));
  }
}
