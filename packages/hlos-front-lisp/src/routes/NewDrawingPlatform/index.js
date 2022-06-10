/*
 * @Description: 新图纸平台
 * @Author: 赵敏捷 <minjie.zhao@hand-china.com>
 * @Date: 2020-08-04 10:29:10
 * @LastEditors: 赵敏捷
 */
import { isEmpty } from 'lodash';
import React, { useState, Fragment } from 'react';
import { DataSet, Table, Tooltip } from 'choerodon-ui/pro';
import { Button as HButton } from 'hzero-ui';

import { openTab } from 'utils/menuTab';
import { Content, Header } from 'components/Page';
import ExcelExport from 'components/ExcelExport';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import { dsConfig } from '@/stores/newDrawingPlatformDS';

import styles from './index.module.less';

const organizationId = getCurrentOrganizationId();

function getColumns() {
  return [
    {
      name: 'attribute1',
      width: 150,
      editor: false,
    },
    {
      name: 'attribute2&3',
      width: 150,
      editor: false,
      renderer({ record }) {
        return (
          <div className={styles['c-row']}>
            <div className={styles['c-row__value']}>{record.get('attribute2')}</div>
            <div>{record.get('attribute3')}</div>
          </div>
        );
      },
    },
    {
      name: 'attribute4',
      width: 150,
      editor: false,
    },
    {
      name: 'attribute5',
      width: 150,
      editor: false,
    },
    {
      name: 'attribute6&7',
      width: 150,
      editor: false,
      renderer({ record }) {
        return (
          <div className={styles['c-row']}>
            <div className={styles['c-row__value']}>{record.get('attribute6')}</div>
            <div>{record.get('attribute7')}</div>
          </div>
        );
      },
    },
    {
      name: 'attribute8&9',
      width: 150,
      editor: false,
      renderer({ record }) {
        return (
          <div className={styles['c-row']}>
            <div className={styles['c-row__value']}>{record.get('attribute8')}</div>
            <div>{record.get('attribute9')}</div>
          </div>
        );
      },
    },
    {
      name: 'attribute10',
      width: 150,
      editor: false,
    },
    {
      name: 'attribute11',
      width: 150,
      editor: false,
    },
    {
      name: 'attribute12',
      width: 150,
      editor: false,
      renderer({ value }) {
        if (isEmpty(value)) return value;
        const links = value.split(';').map((item) => {
          return (
            <Fragment>
              <a
                href={item}
                target="_blank"
                rel="noopener noreferrer"
                style={{ margin: '3px 10px' }}
              >
                {item.split('@').pop()}
              </a>
              <br />
            </Fragment>
          );
        });
        return (
          <Tooltip title={links}>
            <span className={styles['c-row__value']}>
              <a>查看附件</a>
            </span>
          </Tooltip>
        );
      },
    },
    {
      name: 'attribute13',
      width: 200,
      editor: false,
    },
  ];
}

function handleBatchImport() {
  openTab({
    key: `/himp/commentImport/LISP_DRAWING_TEMPLATE`,
    title: '图纸平台数据导入',
  });
}

export default function NewDrawingPlatform() {
  const [ds] = useState(new DataSet(dsConfig()));

  function getExportQueryParams() {
    const queryDataDs = ds.queryDataSet?.current;
    const queryDataDsValue = queryDataDs ? filterNullValueObject(queryDataDs.toData()) : {};
    return {
      tenantId: organizationId,
      ...queryDataDsValue,
    };
  }

  return (
    <Fragment>
      <Header title="图纸平台">
        <ExcelExport requestUrl={null} queryParams={getExportQueryParams} />
        <HButton icon="upload" onClick={handleBatchImport}>
          导入
        </HButton>
      </Header>
      <Content>
        <Table dataSet={ds} columns={getColumns()} rowHeight="auto" />
      </Content>
    </Fragment>
  );
}
