import React, { Fragment, useMemo } from 'react';

import { openTab } from 'utils/menuTab';
import queryString from 'query-string';
import { Button, DataSet, Table } from 'choerodon-ui/pro';

import { Content, Header } from 'components/Page';
import { getSerialNum } from '@/utils/renderer';
import tableDsConfig from '@/stores/productionWarehousingDS';

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
        align: 'center',
        width: 50,
        renderer: ({ record }) => getSerialNum(record),
        lock: 'left',
      },
      {
        name: 'attribute1',
        editor: false,
        align: 'center',
        width: 150,
        renderer: ({ value, record }) => (
          <Fragment>
            {record.get('attribute11') === '1' && (
              <img src={customerIcon} alt="customerIcon" style={{ marginRight: '6px' }} />
            )}
            {value}
          </Fragment>
        ),
        lock: 'left',
      },
      // {
      //   name: 'attribute2',
      //   editor: false,
      //   align: 'center',
      //   width: 150,
      //   lock: 'left',
      // },
      {
        name: 'attribute3',
        editor: false,
        align: 'center',
        width: 150,
        lock: 'left',
      },
      {
        name: 'attribute4',
        editor: false,
        align: 'center',
        width: 150,
      },
      {
        name: 'attribute5',
        editor: false,
        align: 'center',
        width: 250,
        style: {
          overflow: 'hidden',
        },
        renderer: ({ value, record }) => {
          const attribute7 = record.get('attribute7');
          if (attribute7 && value) {
            return (
              <>
                {value}-{attribute7}
              </>
            );
          } else {
            return { value };
          }
        },
      },
      {
        name: 'attribute6',
        editor: false,
        align: 'center',
        width: 150,
      },
      // {
      //   name: 'attribute7',
      //   editor: false,
      //   align: 'center',
      //   width: 250,
      //   style: {
      //     overflow: 'hidden',
      //   },
      // },
      {
        name: 'attribute8',
        className: 'high-light',
        editor: false,
        align: 'center',
        width: 150,
        renderer: ({ value, record }) => {
          const umo = record.get('attribute9');
          return (
            <>
              {value} {umo}
            </>
          );
        },
      },
      {
        name: 'attribute10',
        type: 'date',
        align: 'center',
        width: 150,
      },
    ];
  };

  const handleBatchImport = () => {
    openTab({
      // ????????????????????????
      key: `/himp/commentImport/LISP.PRO.STORAGE_TEMPLATE`,
      // MenuTab ???????????????????????? hzero.common ??????(???????????????????????????)
      title: '??????????????????',
      search: queryString.stringify({
        action: '??????????????????',
      }),
    });
  };

  return (
    <Fragment>
      <div className="lisp-production-warehousing">
        <Header title="????????????">
          <Button icon="file_upload" onClick={() => handleBatchImport()}>
            ??????
          </Button>
        </Header>
        <Content>
          <div className="content">
            <Table
              dataSet={tableDS}
              columns={getTableColumns()}
              border={false}
              columnResizable="true"
              rowHeight="auto"
            />
          </div>
        </Content>
      </div>
    </Fragment>
  );
};
