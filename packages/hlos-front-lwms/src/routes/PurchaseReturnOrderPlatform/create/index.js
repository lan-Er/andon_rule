/*
 * @Description: 采购接收退货单创建
 * @Author: mengting.zhang <mengting.zhang@hand-china.com>
 * @LastEditTime: 2021-04-24 22:47:42
 */

import React, { Fragment, useState, useEffect, useMemo } from 'react';
import { Header, Content } from 'components/Page';
import {
  Button,
  DataSet,
  Table,
  Form,
  Lov,
  DatePicker,
  NumberField,
  TextField,
  Modal,
  Tooltip,
} from 'choerodon-ui/pro';
import { Divider } from 'choerodon-ui';
import { queryLovData } from 'hlos-front/lib/services/api';
import notification from 'utils/notification';
import moment from 'moment';
import { DEFAULT_DATETIME_FORMAT } from 'utils/constants';
import { getCurrentOrganizationId, getResponse } from 'utils/utils';

import { CreatePageDS, CreateReturnDS } from '../../../stores/purchaseReturnOrderPlatformDS';
import { createDeliveryReturn } from '../../../services/purchaseReturnOrderPlatformService';
import style from '../index.less';

const tenantId = getCurrentOrganizationId();

function PurchaseCreatePage(props) {
  const createDS = useMemo(() => new DataSet(CreatePageDS()), []);
  const returnDS = useMemo(() => new DataSet(CreateReturnDS()), []);

  // const [scmMoreFlag, setScmMoreFlag] = useState(false);
  // const [returnMoreFlag, setReturnMoreFlag] = useState(false);
  const [defWorkerObj, setDefWorkerObj] = useState({});
  const [listPageState, setListPageState] = useState({});

  useEffect(() => {
    const { returnOrderObj } = props.location.state;
    let docNum = '';
    if (returnOrderObj && returnOrderObj.docProcessRule) {
      docNum = JSON.parse(returnOrderObj && returnOrderObj.docProcessRule).doc_num;
    }
    handleQueryDefaultOrg();
    handleQueryDefaultWorker();
    setListPageState(props.location.state);
    if (!docNum || docNum !== 'manual') {
      returnDS.fields.get('returnDocNum').set('disabled', true);
    } else {
      returnDS.fields.get('returnDocNum').set('required', true);
    }
  }, []);

  const handleQueryDefaultOrg = async () => {
    const res = await queryLovData({ lovCode: 'LMDS.ORGANIZATION', defaultFlag: 'Y' });
    if (res && res.content && res.content.length) {
      createDS.queryDataSet.current.set('organizationObj', {
        organizationId: res.content[0].organizationId,
        organizationCode: res.content[0].organizationCode,
        organizationName: res.content[0].organizationName,
      });
      returnDS.current.set('organizationId', res.content[0].organizationId);
    }
  };

  const handleQueryDefaultWorker = async () => {
    const res = await queryLovData({ lovCode: 'LMDS.WORKER', defaultFlag: 'Y' });
    if (res && res.content && res.content.length) {
      createDS.queryDataSet.current.set('buyerObj', {
        workerId: res.content[0].workerId,
        workerCode: res.content[0].workerCode,
        workerName: res.content[0].workerName,
      });
      setDefWorkerObj(res.content[0]);
    }
  };

  const handleNumberChange = (value) => {
    if (value > 0) {
      returnDS.children.lineList.select(returnDS.children.lineList.current);
    } else {
      returnDS.children.lineList.unSelect(returnDS.children.lineList.current);
    }
  };

  const purchaseColumns = () => {
    return [
      {
        name: 'scmPoNum',
        width: 150,
        tooltip: 'overflow',
        lock: 'left',
        renderer: ({ record }) => `${record.get('poNum') || ''}-${record.get('poLineNum')}`,
      },
      { name: 'itemCode', width: 120, tooltip: 'overflow', lock: 'left' },
      { name: 'itemDescription', width: 120, tooltip: 'overflow' },
      { name: 'uomName', width: 70, tooltip: 'overflow' },
      { name: 'receivedQty', width: 82, tooltip: 'overflow' },
      { name: 'returnedQty', width: 82, tooltip: 'overflow' },
      { name: 'qcNgQty', width: 82, tooltip: 'overflow' },
      { name: 'supplierItemDesc', width: 120, tooltip: 'overflow' },
    ];
  };

  const returnColumns = () => {
    return [
      {
        name: 'lineNum',
        key: 'lineNum',
        width: 70,
        tooltip: 'overflow',
        lock: 'left',
        renderer: ({ record }) => getSerialNum(record),
      },
      {
        name: 'returnItemCode',
        key: 'returnItemCode',
        width: 120,
        tooltip: 'overflow',
        lock: 'left',
      },
      {
        name: 'returnItemDescription',
        key: 'returnItemDescription',
        width: 120,
        tooltip: 'overflow',
      },
      { name: 'returnUomName', key: 'returnUomName', width: 70, tooltip: 'overflow' },
      {
        name: 'returnQty',
        key: 'returnQty',
        width: 120,
        editor: <NumberField onChange={handleNumberChange} />,
      },
      {
        name: 'returnWarehouseObj',
        key: 'returnWarehouseObj',
        width: 150,
        tooltip: 'overflow',
        editor: <Lov />,
      },
      {
        name: 'returnWmAreaObj',
        key: 'returnWmAreaObj',
        width: 150,
        tooltip: 'overflow',
        editor: <Lov onChange={handleLineWmAreaChange} />,
      },
      {
        name: 'returnReason',
        key: 'returnReason',
        width: 120,
        tooltip: 'overflow',
        editor: <TextField />,
      },
      { name: 'scmPoNum', key: 'scmPoNum', width: 150, tooltip: 'overflow' },
      { name: 'secondUomName', key: 'secondUomName', width: 82, tooltip: 'overflow' },
      {
        name: 'secondApplyQty',
        key: 'secondApplyQty',
        width: 82,
        tooltip: 'overflow',
        editor: (record) => {
          if (record.get('secondUomName')) {
            return <NumberField required />;
          }
          return false;
        },
      },
      {
        name: 'lotNumber',
        key: 'lotNumber',
        width: 120,
        tooltip: 'overflow',
        editor: <TextField />,
      },
      { name: 'tagCode', key: 'tagCode', width: 120, tooltip: 'overflow', editor: <TextField /> },
      {
        name: 'packingQty',
        key: 'packingQty',
        width: 120,
        tooltip: 'overflow',
        editor: <TextField />,
      },
      {
        name: 'containerQty',
        key: 'containerQty',
        width: 120,
        tooltip: 'overflow',
        editor: <TextField />,
      },
    ];
  };

  const handleLineWmAreaChange = () => {
    returnDS.current.set('receiveWmAreaObj', null);
    returnDS.children.lineList.forEach((i) => {
      if (i.data.returnLineNum === returnDS.children.lineList.current.get('returnLineNum')) return;
      i.set('receiveWmAreaObj', null);
    });
  };

  /**
   * 获取行序号
   * @param {*} record 当前行记录
   */
  const getSerialNum = (record) => {
    const { index } = record;
    record.set('returnLineNum', index + 1);
    return index + 1;
  };

  const handleOrgChange = (value) => {
    createDS.queryDataSet.current.set('scmObj', null);
    createDS.queryDataSet.current.set('supplierObj', null);
    createDS.queryDataSet.current.set('itemObj', null);
    createDS.queryDataSet.current.set('demandDateStart', null);
    createDS.queryDataSet.current.set('demandDateEnd', null);
    createDS.data = [];
    returnDS.current.reset();
    returnDS.children.lineList.reset();
    if (value) {
      returnDS.current.set('organizationId', value.organizationId);
    } else {
      returnDS.current.set('organizationId', null);
    }
  };

  const handleScmChange = (record) => {
    if (record) {
      createDS.queryDataSet.current.set('supplierObj', {
        partyId: record.supplierId || '',
        partyNumber: record.supplierNumber || '',
        partyName: record.supplierName || '',
      });
    }
  };

  const handleQuery = async () => {
    const isValid = await createDS.queryDataSet.validate(false, false);
    if (!isValid) {
      notification.warning({
        message: '请先完成必输项',
      });
      return;
    }
    createDS.query();
  };

  const handleConfirm = () => {
    const validList = createDS.selected.filter((v) => v.selectable);
    if (!validList.length) {
      notification.warning({
        message: '请至少选择一条数据',
      });
      return;
    }

    const selectedList = validList.map((i) => i.toJSONData());
    const _lineList = returnDS.children.lineList.map((i) => i.toJSONData());
    const { returnWarehouseObj, returnWmAreaObj, returnReason } = returnDS.current.data;
    // if (returnWarehouseObj && Object.keys(returnWarehouseObj).length) {
    //   returnDS.children.lineList.fields.get('returnWarehouseObj').set('disabled', true);
    // }
    // if (returnWmAreaObj && Object.keys(returnWmAreaObj).length) {
    //   returnDS.children.lineList.fields.get('returnWmAreaObj').set('disabled', true);
    // }
    let noticeFlag = false;
    let addFlag = true;
    if (_lineList.length) {
      selectedList.forEach((v) => {
        returnDS.children.lineList.data.forEach((rec) => {
          if (`${v.poNum}-${v.poLineNum}` === rec.toJSONData().scmPoNum) {
            addFlag = false;
            noticeFlag = true;
          }
        });
        if (addFlag) {
          returnDS.children.lineList.create({
            ...v,
            scmPoNum: `${v.poNum}-${v.poLineNum}`,
            returnItemCode: v.itemCode,
            returnItemDescription: v.itemDescription,
            returnUomName: v.uomName,
            returnQty: v.receivedQty - v.returnedQty || 0,
            returnWarehouseObj,
            returnWmAreaObj,
            returnReason,
            secondUomId: v.secondUomId,
            secondUom: v.secondUom,
            secondUomName: v.secondUomName,
          });
        }
        addFlag = true;
      });
      if (noticeFlag) {
        notification.warning({
          message: '不可重复添加',
        });
      }
    } else {
      selectedList.forEach((v) => {
        returnDS.children.lineList.create({
          ...v,
          scmPoNum: `${v.poNum}-${v.poLineNum}`,
          returnItemCode: v.itemCode,
          returnItemDescription: v.itemDescription,
          returnUomName: v.uomName,
          returnQty: v.receivedQty - v.returnedQty || 0,
          returnWarehouseObj,
          returnWmAreaObj,
          returnReason,
          secondUomId: v.secondUomId,
          secondUom: v.secondUom,
          secondUomName: v.secondUomName,
        });
      });
    }

    validList.forEach((rec) => {
      // eslint-disable-next-line no-param-reassign
      rec.selectable = false;
      // createDS.remove(rec);
    });
    // returnDS.children.lineList.selectAll();
  };

  const handleReturnCancel = () => {
    const lineListSelected = returnDS.children.lineList.selected;
    if (!lineListSelected.length) {
      notification.warning({
        message: '请至少选择一条数据',
      });
      return;
    }
    const selectedList = lineListSelected.map((i) => i.toJSONData());
    lineListSelected.forEach((rec) => {
      // eslint-disable-next-line no-param-reassign
      rec.selectable = false;
      returnDS.children.lineList.remove(rec);
    });

    createDS.selected.forEach((rec) => {
      const scmPoNum = `${rec.toJSONData().poNum}-${rec.toJSONData().poLineNum}`;
      selectedList.forEach((v) => {
        if (scmPoNum === v.scmPoNum) {
          // eslint-disable-next-line no-param-reassign
          rec.selectable = true;
          // createDS.reset(rec);
        }
      });
    });
  };

  const handleSave = async () => {
    const createData = createDS.queryDataSet.current;
    const returnData = returnDS.current;
    const returnLineSelectedList = returnDS.children.lineList.selected;
    const isValid = await returnDS.validate(false, false);
    if (!isValid) {
      notification.warning({
        message: '请先完成必输项',
      });
      return;
    }
    if (!returnLineSelectedList.length) {
      notification.warning({
        message: '未选中采购退货单行',
      });
      return;
    }
    const deliveryReturnLineList = returnLineSelectedList.map((v, idx) => {
      const rec = v.toJSONData();
      return {
        returnLineNum: idx + 1,
        itemId: rec.itemId,
        itemCode: rec.itemCode,
        uomId: rec.uomId,
        uom: rec.uom,
        applyQty: rec.returnQty,
        itemControlType: rec.itemControlType,
        returnLineStatus: '',
        poId: rec.poHeaderId,
        poNum: rec.poNum,
        poLineId: rec.poLineId,
        poLineNum: rec.poLineNum,
        secondUomId: rec.secondUomId,
        secondUom: rec.secondUom,
        secondApplyQty: rec.secondApplyQty,
        returnReason: rec.returnReason,
        returnWarehouseId: rec.warehouseId,
        returnWarehouseCode: rec.warehouseCode,
        returnWmAreaId: rec.wmAreaId,
        returnWmAreaCode: rec.wmAreaCode,
        packingQty: rec.packingQty,
        containerQty: rec.containerQty,
        lotNumber: rec.lotNumber,
        tagCode: rec.tagCode,
        lineRemark: '',
        tenantId,
      };
    });
    const params = {
      ...createData.data.organizationObj,
      organizationId: createData.get('receiveOrgId'),
      deliveryReturnTypeId: listPageState.returnOrderObj
        ? listPageState.returnOrderObj.documentTypeId
        : '',
      deliveryReturnTypeCode: listPageState.returnOrderObj
        ? listPageState.returnOrderObj.documentTypeCode
        : '',
      returnSourceType: 'PO',
      partyId: createData.get('supplierId'),
      partyName: createData.get('partyName'),
      partyNumber: createData.get('partyNumber'),
      buyerId: createData.get('buyerId'),
      buyer: createData.get('workerCode'),
      poId: createData.get('poId'),
      poNum: createData.get('poNum'),
      returnWarehouseId: returnData.get('warehouseId'),
      returnWarehouseCode: returnData.get('warehouseCode'),
      returnWmAreaId: returnData.get('wmAreaId'),
      returnWmAreaCode: returnData.get('wmAreaCode'),
      deliveryReturnNum: returnData.get('returnDocNum'),
      returnCreatedDate: moment().format(DEFAULT_DATETIME_FORMAT),
      creatorId: defWorkerObj.workerId,
      creator: defWorkerObj.workerCode,
      docProcessRuleId: listPageState.returnOrderObj
        ? listPageState.returnOrderObj.docProcessRuleId
        : '',
      docProcessRule: listPageState.returnOrderObj
        ? listPageState.returnOrderObj.docProcessRule
        : '',
      remark: returnData.get('remark'),
      tenantId,
      deliveryReturnLineList,
    };
    const res = await createDeliveryReturn(params);
    if (getResponse(res)) {
      await returnDS.children.lineList.reset();
      await createDS.queryDataSet.current.reset();
      createDS.data = [];
      notification.success({
        message: '提交成功',
      });
      sessionStorage.setItem('purchaseReturnParentQuery', true);
      props.history.push('/lwms/purchase-return-order-platform/list');
    }
  };

  const handleBack = () => {
    if (returnDS.children.lineList.data.length) {
      Modal.confirm({
        children: <p>当前数据未保存, 是否退出？</p>,
        okText: '是',
        cancelText: '否',
        onOk: () => {
          props.history.push('/lwms/purchase-return-order-platform/list');
          createDS.queryDataSet.current.reset();
          createDS.data = [];
          returnDS.children.lineList.reset();
        },
      });
    } else {
      props.history.push('/lwms/purchase-return-order-platform/list');
      createDS.queryDataSet.current.reset();
      createDS.data = [];
      returnDS.children.lineList.reset();
    }
  };

  return (
    <Fragment>
      <Header title="新建采购退货单" backPath="/lwms/purchase-return-order-platform/list">
        <Button color="primary" onClick={handleSave}>
          保存
        </Button>
        <Button onClick={handleBack}>返回</Button>
      </Header>
      <Content>
        <div>
          <Form dataSet={createDS.queryDataSet} columns={4}>
            <Lov name="organizationObj" noCache key="organizationObj" onChange={handleOrgChange} />
            <Lov name="scmObj" noCache key="scmObj" onChange={handleScmChange} />
            <Lov name="supplierObj" noCache key="supplierObj" />
            <Lov name="itemObj" noCache key="itemObj" />
          </Form>
          <div style={{ position: 'relative' }}>
            <Form dataSet={createDS.queryDataSet} columns={4}>
              <Lov name="buyerObj" noCache key="buyerObj" />
              <DatePicker name="demandDateStart" noCache key="demandDateStart" />
              <DatePicker name="demandDateEnd" noCache key="demandDateEnd" />
            </Form>
            <Tooltip
              title={
                listPageState &&
                listPageState.returnOrderObj &&
                listPageState.returnOrderObj.docProcessRule
              }
            >
              <a style={{ position: 'absolute', right: '4px', bottom: '15px' }}>单据处理规则</a>
            </Tooltip>
          </div>
        </div>
        <div className={style['return-goods']}>
          <div className={style['return-goods-org']}>
            <span className={style['small-block']} />
            <span>退货组织</span>
          </div>
          <Divider />
          <Form dataSet={returnDS} columns={4}>
            <Lov name="returnWarehouseObj" noCache key="returnWarehouseObj" />
            <Lov name="returnWmAreaObj" noCache key="returnWmAreaObj" />
            <TextField name="returnDocNum" key="returnDocNum" />
          </Form>
          <Form dataSet={returnDS} columns={2}>
            <TextField name="returnReason" key="returnReason" />
            <TextField name="remark" key="remark" />
          </Form>
        </div>
        <div className={style['show-table-content']}>
          <div className={style['order-line']}>
            <div className={style['order-title']}>
              <span>采购订单行</span>
              <div className={style['order-buttons']}>
                <Button onClick={handleQuery}>查询</Button>
                <Button onClick={handleConfirm}>确认</Button>
              </div>
            </div>
            <Table
              dataSet={createDS}
              border={false}
              columns={purchaseColumns()}
              columnResizable="true"
              queryBar="none"
            />
          </div>
          <div className={style['order-line']}>
            <div className={style['order-title']}>
              <span>退货单行</span>
              <div className={style['order-buttons']}>
                <Button onClick={handleReturnCancel}>清空</Button>
              </div>
            </div>
            <Table
              dataSet={returnDS.children.lineList}
              border={false}
              columns={returnColumns()}
              columnResizable="true"
              queryBar="none"
            />
          </div>
        </div>
      </Content>
    </Fragment>
  );
}

export default PurchaseCreatePage;
