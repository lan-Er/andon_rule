/*
 * @Description: 装箱查询
 * @Author: mengting.zhang <mengting.zhang@hand-china.com>
 * @LastEditTime: 2020-08-12 10:28:17
 */

import React, { Fragment } from 'react';
import { Header, Content } from 'components/Page';
import { getSerialNum } from '@/utils/renderer';
import { Button, Table, DataSet } from 'choerodon-ui/pro';

// import { openTab } from 'utils/menuTab';
// import queryString from 'query-string';
import { packingListDS } from '@/stores/packingListDS';
import './index.less';

const plDs = new DataSet(packingListDS());

class PackingList extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }

  // table 列
  columns = () => {
    return [
      {
        header: 'No.',
        width: 80,
        lock: 'left',
        tooltip: 'overflow',
        renderer: ({ record }) => getSerialNum(record),
      },
      {
        name: 'attribute2&3',
        value: '客户PO号-PO行号',
        width: 150,
        lock: 'left',
        tooltip: 'overflow',
        renderer({ record }) {
          if (!record.get('attribute2')) {
            return;
          }
          return (
            <div className="line-cell">
              <span>{record.get('attribute2')}</span>
              <span>-</span>
              <span>{record.get('attribute3')}</span>
            </div>
          );
        },
      },
      {
        name: 'attribute4&5',
        value: '箱头-箱名',
        width: 150,
        align: 'left',
        tooltip: 'overflow',
        renderer({ record }) {
          if (!record.get('attribute4')) {
            return;
          }
          return (
            <div className="line-cell">
              <span className="val">{record.get('attribute4')}</span>
              <span>-</span>
              <span className="desc">{record.get('attribute5')}</span>
            </div>
          );
        },
      },
      {
        name: 'attribute6',
        value: '分箱',
        width: 90,
        align: 'center',
        tooltip: 'overflow',
      },
      {
        name: 'attribute7',
        value: '清单版本',
        width: 120,
        align: 'center',
        tooltip: 'overflow',
      },
      {
        name: 'attribute8',
        value: '箱头版本',
        width: 120,
        align: 'center',
        tooltip: 'overflow',
      },
      {
        name: 'attribute9',
        value: '客户',
        width: 150,
        align: 'center',
        tooltip: 'overflow',
      },
      {
        name: 'attribute10',
        value: '密箱',
        align: 'center',
        width: 150,
        tooltip: 'overflow',
      },
      {
        name: 'attribute11&12',
        value: '物料-描述',
        align: 'left',
        width: 180,
        tooltip: 'overflow',
        renderer({ record }) {
          if (!record.get('attribute11')) {
            return;
          }
          return (
            <div className="line-cell">
              <span className="val">{record.get('attribute11')}</span>
              <span>-</span>
              <span className="desc">{record.get('attribute12')}</span>
            </div>
          );
        },
      },
      {
        name: 'attribute13',
        value: '自制/外购',
        width: 130,
        align: 'left',
        tooltip: 'overflow',
      },
      {
        name: 'attribute14&15',
        value: '库存可用量-单位',
        width: 150,
        align: 'left',
        tooltip: 'overflow',
        renderer({ record }) {
          if (!record.get('attribute14')) {
            return;
          }
          return (
            <div className="line-cell">
              <span className="val">{record.get('attribute14')}</span>
              <span>-</span>
              <span className="desc">{record.get('attribute15')}</span>
            </div>
          );
        },
      },
      // {
      //   name: 'attribute15',
      //   value: '单位',
      //   width: 100,
      //   align: 'right',
      //   tooltip: 'overflow',
      // },
      {
        name: 'attribute16',
        value: '需求日期',
        width: 120,
        align: 'right',
        tooltip: 'overflow',
      },
      {
        name: 'attribute17',
        value: '备注',
        align: 'left',
        width: 200,
        tooltip: 'overflow',
      },
    ];
  };

  handleBatchImport = () => {
    // openTab({
    //   // 编码是后端给出的
    //   key: `/himp/commentImport/LISP_DEMO_MO`,
    //   title: 'MO工作台数据导入',
    //   search: queryString.stringify({
    //     action: 'MO工作台数据导入',
    //   }),
    // });
  };

  render() {
    return (
      <Fragment>
        <Header title="装箱清单">
          <Button onClick={this.handleBatchImport}>导入</Button>
        </Header>
        <Content>
          <div className="content">
            <Table
              dataSet={plDs}
              columns={this.columns()}
              border={false}
              columnResizable="true"
              editMode="inline"
            />
          </div>
        </Content>
      </Fragment>
    );
  }
}

export default PackingList;
