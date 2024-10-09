import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { Children, PropsWithChildren } from 'react';

type Props = {
  dataCy: string;
  headers?: string[];
  className?: string;
  emptyMessage?: string;
};

export function DetailsTable({
  headers = [],
  dataCy,
  className,
  emptyMessage,
  children,
}: PropsWithChildren<Props>) {
  const { t } = useTranslation();
  const translatedHeaders = headers.map((header) => t(header));
  const translatedEmptyMessage =
    typeof emptyMessage === 'string' ? t(emptyMessage) : emptyMessage;

  return (
    <table className={clsx('table', className)} data-cy={dataCy}>
      {translatedHeaders.length > 0 && (
        <thead>
          <tr>
            {translatedHeaders.map((header) => (
              <th key={header}>{header}</th>
            ))}
          </tr>
        </thead>
      )}
      <tbody>
        {Children.count(children) > 0 ? (
          children
        ) : (
          <tr>
            <td
              colSpan={translatedHeaders.length}
              className="text-muted text-center"
            >
              {translatedEmptyMessage}
            </td>
          </tr>
        )}
      </tbody>
    </table>
  );
}
