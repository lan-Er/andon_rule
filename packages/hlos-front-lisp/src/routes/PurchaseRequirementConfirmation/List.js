/*
 * @Description: 采购需求发布与确认
 * @Author: liangkun, <kun.liang01@hand-china.com>
 * @Date: 2020-07-24 10:57:01
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2020-08-04 14:16:34
 * @Copyright: Copyright (c) 2018, Hand
 */

import React, { Fragment, useState, useEffect } from 'react';
import { isEmpty } from 'lodash';
import { getCurrentUser } from 'utils/utils';
import notification from 'utils/notification';
import { Header, Content } from 'components/Page';
import { useDataSet } from 'hzero-front/lib/utils/hooks';
import { ExportButton } from 'hlos-front/lib/components';
import { Tabs, Table, Button, DataSet, Tooltip } from 'choerodon-ui/pro';

import { surnamesRender, getSerialNum } from '@/utils/renderer';
import { releasedDS, confirmedDS } from '@/stores/purchaseRequirementDS';

import styles from './index.less';

const tabsList = [
  {
    name: '已发布',
    value: 'released',
  },
  {
    name: '已确认',
    value: 'confirmed',
  },
];
const { TabPane } = Tabs;
const { loginName } = getCurrentUser();

const PurchaseRequirementConfirmation = (props) => {
  const todoReleasedListDataSetFactory = () =>
    new DataSet({
      ...releasedDS(),
    });
  const todoConfirmedListDataSetFactory = () =>
    new DataSet({
      ...confirmedDS(),
    });
  const releasedListDS = useDataSet(todoReleasedListDataSetFactory);
  const confirmedListDS = useDataSet(todoConfirmedListDataSetFactory);

  const [curTab, setCurTab] = useState('released');
  const [confirmLoading, setConfirmLoading] = useState(false);

  const { dispatch } = props;

  useEffect(() => {
    releasedListDS.query();
  }, []);

  /**
   * 已发布table列
   * @returns
   */
  function getReleasedColumns() {
    return [
      { header: 'No.', width: 70, lock: 'left', renderer: ({ record }) => getSerialNum(record) },
      { name: 'attribute6', lock: 'left' },
      { name: 'saleOrderNum', lock: 'left', tooltip: 'overflow' },
      { name: 'saleOrderLineNum', width: 130, tooltip: 'overflow' },
      { name: 'attribute8', tooltip: 'overflow', renderer: ({ value }) => surnamesRender(value) },
      {
        name: 'attribute1',
        tooltip: 'overflow',
        width: 130,
        renderer: ({ value }) => <span className={styles['text-wrap']}>{value}</span>,
      },
      { name: 'attribute2', tooltip: 'overflow', width: 130 },
      { name: 'attribute5', tooltip: 'overflow' },
      { name: 'attribute9', tooltip: 'overflow' },
      { name: 'attribute10', tooltip: 'overflow' },
      { name: 'attribute11', tooltip: 'overflow' },
      { name: 'attribute12', tooltip: 'overflow' },
      { name: 'attribute13', tooltip: 'overflow' },
      { name: 'attribute14', tooltip: 'overflow', width: 120 },
      {
        name: 'attribute15',
        tooltip: 'overflow',
        width: 150,
        renderer: ({ record, value }) => handleCellRender(value, record.get('attribute16')),
      },
      { name: 'attribute17', tooltip: 'overflow' },
      { name: 'attribute18', tooltip: 'overflow' },
      { name: 'attribute19', tooltip: 'overflow', width: 120 },
      {
        name: 'attribute20',
        tooltip: 'overflow',
        renderer: ({ record, value }) => (
          <span className={styles['text-wrap']}>{`${record.get('attribute10')} ${value}`}</span>
        ),
      },
      {
        name: 'attribute21',
        tooltip: 'overflow',
        width: 120,
        renderer: ({ record, value }) => (
          <span className={styles['text-wrap']}>{`${record.get('attribute10')} ${value}`}</span>
        ),
      },
      {
        name: 'attribute22',
        tooltip: 'overflow',
        width: 120,
        renderer: ({ value }) => (
          <span className={styles['text-wrap']} style={{ margin: 0 }}>
            {value}
          </span>
        ),
      },
      {
        name: 'attribute23',
        tooltip: 'overflow',
        width: 120,
        renderer: ({ value }) => handlePreview(value),
      },
    ];
  }

  /**
   * 已发布table列
   * @returns
   */
  function getConfirmedColumns() {
    return [
      { header: 'No.', width: 70, lock: 'left', renderer: ({ record }) => getSerialNum(record) },
      { name: 'attribute1', lock: 'left' },
      { name: 'attribute5', width: 130, lock: 'left', tooltip: 'overflow' },
      { name: 'attribute6', width: 130, tooltip: 'overflow' },
      { name: 'attribute7', tooltip: 'overflow', renderer: ({ value }) => surnamesRender(value) },
      {
        name: 'attribute3',
        tooltip: 'overflow',
        width: 130,
        renderer: ({ value }) => <span className={styles['text-wrap']}>{value}</span>,
      },
      { name: 'attribute28', tooltip: 'overflow', width: 130 },
      { name: 'attribute30', tooltip: 'overflow' },
      { name: 'attribute25', tooltip: 'overflow' },
      { name: 'attribute20', tooltip: 'overflow' },
      { name: 'attribute22', tooltip: 'overflow' },
      { name: 'attribute23', tooltip: 'overflow' },
      { name: 'attribute24', tooltip: 'overflow' },
      { name: 'attribute29', tooltip: 'overflow', width: 130 },
      {
        name: 'attribute11',
        tooltip: 'overflow',
        width: 150,
        renderer: ({ record, value }) => handleCellRender(value, record.get('attribute12')),
      },
      { name: 'attribute13', tooltip: 'overflow' },
      { name: 'attribute14', tooltip: 'overflow' },
      { name: 'attribute17', tooltip: 'overflow', width: 120 },
      {
        name: 'attribute15',
        tooltip: 'overflow',
        renderer: ({ record, value }) => (
          <span className={styles['text-wrap']}>{`${record.get('attribute20')} ${value}`}</span>
        ),
      },
      {
        name: 'attribute21',
        tooltip: 'overflow',
        width: 120,
        renderer: ({ record, value }) => (
          <span className={styles['text-wrap']}>{`${record.get('attribute20')} ${value}`}</span>
        ),
      },
      {
        name: 'attribute26',
        tooltip: 'overflow',
        width: 120,
        renderer: ({ value }) => <span className={styles['text-wrap']}>{value}</span>,
      },
      {
        name: 'attribute27',
        tooltip: 'overflow',
        width: 120,
        renderer: ({ value }) => handlePreview(value),
      },
    ];
  }

  /**
   * 图纸预览列表
   * @param {*} record 当前行记录
   */
  function handlePreview(fileList) {
    if (isEmpty(fileList)) return fileList;
    const links = fileList.split(';').map((item) => {
      return (
        <>
          <a href={item} target="_blank" rel="noopener noreferrer" style={{ margin: '3px 10px' }}>
            {item.split('@').pop()}
          </a>
          <br />
        </>
      );
    });
    return (
      <Tooltip title={links}>
        <span className={styles['text-wrap']}>
          <a>查看附件</a>
        </span>
      </Tooltip>
    );
  }

  /**
   * 换行内容渲染
   * @param {*} record 当前行记录
   */
  function handleCellRender(upValue, downValue) {
    return (
      <>
        <span className={styles['text-wrap']}>{upValue}</span>
        <br />
        <span className={`${styles['down-font']} ${styles['text-wrap']}`}>{downValue}</span>
      </>
    );
  }

  /**
   * 确认订单
   */
  function handleConfirm() {
    setConfirmLoading(true);
    return new Promise((resolve) => {
      const { selected } = releasedListDS;
      if (isEmpty(selected)) {
        notification.warning({
          message: '请先选择具体采购订单',
        });
        resolve(setConfirmLoading(false));
        return false;
      }
      const confirmData = selected.map((item) => {
        const {
          attribute6,
          attribute8,
          attribute1,
          attribute2,
          attribute5,
          attribute9,
          attribute10,
          attribute11,
          attribute12,
          attribute13,
          attribute14,
          attribute15,
          attribute16,
          attribute17,
          attribute18,
          attribute19,
          attribute20,
          attribute21,
          attribute22,
          attribute23,
        } = item.toData();
        return {
          attribute1: attribute6,
          attribute5: `S${attribute2.slice(1)}`,
          attribute6: attribute14,
          attribute7: attribute8,
          attribute3: attribute1,
          attribute28: attribute2,
          attribute30: attribute5,
          attribute25: attribute9,
          attribute20: attribute10,
          attribute22: attribute11,
          attribute23: attribute12,
          attribute24: attribute13,
          attribute29: attribute14,
          attribute11: attribute15,
          attribute12: attribute16,
          attribute13: attribute17,
          attribute14: attribute18,
          attribute17: attribute19,
          attribute15: attribute20,
          attribute21,
          attribute26: attribute22,
          attribute27: attribute23,
          functionType: 'SUPPLIER_CHAIN',
          dataType: 'SALE_ORDER',
          user: loginName,
        };
      });
      dispatch({
        type: 'purchaseRequirementModel/createSo',
        payload: confirmData,
      }).then((res) => {
        if (res && !res.failed && Array.isArray(res)) {
          const soData = selected.map((item) => {
            return {
              ...item.toData(),
              functionType: 'SUPPLIER_CHAIN',
              dataType: 'PURCHASE_ORDER',
              attribute4: '已确认',
            };
          });
          dispatch({
            type: 'purchaseRequirementModel/confirm',
            payload: soData,
          }).then((response) => {
            if (response && !response.failed) {
              notification.warning({
                message: '操作成功',
              });
              // releasedListDS.query();
              handleTabChange('confirmed');
            }
            resolve(setConfirmLoading(false));
          });
          return;
        }
        resolve(setConfirmLoading(false));
      });
    });
  }

  /**
   * 页签切换查询
   * @param {string} key 页签标识
   */
  function handleTabChange(key) {
    setCurTab(key);
    if (key === 'released') {
      releasedListDS.query();
    } else {
      confirmedListDS.query();
    }
  }

  return (
    <Fragment>
      <Header title="采购需求确认">
        <Button
          onClick={() => handleConfirm()}
          loading={confirmLoading}
          color="primary"
          disabled={curTab === 'confirmed'}
        >
          确认订单
        </Button>
        <ExportButton reportCode={['LMES.MO']} exportTitle="采购需求确认导出" />
      </Header>
      <Content className={styles['lisp-purchase-requirement-confirmation']}>
        <Tabs activeKey={curTab} onChange={handleTabChange}>
          {tabsList.map((item) => (
            <TabPane tab={`${item.name}`} key={`${item.value}`} />
          ))}
        </Tabs>
        <Table
          dataSet={curTab === 'released' ? releasedListDS : confirmedListDS}
          columns={curTab === 'released' ? getReleasedColumns() : getConfirmedColumns()}
          border={false}
          columnResizable="true"
          editMode="inline"
          rowHeight="auto"
          style={{ height: 550 }}
        />
      </Content>
    </Fragment>
  );
};

export default PurchaseRequirementConfirmation;
