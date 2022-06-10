/**
 * @Description: 对账单创建 - index
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-07-23  16:58:00
 * @LastEditors: yu.na
 */

import React, { useState } from 'react';
import { Button, Lov, Table, DataSet, DatePicker, Form } from 'choerodon-ui/pro';
import { Modal, Icon } from 'choerodon-ui';
import moment from 'moment';
import { DEFAULT_DATE_FORMAT } from 'utils/constants';
import { Header } from 'components/Page';
import { getResponse } from 'utils/utils';
import formatterCollections from 'utils/intl/formatterCollections';
import notification from 'utils/notification';
import intl from 'utils/intl';
import { useDataSet } from 'hzero-front/lib/utils/hooks';
import { getSerialNum } from '@/utils/renderer';
import { ListDS } from '@/stores/statementCreateDS';
import { generateStatementApi, updateStatementApi } from '@/services/statementService';

import GenerateImg from './assets/generate.svg';
import qiIcon from './assets/qi.svg';
import './style.less';

const { Sidebar } = Modal;

const StatementCreate = () => {
  const ds = () =>
    new DataSet({
      ...ListDS(),
    });
  const listDS = useDataSet(ds, StatementCreate);

  const [showMore, toggleShowMore] = useState(false);

  /**
   * table列
   * @returns
   */
  function columns() {
    return [
      { header: 'No.', width: 70, lock: 'left', renderer: ({ record }) => getSerialNum(record) },
      {
        name: 'attribute2',
        width: 150,
        tooltip: 'overflow',
        lock: 'left',
      },
      {
        name: 'attribute2-3',
        width: 180,
        tooltip: 'overflow',
        lock: 'left',
      },
      {
        name: 'attribute29',
        width: 200,
        tooltip: 'overflow',
        renderer: ({ value, record }) => {
          if (record.get('attribute40') === '1') {
            return (
              <span>
                <img src={qiIcon} alt="" style={{ marginRight: 6 }} />
                {value}
              </span>
            );
          }
          return value;
        },
      },
      // {
      //   name: 'attribute3',
      //   width: 150,
      //   tooltip: 'overflow',
      //   renderer: ({ value, record }) => {
      //     if (record.get('attribute41') === '1') {
      //       return (
      //         <span>
      //           <img src={qiIcon} alt="" style={{ marginRight: 6 }} />
      //           {value}
      //         </span>
      //       );
      //     }
      //     return value;
      //   },
      // },
      {
        name: 'attribute27',
        width: 100,
        tooltip: 'overflow',
        renderer: ({ record, value }) => (
          <span>
            {value} {record.get('attribute25')}
          </span>
        ),
      },
      {
        name: 'attribute28',
        width: 100,
        className: 'high-light',
        tooltip: 'overflow',
        renderer: ({ record, value }) => (
          <span>
            {value} {record.get('attribute25')}
          </span>
        ),
      },
      {
        name: 'attribute30',
        width: 100,
        className: 'high-light',
        tooltip: 'overflow',
        renderer: ({ record, value }) => (
          <span>
            {record.get('attribute32')} {value}
          </span>
        ),
      },
      {
        name: 'attribute31',
        width: 100,
        className: 'high-light',
        tooltip: 'overflow',
        renderer: ({ record, value }) => (
          <span>
            {record.get('attribute32')} {value}
          </span>
        ),
      },
      { name: 'attribute18', width: 100, tooltip: 'overflow' },
      { name: 'attribute20', width: 100, tooltip: 'overflow' },
    ];
  }

  function handleToggle() {
    toggleShowMore(!showMore);
  }

  /**
   *重置
   */
  async function handleReset() {
    listDS.queryDataSet.current.reset();
    await listDS.query();
    toggleShowMore(false);
  }

  /**
   *查询
   * @returns
   */
  async function handleSearch() {
    const validateValue = await listDS.validate(false, false);
    if (!validateValue) {
      return;
    }
    await listDS.query();
    toggleShowMore(false);
  }

  /**
   *生成对账单
   * @returns
   */
  async function handleGenerate() {
    if (!listDS.selected.length) {
      notification.warning({
        message: '请至少选择一条发货单',
      });
      return;
    }
    if (!listDS.selected.every((i) => i.data.attribute29 === listDS.selected[0].data.attribute29)) {
      notification.warning({
        message: '只能针对同一供应商生成对账单',
      });
      return;
    }
    if (!listDS.selected.every((i) => i.data.attribute3 === listDS.selected[0].data.attribute3)) {
      notification.warning({
        message: '只能针对同一客户生成对账单',
      });
      return;
    }
    if (!listDS.selected.every((i) => i.data.attribute3 === listDS.selected[0].data.attribute3)) {
      notification.warning({
        message: '只能针对同一种货币生成对账单',
      });
      return;
    }
    let attribute4 = 0;
    listDS.selected.forEach((i) => {
      attribute4 += Number(i.data.attribute31);
    });
    const date = new Date();
    const year = date.getFullYear();
    const month = date.getMonth() < 9 ? `0${date.getMonth() + 1}` : date.getMonth() + 1;
    const day = date.getDate() < 10 ? `0${date.getDate()}` : date.getDate();
    const random = Math.floor(Math.random() * 4000);
    const newOrder = `DZD${year}${month}${day}${random}`;

    const res = await generateStatementApi([
      {
        attribute1: newOrder,
        attribute2: listDS.selected[0].data.attribute29,
        attribute3: listDS.selected[0].data.attribute3,
        attribute5: '13%',
        attribute4,
        attribute6: listDS.selected[0].data.attribute32,
        attribute7: moment(date).format(DEFAULT_DATE_FORMAT),
        attribute9: '未对账',
        attribute10: '未对账',
        attribute11: '否',
        attribute13: listDS.selected[0].data.attribute40,
        attribute14: listDS.selected[0].data.attribute41,
      },
    ]);

    const data = [];
    listDS.selected.forEach((item) => {
      data.push({
        ...item.data,
        attribute37: newOrder,
      });
    });
    if (getResponse(res) && !res.failed) {
      notification.success();
      await updateStatementApi(data);
      await listDS.query();
    }
  }

  function handleCancel() {
    toggleShowMore(false);
  }

  return (
    <div className="lisp-statement-create">
      <Header title="对账单创建">
        <Button color="primary" onClick={handleSearch}>
          {intl.get('hzero.common.button.search').d('查询')}
        </Button>
        <Button onClick={handleReset}>{intl.get('hzero.common.button.reset').d('重置')}</Button>
        <span className="more-btn" onClick={handleToggle}>
          更多
          <Icon type="expand_more" />
        </span>
        <Lov dataSet={listDS.queryDataSet} name="attribute29" placeholder="选择供应商" noCache />
        <Lov dataSet={listDS.queryDataSet} name="attribute2" placeholder="选择发货单号" noCache />
      </Header>
      <div className="sub-header">
        <Button onClick={handleGenerate}>
          <img src={GenerateImg} alt="" />
          生成对账单
        </Button>
      </div>
      <div className="content">
        <Table
          dataSet={listDS}
          columns={columns()}
          border={false}
          columnResizable="true"
          editMode="inline"
          queryBar="none"
        />
      </div>
      <Sidebar
        title="筛选"
        className="lisp-statement-create-more-modal"
        visible={showMore}
        onCancel={handleCancel}
        cancelText="重置"
        okText="查询"
        width={560}
        closable
        footer={null}
        zIndex={999}
      >
        <Form className="form" dataSet={listDS.queryDataSet}>
          <Lov name="attribute2" noCache />
          <Lov name="attribute29" noCache />
          <DatePicker name="deliveryDateStart" />
          <DatePicker name="confirmDateStart" />
        </Form>
        <div className="foot-btn">
          <Button onClick={handleReset}>{intl.get('hzero.common.button.reset').d('重置')}</Button>
          <Button color="primary" onClick={handleSearch}>
            {intl.get('hzero.common.button.search').d('查询')}
          </Button>
        </div>
      </Sidebar>
    </div>
  );
};

export default formatterCollections({
  code: ['lisp.statementCreate', 'lisp.common'],
})(StatementCreate);
