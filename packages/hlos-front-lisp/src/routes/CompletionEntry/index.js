/*
 * @Author: chunyan.liang <chunyan.liang@hand-china.com>
 * @Date: 2020-07-23 18:24:15
 * @LastEditTime: 2020-08-03 19:02:11
 * @Description:
 */
import React, { Fragment } from 'react';
import { Header, Content } from 'components/Page';
import { Button, Table, DataSet } from 'choerodon-ui/pro';
import { getSerialNum, surnamesRender } from '@/utils/renderer';
import { openTab } from 'utils/menuTab';
import intl from 'utils/intl';
import queryString from 'query-string';

import { ListDS } from '@/stores/completionEntryDS';
import { deleteListDatas } from '../../services/api';
import styles from './index.less';
import deleteIcon from './assets/deleteIcon.svg';
import importIcon from './assets/importIcon.svg';

const preCode = 'lisp.completionEntry';

class CompletionEntry extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  ds = new DataSet(ListDS());

  /**
   *查询
   *
   * @memberof CompletionEntry
   */
  handleSearch = () => {
    this.ds.query();
  };

  /**
   * 换行内容渲染
   * @param {*} record 当前行记录
   */
  handleCellRender = (upValue, downValue) => {
    return (
      <>
        <span className={styles['text-wrap']}>{upValue}</span>
        <br />
        <span className={`${styles['down-font']} ${styles['text-wrap']}`}>{downValue}</span>
      </>
    );
  };

  /**
   *导入
   * @memberof CompletionEntry
   */
  handleBatchImport = () => {
    openTab({
      // 编码是后端给出的
      key: `/himp/commentImport/LISP_DEMO_REPORT`,
      // MenuTab 的国际化必须使用 hzero.common 开头(或者其他公用多语言)
      title: intl.get(`${preCode}.view.title.solutionPackageImport`).d('完工录入数据导入'),
      search: queryString.stringify({
        action: intl.get(`${preCode}.view.title.solutionPackageImport`).d('完工录入数据导入'),
      }),
    });
  };

  get columns() {
    return [
      { header: 'No.', width: 50, lock: 'left', renderer: ({ record }) => getSerialNum(record) },
      { name: 'attribute1', width: 100, lock: 'left' },
      {
        name: 'attribute2',
        width: 150,
        tooltip: 'overflow',
        lock: 'left',
      },
      {
        name: 'attribute3',
        width: 120,
        renderer: ({ record, value }) => this.handleCellRender(value, record.get('attribute13')),
        tooltip: 'overflow',
        lock: 'left',
      },
      {
        name: 'attribute7',
        width: 100,
        renderer: ({ value, record }) => {
          return (
            <span>
              {value} {record.get('attribute14')}
            </span>
          );
        },
      },
      {
        name: 'attribute8',
        width: 100,
        renderer: ({ value, record }) => {
          return (
            <span>
              {value} {record.get('attribute14')}
            </span>
          );
        },
      },
      {
        name: 'attribute9',
        width: 100,
        renderer: ({ value, record }) => {
          return (
            <span>
              {value} {record.get('attribute14')}
            </span>
          );
        },
      },
      { name: 'attribute10', width: 150, tooltip: 'overflow' },
      { name: 'attribute11', width: 120 },
      { name: 'attribute12', width: 120 },
      {
        name: 'attribute5',
        width: 120,
        tooltip: 'overflow',
        renderer: ({ value }) => surnamesRender(value),
      },
      { name: 'attribute4', width: 150 },
      { name: 'creationDate', width: 150 },
    ];
  }

  handleDelete = async () => {
    const newList = this.ds.selected.slice();
    const params = [];
    newList.forEach((element) => {
      const newObj = element.data;
      params.push(newObj);
    });
    await deleteListDatas(params);
    this.ds.query();
  };

  render() {
    return (
      <Fragment>
        <Header title="生产履历">
          <div className={styles['completion-entry-header']}>
            <Button
              color="red"
              style={{ color: '#fff', background: '#F56767' }}
              onClick={() => {
                this.handleDelete();
              }}
            >
              <img src={deleteIcon} alt="" style={{ marginBottom: '3px' }} />
              删除
            </Button>
            <Button
              color="green"
              style={{ color: '#fff', background: '#62C0BC' }}
              onClick={() => this.handleBatchImport()}
            >
              <img src={importIcon} alt="" style={{ marginBottom: '3px' }} />
              导入
            </Button>
          </div>
        </Header>
        <Content className={styles['completion-entry-content']}>
          <Table
            border={false}
            queryFieldsLimit={4}
            dataSet={this.ds}
            columns={this.columns}
            rowHeight="72"
          />
        </Content>
      </Fragment>
    );
  }
}

export default CompletionEntry;
