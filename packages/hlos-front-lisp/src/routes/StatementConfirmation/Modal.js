/**
 * @Description: 核企 对账单确认 - index
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-07-24  09:41:22
 * @LastEditors: yu.na
 */

import React from 'react';
import { Table, DatePicker, Lov, Form, Button } from 'choerodon-ui/pro';
import { Modal } from 'choerodon-ui';
import intl from 'utils/intl';
import { getSerialNum } from '@/utils/renderer';

import qiIcon from './assets/qi.svg';
import './style.less';

const DetailModal = ({ showFlag, onDetailClose, modalDS, onModalSearch, pageType }) => {
  /**
   * table列
   * @returns
   */
  function columns() {
    return [
      { header: 'No.', width: 50, lock: 'left', renderer: ({ record }) => getSerialNum(record) },
      {
        name: 'attribute2',
        width: 150,
        tooltip: 'overflow',
      },
      { name: 'attribute2-3', width: 170, tooltip: 'overflow' },
      {
        name: 'attribute29',
        width: 150,
        tooltip: 'overflow',
        hidden: pageType === 'supply',
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
      {
        name: 'attribute3',
        width: 150,
        tooltip: 'overflow',
        hidden: pageType === 'enterprise',
        renderer: ({ value, record }) => {
          if (record.get('attribute41') === '1') {
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
        width: 80,
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

  return (
    <Modal
      title="对账单明细"
      visible={showFlag}
      width={1291}
      className="lisp-statement-confirm-detail-modal"
      onCancel={onDetailClose}
      footer={null}
      zIndex={999}
    >
      <div
        style={{
          display: 'flex',
          marginBottom: 15,
          alignItems: 'center',
          padding: '9px 69px 0 19px',
        }}
      >
        <Form
          dataSet={modalDS.queryDataSet}
          labelLayout="placeholder"
          columns={4}
          style={{ flex: '1 1 auto' }}
        >
          <Lov name="attribute2" placeholder="选择发货单号" />
          <Lov name="attribute29" placeholder="选择供应商" />
          <DatePicker name="deliveryDateStart" placeholder={['发货日期开始', '发货日期结束']} />
          <DatePicker name="confirmDateStart" placeholder={['确认日期开始', '确认日期结束']} />
        </Form>
        <div style={{ marginLeft: 38, flexShrink: 0, display: 'flex', alignItems: 'center' }}>
          <Button
            onClick={() => {
              modalDS.current.reset();
            }}
          >
            {intl.get('hzero.common.button.reset').d('重置')}
          </Button>
          <Button color="primary" onClick={onModalSearch}>
            {intl.get('hzero.common.button.search').d('查询')}
          </Button>
        </div>
      </div>
      <Table
        dataSet={modalDS}
        columns={columns()}
        border={false}
        columnResizable="true"
        editMode="inline"
        queryBar="none"
      />
    </Modal>
  );
};

export default DetailModal;
