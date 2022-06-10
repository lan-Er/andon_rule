/*
 * @Author: zhang yang
 * @Description: 采购订单
 * @E-mail: yang.zhang14@hand-china.com
 * @Date: 2020-01-07 18:28:49
 */
import React, { useState, Fragment } from 'react';
import { Table, Tooltip, Button, Lov, Select, TextField } from 'choerodon-ui/pro';
import { Tabs, Modal } from 'choerodon-ui';
import { isEmpty } from 'lodash';
import notification from 'utils/notification';
import intl from 'utils/intl';
import { statusRender } from 'hlos-front/lib/utils/renderer';

import { deletePoLineAPI, cancelPoLineAPI, closePoLineAPI } from '../../../services/posService';

const preCode = 'lscm.pos';
const { TabPane } = Tabs;

function LineList(props) {
  const { lineList } = props.tableDS.children;
  const [editorForOrg, changeForOrg] = useState(true);

  /**
   * 取消当前对象操作
   * @param {json} record 当前对象
   */
  function removeData(record) {
    if (record.toData().poLineId) {
      lineList.current.reset();
    } else {
      record.set('lineAmount', 0);
      lineList.remove(record);
    }
  }

  /**
   * 指定状态可修改。
   */
  function isEditor(record) {
    if (
      record.data.poLineStatus !== 'APPROVING' &&
      record.data.poLineStatus !== 'CLOSED' &&
      record.data.poLineStatus !== 'CANCELLED' &&
      record.data.poLineStatus !== 'REFUSED'
    ) {
      return true;
    }
    return false;
  }

  function mainColumns() {
    return [
      { name: 'poLineNum', editor: false, width: 70, lock: true },
      {
        name: 'receiveOrgObj',
        editor: (record) => (record.status === 'add' && editorForOrg ? <Lov noCache /> : null),
        width: 128,
        lock: true,
      },
      {
        name: 'itemObj',
        editor: (record) =>
          record.status === 'add' ? (
            <Lov noCache onChange={(rec) => props.onLineItemChange(rec, record)} />
          ) : null,
        width: 144,
        lock: true,
      },
      { name: 'itemDescription', editor: false, width: 200 },
      {
        name: 'uomObj',
        // editor: (record) => (record.status === 'add' ? <Lov noCache /> : null),
        width: 70,
      },
      { name: 'demandQty', width: 100, editor: (record) => isEditor(record) },
      { name: 'demandDate', width: 128, editor: (record) => isEditor(record) },
      { name: 'promiseDate', width: 128, editor: (record) => isEditor(record) },
      {
        name: 'receiveRule',
        editor: (record) => (record.status === 'add' ? <Select /> : null),
        width: 100,
      },
      {
        name: 'poLineStatusMeaning',
        width: 84,
        align: 'center',
        renderer: ({ value, record }) => {
          if (value) {
            return statusRender(record.data.poLineStatus, value);
          } else {
            const myValue = record.data.poLineStatus === 'NEW' ? '新建' : '';
            return statusRender(record.data.poLineStatus, myValue);
          }
        },
      },
      { name: 'unitPrice', width: 100, editor: (record) => isEditor(record) },
      { name: 'lineAmount', width: 100, editor: (record) => isEditor(record) },
      { name: 'receiveToleranceType', width: 100, editor: (record) => isEditor(record) },
      { name: 'receiveTolerance', width: 82, editor: (record) => isEditor(record) },
      { name: 'receiveWarehouseObj', width: 144, editor: (record) => isEditor(record) },
      { name: 'receiveWmAreaObj', width: 144, editor: (record) => isEditor(record) },
      { name: 'inventoryWarehouseObj', width: 144, editor: (record) => isEditor(record) },
      { name: 'inventoryWmAreaObj', width: 144, editor: (record) => isEditor(record) },
      { name: 'projectNum', width: 128, editor: (record) => isEditor(record) },
      { name: 'secondUomName', width: 80 },
      { name: 'secondDemandQty', width: 100, editor: (record) => isEditor(record) },
      { name: 'supplierItemCode', width: 128, editor: (record) => isEditor(record) },
      { name: 'supplierItemDesc', width: 200, editor: (record) => isEditor(record) },
      { name: 'itemCategoryObj', width: 128, editor: (record) => isEditor(record) },
      { name: 'lineRemark', width: 200, editor: (record) => isEditor(record) },
      {
        header: intl.get('hzero.common.button.action').d('操作'),
        width: 70,
        command: ({ record }) => {
          return [
            <Tooltip placement="bottom" title={intl.get('hzero.common.button.cancel').d('取消')}>
              <Button
                icon="cancle_a"
                color="primary"
                funcType="flat"
                onClick={() => removeData(record)}
              />
            </Tooltip>,
          ];
        },
        lock: 'right',
      },
    ];
  }
  function getColumns() {
    return [
      { name: 'poLineNum', editor: false, width: 70, lock: true },
      {
        name: 'receiveOrgObj',
        editor: (record) => (record.status === 'add' && editorForOrg ? <Lov noCache /> : null),
        width: 128,
        lock: true,
      },
      {
        name: 'itemObj',
        editor: (record) =>
          record.status === 'add' ? <Lov noCache onChange={props.onLineItemChange} /> : null,
        width: 128,
        lock: true,
      },
      { name: 'demandQty', editor: false, width: 82 },
      { name: 'receivedQty', editor: false, width: 82 },
      { name: 'inventoryQty', editor: false, width: 82 },
      { name: 'qcNgQty', editor: false, width: 82 },
      { name: 'returnedQty', editor: false, width: 82 },
      { name: 'receiveWarehouseObj', editor: false, width: 128 },
      { name: 'receiveWmAreaObj', editor: false, width: 128 },
      { name: 'inventoryWarehouseObj', editor: false, width: 128 },
      { name: 'inventoryWmAreaObj', editor: false, width: 128 },
      {
        header: intl.get('hzero.common.button.action').d('操作'),
        width: 70,
        command: ({ record }) => {
          return [
            <Tooltip placement="bottom" title={intl.get('hzero.common.button.cancel').d('取消')}>
              <Button
                icon="cancle_a"
                color="primary"
                funcType="flat"
                onClick={() => removeData(record)}
              />
            </Tooltip>,
          ];
        },
        lock: 'right',
      },
    ];
  }
  function otherColumns() {
    return [
      { name: 'poLineNum', editor: false, width: 70, lock: true },
      {
        name: 'receiveOrgObj',
        editor: (record) => (record.status === 'add' && editorForOrg ? <Lov noCache /> : null),
        width: 128,
        lock: true,
      },
      {
        name: 'itemObj',
        editor: (record) =>
          record.status === 'add' ? <Lov noCache onChange={props.onLineItemChange} /> : null,
        width: 128,
        lock: true,
      },
      { name: 'lotNumber', width: 144, editor: (record) => isEditor(record) },
      { name: 'tagCode', width: 144, editor: (record) => isEditor(record) },
      { name: 'packageNum', width: 144, editor: (record) => isEditor(record) },
      {
        name: 'moNumObj',
        editor: (record) => (record.status === 'add' ? <Lov noCache /> : null),
        width: 144,
      },
      {
        name: 'moOperationObj',
        editor: (record) => (record.status === 'add' ? <Lov noCache /> : null),
        width: 144,
      },
      {
        name: 'relatedItemCodeObj',
        editor: (record) => (record.status === 'add' ? <Lov noCache /> : null),
        width: 144,
      },
      { name: 'relatedItemDesc', editor: false, width: 200 },
      {
        name: 'relatedUomObj',
        // editor: (record) => (record.status === 'add' ? <Lov noCache /> : null),
        width: 70,
      },
      { name: 'relatedDemandQty', width: 100, editor: (record) => isEditor(record) },
      {
        name: 'sourceDocTypeObj',
        editor: (record) => (record.status === 'add' ? <Lov noCache /> : null),
        width: 144,
      },
      {
        name: 'sourceDocNumObj',
        editor: (record) => (record.status === 'add' ? <Lov noCache /> : null),
        width: 144,
      },
      {
        name: 'sourceDocLineNumObj',
        editor: (record) => (record.status === 'add' ? <Lov noCache /> : null),
        width: 70,
      },
      {
        name: 'externalId',
        editor: (record) => (record.status === 'add' ? <TextField /> : null),
        width: 128,
      },
      {
        name: 'externalNum',
        editor: (record) => (record.status === 'add' ? <TextField /> : null),
        width: 144,
      },
      {
        header: intl.get('hzero.common.button.action').d('操作'),
        width: 70,
        command: ({ record }) => {
          return [
            <Tooltip placement="bottom" title={intl.get('hzero.common.button.cancel').d('取消')}>
              <Button
                icon="cancle_a"
                color="primary"
                funcType="flat"
                onClick={() => removeData(record)}
              />
            </Tooltip>,
          ];
        },
        lock: 'right',
      },
    ];
  }

  const tablePropsMain = {
    columns: mainColumns(),
    dataSet: lineList,
  };
  const tablePropsGet = {
    columns: getColumns(),
    dataSet: lineList,
  };
  const tablePropsOther = {
    columns: otherColumns(),
    dataSet: lineList,
  };

  /*
    设置新增初始组织
  */
  function getParOrg() {
    if (
      !isEmpty(props.tableDS.current.get('receiveOrgObj')) &&
      props.tableDS.current.get('receiveOrgObj').organizationId
    ) {
      const paeOrgObj = props.tableDS.current.get('receiveOrgObj');
      changeForOrg(false);
      return paeOrgObj;
    } else {
      changeForOrg(true);
      return null;
    }
  }
  /*
    设置新增初始值
  */
  function handleAddChildrenList() {
    const testData = props.tableDS.toData();
    const statusFlag = testData[0].poStatus;
    if (
      statusFlag === 'CANCELLED' ||
      statusFlag === 'CLOSED' ||
      statusFlag === 'APPROVING' ||
      statusFlag === 'REFUSED'
    ) {
      return notification.warning({
        message: '警告',
        description: intl.get(`${preCode}.msg.disableNew`).d('当前订单状态不可新建数据'),
      });
    }
    lineList.create(
      {
        poLineNum: lineList.data.length + 1,
        receiveOrgObj: getParOrg(),
      },
      0
    );
  }

  function handleTurnChange(key) {
    if (key === 'main') {
      this.keyList = 'main';
    }
    if (key === 'get') {
      this.keyList = 'get';
    }
    if (key === 'other') {
      this.keyList = 'other';
    }
  }

  /**
   * 删除
   */
  async function handleDelete() {
    const { selected } = lineList;
    if (selected.length) {
      if (selected.every((item) => item.toData().poLineStatus === 'NEW')) {
        Modal.confirm({
          title: intl.get(`${preCode}.msg.isDelete`).d('是否删除'),
          content: '',
          onOk() {
            // const amountArr = selected.map(
            //   (item) => item.data.soLineStatus !== 'CANCELLED' && item.data.lineAmount
            // );
            // const amount = amountArr.filter((item) => item).reduce((a, b) => a + b, 0);
            // const currentAmount = props.tableDS.current.data.totalAmount - amount;
            deletePoLineAPI(selected.map((item) => item.data.poLineId)).then((res) => {
              if (res && res.failed) {
                notification.error({
                  message: '错误',
                  description: intl.get(`${preCode}.msg.deleteError`).d('删除失败'),
                });
              } else {
                notification.success({
                  message: '成功',
                  description: intl.get(`${preCode}.msg.deleteSuccess`).d('删除成功'),
                });
                props.tableDS.query();
              }
            });
          },
          onCancel() {},
        });
      } else {
        notification.warning({
          message: '警告',
          description: intl.get(`${preCode}.msg.justNew`).d('只能删除新建状态的数据'),
        });
      }
    } else {
      notification.warning({
        message: '警告',
        description: intl.get(`${preCode}.msg.selectFirst`).d('请先选择一条数据'),
      });
    }
  }

  /**
   * 取消
   */
  async function handleCancel() {
    const { selected } = lineList;
    if (selected.length) {
      if (
        selected.every(
          (item) =>
            item.toData().poLineStatus === 'NEW' ||
            item.toData().poLineStatus === 'APPROVING' ||
            item.toData().poLineStatus === 'APPROVED'
        )
      ) {
        Modal.confirm({
          title: intl.get(`${preCode}.msg.isCancel`).d('是否取消'),
          content: '',
          onOk() {
            // const amountArr = selected.map(
            //   (item) => item.data.soLineStatus !== 'CANCELLED' && item.data.lineAmount
            // );
            // const amount = amountArr.filter((item) => item).reduce((a, b) => a + b, 0);
            // const currentAmount = props.tableDS.current.data.totalAmount - amount;
            cancelPoLineAPI(selected.map((item) => item.data.poLineId)).then((res) => {
              if (res && res.failed) {
                notification.error({
                  message: '错误',
                  description: intl.get(`${preCode}.msg.cancelError`).d('取消失败'),
                });
              } else {
                notification.success({
                  message: '成功',
                  description: intl.get(`${preCode}.msg.cancelSuccess`).d('取消成功'),
                });
                props.tableDS.query();
              }
            });
          },
          onCancel() {},
        });
      } else {
        notification.warning({
          message: '警告',
          description: intl.get(`${preCode}.msg.justCancel`).d('只能取消新建、审批状态的数据'),
        });
      }
    } else {
      notification.warning({
        message: '警告',
        description: intl.get(`${preCode}.msg.selectFirst`).d('请先选择一条数据'),
      });
    }
  }

  /**
   * 关闭
   */
  async function handleClose() {
    const { selected } = lineList;
    if (selected.length) {
      if (
        selected.every(
          (item) =>
            item.toData().poLineStatus === 'CANCELLED' || item.toData().poLineStatus === 'CLOSED'
        )
      ) {
        notification.warning({
          message: '警告',
          description: intl.get(`${preCode}.msg.justClose`).d('存在不允许关闭的数据'),
        });
      } else {
        Modal.confirm({
          title: intl.get(`${preCode}.msg.isClose`).d('是否关闭'),
          content: '',
          onOk() {
            const data = selected.map((item) => item.toData().poLineId);
            closePoLineAPI(data).then((res) => {
              if (res && res.failed) {
                notification.error({
                  message: '错误',
                  description: intl.get(`${preCode}.msg.closeError`).d('关闭失败'),
                });
              } else {
                notification.success({
                  message: '成功',
                  description: intl.get(`${preCode}.msg.closeSuccess`).d('关闭成功'),
                });
                props.tableDS.query();
              }
            });
          },
          onCancel() {},
        });
      }
    } else {
      notification.warning({
        message: '警告',
        description: intl.get(`${preCode}.msg.selectFirst`).d('请先选择一条数据'),
      });
    }
  }

  return (
    <Fragment key="purchaseOrdersDetailsLine">
      <Button
        icon="playlist_add"
        funcType="flat"
        color="primary"
        disabled={props.disableFlagx || props.disableFlagy}
        onClick={() => handleAddChildrenList()}
      >
        {intl.get('hzero.common.button.create').d('新增')}
      </Button>
      <Button
        onClick={handleDelete}
        icon="delete"
        funcType="flat"
        color="primary"
        disabled={props.comFlag}
      >
        {intl.get('hzero.common.button.delete').d('删除')}
      </Button>
      <Button
        onClick={handleCancel}
        icon="cancel"
        funcType="flat"
        color="primary"
        disabled={props.comFlag}
      >
        {intl.get('hzero.common.button.cancel').d('取消')}
      </Button>
      <Button
        onClick={handleClose}
        icon="close"
        funcType="flat"
        color="primary"
        disabled={props.comFlag}
      >
        {intl.get('hzero.common.button.close').d('关闭')}
      </Button>
      <Tabs
        animated={{ inkBar: true, tabPane: false }}
        defaultActiveKey="main"
        onChange={() => handleTurnChange()}
      >
        <TabPane tab={intl.get(`${preCode}.view.title.main`).d('主要')} key="main">
          <Table {...tablePropsMain} key="poLineId" />
        </TabPane>
        <Tabs.TabPane tab={intl.get(`${preCode}.view.title.get`).d('收货')} key="get">
          <Table {...tablePropsGet} key="poLineId" />
        </Tabs.TabPane>
        <Tabs.TabPane tab={intl.get(`${preCode}.view.title.other`).d('其它')} key="other">
          <Table {...tablePropsOther} key="poLineId" />
        </Tabs.TabPane>
      </Tabs>
    </Fragment>
  );
}

export default LineList;
