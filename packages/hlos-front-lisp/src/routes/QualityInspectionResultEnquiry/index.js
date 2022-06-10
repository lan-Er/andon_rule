/*
 * @Author: chunyan.liang <chunyan.liang@hand-china.com>
 * @Date: 2020-07-30 16:02:23
 * @LastEditTime: 2020-09-11 14:29:58
 * @Description:
 */
import React, { Fragment } from 'react';
import { Header, Content } from 'components/Page';
import { Table, DataSet, Lov } from 'choerodon-ui/pro';
import { getSerialNum } from '@/utils/renderer';

import styles from './index.less';
import { qualityInspectionResultEnquiryDS } from '@/stores/qualityInspectionResultEnquiryDS';
// import { queryList } from '../../services/api';

class QualityInspectionResultEnquiry extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  ds = new DataSet(qualityInspectionResultEnquiryDS());

  get columns() {
    return [
      { header: 'No.', width: 50, renderer: ({ record }) => getSerialNum(record), lock: 'left' },
      { width: 150, name: 'attribute25', lock: 'left' },
      { width: 120, name: 'attribute1', lock: 'left' },
      { width: 120, name: 'attribute3', lock: 'left' },
      { width: 100, name: 'attribute4' },
      {
        width: 120,
        name: 'attribute5',
        renderer: ({ record, value }) => this.handleCellRender(value, record.get('attribute6')),
      },
      {
        width: 100,
        name: 'attribute7',
        renderer: ({ value }) => {
          return value === '合格' ? (
            <span className={styles['quality-result-pass']}> {value} </span>
          ) : (
            <span className={styles['quality-result-nopass']}> {value} </span>
          );
        },
      },
      { width: 100, name: 'attribute8' },
      { width: 100, name: 'attribute9' },
      { width: 150, name: 'attribute10' },
      {
        width: 150,
        name: 'attribute11',
        renderer: ({ value }) => {
          return <span className={styles['quality-group']}> {value} </span>;
        },
      },
      {
        width: 450,
        name: 'attribute16',
        renderer: ({ record, value }) =>
          this.handleCellRenderGroup([
            {
              name: value,
              result: record.get('attribute17'),
              resultData: record.get('attribute22'),
            },
            {
              name: record.get('attribute18'),
              result: record.get('attribute19'),
              resultData: record.get('attribute23'),
            },
            {
              name: record.get('attribute20'),
              result: record.get('attribute21'),
              resultData: record.get('attribute24'),
            },
          ]),
      },
    ];
  }

  queryFeild = () => {
    return {
      PO: (
        <Lov
          name="item"
          noCache
          onChange={() => {
            this.ds.queryDataSet.current.set('item', null);
          }}
        />
      ),
      item: (
        <Lov
          name="item"
          noCache
          onChange={() => {
            this.ds.queryDataSet.current.set('processObj', null);
          }}
        />
      ),
    };
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
        <span className={`${styles['text-wrap']} ${styles['text-wrap']}`}>{downValue}</span>
      </>
    );
  };

  handleCellRenderGroup = (value) => {
    return (
      <div className={styles['group-result']}>
        {value &&
          value.map((element) => {
            return (
              <div>
                <span className={styles['text-wrap']}>{element.name}</span>
                <br />
                {element.result === '合格' ? (
                  <span className={styles['group-result-pass']}>
                    <span className={styles['span-circle']} /> {element.result}{' '}
                    {element.resultData ? `(${element.resultData})` : `(-)`}
                  </span>
                ) : (
                  <span className={styles['group-result-nopass']}>
                    <span className={styles['span-circle']} /> {element.result}{' '}
                    {element.resultData ? `(${element.resultData})` : `(-)`}
                  </span>
                )}
              </div>
            );
          })}
      </div>
    );
  };

  /**
   *清空时间
   *
   * @memberof QualityInspectionResultEnquiry
   */
  handleTime = (value) => {
    if (value.attribute3) {
      this.ds.queryDataSet.current.set('date', { start: null, end: null });
    }
  };

  render() {
    return (
      <Fragment>
        <Header title="质检结果查询" />
        <Content>
          <div className={styles['quality-inspection-content']}>
            <Table
              queryFieldsLimit={4}
              border={false}
              dataSet={this.ds}
              columns={this.columns}
              rowHeight="auto"
              queryFields={this.queryFeild()}
            />
          </div>
        </Content>
      </Fragment>
    );
  }
}

export default QualityInspectionResultEnquiry;
