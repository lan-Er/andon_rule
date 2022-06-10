/**
 * @Description: 销售订单管理信息--行表
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-01-10 14:18:08
 * @LastEditors: yu.na
 */

import React from 'react';
import {
  Lov,
  Select,
  TextField,
  NumberField,
  Button,
  Tabs,
  Table,
  Modal,
  Tooltip,
} from 'choerodon-ui/pro';
import notification from 'utils/notification';
import { isEmpty } from 'lodash';
import intl from 'utils/intl';
import { statusRender } from 'hlos-front/lib/utils/renderer';
import {
  cancelSoLine,
  closeSoLine,
  deleteSoLine,
  getItemCustomerAttributes,
} from '@/services/salesOrderService';

const preCode = 'lsop.salesOrder';
const { TabPane } = Tabs;

export default function LineList(props) {
  const { soLineList } = props.tableDS.children;

  const mainColumns = [
    { name: 'soLineNum', width: 70, lock: true },
    {
      name: 'itemObj',
      width: 144,
      lock: true,
      editor: (record) =>
        record.status === 'add' && isEditable(record) ? (
          <Lov noCache onChange={handleItemChange} />
        ) : null,
    },
    { name: 'itemDescription', width: 200 },
    { name: 'featureCode', width: 128 },
    { name: 'featureDesc', width: 200 },
    {
      name: 'uomObj',
      width: 70,
    },
    { name: 'demandQty', width: 100, editor: (record) => isEditable(record) },
    { name: 'demandDate', width: 128, editor: (record) => isEditable(record) },
    { name: 'promiseDate', width: 128, editor: (record) => isEditable(record) },
    {
      name: 'shipOrgObj',
      width: 144,
      editor: (record) => (record.status === 'add' && isEditable(record) ? <Lov noCache /> : null),
    },
    {
      name: 'soLineType',
      width: 84,
      editor: (record) => (record.status === 'add' && isEditable(record) ? <Select /> : null),
    },
    {
      name: 'soLineStatus',
      width: 84,
      renderer: ({ value, record }) => statusRender(value, record.data.soLineStatusMeaning),
    },
    { name: 'unitPrice', width: 100, editor: (record) => isEditable(record) },
    { name: 'lineAmount', width: 100, editor: (record) => isEditable(record) },
    { name: 'customerItemCode', width: 144, editor: (record) => isEditable(record) },
    { name: 'customerItemDesc', width: 200, editor: (record) => isEditable(record) },
    { name: 'customerPo', width: 144, editor: (record) => isEditable(record) && !props.customerPo },
    {
      name: 'customerPoLine',
      width: 82,
      editor: (record) => isEditable(record) && !props.customerPoLine,
    },
    {
      name: 'secondUomObj',
      width: 70,
    },
    {
      name: 'secondDemandQty',
      width: 100,
      editor: (record) => isEditable(record) && !isEmpty(record.get('secondUomObj')),
    },
    {
      name: 'itemCategoryObj',
      width: 144,
      editor: (record) => isEditable(record) && <Lov noCache />,
    },
    {
      name: 'sourceDocTypeObj',
      width: 144,
      editor: (record) => (record.status === 'add' && isEditable(record) ? <Lov noCache /> : null),
    },
    {
      name: 'sourceDocObj',
      width: 144,
      editor: (record) => (record.status === 'add' && isEditable(record) ? <Lov noCache /> : null),
    },
    {
      name: 'sourceDocLineObj',
      width: 82,
      editor: (record) => (record.status === 'add' && isEditable(record) ? <Lov noCache /> : null),
    },
    {
      name: 'externalId',
      width: 144,
      editor: (record) => (record.status === 'add' && isEditable(record) ? <NumberField /> : null),
    },
    {
      name: 'externalNum',
      width: 144,
      editor: (record) => (record.status === 'add' && isEditable(record) ? <TextField /> : null),
    },
    { name: 'lineRemark', width: 200, editor: (record) => isEditable(record) },
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
  const shipColumns = [
    { name: 'soLineNum', width: 70, lock: true },
    { name: 'itemCode', width: 144, lock: true },
    { name: 'demandQty', width: 82 },
    { name: 'shippedQty', width: 82 },
    { name: 'returnedQty', width: 82 },
    { name: 'demandDate', width: 100 },
    { name: 'promiseDate', width: 100 },
    { name: 'planShipDate', width: 128, editor: (record) => isEditable(record) },
    { name: 'applyShipDate', width: 128, editor: (record) => isEditable(record) },
    { name: 'lastShippedDate', width: 100 },
    { name: 'warehouseObj', width: 144, editor: (record) => isEditable(record) && <Lov noCache /> },
    { name: 'wmAreaObj', width: 144, editor: (record) => isEditable(record) && <Lov noCache /> },
    {
      name: 'shipSiteObj',
      width: 144,
      editor: (record) => (record.status === 'add' && isEditable(record) ? <Lov noCache /> : null),
    },
    { name: 'customerReceiveOrg', width: 144, editor: (record) => isEditable(record) },
    { name: 'customerReceiveWm', width: 144, editor: (record) => isEditable(record) },
    { name: 'customerInventoryWm', width: 144, editor: (record) => isEditable(record) },
    { name: 'customerReceiveType', width: 144, editor: (record) => isEditable(record) },
    { name: 'shippingMethod', width: 100, editor: (record) => isEditable(record) },
    { name: 'shipRuleObj', width: 144, editor: (record) => isEditable(record) && <Lov noCache /> },
    {
      name: 'packingRuleObj',
      width: 144,
      editor: (record) => isEditable(record) && <Lov noCache />,
    },
    { name: 'packingFormat', width: 144, editor: (record) => isEditable(record) },
    { name: 'packingMaterial', width: 144, editor: (record) => isEditable(record) },
    { name: 'minPackingQty', width: 100, editor: (record) => isEditable(record) },
    { name: 'packingQty', width: 100, editor: (record) => isEditable(record) },
    { name: 'containerQty', width: 100, editor: (record) => isEditable(record) },
    { name: 'palletContainerQty', width: 100, editor: (record) => isEditable(record) },
    { name: 'packageNum', width: 144, editor: (record) => isEditable(record) },
    { name: 'tagTemplate', width: 144, editor: (record) => isEditable(record) },
    { name: 'lotNumber', width: 144, editor: (record) => isEditable(record) },
    { name: 'tagCode', width: 144, editor: (record) => isEditable(record) },
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

  const params = {
    dataSet: props.tableDS.children.soLineList,
    border: false,
    columnResizable: true,
  };

  /**
   * 取消当前对象操作
   * @param {json} record 当前对象
   */
  function removeData(record) {
    if (record.toData().soLineId) {
      soLineList.current.reset();
    } else {
      record.set('lineAmount', 0);
      soLineList.remove(record);
    }
  }

  /**
   *tab数组
   * @returns
   */
  function tabsArr() {
    return [
      { code: 'main', title: '主要', component: <Table {...params} columns={mainColumns} /> },
      { code: 'ship', title: '发运', component: <Table {...params} columns={shipColumns} /> },
    ];
  }

  /**
   * 监听物料Lov字段变化
   * @param record 选中行信息
   */
  async function handleItemChange(record) {
    soLineList.current.reset();
    if (record) {
      // 102820560007
      const res = await getItemCustomerAttributes({
        itemId: record.itemId,
        sopOuId: props.tableDS.current.get('sopOuId'),
        customerId: props.tableDS.current.get('customerId'),
        customerSiteId: props.tableDS.current.get('customerSiteId'),
      });
      if (res && !res.failed) {
        const {
          unitPrice,
          customerItemCode,
          customerItemDesc,
          sopCategoryId,
          sopCategoryName,
          organizationId,
          organizationName,
          shipWarehouseId,
          shipWarehouseName,
          shipWmAreaId,
          shipWmAreaName,
          shippingMethod,
          shipRuleId,
          shipRule,
          shipRuleName,
          packingRuleId,
          packingRule,
          packingRuleName,
          packingFormat,
          packingMaterial,
          minPackingQty,
          packingQty,
          containerQty,
          palletContainerQty,
          tagTemplate,
        } = res;
        soLineList.current.set('unitPrice', unitPrice);
        soLineList.current.set('customerItemCode', customerItemCode);
        soLineList.current.set('customerItemDesc', customerItemDesc);
        if (sopCategoryId) {
          soLineList.current.set('itemCategoryObj', {
            categoryId: sopCategoryId,
            categoryName: sopCategoryName,
          });
        }
        if (organizationId) {
          soLineList.current.set('shipOrgObj', {
            organizationId,
            organizationName,
          });
        }
        if (shipWarehouseId) {
          soLineList.current.set('warehouseObj', {
            warehouseId: shipWarehouseId,
            warehouseName: shipWarehouseName,
          });
        }
        if (shipWmAreaId) {
          soLineList.current.set('wmAreaObj', {
            wmAreaId: shipWmAreaId,
            wmAreaName: shipWmAreaName,
          });
        }
        soLineList.current.set('shippingMethod', shippingMethod);
        if (shipRuleId) {
          soLineList.current.set('shipRuleObj', {
            ruleId: shipRuleId,
            ruleJson: shipRule,
            ruleName: shipRuleName,
          });
        }
        if (packingRuleId) {
          soLineList.current.set('packingRuleObj', {
            ruleId: packingRuleId,
            ruleJson: packingRule,
            ruleName: packingRuleName,
          });
        }
        soLineList.current.set('packingFormat', packingFormat);
        soLineList.current.set('packingMaterial', packingMaterial);
        soLineList.current.set('minPackingQty', minPackingQty);
        soLineList.current.set('packingQty', packingQty);
        soLineList.current.set('containerQty', containerQty);
        soLineList.current.set('palletContainerQty', palletContainerQty);
        soLineList.current.set('tagTemplate', tagTemplate);
      }
      soLineList.current.set('itemObj', {
        itemId: record.itemId,
        itemCode: record.itemCode,
        description: record.description,
      });
      soLineList.current.set('uomObj', {
        uomId: record.uomId,
        uomCode: record.uom,
        uomName: record.uomName,
      });
      soLineList.current.set('secondUomObj', {
        uomId: record.secondUomId,
        uomCode: record.secondUom,
        uomName: record.secondUomName,
      });
      soLineList.current.set('shipOrgObj', {
        organizationId: record.meOuId,
        organizationCode: record.meOuCode,
        organizationName: record.meOuName,
      });
      soLineList.current.set('itemCategoryObj', {
        categoryId: record.sopCategoryId,
        categoryName: record.sopCategoryName,
      });
      soLineList.current.set('featureCode', record.featureCode);
      soLineList.current.set('featureDesc', record.featureDesc);
    } else {
      soLineList.current.set('itemObj', null);
      soLineList.current.set('uomObj', null);
      soLineList.current.set('secondUomObj', null);
      soLineList.current.set('shipOrgObj', null);
      soLineList.current.set('itemCategoryObj', null);
      soLineList.current.set('unitPrice', null);
      soLineList.current.set('customerItemCode', null);
      soLineList.current.set('customerItemDesc', null);
      soLineList.current.set('itemCategoryObj', null);
      soLineList.current.set('shipOrgObj', null);
      soLineList.current.set('warehouseObj', null);
      soLineList.current.set('wmAreaObj', null);
      soLineList.current.set('shippingMethod', null);
      soLineList.current.set('shipRuleObj', null);
      soLineList.current.set('packingRuleObj', null);
      soLineList.current.set('packingFormat', null);
      soLineList.current.set('packingMaterial', null);
      soLineList.current.set('minPackingQty', null);
      soLineList.current.set('packingQty', null);
      soLineList.current.set('containerQty', null);
      soLineList.current.set('palletContainerQty', null);
      soLineList.current.set('tagTemplate', null);
    }
  }

  /**
   * 字段是否可编辑
   * @param record 行信息
   */
  function isEditable(record) {
    if (
      record.data.soLineStatus !== 'APPROVING' &&
      record.data.soLineStatus !== 'CLOSED' &&
      record.data.soLineStatus !== 'CANCELLED' &&
      record.data.soLineStatus !== 'REFUSED'
    ) {
      return true;
    }
    return false;
  }

  /**
   *新增
   */
  function handleAddLine() {
    let maxNum = 0;
    if (soLineList.data.length) {
      const numList = soLineList.data.map((o) => o.data.soLineNum);
      maxNum = Math.max(...numList);
    }
    soLineList.create(
      {
        soLineNum: maxNum + 1,
        customerPo: props.customerPo || null,
        customerPoLine: props.customerPoLine || null,
      },
      0
    );
  }

  /**
   *删除
   */
  async function handleDelete() {
    const { selected } = soLineList;
    if (!selected.length) {
      notification.error({
        message: intl.get(`hzero.common.message.validation.atLeast`).d('请至少选择一条数据'),
      });
      return;
    }
    if (!selected.filter((item) => item.data.soLineStatus === 'NEW').length) {
      notification.error({
        message: intl
          .get(`${preCode}.view.message.delLineLimit`)
          .d('只有新增状态的销售订单行)才允许删除！'),
      });
    }
    const amountArr = selected.map(
      (item) => item.data.soLineStatus !== 'CANCELLED' && item.data.lineAmount
    );
    const amount = amountArr.filter((item) => item).reduce((a, b) => a + b, 0);
    const currentAmount = props.tableDS.current.data.totalAmount - amount;
    Modal.confirm({
      children: <p>{intl.get(`${preCode}.view.message.delSoLine`).d('是否删除销售订单行？')}</p>,
      onOk: () =>
        deleteSoLine({
          soLineList: selected.map((item) => item.toJSONData()),
          soHeader: {
            ...props.tableDS.current.toJSONData(),
            totalAmount: currentAmount,
          },
        }).then(async (res) => {
          if (!isEmpty(res) && res.failed && res.message) {
            notification.error({
              message: res.message,
            });
            return;
          }
          await props.tableDS.query();
        }),
    });
  }

  /**
   *取消
   */
  function handleCancel() {
    const { selected } = soLineList;
    if (!selected.length) {
      notification.error({
        message: intl.get(`hzero.common.message.validation.atLeast`).d('请至少选择一条数据'),
      });
      return;
    }
    if (
      selected.filter(
        (item) =>
          item.data.soLineStatus === 'NEW' ||
          item.data.soLineStatus === 'APPROVING' ||
          item.data.soLineStatus === 'RELEASED'
      ).length
    ) {
      const soLineIds = selected.map((item) => item.data.soLineId);
      const amountArr = selected.map(
        (item) => item.data.soLineStatus !== 'CANCELLED' && item.data.lineAmount
      );
      const amount = amountArr.filter((item) => item).reduce((a, b) => a + b, 0);
      const currentAmount = props.tableDS.current.data.totalAmount - amount;
      Modal.confirm({
        children: (
          <p>{intl.get(`${preCode}.view.message.cancelSoLine`).d('是否取消销售订单行？')}</p>
        ),
        onOk: () =>
          cancelSoLine({
            soLineIds,
            soHeader: {
              ...props.tableDS.current.toJSONData(),
              totalAmount: currentAmount,
            },
          }).then(async (res) => {
            if (!isEmpty(res) && res.failed && res.message) {
              notification.error({
                message: res.message,
              });
              return;
            }
            await props.tableDS.query();
          }),
      });
    } else {
      notification.error({
        message: intl
          .get(`${preCode}.view.message.cancelLineLimit`)
          .d('只有新增、审批中、已提交状态的销售订单行才允许取消！'),
      });
    }
  }

  /**
   *关闭
   */
  function handleClose() {
    const { selected } = soLineList;
    if (!selected.length) {
      notification.error({
        message: intl.get(`hzero.common.message.validation.atLeast`).d('请至少选择一条数据'),
      });
      return;
    }
    if (
      selected.filter(
        (item) => item.data.soLineStatus === 'CANCELLED' || item.data.soLineStatus === 'CLOSED'
      ).length !== selected.length
    ) {
      const ids = selected.map((item) => item.data.soLineId);
      Modal.confirm({
        children: (
          <p>{intl.get(`${preCode}.view.message.closeSoLine`).d('是否关闭销售订单行？')}</p>
        ),
        onOk: () =>
          closeSoLine(ids).then(async (res) => {
            if (!isEmpty(res) && res.failed && res.message) {
              notification.error({
                message: res.message,
              });
              return;
            }
            await props.tableDS.query();
          }),
      });
    } else {
      notification.error({
        message: intl
          .get(`${preCode}.view.message.closeLineLimit`)
          .d('已取消、已关闭状态的销售订单行不允许关闭！'),
      });
    }
  }

  return (
    <>
      <Button
        key="playlist_add"
        icon="playlist_add"
        funcType="flat"
        color="primary"
        onClick={handleAddLine}
        disabled={props.allDisabled}
      >
        {intl.get('hzero.common.button.add').d('新增')}
      </Button>
      <Button
        key="delete"
        icon="delete"
        funcType="flat"
        color="primary"
        onClick={handleDelete}
        disabled={props.isCreate || props.allDisabled}
      >
        {intl.get('hzero.common.button.delete').d('删除')}
      </Button>
      <Button
        key="cancel"
        icon="cancel"
        funcType="flat"
        color="primary"
        onClick={handleCancel}
        disabled={props.isCreate || props.allDisabled}
      >
        {intl.get('hzero.common.button.cancel').d('取消')}
      </Button>
      <Button
        key="close"
        icon="close"
        funcType="flat"
        color="primary"
        onClick={handleClose}
        disabled={props.isCreate || props.allDisabled}
      >
        {intl.get('hzero.common.button.close').d('关闭')}
      </Button>
      <Tabs animated={{ inkBar: true, tabPane: false }} defaultActiveKey="main">
        {tabsArr().map((tab) => (
          <TabPane tab={intl.get(`${preCode}.view.title.${tab.code}`).d(tab.title)} key={tab.code}>
            {tab.component}
          </TabPane>
        ))}
      </Tabs>
    </>
  );
}
