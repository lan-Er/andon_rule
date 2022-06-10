/*
 * @Author: zhang yang
 * @Description: 采购订单
 * @E-mail: yang.zhang14@hand-china.com
 * @Date: 2020-01-07 16:12:32
 */
import React, { useState, useEffect } from 'react';
import { connect } from 'dva';
import { withRouter } from 'react-router-dom';
import { Header, Content } from 'components/Page';
import { Lov, Form, Button, Select, TextField, DataSet, Modal as ModalPro } from 'choerodon-ui/pro';
import { Divider, Icon, Modal, Card } from 'choerodon-ui';
import { queryLovData, userSetting } from 'hlos-front/lib/services/api';
import { DETAIL_CARD_CLASSNAME, DETAIL_CARD_TABLE_CLASSNAME } from 'utils/constants';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import notification from 'utils/notification';
import { useDataSet } from 'hzero-front/lib/utils/hooks';
import moment from 'moment';
import { getResponse } from 'utils/utils';
import {
  releasePoAPI,
  cancelPoAPI,
  closePoAPI,
  // getNumAPI,
  getItemSupplierAPI,
  getDocumentTypeApi,
  createSqcDocAPI,
} from '@/services/posService';
import { ScmPoDetailDS, ScmWorker } from '@/stores/purchaseOrdersDS';

// import Store from '../stores';
import LineList from './LineList';

