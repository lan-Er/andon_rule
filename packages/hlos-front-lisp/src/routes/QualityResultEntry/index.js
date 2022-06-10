/*
 * @Description: 质检结果录入
 * @Author: taotao.zhu@hand-china.com
 * @Date: 2020-07-25 14:33:18
 * @LastEditors: Axtlive
 * @LastEditTime: 2020-08-03 15:45:32
 */

import React, { Fragment, useMemo } from 'react';

import { openTab } from 'utils/menuTab';
import queryString from 'query-string';
import { Button, DataSet, Table } from 'choerodon-ui/pro';

import { Content, Header } from 'components/Page';
import { getSerialNum } from '@/utils/renderer';
import tableDsConfig from '@/stores/qualityResultEntryDS';

import customerIcon from '../../assets/supplierOrder/customer.svg';

import './style.less';

export default () => {
  const tableDS = useMemo(() => new DataSet(tableDsConfig()), []);

  const getTableColumns = () => {
    return [
      {
        name: 'serialNumber',
        key: 'No.',
        editor: false,
        width: 50,
        align: 'center',
        lock: 'left',
        renderer: ({ record }) => getSerialNum(record),
      },
      {
        name: 'attribute1',
        editor: false,
        width: 150,
        lock: 'left',
        align: 'center',
      },
      {
        name: 'attribute2',
        editor: false,
        lock: 'left',
        width: 100,
        align: 'center',
        renderer: ({ value }) => {
          let backgroundColor = '#DDF7EC';
          let color = '#24BDA2';
          if (value === '未检验') {
            backgroundColor = '#f66767';
            color = '#fff';
          }
          return (
            <div
              style={{
                backgroundColor,
                color,
                margin: 'auto',
                width: '55px',
                textAlign: 'center',
                lineHeight: '16px',
                borderRadius: '4px',
                padding: '0 4px',
              }}
            >
              {value}
            </div>
          );
        },
      },
      {
        name: 'attribute3',
        editor: false,
        lock: 'left',
        width: 100,
        align: 'center',
      },
      {
        name: 'attribute4',
        editor: false,
        width: 150,
        align: 'center',
      },
      // {
      //   name: 'attribute5',
      //   editor: false,
      //   width: 150,
      //   align: 'center',
      // },
      {
        name: 'attribute6',
        editor: false,
        width: 150,
        align: 'center',
      },
      {
        name: 'attribute7',
        editor: false,
        width: 150,
        align: 'center',
        renderer: ({ value, record }) => (
          <Fragment>
            {record.get('attribute17') === '1' && (
              <img src={customerIcon} alt="customerIcon" style={{ marginRight: '6px' }} />
            )}
            {value}
          </Fragment>
        ),
      },
      {
        name: 'attribute8',
        editor: false,
        width: 150,
        align: 'center',
        renderer: ({ value, record }) => (
          <Fragment>
            {record.get('attribute18') === '1' && (
              <img src={customerIcon} alt="customerIcon" style={{ marginRight: '6px' }} />
            )}
            {value}
          </Fragment>
        ),
      },
      {
        name: 'attribute9',
        editor: false,
        width: 150,
        align: 'center',
      },
      {
        name: 'attribute10',
        editor: false,
        width: 150,
        align: 'center',
      },
      {
        name: 'attribute11',
        editor: false,
        width: 200,
        align: 'center',
        style: {
          overflow: 'hidden',
        },
      },
      {
        name: 'attribute12',
        editor: false,
        width: 150,
        align: 'center',
        className: 'high-light',
      },
      {
        name: 'attribute13',
        editor: false,
        width: 150,
        align: 'center',
        className: 'high-light',
      },
      {
        name: 'attribute14',
        editor: false,
        width: 150,
        align: 'center',
        className: 'high-light',
      },
      {
        name: 'attribute15',
        editor: false,
        width: 100,
        align: 'center',
        renderer: ({ value }) => {
          let backgroundColor = '#f66767';
          let color = '#fff';
          if (value === '合格') {
            backgroundColor = '#DDF7EC';
            color = '#24BDA2';
          }
          return (
            <div
              style={{
                backgroundColor,
                color,
                margin: 'auto',
                width: '55px',
                textAlign: 'center',
                lineHeight: '16px',
                borderRadius: '4px',
                padding: '0 4px',
              }}
            >
              {value}
            </div>
          );
        },
      },
      {
        name: 'attribute16',
        type: 'date',
        label: '检验日期',
        width: 150,
        align: 'center',
      },
    ];
  };

  const handleBatchImport = () => {
    openTab({
      // 编码是后端给出的
      key: `/himp/commentImport/LMDS.INSPECTION_TEMPLATE`,
      // MenuTab 的国际化必须使用 hzero.common 开头(或者其他公用多语言)
      title: '质检结果录入导入',
      search: queryString.stringify({
        action: '质检结果录入导入',
      }),
    });
  };

  return (
    <Fragment>
      <div className="lisp-quality-result-entry">
        <Header title="质检结果录入">
          <Button icon="file_upload" onClick={() => handleBatchImport()}>
            导入
          </Button>
        </Header>
        <Content>
          <div className="content">
            <Table dataSet={tableDS} columns={getTableColumns()} border={false} rowHeight="auto" />
          </div>
        </Content>
      </div>
    </Fragment>
  );
};
