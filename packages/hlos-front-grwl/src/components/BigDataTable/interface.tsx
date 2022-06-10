/*
 * @module: 接口定义
 * @Author: 张前领<qianling.zhang@hand-china.com>
 * @Date: 2021-05-31 10:07:12
 * @LastEditTime: 2021-06-25 10:36:08
 * @copyright: Copyright (c) 2020,Hand
 */
import React, { ReactNode } from 'react';

interface PageSizeProps {
  total: number;
  page: number;
  pageSize: number;
}

interface StandardProps {
  /** The prefix of the component CSS class */
  classPrefix?: string;

  /** Additional classes */
  className?: string;

  /** Additional style */
  style?: React.CSSProperties;

  [key: string]: any;
}

type SortType = 'desc' | 'asc';
interface RowDataType {
  dataKey: string;
  [key: string]: any;
}

interface TableLocale {
  emptyMessage?: string;
  loading?: string;
}

interface TableScrollLength {
  horizontal?: number;
  vertical?: number;
}

interface ColumnProps {
  align?: 'left' | 'center' | 'right';
  verticalAlign?: 'top' | 'middle' | 'bottom';
  width?: number;
  fixed?: boolean | 'left' | 'right';
  resizable?: boolean;
  sortable?: boolean;
  flexGrow?: number;
  minWidth?: number;
  colSpan?: number;
  treeCol?: boolean;
  onResize?: (columnWidth?: number, dataIndex?: string) => void;
  render?: (props: { rowData: any; rowIndex: number; dataIndex?: string | undefined }) => ReactNode;
  dataIndex?: string;
  title?: ReactNode | (() => ReactNode);
  children?: ColumnProps[];
  type?: 'ColumnGroup';
}

interface TableProps extends StandardProps {
  columns?: ColumnProps[];
  autoHeight?: boolean;
  affixHeader?: boolean | number;
  affixHorizontalScrollbar?: boolean | number;
  bodyRef?: (ref: HTMLElement) => void;
  bordered?: boolean;
  className?: string;
  classPrefix?: string;
  children: React.ReactNode;
  cellBordered?: boolean;
  defaultSortType?: SortType;
  disabledScroll?: boolean;
  defaultExpandAllRows?: boolean;
  defaultExpandedRowKeys?: string[] | number[];
  data: object[];
  expandedRowKeys?: string[] | number[];
  height: number;
  hover: boolean;
  headerHeight: number;
  locale: TableLocale;
  clickScrollLength: TableScrollLength;
  loading?: boolean;
  loadAnimation?: boolean;
  minHeight: number;
  rowHeight: number | ((rowData: object) => number);
  rowKey: string | number;
  isTree?: boolean;
  rowExpandedHeight?: number;
  rowClassName?: string | ((rowData: object) => string);
  showHeader?: boolean;
  showPage?: boolean;
  showScrollArrow?: boolean;
  style?: React.CSSProperties;
  sortColumn?: string;
  sortType?: SortType;
  shouldUpdateScroll?: boolean;
  translate3d?: boolean;
  rtl?: boolean;
  width?: number;
  wordWrap?: boolean;
  virtualized?: boolean;
  renderTreeToggle?: (
    expandButton: React.ReactNode,
    rowData?: RowDataType,
    expanded?: boolean
  ) => React.ReactNode;
  renderRowExpanded?: (rowDate?: object) => React.ReactNode;
  renderEmpty?: (info: React.ReactNode) => React.ReactNode;
  renderLoading?: (loading: React.ReactNode) => React.ReactNode;
  onRowClick?: (rowData: object, event: React.MouseEvent) => void;
  onRowContextMenu?: (rowData: object, event: React.MouseEvent) => void;
  onScroll?: (scrollX: number, scrollY: number) => void;
  onSortColumn?: (dataKey: string, sortType?: SortType) => void;
  onExpandChange?: (expanded: boolean, rowData: object) => void;
  onTouchStart?: (event: React.TouchEvent) => void; // for tests
  onTouchMove?: (event: React.TouchEvent) => void; // for tests
  onDataUpdated?: (nextData: object[], scrollTo: (coord: { x: number; y: number }) => void) => void;
}

export interface TableComponentProps {
  config: TableProps;
  pageConfig?: PageSizeProps;
}
