import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  label: string;
  colClassName?: string;
  className?: string;
  columns?: Array<ReactNode>;
}

export function DetailsRow({
  label,
  children,
  colClassName,
  className,
  columns,
}: Props) {
  const { t } = useTranslation();
  const translatedLabel = t(label);
  return (
    <tr className={className}>
      <td className={clsx(colClassName, 'min-w-[150px] !break-normal')}>
        {translatedLabel}
      </td>
      <td className={colClassName} data-cy={`detailsTable-${label}Value`}>
        {children}
      </td>
      {columns?.map((column, index) => (
        <td key={index} className={colClassName}>
          {column}
        </td>
      ))}
    </tr>
  );
}