const preCode = 'lscm.pos';
// const modalKey = Modal.key();
const PosDetailList = (props) => {
  const workerDS = useDataSet(() => new DataSet(ScmWorker()));
  const detailDataSet = useDataSet(() => new DataSet(ScmPoDetailDS()), 'lscm-purchase-orders');
  const { match, history, location } = props;

  const [MoreDetail, changgeMoreDetail] = useState(false);

  const [disableFlagx, changeFlagx] = useState(true);
  const [disableFlagy, changeFlagy] = useState(true);

  const [AddVisible, changeVisible] = useState(false);

  const [comFlag, changeComFlag] = useState(false);

  const [ruleFlag, changeRuleFlag] = useState(true);
  const [siteFlag, changeSiteFlag] = useState(false);

  const [dsDirty, setDSDirty] = useState(false);
  const [newStatusParams, setNewStatusParams] = useState({});
  const [poHeaderRecord, setPoHeaderRecord] = useState({});

  useEffect(() => {
    async function queryDefaultOrg() {
      const res = await userSetting({ defaultFlag: 'Y' });
      if (res && res.content && res.content[0]) {
        const { workerId, workerCode, workerName, organizationId } = res.content[0];
        if (workerDS.current) {
          workerDS.current.set('workerObj', {
            workerId,
            workerCode,
            workerName,
          });
          workerDS.current.set('organizationId', organizationId);
        }
      }
    }
    queryDefaultOrg();
  }, []);

  useEffect(() => {
    const { params: { poHeaderId = '' } = {} } = match;
    const { state } = location;
    async function queryDefaultScmOu() {
      const res = await queryLovData({
        lovCode: 'LMDS.SCM_OU',
        defaultFlag: 'Y',
      });
      if (res && res.content && res.content[0]) {
        detailDataSet.current.set('scmOuObj', res.content[0]);
        changeFlagy(false);
      }
    }

    async function getDefaultDocumentType() {
      const res = await userSetting({ defaultFlag: 'Y' });
      if (res && res.content && res.content.length) {
        detailDataSet.current.set('poType', {
          documentTypeId: res.content[0].poTypeId,
          documentTypeCode: res.content[0].poTypeCode,
          documentTypeName: res.content[0].poTypeName,
        });
        const params = {
          documentTypeId: res.content[0].poTypeId,
          documentTypeCode: res.content[0].poTypeCode,
        };
        queryDocNum({ ...res.content[0], ...params });
        changeFlagx(false);
      }
    }

    if (poHeaderId === 'create') {
      if (state && state.mode && state.mode === 'copy') {
        if (detailDataSet.current) {
          const { poType = {} } = detailDataSet.current.data;
          let docProcessRules = poType && poType.docProcessRule;
          if (docProcessRules) {
            docProcessRules = JSON.parse(docProcessRules);
          }
          if (docProcessRules && docProcessRules.doc_num && docProcessRules.doc_num === 'manual') {
            detailDataSet.current.fields.get('poNum').set('required', true);
            changeRuleFlag(false);
          } else {
            changeRuleFlag(true);
            detailDataSet.current.fields.get('poNum').set('required', false);
          }
        }
        changeFlagx(false);
        changeFlagy(false);
        return;
      } else {
        getDefaultDocumentType();
        queryDefaultScmOu();
      }
      changeComFlag(true);
      if (!detailDataSet.current) {
        detailDataSet.create({});
      }
    } else {
      changeComFlag(false);
      setDSDirty(false);
      detailDataSet.queryParameter = { poHeaderId };
      detailDataSet.query().then((list) => {
        const { poStatus } = list;
        setPoHeaderRecord(list);
        if (poStatus === 'NEW') {
          changeFlagx(false);
          changeFlagy(false);
        }
      });
    }
    function updateDSDirty() {
      setDSDirty(detailDataSet.dirty);
    }
    function addDirtyDetect() {
      detailDataSet.addEventListener('update', updateDSDirty);
      detailDataSet.addEventListener('create', updateDSDirty);
      detailDataSet.addEventListener('remove', updateDSDirty);
    }

    addDirtyDetect();

    return () => {
      detailDataSet.removeEventListener('update', updateDSDirty);
      detailDataSet.removeEventListener('create', updateDSDirty);
      detailDataSet.removeEventListener('remove', updateDSDirty);
    };
  }, [detailDataSet, match, location, history]);

  useEffect(() => {
    return () => {
      if (detailDataSet.current) {
        detailDataSet.current.records.clear();
      }
    };
  }, [history]);

  /**
   * @description: 初始化查看采购订单号有没有权限编辑
   * @param {*} params
   * @return {*}
   */
  async function queryDocNum(params) {
    getDocumentTypeApi({ ...params }).then((myRes) => {
      let { docProcessRule } = myRes;
      docProcessRule = docProcessRule && JSON.parse(docProcessRule);
      const docNumber = docProcessRule && docProcessRule.doc_num;
      if (docNumber && docNumber === 'manual') {
        detailDataSet.current.set('poNum', '');
        detailDataSet.current.fields.get('poNum').set('required', true);
        changeRuleFlag(false);
      } else {
        detailDataSet.current.fields.get('poNum').set('required', false);
        changeRuleFlag(true);
      }
      setNewStatusParams(myRes);
    });
  }

  async function queryDocNumUpate(params) {
    getDocumentTypeApi({ ...params }).then((myRes) => {
      setNewStatusParams(myRes);
    });
  }
  /**
   * 保存
   */
  async function handleSave() {
    const validateValue = await detailDataSet.validate(false, false);
    if (!validateValue) {
      notification.error({
        message: intl.get('hzero.common.view.message.valid.error').d('数据校验失败'),
      });
      return;
    }
    const isNew = detailDataSet && detailDataSet.current && detailDataSet.current.get('poStatus');
    if (isNew === 'NEW') {
      for (const i in newStatusParams) {
        if (Object.prototype.hasOwnProperty.call(newStatusParams, i)) {
          // 防止请求参数的版本号，干扰查询版本号
          if (i !== 'objectVersionNumber') {
            detailDataSet.current.set(i, newStatusParams[i]);
          }
        }
      }
    }
    const res = await detailDataSet.submit(false, false);
    if (res && res.failed && res.message) {
      notification.error({
        message: res.message,
      });
      throw new Error(res);
    } else if (res === undefined) {
      notification.info({
        message: intl.get('hzero.common.view.message.title.noChange').d('未修改数据'),
      });
      return;
    }

    if (res && res.content && res.content[0]) {
      if (detailDataSet.current) {
        detailDataSet.reset();
        detailDataSet.records.clear();
      }
      changeComFlag(false);
      setDSDirty(false);
      history.push(`/lscm/po-qty-list/detail/${res.content[0].poHeaderId}`);
      props.dispatch({
        type: 'PurchaseOrderModel/updateState',
        payload: {
          purchaseOrderModelData: {
            ...props.purchaseOrderModelData,
            queryStatus: 'refresh',
          },
        },
      });
    }
  }

  /**
   * 报检
   */
  async function handleInspection() {
    if (!comFlag) {
      const { selected } = detailDataSet.children.lineList;
      if (selected.length) {
        ModalPro.open({
          key: 'purchase-order-inspection-modal',
          title: intl.get(`${preCode}.msg.isSubmit`).d('是否报检'),
          children: (
            <Form dataSet={workerDS}>
              <Lov name="workerObj" />
            </Form>
          ),
          async onOk() {
            const { poHeaderId } = poHeaderRecord;
            const lines = selected.map((i) => {
              const { poLineId, demandQty, secondDemandQty } = i.toJSONData();
              return {
                poLineId,
                batchQty: demandQty,
                secondBatchQty: secondDemandQty,
                samplingType: null,
                sampleQty: 1,
                itemControlType: null,
                inspectionTemplateType: 'SQC.NORMAL',
                templateId: null,
                sqcDocNum: null,
                priority: null,
              };
            });
            const params = [
              {
                poHeaderId,
                declarerId: workerDS.current.get('workerId'),
                declarer: workerDS.current.get('workerCode'),
                declaredDate: moment().format('YYYY-MM-DD HH:mm:ss'),
                pictures: null,
                remark: null,
                lines,
              },
            ];
            const resp = await createSqcDocAPI(params);
            if (getResponse(resp)) {
              notification.success({
                message: '报检成功',
              });
              detailDataSet.query();
            }
          },
        });
      } else {
        notification.warning({
          message: '警告',
          description: intl.get(`${preCode}.msg.selectFirst`).d('请先选择一条行数据'),
        });
      }
    }
  }

  /**
   * 改变重要字段的响应：PoType
   */
  function handleChangePoType(value, oldValue) {
    const Rule =
      detailDataSet && detailDataSet.current && detailDataSet.current.get('docProcessRule');
    if (Rule) {
      const ruleObject = JSON.parse(Rule);
      if (ruleObject && ruleObject.doc_num && ruleObject.doc_num === 'manual') {
        detailDataSet.current.set('poNum', '');
        detailDataSet.current.fields.get('supplierSiteObj').set('required', true);
        detailDataSet.current.fields.get('poNum').set('required', true);
        changeRuleFlag(false);
      } else {
        detailDataSet.current.fields.get('poNum').set('required', false);
        changeRuleFlag(true);
      }
      if (ruleObject && ruleObject.supplier_site && ruleObject.supplier_site === 'enable') {
        detailDataSet.current.fields.get('supplierSiteObj').set('required', true);
        changeSiteFlag(true);
      } else {
        detailDataSet.current.fields.get('supplierSiteObj').set('required', false);
        changeSiteFlag(false);
      }
    } else {
      detailDataSet.current.fields.get('poNum').set('required', false);
      changeRuleFlag(true);
      detailDataSet.current.fields.get('supplierSiteObj').set('required', false);
      changeSiteFlag(false);
    }
    if (value !== null) {
      changeFlagx(false);
    } else {
      changeFlagx(true);
    }
    if (oldValue !== undefined) {
      detailDataSet.current.set('supplierObj', null);
      detailDataSet.current.set('buyerObj', null);
      detailDataSet.current.set('receiveOrgObj', null);
      detailDataSet.current.set('supplierContact', null);
      detailDataSet.current.set('contactPhone', null);
      detailDataSet.current.set('remark', null);
      detailDataSet.current.set('contactEmail', null);
      detailDataSet.current.set('currencyObj', null);
      detailDataSet.current.set('exchangeRate', null);
      detailDataSet.current.set('totalAmount', 0);
      detailDataSet.current.set('paymentMethod', null);
      detailDataSet.current.set('paymentDeadline', null);
      detailDataSet.current.set('taxRate', null);
      detailDataSet.current.set('poVersion', null);
      detailDataSet.current.set('externalId', null);
      detailDataSet.current.set('externalNum', null);
      // detailDataSet.current.set('approvalRule', null);
      detailDataSet.children.lineList.reset();
    }
    if (value) {
      const { documentTypeId, documentTypeCode } = value;
      queryDocNumUpate(Object.assign({}, { documentTypeId, documentTypeCode }));
    }
  }

  /**
   * 改变重要字段的响应：ScmOuObj
   */
  function handleChangeScmOuObj(value, oldValue) {
    if (value !== null) {
      changeFlagy(false);
    } else {
      changeFlagy(true);
    }
    if (oldValue !== undefined) {
      detailDataSet.current.set('supplierObj', null);
      detailDataSet.current.set('buyerObj', null);
      detailDataSet.current.set('receiveOrgObj', null);
      detailDataSet.current.set('supplierContact', null);
      detailDataSet.current.set('contactPhone', null);
      detailDataSet.current.set('remark', null);
      detailDataSet.current.set('contactEmail', null);
      detailDataSet.current.set('currencyObj', null);
      detailDataSet.current.set('exchangeRate', null);
      detailDataSet.current.set('totalAmount', 0);
      detailDataSet.current.set('paymentMethod', null);
      detailDataSet.current.set('paymentDeadline', null);
      detailDataSet.current.set('taxRate', null);
      detailDataSet.current.set('poVersion', null);
      detailDataSet.current.set('externalId', null);
      detailDataSet.current.set('externalNum', null);
      // detailDataSet.current.set('approvalRule', null);
      detailDataSet.children.lineList.reset();
    }
  }

  /**
   *  改变重要字段的响应：Supplier 修改供应商值集视图
   */
  function handleChangeSupplier(oldValue) {
    if (oldValue !== undefined) {
      detailDataSet.current.set('supplierSiteObj', null);
      detailDataSet.current.set('buyerObj', null);
      detailDataSet.current.set('receiveOrgObj', null);
      detailDataSet.current.set('remark', null);
      detailDataSet.current.set('currencyObj', {
        currencyId: oldValue.currencyId,
        currencyCode: oldValue.currency,
        currencyName: oldValue.currencyName,
      });
      detailDataSet.current.set('exchangeRate', null);
      detailDataSet.current.set('totalAmount', 0);
      detailDataSet.current.set('paymentMethod', oldValue.paymentMethod);
      detailDataSet.current.set('paymentDeadline', oldValue.paymentDeadline);
      detailDataSet.current.set('taxRate', oldValue.taxRate);
      detailDataSet.current.set('poVersion', null);
      detailDataSet.current.set('externalId', null);
      detailDataSet.current.set('externalNum', null);
      // detailDataSet.current.set('approvalRule', null);
      detailDataSet.children.lineList.reset();
      if (!detailDataSet.current.get('supplierSiteId')) {
        detailDataSet.current.set('supplierContact', oldValue.contact);
        detailDataSet.current.set('contactPhone', oldValue.phoneNumber);
        detailDataSet.current.set('contactEmail', oldValue.email);
      }
    }
  }

  /**
   *  改变重要字段的响应：SupplierSite
   */
  function handleChangeSupplierSite(oldValue) {
    if (oldValue !== undefined) {
      detailDataSet.current.set('buyerObj', null);
      detailDataSet.current.set('receiveOrgObj', null);
      detailDataSet.current.set('supplierContact', oldValue.contact);
      detailDataSet.current.set('contactPhone', oldValue.phoneNumber);
      detailDataSet.current.set('remark', null);
      detailDataSet.current.set('contactEmail', oldValue.email);
      detailDataSet.current.set('currencyObj', null);
      detailDataSet.current.set('exchangeRate', null);
      detailDataSet.current.set('totalAmount', 0);
      detailDataSet.current.set('paymentMethod', null);
      detailDataSet.current.set('paymentDeadline', null);
      detailDataSet.current.set('taxRate', null);
      detailDataSet.current.set('poVersion', null);
      detailDataSet.current.set('externalId', null);
      detailDataSet.current.set('externalNum', null);
      // detailDataSet.current.set('approvalRule', null);
      detailDataSet.children.lineList.reset();
    }
  }

  /**
   *  改变重要字段的响应：Org
   */
  function handleChangeOrg(oldValue) {
    if (oldValue !== undefined) {
      detailDataSet.current.set('totalAmount', 0);
      detailDataSet.children.lineList.reset();
    }
  }

  function handleAdd() {
    changeVisible(true);
  }

  async function handleOk() {
    const validateValue = await detailDataSet.validate(false, false);

    if (!validateValue) {
      notification.error({
        message: intl.get('hzero.common.view.message.valid.error').d('数据校验失败'),
      });
      return;
    }
    const res = await detailDataSet.submit(false, false);
    if (res && res.failed && res.message) {
      notification.error({
        message: res.message,
      });
      throw new Error(res);
    }
    changeVisible(false);
    changeComFlag(false);
    detailDataSet.remove(detailDataSet.current);
    history.push({
      pathname: `/lscm/po-qty-list/detail/create`,
    });
  }

  function handleCancel() {
    changeVisible(false);
    detailDataSet.remove(detailDataSet.current);
    history.push({
      pathname: `/lscm/po-qty-list/detail/create`,
    });
  }

  function handleCopy() {
    if (!comFlag) {
      const dataCopy = detailDataSet.current.toData();
      dataCopy.poNum = null;
      dataCopy.poId = null;
      dataCopy.poHeaderId = null;
      dataCopy.poStatus = 'NEW';
      dataCopy.poStatusMeaning = '新建';
      dataCopy.lastStatus = null;
      // dataCopy.lineList = null;
      dataCopy.lineList.forEach((i) => {
        const _i = i;
        _i.poLineStatus = 'NEW';
        _i.poLineStatusMeaning = '新建';
        _i.poLineId = null;
        _i.poHeaderId = null;
        _i.receivedQty = null;
        _i.inventoryQty = null;
        _i.qcNgQty = null;
        _i.returnedQty = null;
      });
      history.push({
        pathname: `/lscm/po-qty-list/detail/create`,
        state: { mode: 'copy' },
      });
      changeComFlag(true);
      detailDataSet.create(dataCopy);
    }
  }

  /**
   * 关闭
   */
  async function handleClose() {
    if (!comFlag) {
      if (detailDataSet.current.data.poStatus !== 'NEW') {
        notification.warning({
          message: '警告',
          description: intl.get(`${preCode}.msg.justClose`).d('存在不允许关闭的数据'),
        });
      } else {
        Modal.confirm({
          title: intl.get(`${preCode}.msg.isClose`).d('是否关闭'),
          content: '',
          onOk() {
            const { params: { poHeaderId = '' } = {} } = match;
            const data = [poHeaderId];
            closePoAPI(data).then((res) => {
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
                detailDataSet.query();
              }
            });
          },
          onCancel() {},
        });
      }
    }
  }

  /**
   * 取消
   */
  async function handleCancelApi() {
    if (!comFlag) {
      if (
        detailDataSet.current.data.poStatus !== 'NEW' &&
        detailDataSet.current.data.poStatus !== 'APPROVING' &&
        detailDataSet.current.data.poStatus !== 'APPROVED'
      ) {
        notification.warning({
          message: '警告',
          description: intl.get(`${preCode}.msg.justCancel`).d('只能取消新建、审批状态的数据'),
        });
      } else {
        Modal.confirm({
          title: intl.get(`${preCode}.msg.isCancel`).d('是否取消'),
          content: '',
          onOk() {
            const { params: { poHeaderId = '' } = {} } = match;
            const data = [poHeaderId];
            cancelPoAPI(data).then((res) => {
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
                detailDataSet.query();
              }
            });
          },
          onCancel() {},
        });
      }
    }
  }

  /**
   * 提交
   */
  async function handleSubmitTo() {
    if (!comFlag) {
      if (detailDataSet.current.data.poStatus !== 'NEW') {
        notification.warning({
          message: '警告',
          description: intl.get(`${preCode}.msg.justNew`).d('只能选择新建状态的数据'),
        });
      } else {
        Modal.confirm({
          title: intl.get(`${preCode}.msg.isSubmit`).d('是否提交'),
          content: '',
          onOk() {
            const { params: { poHeaderId = '' } = {} } = match;
            const data = [poHeaderId];
            releasePoAPI(data).then((res) => {
              if (res && res.failed) {
                notification.error({
                  message: '错误',
                  description: intl.get(`${preCode}.msg.submitError`).d('提交失败'),
                });
              } else {
                notification.success({
                  message: '成功',
                  description: intl.get(`${preCode}.msg.submitSuccess`).d('提交成功'),
                });
                detailDataSet.query();
              }
            });
          },
          onCancel() {},
        });
      }
    }
  }

  async function handleLineItemChange(rec, record) {
    if (rec) {
      record.set('uomObj', {
        uomId: rec.uomId,
        uomCode: rec.uom,
        uomName: rec.uomName,
      });
      record.set('receiveWarehouseObj', {
        warehouseId: rec.scmReceiveWarehouseId,
        warehouseCode: rec.scmReceiveWarehouseCode,
        warehouseName: rec.scmReceiveWarehouseName,
      });
      record.set('receiveWmAreaObj', {
        wmAreaId: rec.scmReceiveWmAreaId,
        wmAreaCode: rec.scmReceiveWmAreaCode,
        wmAreaName: rec.scmReceiveWmAreaName,
      });
      record.set('inventoryWarehouseObj', {
        warehouseId: rec.scmInventoryWarehouseId,
        warehouseCode: rec.scmInventoryWarehouseCode,
        warehouseName: rec.scmInventoryWarehouseName,
      });
      record.set('inventoryWmAreaObj', {
        wmAreaId: rec.scmInventoryWmAreaId,
        wmAreaCode: rec.scmInventoryWmAreaCode,
        wmAreaName: rec.scmInventoryWmAreaName,
      });
      const { scmOuId, scmOuCode, supplierId, supplierCode } = detailDataSet.current.toJSONData();
      const res = await getItemSupplierAPI({
        scmOuId,
        scmOu: scmOuCode,
        supplierId,
        supplier: supplierCode,
        itemId: rec.itemId,
        itemCode: rec.itemCode,
      });
      if (res && res.receiveRule) {
        record.set('receiveRule', res.receiveRule);
      }
    } else {
      record.set('uomObj', null);
    }
  }

  // function handleBack() {
  //   // history.push('/lscm/po-qty-list');
  //   sessionStorage.setItem('purchaseOrderQuery', false);
  // }

  return (
    <React.Fragment key="posDetailMyItem">
      <Header
        title={intl.get(`${preCode}.view.title.scmPo`).d('采购订单')}
        backPath="/lscm/po-qty-list/list"
        isChange={dsDirty}
        // onBack={handleBack}
      >
        <Button
          disabled={comFlag}
          color={comFlag ? 'default' : 'primary'}
          onClick={() => handleAdd()}
        >
          {intl.get('hzero.common.button.add').d('新增')}
        </Button>
        <Button disabled={comFlag} onClick={() => handleClose()}>
          {intl.get('hzero.common.button.close').d('关闭')}
        </Button>
        <Button disabled={comFlag} onClick={() => handleCancelApi()}>
          {intl.get('hzero.common.button.cancel').d('取消')}
        </Button>
        <Button disabled={comFlag} onClick={() => handleCopy()}>
          {intl.get('hzero.common.button.copy').d('复制')}
        </Button>
        <Button disabled={comFlag} onClick={() => handleSubmitTo()}>
          {intl.get('hzero.common.button.submit').d('提交')}
        </Button>
        <Button onClick={() => handleSave()}>
          {intl.get('hzero.common.button.save').d('保存')}
        </Button>
        <Button disabled={comFlag} onClick={handleInspection}>
          {intl.get('hzero.common.button.inspect').d('报检')}
        </Button>
      </Header>
      <Content>
        <Card key="sales-order-detail-header" bordered={false} className={DETAIL_CARD_CLASSNAME}>
          <Form
            dataSet={detailDataSet}
            columns={4}
            style={!comFlag ? { display: 'none' } : { display: 'block' }}
          >
            <Lov
              name="scmOuObj"
              clearButton
              noCache
              onChange={(value, oldValue) => handleChangeScmOuObj(value, oldValue)}
            />
            <Lov
              name="poType"
              clearButton
              noCache
              onChange={(value, oldValue) => handleChangePoType(value, oldValue)}
            />
            <Lov
              name="supplierObj"
              clearButton
              noCache
              onChange={(oldValue) => handleChangeSupplier(oldValue)}
            />
            <Lov
              name="supplierSiteObj"
              clearButton
              noCache
              disabled={disableFlagx || disableFlagy || !siteFlag}
              onChange={(oldValue) => handleChangeSupplierSite(oldValue)}
            />
            <TextField name="poNum" disabled={ruleFlag || disableFlagx || disableFlagy} />
            <Lov name="buyerObj" clearButton noCache disabled={disableFlagx || disableFlagy} />
            <Lov
              name="receiveOrgObj"
              clearButton
              noCache
              disabled={disableFlagx || disableFlagy}
              onChange={(oldValue) => handleChangeOrg(oldValue)}
            />
            <Select name="poStatus" disabled />
            <TextField name="supplierContact" disabled={disableFlagx || disableFlagy} />
            <TextField name="contactPhone" disabled={disableFlagx || disableFlagy} />
            <TextField name="remark" colSpan={2} disabled={disableFlagx || disableFlagy} />
            {MoreDetail && (
              <TextField name="contactEmail" disabled={disableFlagx || disableFlagy} />
            )}
            {MoreDetail && (
              <Lov name="currencyObj" clearButton noCache disabled={disableFlagx || disableFlagy} />
            )}
            {MoreDetail && (
              <TextField name="exchangeRate" disabled={disableFlagx || disableFlagy} />
            )}
            {MoreDetail && <TextField name="totalAmount" disabled />}
            {MoreDetail && <Select name="paymentMethod" disabled={disableFlagx || disableFlagy} />}
            {MoreDetail && (
              <Select name="paymentDeadline" disabled={disableFlagx || disableFlagy} />
            )}
            {MoreDetail && <TextField name="taxRate" disabled={disableFlagx || disableFlagy} />}
            {MoreDetail && <TextField name="poVersion" />}
            {MoreDetail && <TextField name="externalId" disabled={disableFlagx || disableFlagy} />}
            {MoreDetail && <TextField name="externalNum" disabled={disableFlagx || disableFlagy} />}
            {MoreDetail && <Select name="approvalRule" disabled />}
          </Form>
          <div style={{ display: 'block' }}>
            <Form
              dataSet={detailDataSet}
              columns={4}
              style={comFlag ? { display: 'none' } : { display: 'block' }}
            >
              <Lov name="scmOuObj" clearButton noCache disabled />
              <Lov name="poType" clearButton noCache disabled />
              <Lov name="supplierObj" clearButton noCache disabled />
              <Lov name="supplierSiteObj" clearButton noCache disabled />
              <TextField name="poNum" disabled />
              <Lov name="buyerObj" clearButton noCache />
              <Lov name="receiveOrgObj" clearButton noCache disabled />
              <Select name="poStatus" disabled />
              <TextField name="supplierContact" />
              <TextField name="contactPhone" />
              <TextField name="remark" colSpan={2} />
              {MoreDetail && <TextField name="contactEmail" />}
              {MoreDetail && <Lov name="currencyObj" clearButton noCache disabled />}
              {MoreDetail && <TextField name="exchangeRate" disabled />}
              {MoreDetail && <TextField name="totalAmount" disabled />}
              {MoreDetail && <Select name="paymentMethod" disabled />}
              {MoreDetail && <Select name="paymentDeadline" disabled />}
              {MoreDetail && <TextField name="taxRate" disabled />}
              {MoreDetail && <TextField name="poVersion" />}
              {MoreDetail && <TextField name="externalId" disabled />}
              {MoreDetail && <TextField name="externalNum" disabled />}
              {MoreDetail && <Select name="approvalRule" disabled />}
            </Form>
            <div
              style={{
                display: MoreDetail ? 'inline-block' : 'none',
                width: '25%',
                marginTop: '-50px',
                marginLeft: '75%',
                position: 'absolute',
                lineHeight: '50px',
                paddingLeft: 15,
              }}
            >
              <a style={{ marginRight: '35px', marginLeft: '35px' }} disabled>
                {intl.get(`${preCode}.model.approvalChart`).d('审批流程')}
              </a>
              <a>{intl.get(`${preCode}.model.docProcessRule`).d('单据处理规则')}</a>
            </div>
          </div>
          <Divider>
            <div>
              <span onClick={() => changgeMoreDetail(!MoreDetail)} style={{ cursor: 'pointer' }}>
                {!MoreDetail
                  ? `${intl.get('hzero.common.button.expand').d('展开')}`
                  : `${intl.get(`hzero.common.button.hidden`).d('隐藏')}`}
              </span>
              <Icon type={!MoreDetail ? 'expand_more' : 'expand_less'} />
            </div>
          </Divider>
          <Modal
            visible={AddVisible}
            onOk={() => handleOk()}
            onCancel={() => handleCancel()}
            width={300}
            center
          >
            {intl.get(`${preCode}.msg.isSave`).d('是否确定保存本条数据？')}
          </Modal>
        </Card>
        <Card
          key="sales-order-detail-line"
          bordered={false}
          className={DETAIL_CARD_TABLE_CLASSNAME}
        >
          <LineList
            tableDS={detailDataSet}
            comFlag={comFlag}
            disableFlagx={disableFlagx}
            disableFlagy={disableFlagy}
            onLineItemChange={handleLineItemChange}
          />
        </Card>
      </Content>
    </React.Fragment>
  );
};

export default connect(({ PurchaseOrderModel }) => ({
  purchaseOrderModelData: PurchaseOrderModel?.purchaseOrderModelData || {},
}))(formatterCollections({ code: ['lscm.pos', 'lscm.common'] })(withRouter(PosDetailList)));
