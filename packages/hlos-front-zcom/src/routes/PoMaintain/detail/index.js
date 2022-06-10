/*
 * @Descripttion: 采购订单列表-详情页（核企侧）
 * @version:
 * @Author: yin.lei@hand-china.com
 * @Date: 2021-04-14 15:57:16
 * @LastEditors: yin.lei@hand-china.com
 * @LastEditTime: 2021-04-14 16:02:58
 */

import React, { useState, useEffect, Fragment } from 'react';
import {
  DataSet,
  Button,
  Tabs,
  Table,
  Form,
  Select,
  TextField,
  Lov,
  DatePicker,
  TextArea,
} from 'choerodon-ui/pro';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import { getCurrentUser } from 'utils/utils';
import notification from 'utils/notification';
import formatterCollections from 'utils/intl/formatterCollections';
import { useDataSet, useDataSetEvent } from 'hzero-front/lib/utils/hooks';
import { WithCustomizeC7N as WithCustomize } from 'components/Customize';
import ItemAttributeSelect from '@/components/ItemAttributeSelect/index';
import { PoHeadDS, PoLineDS, PoOutsourceLineDS } from '../store/indexDS';
import styles from './index.less';

const { TabPane } = Tabs;
const intlPrefix = 'zcom.poMaintain';
const poHeadDS = () => new DataSet(PoHeadDS());
const poLineDS = () => new DataSet(PoLineDS());
const poOutsourceLineDS = () => new DataSet(PoOutsourceLineDS());

