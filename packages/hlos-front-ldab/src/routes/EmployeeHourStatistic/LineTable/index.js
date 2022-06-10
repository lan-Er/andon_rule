/*
 * @module: 行数据
 * @Author: 张前领<qianling.zhang@hand-china.com>
 * @Date: 2021-03-17 19:06:12
 * @LastEditTime: 2021-03-19 15:11:04
 * @copyright: Copyright (c) 2020,Hand
 */
import { Table } from 'hzero-ui';
import React, { Fragment } from 'react';

import Icons from 'components/Icons';

import styles from './index.less';

export default function LineTable(props) {
  const {
    // loading,
    columns = [],
    dataSource = [],
    lineHeader = {},
    lineHeader: { statisticType },
  } = props;
  return (
    <Fragment>
      {statisticType === 'WORKER_GROUP' ? (
        <div className={styles['table-header-worker-group']}>
          <section>
            <Icons type="lot-icon" size={14} color="#000" />
            <span>{lineHeader.workerGroupCode}</span>
          </section>
          <section>
            <Icons type="org" size={14} color="#000" />
            <span>{lineHeader.organizationName}</span>
          </section>
          <section>
            <Icons type="team" size={14} color="#000" />
            <span>{lineHeader.workerGroupName}</span>
          </section>
        </div>
      ) : (
        <div className={styles['table-header-worker-group']}>
          <section>
            <Icons type="workcell" size={14} color="#000" />
            <span>
              {lineHeader.workerName} {lineHeader.workerCode}
            </span>
          </section>
          <section>
            <Icons type="org" size={14} color="#000" />
            <span>{lineHeader.organizationName}</span>
          </section>
          <section>
            <Icons type="team" size={14} color="#000" />
            <span>{lineHeader.workerGroupName}</span>
          </section>
        </div>
      )}
      <Table
        // loading={loading}
        rowKey="rowId"
        bordered
        columns={columns}
        dataSource={dataSource}
      />
    </Fragment>
  );
}
