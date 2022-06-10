/*
 * @module: 大数据表格组件
 * @Author: 张前领<qianling.zhang@hand-china.com>
 * @Date: 2021-05-31 09:59:41
 * @LastEditTime: 2021-06-25 17:39:33
 * @copyright: Copyright (c) 2020,Hand
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { PerformanceTable, Pagination } from 'choerodon-ui/pro';

import { TableComponentProps } from './interface';
import style from './index.module.less';

export default function BigDataTable({
  config,
  pageConfig = { total: 0, page: 1, pageSize: 20 },
}: TableComponentProps) {
  console.log(config.loading, 'config');
  const tableRef: any = useRef(null);
  const tableCurrent: any = useRef(null);
  const [height, setHeight] = useState<number>(200);
  const bottomPageHeight = useMemo(() => (config.showPage ? 42 : 0), [config.showPage]);
  const [changeWindow, setChangeWindow] = useState<boolean>(false);

  useEffect(() => {
    if (tableRef && tableCurrent && tableRef.current && tableRef.current.tableHeaderRef) {
      const { tableHeaderRef } = tableRef.current;
      const tableWidth = (tableHeaderRef && tableHeaderRef.current.offsetWidth) || 0;
      let columnsWidth = 0;
      const { columns = [], data = [] } = config;
      if (columns && columns.length > 0) {
        columns.forEach((item) => {
          columnsWidth += item.width || 100;
        });
      }
      // 最后一列自适应
      if (tableWidth > columnsWidth) {
        columns[columns.length - 1] = { ...columns[columns.length - 1], flexGrow: 1 };
      }
      // 高度自适应
      const headerHeight = config.config || 33; // 表头高度
      let bodyHeight = 200; // 表格高度
      if (tableCurrent.current.offsetHeight - bottomPageHeight <= headerHeight + data.length * 30) {
        bodyHeight = tableCurrent.current.offsetHeight - bottomPageHeight;
      } else {
        bodyHeight = headerHeight + data.length * 30;
      }
      if (data.length === 0) {
        bodyHeight = headerHeight + 30;
      }
      setHeight(bodyHeight);
    }
  }, [tableRef, config]);

  useEffect(() => {
    const { data } = config;
    const headerHeight = config.config || 33; // 表头高度
    let bodyHeight = 200; // 表格高度
    if (tableCurrent.current.offsetHeight - bottomPageHeight <= headerHeight + data.length * 30) {
      bodyHeight = tableCurrent.current.offsetHeight - bottomPageHeight;
    } else {
      bodyHeight = headerHeight + data.length * 30;
    }
    if (data.length === 0) {
      bodyHeight = headerHeight + 30;
    }
    setHeight(bodyHeight);
  }, [changeWindow]);

  useEffect(() => {
    function handleResize() {
      setChangeWindow(!changeWindow);
    }
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [changeWindow]);

  /**
   * @description: 改变页码回调
   * @param {*} pages 第几页
   * @param {*} pageSizes 每页大小
   * @return {*}
   */
  function handleChange(pages, pageSizes) {
    config.pageChange(pages, pageSizes);
  }
  return (
    <div className={style['my-table-list']} ref={tableCurrent}>
      <div className={style['table-list-content']}>
        <PerformanceTable {...config} ref={tableRef} height={height} />
      </div>
      {config.showPage ? (
        <div className={style['performance-table-pagination']}>
          <Pagination
            total={pageConfig.total}
            page={pageConfig.page}
            pageSize={pageConfig.pageSize}
            onChange={handleChange}
          />
        </div>
      ) : null}
    </div>
  );
}
