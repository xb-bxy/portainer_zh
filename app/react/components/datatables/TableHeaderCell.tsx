import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { CSSProperties, PropsWithChildren, ReactNode } from 'react';

import { TableHeaderSortIcons } from './TableHeaderSortIcons';

interface Props {
  canSort: boolean;
  isSorted: boolean;
  isSortedDesc?: boolean;
  onSortClick: (desc: boolean) => void;
  render: () => ReactNode;
  renderFilter?: () => ReactNode;
  className?: string;
  style?: CSSProperties;
}

export function TableHeaderCell({
  canSort,
  render,
  onSortClick,
  isSorted,
  isSortedDesc = true,

  renderFilter,
  className,
  style,
}: Props) {
  return (
    <th style={style} className={className}>
      <div className="flex h-full flex-row flex-nowrap items-center gap-1">
        <SortWrapper
          canSort={canSort}
          onClick={onSortClick}
          isSorted={isSorted}
          isSortedDesc={isSortedDesc}
        >
          {render()}
        </SortWrapper>
        {renderFilter ? renderFilter() : null}
      </div>
    </th>
  );
}

interface SortWrapperProps {
  canSort: boolean;
  isSorted: boolean;
  isSortedDesc?: boolean;
  onClick?: (desc: boolean) => void;
}

function SortWrapper({
  canSort,
  children,
  onClick = () => {},
  isSorted,
  isSortedDesc = true,
}: PropsWithChildren<SortWrapperProps>) {
  if (!canSort) {
    return <>{children}</>;
  }

  return (
    <button
      type="button"
      onClick={() => onClick(!isSortedDesc)}
      className={clsx(
        '!ml-0 h-full border-none !bg-transparent !px-0 focus:border-none',
        !isSorted && 'group'
      )}
    >
      <div className="flex h-full w-full flex-row items-center justify-start">
        {children}
        <TableHeaderSortIcons
          sorted={isSorted}
          descending={isSorted && !!isSortedDesc}
        />
      </div>
    </button>
  );
}

export interface TableColumnHeaderAngularProps {
  colTitle: string;
  canSort: boolean;
  isSorted?: boolean;
  isSortedDesc?: boolean;
}

export function TableColumnHeaderAngular({
  canSort,
  isSorted,
  colTitle,
  isSortedDesc = true,
  children,
}: PropsWithChildren<TableColumnHeaderAngularProps>) {
  const { t } = useTranslation();
  const translatedColTitle = t(colTitle);
  return (
    <div className="flex h-full flex-row flex-nowrap">
      <SortWrapper
        canSort={canSort}
        isSorted={!!isSorted}
        isSortedDesc={isSortedDesc}
      >
        {translatedColTitle}
        {children}
      </SortWrapper>
    </div>
  );
}
