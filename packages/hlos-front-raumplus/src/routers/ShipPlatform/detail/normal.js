/**
 * @Description: 普通发货单新建
 * @Author: yu.na@hand-china.com
 * @Date: 2021-01-06 10:32:33
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  Table,
  Button,
  DataSet,
  Form,
  TextField,
  Select,
  Spin,
  Lov,
  NumberField,
  DatePicker,
  Tooltip,
  Modal,
} from 'choerodon-ui/pro';
import { isEmpty } from 'lodash';
import { Header, Content } from 'components/Page';
// import { Divider, Icon } from 'choerodon-ui';
import notification from 'utils/notification';
import { getResponse } from 'utils/utils';
import intl from 'utils/intl';
import moment from 'moment';
import formatterCollections from 'utils/intl/formatterCollections';
import { useDataSet, useDataSetEvent } from 'hzero-front/lib/utils/hooks';
import { userSetting, queryIndependentValueSet } from 'hlos-front/lib/services/api';
import { normalHeadDS, normalLineDS, seniorSearchDS } from '@/stores/shipDetailDS';
import {
  createShipOrder,
  getMasterOrderNo,
  deleteShipOrderLineApi,
} from '@/services/shipPlatformService';
import SeniorSearch from './seniorSearch';
import codeConfig from '@/common/codeConfig';
import styles from '../styles/index.module.less';

const { lwmsShipPlatform } = codeConfig.code;
const modalKey = Modal.key();

// const preCode = 'lwms.ship.model';
const todoHeadDataSetFactory = () => new DataSet({ ...normalHeadDS() });
const todoLineDataSetFactory = () => new DataSet({ ...normalLineDS() });

const ShipNormalDetail = (props) => {
  const modalTableDS = useMemo(() => new DataSet(seniorSearchDS()), []);
  // const [moreDetail, setMoreDetail] = useState(false);
  const HeadDS = useDataSet(todoHeadDataSetFactory, ShipNormalDetail);
  const LineDS = useDataSet(todoLineDataSetFactory);
  const [loading, setLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [isDirty, setIsDirty] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);
  const [warehouseDisabled, setWarehouseDisabled] = useState(false);
  // const [wmAreaDisbled, setWmAreaDisabled] = useState(false);
  const [secondDemandQtyDisabled, setsecondDemandQtyDisabled] = useState(true);
  const [isStateNew, setIsStateNew] = useState(true);
  const [shipOrderStatus, setShipOrderStatus] = useState('');
  const [isShipOrderId, setIsShipOrderId] = useState(false);
  const [isDisabledCustomer, setIsDisabledCustomer] = useState(true);
  const [workerObj, setWorkerObj] = useState({});
  const [isEdit, setIsEdit] = useState(false);
  // 删除loading
  const [deleteLoading, setDeleteLoading] = useState(false);

  useEffect(() => {
    async function defaultWorker() {
      const res = await userSetting({ defaultFlag: 'Y' });
      if (getResponse(res) && res.content && res.content[0]) {
        const { workerId, workerCode, workerName } = res.content[0];
        setWorkerObj({
          workerId,
          workerCode,
          workerName,
        });
      }
    }
    defaultWorker();
  }, []);

  useEffect(() => {
    const {
      location: { state },
    } = props;
    if (state?.shipOrderTypeObj?.pageType === 'details') {
      setIsEdit(false);
    } else {
      setIsEdit(true);
    }
    if (state && state.shipOrderTypeObj.id) {
      sessionStorage.setItem('shipOrderId', state.shipOrderTypeObj.id);
      detailedData(state.shipOrderTypeObj.id);
    } else {
      const shipOrderId = sessionStorage.getItem('shipOrderId');
      if (shipOrderId) {
        detailedData(shipOrderId);
      } else if (state && state.shipOrderTypeObj) {
        sessionStorage.setItem('shipOrderTypeObj', JSON.stringify(state.shipOrderTypeObj));
        if (HeadDS.current) {
          HeadDS.current.set('shipOrderTypeObj', state.shipOrderTypeObj);
          HeadDS.current.set('approvalRule', state.shipOrderTypeObj.approvalRule);
          HeadDS.current.set('approvalWorkflow', state.shipOrderTypeObj.approvalWorkflow);
          HeadDS.current.set('docProcessRule', state.shipOrderTypeObj.docProcessRule);
          HeadDS.current.set('docProcessRuleId', state.shipOrderTypeObj.docProcessRuleId);
          HeadDS.current.set('documentTypeCode', state.shipOrderTypeObj.documentTypeCode);
          HeadDS.current.set('documentTypeId', state.shipOrderTypeObj.documentTypeId);
          HeadDS.current.set('planShipDate', moment(new Date()).format('YYYY-MM-DD') || '');
        } else {
          HeadDS.create({
            shipOrderTypeObj: state.shipOrderTypeObj,
            approvalRule: state.shipOrderTypeObj.approvalRule,
            approvalWorkflow: state.shipOrderTypeObj.approvalWorkflow,
            docProcessRule: state.shipOrderTypeObj.docProcessRule,
            docProcessRuleId: state.shipOrderTypeObj.docProcessRuleId,
            documentTypeCode: state.shipOrderTypeObj.documentTypeCode,
            documentTypeId: state.shipOrderTypeObj.documentTypeId,
            planShipDate: moment(new Date()).format('YYYY-MM-DD') || '',
          });
        }
        if (state.shipOrderTypeObj.docProcessRule) {
          const docNum =
            JSON.parse(state.shipOrderTypeObj.docProcessRule) &&
            JSON.parse(state.shipOrderTypeObj.docProcessRule).docNum;
          if (docNum === 'manual') {
            HeadDS.fields.get('shipOrderNum').set('disabled', false);
            HeadDS.fields.get('shipOrderNum').set('required', true);
          }
        }
        defaultLovSetting();
      } else if (!state) {
        if (HeadDS.current) {
          HeadDS.current.set('shipOrderTypeObj', sessionStorage.getItem('shipOrderTypeObj'));
          HeadDS.current.set(
            'approvalRule',
            sessionStorage.getItem('shipOrderTypeObj').approvalRule
          );
          HeadDS.current.set(
            'approvalWorkflow',
            sessionStorage.getItem('shipOrderTypeObj').approvalWorkflow
          );
          HeadDS.current.set(
            'docProcessRule',
            sessionStorage.getItem('shipOrderTypeObj').docProcessRule
          );
          HeadDS.current.set(
            'docProcessRuleId',
            sessionStorage.getItem('shipOrderTypeObj').docProcessRuleId
          );
          HeadDS.current.set(
            'documentTypeCode',
            sessionStorage.getItem('shipOrderTypeObj').documentTypeCode
          );
          HeadDS.current.set(
            'documentTypeId',
            sessionStorage.getItem('shipOrderTypeObj').documentTypeId
          );
        } else {
          HeadDS.create(
            {
              shipOrderTypeObj: sessionStorage.getItem('shipOrderTypeObj'),
              approvalRule: sessionStorage.getItem('shipOrderTypeObj').approvalRule,
              approvalWorkflow: sessionStorage.getItem('shipOrderTypeObj').approvalWorkflow,
              docProcessRule: sessionStorage.getItem('shipOrderTypeObj').docProcessRule,
              docProcessRuleId: sessionStorage.getItem('shipOrderTypeObj').docProcessRuleId,
              documentTypeCode: sessionStorage.getItem('shipOrderTypeObj').documentTypeCode,
              documentTypeId: sessionStorage.getItem('shipOrderTypeObj').documentTypeId,
            },
            0
          );
        }
        if (sessionStorage.getItem('shipOrderTypeObj').docProcessRule) {
          const docNum =
            JSON.parse(sessionStorage.getItem('shipOrderTypeObj').docProcessRule) &&
            JSON.parse(sessionStorage.getItem('shipOrderTypeObj').docProcessRule).docNum;
          if (docNum === 'manual') {
            HeadDS.fields.get('shipOrderNum').set('disabled', false);
            HeadDS.fields.get('shipOrderNum').set('required', true);
          }
        }
        defaultLovSetting();
      }
    }

    return () => {
      if (HeadDS.current) {
        HeadDS.remove(HeadDS.current);
        sessionStorage.removeItem('shipOrderId');
      }
    };
  }, []);

  useDataSetEvent(HeadDS, 'update', ({ record, name }) => {
    setIsDirty(true);
    const { organizationObj, attributeString1, customerObj } = record.toData();
    if (name === 'organizationObj' || name === 'attributeString1' || name === 'customerObj') {
      if (!isEmpty(organizationObj) && !isEmpty(customerObj) && attributeString1) {
        setIsDisabled(false);
      } else {
        setIsDisabled(true);
      }
      record.set({
        sopOuObj: null,
        shippingMethod: null,
        shipOrderNum: null,
        // customerObj: null,
        customerSiteObj: null,
        customerName: null,
        customerAddress: null,
        warehouseObj: null,
        wmAreaObj: null,
        creatorObj: null,
        customerContact: null,
        contactPhone: null,
        contactEmail: null,
        salesmanObj: null,
        freight: null,
        currencyObj: null,
        carrier: null,
        carrierContact: null,
        plateNum: null,
        shipTicket: null,
        expectedArrivalDate: null,
        // planShipDate: null,
      });
      LineDS.data = [];
    }
  });

  /**
   * 发货明细数据
   */
  async function detailedData(id) {
    HeadDS.setQueryParameter('shipOrderId', id);
    const res = await HeadDS.query();
    if (res.shipOrderId) {
      setIsShipOrderId(true);
    }
    if (res && res.shipOrderStatus) {
      setShipOrderStatus(res.shipOrderStatus);
    }
    if (res.shipOrderStatus === 'RELEASED') {
      setIsStateNew(false);
    }
    const shipOrderLineList = res.shipOrderLineList
      ? res.shipOrderLineList.map((item) => {
          return {
            ...item,
            itemCode: item.item,
          };
        })
      : [];
    LineDS.data = shipOrderLineList;
  }

  /**
   *设置默认值
   */
  async function defaultLovSetting() {
    const res = await userSetting({ defaultFlag: 'Y' });
    if (getResponse(res) && res.content && res.content[0]) {
      const {
        organizationId,
        organizationCode,
        organizationName,
        workerId,
        workerCode,
        workerName,
        warehouseId,
        warehouseCode,
        warehouseName,
        wmAreaId,
        wmAreaCode,
        wmAreaName,
      } = res.content[0];
      if (organizationId) {
        HeadDS.current.set('organizationObj', {
          organizationId,
          organizationCode,
          organizationName,
        });
      }
      if (workerId) {
        HeadDS.current.set('creatorObj', {
          workerId,
          workerCode,
          workerName,
        });
      }
      if (warehouseId) {
        HeadDS.current.set('warehouseObj', {
          warehouseId,
          warehouseCode,
          warehouseName,
        });
        setWarehouseDisabled(true);
      }
      if (wmAreaId) {
        HeadDS.current.set('wmAreaObj', {
          wmAreaId,
          wmAreaCode,
          wmAreaName,
        });
      }
    }
  }

  /**
   * 获取行序号
   * @param {*} record 当前行记录
   */
  function getSerialNum(record) {
    const {
      dataSet: { currentPage, pageSize },
      index,
    } = record;
    record.set('shipLineNum', (currentPage - 1) * pageSize + index + 1);
    return (currentPage - 1) * pageSize + index + 1;
  }

  /**
   * 保存
   */
  async function handleSave() {
    const validateArr = await Promise.all([
      HeadDS.validate(false, false),
      LineDS.validate(true, false),
    ]);
    if (validateArr.some((i) => !i)) {
      notification.warning({
        message: '数据校验不通过',
      });
      return;
    }
    const shipOrderLineList = [];
    LineDS.forEach((i) => {
      const promiseShipDate =
        i.get('promiseShipDate') && moment(i.get('promiseShipDate')).format('YYYY-MM-DD');
      shipOrderLineList.push({ ...i.toJSONData(), promiseShipDate });
    });
    const params = {
      ...HeadDS.current.toJSONData(),
      creatorId: workerObj.workerId,
      creator: workerObj.workerCode,
      shipOrderLineList,
    };
    setLoading(true);
    setSaveLoading(true);
    const res = await createShipOrder(params);
    setLoading(false);
    setSaveLoading(false);
    if (getResponse(res)) {
      notification.success({
        message: `发货单${res.shipOrderNum}创建成功`,
      });
      // HeadDS.current.reset();
      // LineDS.data = [];
      // defaultLovSetting();
      // setIsDirty(false);
      const pathName = `/raumplus/ship-platform/list`;
      props.history.push(pathName);
      sessionStorage.setItem('shipPlatformParentQuery', true);
    }
  }

  /**
   *重置
   *
   */
  function handleReset() {
    HeadDS.current.reset();
    LineDS.data = [];
    defaultLovSetting();
    setIsDisabledCustomer(true);
  }

  /**
   * 新增发货单行
   */
  // async function handleAddLine() {
  //   setIsDirty(true);
  //   const {
  //     organizationId,
  //     warehouseId,
  //     warehouseCode,
  //     warehouseName,
  //     wmAreaId,
  //     wmAreaCode,
  //     wmAreaName,
  //   } = HeadDS.current.toJSONData();
  //   await LineDS.create(
  //     {
  //       organizationId: organizationId || null,
  //       warehouseId: warehouseId || null,
  //       warehouseCode: warehouseCode || null,
  //       warehouseName: warehouseName || null,
  //       wmAreaId: wmAreaId || null,
  //       wmAreaCode: wmAreaCode || null,
  //       wmAreaName: wmAreaName || null,
  //     },
  //     0
  //   );
  // }

  /**
   * table列
   */
  function columns() {
    return [
      {
        name: 'shipLineNum',
        width: 70,
        lock: 'left',
        key: 'shipLineNum',
        renderer: ({ record }) => getSerialNum(record),
      },
      {
        name: 'itemObj',
        width: 144,
        lock: 'left',
        key: 'itemObj',
        editor: isEdit ? <Lov onChange={handleItemChange} /> : false,
      },
      { name: 'itemDescription', width: 200, key: 'itemDescription' },
      { name: 'uomObj', width: 70, key: 'uomObj' },
      {
        name: 'applyQty',
        width: 100,
        key: 'applyQty',
        editor:
          isEdit || shipOrderStatus === 'NEW'
            ? (record, name) => <NumberField onChange={(e) => handleApplyQty(e, record, name)} />
            : false,
      },
      { name: 'warehouseObj', width: 144, key: 'warehouseObj', editor: !warehouseDisabled },
      { name: 'wmAreaObj', width: 144, key: 'wmAreaObj', editor: true },
      { name: 'toWarehouseObj', width: 144, key: 'toWarehouseObj', editor: true },
      { name: 'toWmAreaObj', width: 144, key: 'toWmAreaObj', editor: true },
      {
        name: 'soNum',
        width: 144,
        key: 'soNum',
        editor: isEdit ? (record) => <TextField onChange={(e) => soNumChange(e, record)} /> : false,
      },
      { name: 'soLineNum', width: 82, key: 'soLineNum', editor: true },
      { name: 'customerItemCode', width: 144, key: 'customerItemCode', editor: true },
      { name: 'customerItemDesc', width: 200, key: 'customerItemDesc', editor: true },
      { name: 'customerPo', width: 144, key: 'customerPo', editor: true },
      { name: 'customerPoLine', width: 82, key: 'customerPoLine', editor: true },
      { name: 'secondUomObj', width: 70, key: 'secondUomObj', editor: false },
      {
        name: 'secondApplyQty',
        width: 100,
        key: 'secondApplyQty',
        editor: !secondDemandQtyDisabled,
      },
      { name: 'shipRuleObj', width: 144, key: 'shipRuleObj', editor: true },
      { name: 'pickRuleObj', width: 144, key: 'pickRuleObj', editor: true },
      { name: 'reservationRuleObj', width: 144, key: 'reservationRuleObj', editor: true },
      { name: 'packingRuleObj', width: 144, key: 'packingRuleObj', editor: true },
      { name: 'wmInspectRuleObj', width: 144, key: 'wmInspectRuleObj', editor: true },
      { name: 'fifoRuleObj', width: 144, key: 'fifoRuleObj', editor: true },
      { name: 'packingFormat', width: 128, key: 'packingFormat', editor: true },
      { name: 'packingQty', width: 100, key: 'packingQty', editor: true },
      { name: 'minPackingQty', width: 100, key: 'minPackingQty', editor: true },
      { name: 'containerQty', width: 100, key: 'containerQty', editor: true },
      { name: 'palletContainerQty', width: 100, key: 'palletContainerQty', editor: true },
      { name: 'packageNum', width: 144, key: 'packageNum', editor: true },
      { name: 'tagTemplate', width: 144, key: 'tagTemplate', editor: true },
      { name: 'lotNumber', width: 144, key: 'lotNumber', editor: true },
      { name: 'tagCode', width: 144, key: 'tagCode', editor: true },
      // { name: 'itemControlType', width: 100, key: 'itemControlType', editor: true },
      { name: 'lineRemark', width: 200, key: 'lineRemark', editor: true },
      { name: 'externalNum', width: 144, key: 'externalNum' },
      { name: 'promiseShipDate', width: 144, key: 'promiseShipDate', editor: true },
      {
        header: intl.get('hzero.common.button.action').d('操作'),
        width: 90,
        command: ({ record, dataSet }) => {
          return [
            <Tooltip
              key="cancel"
              placement="bottom"
              title={intl.get('hzero.common.button.cancel').d('取消')}
            >
              <Button
                icon="cancle_a"
                color="primary"
                funcType="flat"
                onClick={() => removeData(record, dataSet)}
              />
            </Tooltip>,
          ];
        },
        lock: 'right',
      },
    ];
  }

  /**
   * 销售订单号查询母订单号
   */
  async function soNumChange(e, record) {
    if (e) {
      const data = await getMasterOrderNo({ soHeaderId: e });
      if (data.content.length > 0) {
        const numberOfIssues = data.content[0].demandQty - data.content[0].shippedQty;
        record.set('externalNum', data.content[0].externalNum || null);
        record.set('numberOfIssues', numberOfIssues);
      }
    }
  }

  /**
   * 输入的值不能小于等于‘可发出数’
   */
  function handleApplyQty(e, record, name) {
    console.log('e===', e);
    console.log('name===', name);
    console.log('qty===', record.get('demandQty'));
    const numberOfIssues =
      Number(record.get('demandQty') || 0) - Number(record.get('shippedQty') || 0);
    if (!numberOfIssues) {
      record.set(name, null);
      return;
    }
    if (e >= numberOfIssues) {
      record.set(name, null);
    }
    // if (!record.get('numberOfIssues')) {
    //   record.set(name, null);
    //   return;
    // }
    // if (record.get('numberOfIssues') >= e) {
    //   record.set(name, null);
    // }
  }

  /**
   * 取消当前对象操作
   * @param {json} record 当前对象
   */
  function removeData(record, dataSet) {
    dataSet.remove(record);
  }

  function handleItemChange(rec) {
    if (rec) {
      const { uomId, uom, uomName, secondUomId, secondUom, secondUomName } = rec;
      if (uomId) {
        LineDS.current.set('uomObj', {
          uomId,
          uomCode: uom,
          uomName,
        });
      }
      LineDS.current.set('secondUomObj', null);
      if (secondUomId) {
        LineDS.current.set('secondUomObj', {
          uomId: secondUomId,
          uomCode: secondUom,
          uomName: secondUomName,
        });
        setsecondDemandQtyDisabled(false);
      } else {
        setsecondDemandQtyDisabled(true);
      }
    } else {
      LineDS.current.set('uomObj', null);
      LineDS.current.set('secondUomObj', null);
    }
  }

  // function handleWarehouseChange(record) {
  //   if (record) {
  //     setWarehouseDisabled(true);
  //   } else {
  //     setWarehouseDisabled(false);
  //   }
  //   if (LineDS.length) {
  //     LineDS.forEach((i) => {
  //       i.set({
  //         warehouseId: isEmpty(record) ? null : record.warehouseId,
  //         warehouseCode: isEmpty(record) ? null : record.warehouseCode,
  //         warehouseName: isEmpty(record) ? null : record.warehouseName,
  //       });
  //       i.set('wmAreaObj', null);
  //     });
  //   }
  // }

  // function handleWmAreaChange(record) {
  //   if (record) {
  //     setWmAreaDisabled(true);
  //   } else {
  //     setWmAreaDisabled(false);
  //   }
  //   if (LineDS.length) {
  //     LineDS.forEach((i) => {
  //       i.set({
  //         wmAreaId: isEmpty(record) ? null : record.wmAreaId,
  //         wmAreaCode: isEmpty(record) ? null : record.wmAreaCode,
  //         wmAreaName: isEmpty(record) ? null : record.wmAreaName,
  //       });
  //     });
  //   }
  // }

  // function lineButton() {
  //   return [
  //     <Button key="add" disabled={isDisabled && isStateNew} onClick={handleAddLine}>
  //       新增
  //     </Button>,
  //   ];
  // }

  function handleSopOuChange(rec) {
    if (rec) {
      HeadDS.current.set('customerSiteObj', {
        customerSiteId: rec.customerSiteId,
        customerSiteNumber: rec.customerSiteNumber,
        customerSiteName: rec.customerSiteName,
      });
      HeadDS.current.set('customerAddress', rec.customerAddress);
    }
  }

  function handleCustomer(rec) {
    if (rec) {
      HeadDS.current.set('customerName', rec.customerName);
    }
  }

  /**
   * @description: 高级搜索打开弹窗
   */
  const openModal = () => {
    const customerId = HeadDS.get(0).get('customerId');
    modalTableDS.setQueryParameter('customerId', customerId || null);
    modalTableDS.query();
    Modal.open({
      key: modalKey,
      title: '销售订单明细选择',
      style: {
        width: '100%',
        height: '100%',
        top: 0,
      },
      fullScreen: true,
      mask: true,
      className: styles['my-mo-height-search-list'],
      children: <SeniorSearch ds={modalTableDS} />,
      okText: '保存',
      onOk: seniorSearchSave,
    });
  };

  /**
   * @returns 新增删除逻辑
   */
  const handleDelete = async () => {
    console.log('handleDelete');
    //  deleteShipOrderLineApi
    if (!LineDS.selected || LineDS.selected.length === 0) {
      return notification.warning({
        message: '请勾选需要删除的行数据！',
      });
    }
    console.log('shipOrderId===', sessionStorage.getItem('shipOrderTypeObj'));
    const lists = LineDS.selected.map((line) => line.toData().shipLineId);
    const shipOrderId = sessionStorage.getItem('shipOrderId');
    const params = {
      shipOrderId,
      lists,
    };
    try {
      setDeleteLoading(true);
      const res = await deleteShipOrderLineApi(params);
      setDeleteLoading(false);
      console.log('res', res);
      console.log('res.failed', res.failed);
      if (res && !res.failed) {
        notification.success({
          message: '删除成功！',
        });
        detailedData(shipOrderId);
      } else {
        notification.error({
          message: `删除失败，${res.message}`,
        });
      }
    } catch (err) {
      setDeleteLoading(false);
      return notification.warning({
        message: `删除失败，${err.message}`,
      });
    }
  };

  async function seniorSearchSave() {
    let validateResult = true;
    const selectedData = modalTableDS.selected.map((item) => {
      const rec = item.toData();
      if (!rec.promiseShipDate || !rec.applyQty) {
        item.validate(true);
        validateResult = false;
      }
      return {
        ...rec,
        uomObj: {
          uomCode: rec.uom,
          uomId: rec.uomId,
          uomName: rec.uomName,
        },
        demandDate: moment(rec.demandDate).format('YYYY-MM-DD'),
      };
    });
    if (selectedData.length <= 0 || !validateResult) {
      return false;
    }
    const _headerRec = modalTableDS.queryDataSet.current.toJSONData();
    if (
      _headerRec.productFlag === '0' &&
      selectedData.some((v) => Number(v.avaliableQty) < Number(v.applyQty))
    ) {
      notification.warning({
        message: '本次发货数量不能大于库存数量',
      });
      return false;
    }
    selectedData.forEach((item) => {
      LineDS.create(item);
    });
  }

  async function brandChange(e) {
    if (e) {
      setIsDisabledCustomer(false);
      const result = await queryIndependentValueSet({ lovCode: lwmsShipPlatform.customerGroup });
      const data = () => {
        for (let i = 0; i < result.length; i++) {
          if (result[i].value === e) {
            return result[i].meaning;
          }
        }
      };
      HeadDS.getField('customerObj').setLovPara('customerGroupMeaning', data());
    } else {
      setIsDisabledCustomer(true);
    }
    HeadDS.current.set('customerObj', null);
  }

  return (
    <Spin spinning={loading}>
      <Header title="创建普通发货单" backPath="/raumplus/ship-platform/list" isChange={isDirty}>
        {isStateNew ? (
          <Button
            icon="save"
            color="primary"
            onClick={handleSave}
            loading={saveLoading}
            disabled={!isEdit && shipOrderStatus !== 'NEW'}
          >
            保存
          </Button>
        ) : (
          ''
        )}
        {isStateNew ? (
          <Button disabled={!isEdit} onClick={handleReset}>
            {intl.get('hzero.common.button.reset').d('重置')}
          </Button>
        ) : (
          ''
        )}
      </Header>
      <Content>
        <Form dataSet={HeadDS} columns={4}>
          <Lov name="organizationObj" key="organizationObj" disabled={isShipOrderId} />
          <Lov
            name="sopOuObj"
            key="sopOuObj"
            disabled={isDisabled || isShipOrderId}
            onChange={handleSopOuChange}
          />
          <Select
            name="shippingMethod"
            key="shippingMethod"
            disabled={isDisabled || isShipOrderId}
          />
          <Select
            name="attributeString2"
            key="attributeString2"
            disabled={isDisabled || isShipOrderId}
          />
          <Select
            name="attributeString1"
            key="attributeString1"
            disabled={isShipOrderId}
            onChange={(e) => brandChange(e)}
          />
          <Lov
            name="customerObj"
            key="customerObj"
            disabled={isShipOrderId || isDisabledCustomer}
            onChange={handleCustomer}
          />
          <Lov
            name="customerSiteObj"
            key="customerSiteObj"
            disabled={isDisabled || isShipOrderId}
          />
          <TextField
            name="customerName"
            key="customerName"
            disabled={isDisabled || isShipOrderId}
          />
          <TextField
            name="customerAddress"
            key="customerAddress"
            disabled={isDisabled || isShipOrderId}
          />
          <DatePicker
            name="planShipDate"
            key="planShipDate"
            disabled={isDisabled || isShipOrderId}
          />
          <TextField
            name="remark"
            key="remark"
            // colSpan={2}
            disabled={isDisabled || isShipOrderId}
          />
          <TextField
            name="shipOrderNum"
            key="shipOrderNum"
            disabled={isDisabled || isShipOrderId}
          />
        </Form>
        <Button
          style={{ marginBottom: '10px' }}
          onClick={openModal}
          disabled={isDisabled && shipOrderStatus !== 'NEW'}
        >
          高级搜索
        </Button>
        <Button
          style={{ marginBottom: '10px' }}
          onClick={handleDelete}
          disabled={isDisabled && shipOrderStatus !== 'NEW'}
          loading={deleteLoading}
        >
          删除
        </Button>
        <Table
          dataSet={LineDS}
          columns={columns()}
          columnResizable="true"
          queryBar="none"
          // buttons={lineButton()}
        />
      </Content>
    </Spin>
  );
};

export default formatterCollections({
  code: ['lwms.ship', 'lwms.common'],
})(ShipNormalDetail);