function ZcomPoMaintainDetail({
  match,
  location,
  history,
  dispatch,
  customizeForm,
  customizeTable,
}) {
  const HeadDS = useDataSet(poHeadDS, ZcomPoMaintainDetail);
  const LineDS = useDataSet(poLineDS);
  const OutsourceLineDS = useDataSet(poOutsourceLineDS);

  const { state } = location;
  const stateObj = state || {};
  const {
    params: { type, poId },
  } = match;

  const [canEdit, setCanEdit] = useState(true);
  const [canCancel, setCanCanCel] = useState(true);
  const [curTab, setCurTab] = useState('main');

  useEffect(() => {
    HeadDS.setQueryParameter('poId', null);
    LineDS.setQueryParameter('poId', null);
    OutsourceLineDS.setQueryParameter('poId', null);
    HeadDS.data = [];
    HeadDS.create();
    LineDS.data = [];
    LineDS.clearCachedSelected();
    OutsourceLineDS.data = [];
    OutsourceLineDS.clearCachedSelected();
    if (type === 'create') {
      const { realName } = getCurrentUser();
      HeadDS.current.set('createdByName', realName);
      HeadDS.current.set('poStatus', 'NEW');
    } else {
      setCanEdit(['NEW', 'REFUSED'].includes(stateObj.poStatus));
      setCanCanCel(['REFUSED', 'CONFIRMING', 'CONFIRMED'].includes(stateObj.poStatus));
      HeadDS.setQueryParameter('poId', poId);
      LineDS.setQueryParameter('poId', poId);
      OutsourceLineDS.setQueryParameter('poId', poId);
      handleSearch();
    }
  }, [poId]);

  function handleSearch() {
    HeadDS.query();
    LineDS.query();
  }

  useDataSetEvent(LineDS, 'submitSuccess', () => {
    HeadDS.query();
  });

  async function handleSave() {
    const validateHead = await HeadDS.current.validate(true, false);
    if (!validateHead) {
      notification.warning({
        message: '数据校验不通过',
      });
      return false;
    }
    const res = await HeadDS.submit();
    if (poId) {
      HeadDS.query();
    } else if (res && res.content.length) {
      const { poNum, poStatus } = res.content[0];
      const pathname = `/zcom/po-maintain/datail/${res.content[0]?.poId}`;
      history.push({
        pathname,
        state: {
          poNum,
          poStatus,
        },
      });
    }
  }

  async function handleSubmit() {
    return new Promise(async (resolve) => {
      const validateHead = await HeadDS.current.validate(true, false);
      if (!validateHead) {
        notification.warning({
          message: '数据校验不通过',
        });
        resolve();
        return false;
      }
      const { poSourceType, sourceDocNum } = HeadDS.current.toData();
      dispatch({
        type: 'poMaintain/poSubmit',
        payload: [
          {
            ...HeadDS.current.toData(),
            sourceDocNum: poSourceType !== 'EXTERNAL_SYSTEM' ? sourceDocNum : null,
            externalSourceDocNum: poSourceType === 'EXTERNAL_SYSTEM' ? sourceDocNum : null,
          },
        ],
      }).then((res) => {
        if (res && !res.failed) {
          notification.success({
            message: '提交成功',
          });
          const pathName = `/zcom/po-maintain`;
          history.push(pathName);
        }
        resolve();
      });
    });
  }

  function handleTabChange(key) {
    setCurTab(key);
    if (type !== 'create') {
      if (['main', 'receipt', 'other'].includes(key)) {
        LineDS.query();
      }
      if (key === 'outsource') {
        OutsourceLineDS.query();
      }
    }
  }

  function handleLineAdd() {
    const obj = {
      ...HeadDS.current.toData(),
    };
    const addObj = {
      poId: obj.poId,
      poNum: obj.poNum,
      poBusinessUnitId: obj.poBusinessUnitId,
      poBusinessUnitCode: obj.poBusinessUnitCode,
      poBusinessUnitName: obj.poBusinessUnitName,
      customerCompanyId: obj.customerCompanyId,
      poInventoryOrgId: obj.poInventoryOrgId,
      poInventoryOrgCode: obj.poInventoryOrgCode,
      poInventoryOrgName: obj.poInventoryOrgName,
      customerContacts: obj.customerContacts,
      customerContactsPhone: obj.customerContactsPhone,
      supplierContacts: obj.supplierContacts,
      supplierContactsPhone: obj.supplierContactsPhone,
      consigneeName: obj.consigneeName,
      consigneePhone: obj.consigneePhone,
      receivingAddress: obj.receivingAddress,
      currencyId: obj.currencyId,
      currencyCode: obj.currencyCode,
      taxId: obj.taxId,
      taxRate: obj.taxRate,
      poStatus: obj.poStatus,
    };
    if (curTab === 'main') {
      LineDS.create({
        ...addObj,
        poLineStatus: obj.poStatus,
      });
    }
    if (curTab === 'outsource') {
      OutsourceLineDS.create({
        ...addObj,
      });
    }
  }

  function handleLineDelete() {
    let ds;
    if (['main', 'receipt', 'other'].includes(curTab)) {
      ds = LineDS;
    }
    if (curTab === 'outsource') {
      ds = OutsourceLineDS;
    }
    if (!ds.selected.length) {
      notification.warning({
        message: intl.get(`zcom.common.message.validation.select`).d('至少选择一条数据'),
      });
      return;
    }
    ds.delete(ds.selected);
  }

  function handleLineCancel() {
    let ds;
    if (['main', 'receipt', 'other'].includes(curTab)) {
      ds = LineDS;
    }
    return new Promise(async (resolve) => {
      if (!ds.selected.length) {
        notification.warning({
          message: intl.get(`zcom.common.message.validation.select`).d('至少选择一条数据'),
        });
        resolve();
        return false;
      }
      let statusFlag = true;
      const arr = ds.selected.map((v) => {
        if (!['REFUSED', 'CONFIRMING', 'CONFIRMED'].includes(v.data.poLineStatus)) {
          statusFlag = false;
        }
        return {
          ...v.toData(),
          customerDemandDate: `${v.toData().customerDemandDate} 00:00:00`,
        };
      });
      if (!statusFlag) {
        notification.warning({
          message: intl
            .get(`zcom.common.message.validation.statusValidate`)
            .d('选中的订单行中有无法取消的订单行（新建/已取消/已完结），请检查后选择'),
        });
        resolve();
        return false;
      }
      dispatch({
        type: 'poMaintain/poLineCancel',
        payload: arr,
      }).then((res) => {
        if (res && !res.failed) {
          notification.success({
            message: '取消成功',
          });
          ds.query();
        }
        resolve();
      });
    });
  }

  function handleSure(obj) {
    let ds;
    if (curTab === 'outsource') {
      ds = OutsourceLineDS;
    } else {
      ds = LineDS;
    }
    ds.current.set('itemAttr', {
      ...ds.current.toData(),
      ...obj,
      itemId: ds.current.get('customerItemId'),
      itemCode: ds.current.get('customerItemCode'),
    });
  }

  const mainLineColumns = [
    { name: 'poLineNum', width: 60, lock: true },
    {
      name: 'poInventoryOrgObj',
      width: 150,
      editor: () => canEdit && !HeadDS.current.get('poInventoryOrgId'),
      lock: true,
    },
    {
      name: 'customerItemObj',
      width: 150,
      editor: (record) => canEdit && !record.get('poLineId'),
      lock: true,
    },
    { name: 'customerItemDesc', width: 150 },
    {
      name: 'itemAttr',
      width: 150,
      renderer: ({ record, value }) => {
        return (
          <ItemAttributeSelect
            data={value}
            handleSure={handleSure}
            ds={LineDS}
            itemId={record.get('customerItemId')}
            itemDesc={record.get('customerItemDesc')}
            disabled={!canEdit || !record.editing}
          />
        );
      },
    },
    { name: 'customerDemandQty', width: 100, align: 'left', editor: canEdit },
    { name: 'customerUomName', width: 80 },
    { name: 'customerPrice', width: 100, align: 'left', editor: canEdit },
    {
      name: 'customerDemandDate',
      width: 150,
      editor: canEdit ? <DatePicker min={new Date()} /> : null,
    },
    {
      name: 'taxRateObj',
      width: 90,
      editor: () => canEdit && !HeadDS.current.get('taxRate'),
    },
    { name: 'customerExTaxPrice', width: 100, align: 'left' },
    { name: 'amount', width: 120, align: 'left', minWidth: 120 },
    { name: 'toleranceType', width: 150, editor: canEdit },
    { name: 'customerToleranceValue', width: 150, editor: canEdit, align: 'left' },
    { name: 'poLineStatus', width: 100, lock: 'right' },
    {
      header: intl.get('hzero.common.button.action').d('操作'),
      width: 100,
      command: ({ record }) =>
        canEdit && ['NEW', 'REFUSED'].includes(record.get('poLineStatus')) ? ['edit'] : null,
      lock: 'right',
    },
  ];

  const receiptColumns = [
    { name: 'poLineNum', width: 60, lock: true },
    {
      name: 'poInventoryOrgObj',
      width: 150,
      editor: () => canEdit && !HeadDS.current.get('poInventoryOrgId'),
      lock: true,
    },
    {
      name: 'customerItemObj',
      width: 150,
      editor: (record) => canEdit && !record.get('poLineId'),
      lock: true,
    },
    { name: 'customerDemandQty', width: 100, editor: canEdit, align: 'left' },
    { name: 'consigneeName', width: 150, editor: canEdit },
    { name: 'consigneePhone', width: 150, editor: canEdit, align: 'left' },
    { name: 'receivingAddress', width: 150, editor: canEdit },
    { name: 'consignerName', width: 150 },
    { name: 'consignerPhone', width: 150 },
    { name: 'deliveryAddress', width: 150 },
    {
      name: 'supplierPromiseDate',
      width: 150,
      renderer: ({ value }) => {
        return <span>{value ? value.substring(0, 10) : ''}</span>;
      },
    },
    { name: 'customerDeliveryQty', width: 120 },
    { name: 'customerReceivedQty', width: 100 },
    { name: 'customerReturnedQty', width: 100 },
    {
      name: 'customerDqcQty',
      width: 120,
      editor: (record) => ['CONFIRMED', 'CLOSED'].includes(record.get('poLineStatus')),
      align: 'left',
    },
    { name: 'poLineStatus', width: 100, lock: 'right' },
    {
      header: intl.get('hzero.common.button.action').d('操作'),
      width: 100,
      command: ({ record }) =>
        ['NEW', 'REFUSED', 'CONFIRMED', 'CLOSED'].includes(record.get('poLineStatus'))
          ? ['edit']
          : null,
      lock: 'right',
    },
  ];

  const otherColumns = [
    { name: 'poLineNum', width: 60, lock: true },
    {
      name: 'poInventoryOrgObj',
      width: 150,
      editor: () => canEdit && !HeadDS.current.get('poInventoryOrgId'),
      lock: true,
    },
    {
      name: 'customerItemObj',
      width: 150,
      editor: (record) => canEdit && !record.get('poLineId'),
      lock: true,
    },
    { name: 'brand', width: 150, editor: canEdit },
    { name: 'specification', width: 150, editor: canEdit },
    { name: 'model', width: 150, editor: canEdit },
    { name: 'process', width: 150, editor: canEdit },
    { name: 'supplierItemCode', width: 150 },
    { name: 'supplierItemDesc', width: 150 },
    { name: 'poLineStatus', width: 100, lock: 'right' },
    {
      header: intl.get('hzero.common.button.action').d('操作'),
      width: 100,
      command: ({ record }) =>
        canEdit && ['NEW', 'REFUSED'].includes(record.get('poLineStatus')) ? ['edit'] : null,
      lock: 'right',
    },
  ];

  const outsourceColumns = [
    { name: 'poOutsourceNum', width: 60, lock: true },
    { name: 'customerItemObj', width: 150, editor: canEdit, lock: true },
    { name: 'customerItemDesc', width: 150 },
    {
      name: 'itemAttr',
      width: 150,
      renderer: ({ record, value }) => {
        return (
          <ItemAttributeSelect
            data={value}
            handleSure={handleSure}
            ds={OutsourceLineDS}
            itemId={record.get('customerItemId')}
            itemDesc={record.get('customerItemDesc')}
            disabled={!canEdit || !record.editing}
          />
        );
      },
    },
    { name: 'customerUomName', width: 80 },
    { name: 'customerPromiseQty', align: 'left', width: 100, editor: canEdit },
    { name: 'customerPromiseDate', width: 150, editor: canEdit },
    { name: 'outsrcType', width: 150, editor: canEdit },
    { name: 'outsrcSupplierObj', width: 150, editor: canEdit },
    { name: 'outsrcSupplierContacts', width: 150, editor: canEdit },
    { name: 'outsrcSupplierPhone', align: 'left', width: 150, editor: canEdit },
    { name: 'specification', width: 150, editor: canEdit },
    { name: 'model', width: 150, editor: canEdit },
    { name: 'remark', width: 150, editor: canEdit },
    { name: 'customerDeliveryQty', width: 100, lock: 'right' },
    { name: 'customerReceivedQty', width: 100, lock: 'right' },
    {
      header: intl.get('hzero.common.button.action').d('操作'),
      width: 100,
      command: canEdit ? ['edit'] : null,
      lock: 'right',
    },
  ];

  const addBtn = [
    <Button key="add" icon="add" color="primary" funcType="flat" onClick={handleLineAdd}>
      新增
    </Button>,
  ];

  const deleteBtn = [
    <Button key="delete" icon="delete" color="primary" funcType="flat" onClick={handleLineDelete}>
      删除
    </Button>,
  ];

  const cancelBtn = [
    <Button key="cancel" icon="cancel" color="primary" funcType="flat" onClick={handleLineCancel}>
      取消
    </Button>,
  ];

  function getBtns() {
    if (!poId) {
      return null;
    }
    if (['main', 'receipt', 'other'].includes(curTab)) {
      if (canEdit && canCancel) {
        if (curTab === 'main') {
          return cancelBtn.concat(deleteBtn).concat(addBtn);
        }
        return cancelBtn.concat(deleteBtn);
      }
      if (canEdit && !canCancel) {
        if (curTab === 'main') {
          return deleteBtn.concat(addBtn);
        }
        return deleteBtn;
      }
      if (!canEdit && canCancel) {
        return cancelBtn;
      }
      if (!canEdit && !canCancel) {
        return null;
      }
    }
    if (curTab === 'outsource') {
      if (canEdit) {
        return deleteBtn.concat(addBtn);
      }
      return null;
    }
  }

  return (
    <Fragment>
      <Header
        title={type === 'create' ? '新建采购订单' : '采购订单详情'}
        backPath="/zcom/po-maintain"
      >
        {canEdit && (
          <>
            <Button onClick={handleSubmit} disabled={!poId} color="primary">
              提交
            </Button>
            <Button onClick={handleSave}>保存</Button>
          </>
        )}
      </Header>
      <Content className={styles['zcom-po-maintain-content']}>
        {customizeForm(
          {
            code: 'ZCOM_PO.HEAD.FORM', // 必传，和unitCode一一对应
          },
          <Form dataSet={HeadDS} columns={4} labelWidth={120}>
            <Lov
              name="poBusinessUnitObj"
              key="poBusinessUnitObj"
              clearButton
              noCache
              disabled={!canEdit || poId}
            />
            <Select name="poType" key="poType" disabled={!canEdit || poId} />
            <Lov
              name="supplierObj"
              key="supplierObj"
              clearButton
              noCache
              disabled={!canEdit || poId}
            />
            <Select name="poStatus" key="poStatus" disabled />
            <TextField name="poNum" key="poNum" disabled />
            <Lov
              name="poInventoryOrgObj"
              key="poInventoryOrgObj"
              clearButton
              noCache
              disabled={!canEdit || poId}
            />
            <TextField name="customerContacts" key="customerContacts" disabled={!canEdit} />
            <TextField
              name="customerContactsPhone"
              key="customerContactsPhone"
              disabled={!canEdit}
            />
            <TextField name="supplierContacts" key="supplierContacts" disabled={!canEdit} />
            <TextField
              name="supplierContactsPhone"
              key="supplierContactsPhone"
              disabled={!canEdit}
            />
            <TextField name="consigneeName" key="consigneeName" disabled={!canEdit} />
            <TextField name="consigneePhone" key="consigneePhone" disabled={!canEdit} />
            <TextField name="receivingAddress" key="receivingAddress" disabled={!canEdit} />
            <Lov
              name="currencyObj"
              key="currencyObj"
              clearButton
              noCache
              disabled={!canEdit || poId}
            />
            <Lov
              name="taxRateObj"
              key="taxRateObj"
              clearButton
              noCache
              disabled={!canEdit || poId}
            />
            <TextField name="exTaxAmount" key="exTaxAmount" disabled />
            <TextField name="totalAmount" key="totalAmount" disabled />
            <Select name="poSourceType" key="poSourceType" disabled={!canEdit} />
            <TextField name="sourceDocNum" key="sourceDocNum" disabled={!canEdit} />
            <TextArea
              newLine
              colSpan={2}
              name="remark"
              key="remark"
              disabled={!canEdit}
              resize="both"
              autoSize
            />
          </Form>
        )}

        <Tabs defaultActiveKey="main" onChange={handleTabChange}>
          <TabPane tab="主要" key="main">
            {customizeTable(
              {
                code: 'ZCOM_PO.LINE.TABLE', // 单元编码，必传
              },
              <Table
                dataSet={LineDS}
                columns={mainLineColumns}
                editMode="inline"
                columnResizable="true"
                rowHeight="auto"
                buttons={getBtns()}
              />
            )}
          </TabPane>
          <TabPane tab="收货" key="receipt">
            <Table
              dataSet={LineDS}
              columns={receiptColumns}
              editMode="inline"
              columnResizable="true"
              buttons={getBtns()}
            />
          </TabPane>
          <TabPane tab="外协物料" key="outsource">
            {customizeTable(
              {
                code: 'ZCOM_PO.OUTSOURCE.LINE.TABLE', // 单元编码，必传
              },
              <Table
                dataSet={OutsourceLineDS}
                columns={outsourceColumns}
                editMode="inline"
                columnResizable="true"
                rowHeight="auto"
                buttons={getBtns()}
              />
            )}
          </TabPane>
          <TabPane tab="其他" key="other">
            <Table
              dataSet={LineDS}
              columns={otherColumns}
              editMode="inline"
              columnResizable="true"
              buttons={getBtns()}
            />
          </TabPane>
        </Tabs>
      </Content>
    </Fragment>
  );
}

// export default formatterCollections({
//   code: [`${intlPrefix}`],
// })(ZcomPoMaintainDetail);

export default formatterCollections({
  code: [`${intlPrefix}`],
})(
  WithCustomize({
    unitCode: ['ZCOM_PO.HEAD.FORM', 'ZCOM_PO.LINE.TABLE', 'ZCOM_PO.OUTSOURCE.LINE.TABLE'],
  })(ZcomPoMaintainDetail)
);
