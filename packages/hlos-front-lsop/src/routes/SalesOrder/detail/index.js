/**
 * @Description: 销售订单新建/详情页面
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2020-02-24 14:18:08
 * @LastEditors: yu.na
 */
import React, { useState, useEffect, useMemo } from 'react';
import {
  Lov,
  Form,
  Select,
  TextField,
  NumberField,
  Button,
  Modal,
  DataSet,
  DatePicker,
} from 'choerodon-ui/pro';
import { Divider, Card, Icon, Tooltip } from 'choerodon-ui';
import { isEmpty } from 'lodash';
import { getResponse } from 'utils/utils';
import intl from 'utils/intl';
import { DETAIL_CARD_CLASSNAME, DETAIL_CARD_TABLE_CLASSNAME } from 'utils/constants';
import notification from 'utils/notification';
import { Header, Content } from 'components/Page';
import { queryLovData, userSetting } from 'hlos-front/lib/services/api';
import { SoDetailDS } from '@/stores/salesOrderDS';
import { releaseSo, cancelSo, closeSo } from '@/services/salesOrderService';
import codeConfig from '@/common/codeConfig';

import LineList from './DetailLineList';

const { common } = codeConfig.code;

const preCode = 'lsop.salesOrder';

export default ({ match, history, location }) => {
  const detailDS = useMemo(() => new DataSet(SoDetailDS()), []);
  const [showFlag, setShowFlag] = useState(false);
  const [createFlag, setCreateFlag] = useState(true);
  const [allDisabled, setAllDisabled] = useState(false);
  const [sopOuObj, setSopOuObj] = useState(null);
  const [soTypeObj, setSoTypeObj] = useState(null);
  // const [ customerObj, setCustomerObj ] = useState(null);
  const [customerPo, setCustomerPo] = useState(null);
  const [customerPoLine, setCustomerPoLine] = useState(null);
  const [dsDirty, setDSDirty] = useState(false);
  const [numDisabled, setNumDisabled] = useState(true);
  const [docProcessRule, setDocProcessRule] = useState(null);
  const [siteDisabled, setSiteDisabled] = useState(true);

  useEffect(() => {
    const { soHeaderId } = match.params;
    const { state } = location;
    /**
     *设置默认查询条件
     */
    async function defaultLovSetting() {
      const res = await Promise.all([
        queryLovData({ lovCode: common.sopOu, defaultFlag: 'Y' }),
        queryLovData({ lovCode: common.worker, defaultFlag: 'Y', workerType: 'SALESMAN' }),
        userSetting({ defaultFlag: 'Y' }),
      ]);
      if (getResponse(res)) {
        if (res[0] && res[0].content && res[0].content[0]) {
          detailDS.current.set('sopOuObj', {
            sopOuId: res[0].content[0].sopOuId,
            sopOuCode: res[0].content[0].sopOuCode,
            sopOuName: res[0].content[0].sopOuName,
          });
          setSopOuObj({
            sopOuId: res[0].content[0].sopOuId,
            sopOuCode: res[0].content[0].sopOuCode,
            sopOuName: res[0].content[0].sopOuName,
          });
        }
        if (res[1] && res[1].content && res[1].content[0]) {
          detailDS.current.set('salesmanObj', {
            workerId: res[1].content[0].workerId,
            workerName: res[1].content[0].workerName,
            workerCode: res[1].content[0].workerCode,
          });
        }
        if (res[2] && res[2].content && res[2].content[0]) {
          if (res[2].content[0].soTypeCode) {
            const typeRes = await queryLovData({
              lovCode: common.documentType,
              documentTypeCode: res[2].content[0].soTypeCode,
            });
            if (typeRes && typeRes.content && typeRes.content[0]) {
              detailDS.current.set('soTypeObj', {
                documentTypeId: typeRes.content[0].documentTypeId,
                documentTypeCode: typeRes.content[0].documentTypeCode,
                documentTypeName: typeRes.content[0].documentTypeName,
                docProcessRuleId: typeRes.content[0].docProcessRuleId,
                docProcessRule: typeRes.content[0].docProcessRule,
                approvalRule: typeRes.content[0].approvalRule,
              });
              setSoTypeObj({
                documentTypeId: typeRes.content[0].documentTypeId,
                documentTypeCode: typeRes.content[0].documentTypeCode,
                documentTypeName: typeRes.content[0].documentTypeName,
                docProcessRuleId: typeRes.content[0].docProcessRuleId,
                docProcessRule: typeRes.content[0].docProcessRule,
                approvalRule: typeRes.content[0].approvalRule,
              });
              checkDocRule(typeRes.content[0].docProcessRule);
            }
          }
        }
      }
    }

    /**
     * 查询并校验状态
     */
    async function query(id) {
      detailDS.queryParameter = { soHeaderId: id };
      await detailDS.query().then((res) => {
        if (getResponse(res) && res.content && res.content[0]) {
          setCustomerPo(res.content[0].customerPo);
          setCustomerPoLine(res.content[0].customerPoLine);
          checkSoStatus(res);
          setDocProcessRule(res.content[0].docProcessRule);
        }
      });
    }

    function updateDSDirty() {
      setDSDirty(detailDS.dirty);
    }

    function addDirtyDetect() {
      detailDS.addEventListener('update', updateDSDirty);
      detailDS.addEventListener('create', updateDSDirty);
      detailDS.addEventListener('remove', updateDSDirty);
    }

    if (soHeaderId) {
      query(soHeaderId);
      setCreateFlag(false);
      addDirtyDetect();
    } else {
      if (state && state.mode && state.mode === 'copy') {
        if (detailDS.current) {
          detailDS.remove(detailDS.current);
        }
        detailDS.create(state.data, 0);
        checkDocRule(state.data.docProcessRule);
        return;
      }
      defaultLovSetting().then(addDirtyDetect);
    }

    return () => {
      detailDS.removeEventListener('update', updateDSDirty);
      detailDS.removeEventListener('create', updateDSDirty);
      detailDS.removeEventListener('remove', updateDSDirty);
    };
  }, [detailDS]);

  /*
   **刷新页面
   */
  async function refreshPage() {
    const { soHeaderId } = match.params;
    detailDS.queryParameter = { soHeaderId };
    await detailDS.query();
  }

  /*
   **检查当前销售订单状态
   */
  function checkSoStatus(result) {
    if (result && result.content && result.content[0]) {
      if (
        result.content[0].soStatus === 'APPROVING' ||
        result.content[0].soStatus === 'CLOSED' ||
        result.content[0].soStatus === 'CANCELLED' ||
        result.content[0].soStatus === 'REFUSED'
      ) {
        setAllDisabled(true);
      }
    }
  }
  /**
   *新增
   */
  async function handleAdd() {
    Modal.confirm({
      children: <p>是否确定保存本条数据？</p>,
      okText: '是',
      cancelText: '否',
      onOk: () => handleModalOk(),
      onCancel: () => handleModalCancel(),
    });
  }

  function handleModalOk() {
    handleSave(true);
  }

  function handleModalCancel() {
    const pathname = `/lsop/sales-order/create`;
    history.push(pathname);
  }

  /**
   *提交
   */
  function handleSubmit() {
    if (detailDS.current.data.soStatus === 'NEW') {
      releaseSo([detailDS.current.data.soHeaderId]).then(async (res) => {
        if (res && res.failed && res.message) {
          notification.error({
            message: res.message,
          });
        } else {
          notification.success();
          await detailDS.query().then((result) => {
            checkSoStatus(result);
          });
        }
      });
    } else {
      notification.error({
        message: intl
          .get(`${preCode}.view.message.submitLimit`)
          .d('只有新增状态的销售订单才允许提交!'),
      });
    }
  }

  /**
   *复制
   */
  function handleCopy() {
    const cloneData = detailDS.current.toData();
    cloneData.soNumObj = {
      soHeaderId: null,
      soHeaderNumber: null,
    };
    cloneData.soNum = null;
    cloneData.soHeaderId = null;
    cloneData.soLineList.forEach((i) => {
      const _i = i;
      _i.soHeaderId = null;
      _i.soLineId = null;
    });
    history.push({
      pathname: '/lsop/sales-order/create',
      state: {
        mode: 'copy',
        data: {
          ...cloneData,
          soStatus: 'NEW',
        },
      },
    });
    setCreateFlag(true);
  }

  /**
   *保存
   */
  async function handleSave(flag) {
    const validateValue = await detailDS.validate(false, false);
    if (!validateValue) {
      notification.error({
        message: intl.get('hzero.common.view.message.valid.error').d('数据校验失败'),
      });
      return;
    }
    const res = await detailDS.submit();
    if (res && res.failed && res.message) {
      notification.error({
        message: res.message,
      });
      throw new Error(res);
    } else if (res === undefined && !flag) {
      notification.info({
        message: intl.get('hzero.common.view.message.title.noChange').d('未修改数据'),
      });
      return;
    }
    if (flag) {
      const pathname = `/lsop/sales-order/create`;
      history.push(pathname);
      return;
    }
    sessionStorage.setItem('salesOrderIsSave', true);
    if (!createFlag) {
      refreshPage();
      setDSDirty(false);
    } else if (res && res.content && res.content[0]) {
      // 新建页面创建数据成功后跳转到详情页面
      const pathname = `/lsop/sales-order/detail/${res.content[0].soHeaderId}`;
      history.push(pathname);
      setDSDirty(false);
    }
  }

  /**
   *取消
   */
  function handleCancel() {
    if (
      detailDS.current.data.soStatus === 'NEW' ||
      detailDS.current.data.soStatus === 'APPROVING' ||
      detailDS.current.data.soStatus === 'RELEASED'
    ) {
      Modal.confirm({
        children: <p>{intl.get(`${preCode}.view.message.cancelSo`).d('是否取消销售订单')}</p>,
        onOk: () =>
          cancelSo([detailDS.current.data.soHeaderId]).then(async (res) => {
            if (res && res.failed && res.message) {
              notification.error({
                message: res.message,
              });
            } else {
              await detailDS.query().then((result) => {
                checkSoStatus(result);
              });
            }
          }),
      });
    } else {
      notification.error({
        message: intl
          .get(`${preCode}.view.message.cancelLimit`)
          .d('只有新增、审批中、已提交状态的销售订单才允许取消！'),
      });
    }
  }

  /**
   *关闭
   */
  function handleClose() {
    if (
      detailDS.current.soLineStatus !== 'CANCELLED' &&
      detailDS.current.soLineStatus !== 'CLOSED'
    ) {
      Modal.confirm({
        children: <p>{intl.get(`${preCode}.view.message.closeSo`).d('是否关闭销售订单')}</p>,
        onOk: () =>
          closeSo([detailDS.current.data.soHeaderId]).then(async (res) => {
            if (res && res.failed && res.message) {
              notification.error({
                message: res.message,
              });
            } else {
              await detailDS.query().then((result) => {
                checkSoStatus(result);
              });
            }
          }),
      });
    } else {
      notification.error({
        message: intl
          .get(`${preCode}.view.message.closeLimit`)
          .d('已取消、已关闭状态的销售订单不允许关闭！'),
      });
    }
  }

  /**
   * 切换显示隐藏
   */
  function handleToggle() {
    setShowFlag(!showFlag);
  }

  /**
   * 监听销售中心Lov字段变化
   * @param record 选中行信息
   */
  function handleSopChange(record) {
    if (record) {
      setSopOuObj({
        sopOuId: record.sopOuId,
        sopOuCode: record.sopOuCode,
        sopOuName: record.sopOuName,
      });
      handleReset();
      detailDS.current.set('sopOuObj', {
        sopOuId: record.sopOuId,
        sopOuCode: record.sopOuCode,
        sopOuName: record.sopOuName,
      });
    } else {
      handleReset();
    }
    if (soTypeObj) {
      detailDS.current.set('soTypeObj', soTypeObj);
    }
  }

  function checkDocRule(rule) {
    if (!isEmpty(rule)) {
      if (JSON.parse(rule).doc_num === 'manual') {
        setNumDisabled(false);
        detailDS.fields.get('soNum').set('required', true);
      } else {
        setNumDisabled(true);
        detailDS.fields.get('soNum').set('required', false);
        detailDS.current.set('soNum', null);
      }
      if (JSON.parse(rule).customer_site === 'enable') {
        setSiteDisabled(false);
        detailDS.fields.get('customerSiteObj').set('required', true);
        detailDS.fields.get('customerSiteObj').set('disabled', false);
      } else {
        setSiteDisabled(true);
        detailDS.fields.get('customerSiteObj').set('required', false);
        detailDS.fields.get('customerSiteObj').set('disabled', true);
      }
    } else {
      setNumDisabled(true);
      detailDS.fields.get('soNum').set('required', false);
      detailDS.current.set('soNum', null);
      setSiteDisabled(true);
      detailDS.fields.get('customerSiteObj').set('required', false);
      detailDS.fields.get('customerSiteObj').set('disabled', true);
      setDocProcessRule(null);
    }
  }

  /**
   * 监听订单类型Lov字段变化
   * @param record 选中行信息
   * @param oldRecord 上次选中行信息
   */
  function handleSoTypeChange(record) {
    if (record) {
      setSoTypeObj({
        documentTypeId: record.documentTypeId,
        documentTypeCode: record.documentTypeCode,
        documentTypeName: record.documentTypeName,
        docProcessRuleId: record.docProcessRuleId,
        docProcessRule: record.docProcessRule,
        approvalRule: record.approvalRule,
      });
      handleReset();
      detailDS.current.set('soTypeObj', {
        documentTypeId: record.documentTypeId,
        documentTypeCode: record.documentTypeCode,
        documentTypeName: record.documentTypeName,
        docProcessRuleId: record.docProcessRuleId,
        docProcessRule: record.docProcessRule,
        approvalRule: record.approvalRule,
      });
      setDocProcessRule(record.docProcessRule);
      checkDocRule(record.docProcessRule);
    } else {
      handleReset();
      setNumDisabled(true);
      detailDS.fields.get('soNum').set('required', false);
      setSiteDisabled(true);
      detailDS.fields.get('customerSiteObj').set('required', false);
      detailDS.fields.get('customerSiteObj').set('disabled', true);
      setDocProcessRule(null);
    }
    if (sopOuObj) {
      detailDS.current.set('sopOuObj', sopOuObj);
    }
  }

  /**
   * 监听客户编号Lov字段变化
   * @param record 选中行信息
   */
  async function handleCustomerChange(record) {
    if (record) {
      // setCustomerObj({
      //   customerId: record.customerId,
      //   customerNumber: record.customerNumber,
      //   customerName: record.customerName,
      // });
      handleReset();
      detailDS.current.set('customerObj', {
        customerId: record.customerId,
        customerNumber: record.customerNumber,
        customerName: record.customerName,
      });
      detailDS.current.set('currencyObj', {
        currencyId: record.currencyId,
        currencyCode: record.currency,
        currencyName: record.currencyName,
      });
      detailDS.current.set('salesmanObj', {
        workerId: record.salesmanId,
        // workerCode: record.salesman, 没返回 先不加
        workerName: record.salemanName,
      });
      detailDS.current.set('receiveAddress', record.address);
      detailDS.current.set('contactEmail', record.email);
      detailDS.current.set('contactPhone', record.phoneNumber);
      detailDS.current.set('customerContact', record.contact);
      detailDS.current.set('taxRate', record.taxRate);
      detailDS.current.set('paymentMethod', record.paymentMethod);
      detailDS.current.set('paymentDeadline', record.paymentDeadline);
      if (!siteDisabled) {
        const res = await queryLovData({
          lovCode: 'LMDS.CUSTOMER_SITE',
          customerId: record.customerId,
        });
        if (res && Array.isArray(res.content) && res.content.length) {
          detailDS.current.set('customerSiteObj', {
            customerSiteId: res.content[0].customerSiteId,
            customerSiteNumber: res.content[0].customerSiteNumber,
            customerSiteName: res.content[0].customerSiteName,
          });
        }
      }
    } else {
      handleReset();
    }
    if (sopOuObj) {
      detailDS.current.set('sopOuObj', sopOuObj);
    }
    if (soTypeObj) {
      detailDS.current.set('soTypeObj', soTypeObj);
    }
  }

  /**
   * 监听客户地点Lov字段变化
   * @param record 选中行信息
   * @param oldRecord 上次选中行信息
   */
  function handleCustomerSiteChange(record) {
    if (record) {
      detailDS.current.set('receiveAddress', record.address);
      detailDS.current.set('contactEmail', record.email);
      detailDS.current.set('contactPhone', record.phoneNumber);
      detailDS.current.set('customerContact', record.contact);
    } else {
      detailDS.current.set('receiveAddress', null);
      detailDS.current.set('contactEmail', null);
      detailDS.current.set('contactPhone', null);
      detailDS.current.set('customerContact', null);
    }
  }

  /**
   * 重置
   */
  function handleReset() {
    detailDS.current.reset();
    detailDS.children.soLineList.reset();
  }

  /**
   * 监听客户PO字段变化
   * @param value
   */
  function handleCustomerPoChange(value) {
    const { data } = detailDS.children.soLineList;
    setCustomerPo(value);
    if (data.length) {
      data.map((item) => {
        const dataItem = item;
        if (
          dataItem.soStatus !== 'CLOSED' &&
          dataItem.soStatus !== 'CANCELLED' &&
          dataItem.soStatus !== 'REFUSED'
        ) {
          dataItem.set('customerPo', value);
        }
        return dataItem;
      });
    }
  }

  /**
   * 监听客户PO行字段变化
   * @param value
   */
  function handleCustomerPoLineChange(value) {
    const { data } = detailDS.children.soLineList;
    setCustomerPoLine(value);
    if (data.length) {
      data.map((item) => {
        const dataItem = item;
        dataItem.set('customerPoLine', value);
        return dataItem;
      });
    }
  }

  return (
    <React.Fragment>
      <Header
        title={intl.get(`${preCode}.view.title.salesOrder`).d('销售订单')}
        backPath="/lsop/sales-order/list"
        isChange={dsDirty}
      >
        <Button
          icon="add"
          color={allDisabled || createFlag ? 'default' : 'primary'}
          onClick={handleAdd}
          disabled={allDisabled || createFlag}
        >
          {intl.get('hzero.common.button.add').d('新增')}
        </Button>
        <Button onClick={handleClose} disabled={allDisabled || createFlag}>
          {intl.get('hzero.common.button.close').d('关闭')}
        </Button>
        <Button onClick={handleCancel} disabled={allDisabled || createFlag}>
          {intl.get('hzero.common.button.cancel').d('取消')}
        </Button>
        <Button onClick={handleCopy} disabled={allDisabled || createFlag}>
          {intl.get('hzero.common.button.copy').d('复制')}
        </Button>
        <Button onClick={handleSubmit} disabled={allDisabled || createFlag}>
          {intl.get('hzero.common.button.submit').d('提交')}
        </Button>
        <Button onClick={() => handleSave()} disabled={allDisabled}>
          {intl.get('hzero.common.button.save').d('保存')}
        </Button>
      </Header>
      <Content>
        <Card key="sales-order-detail-header" bordered={false} className={DETAIL_CARD_CLASSNAME}>
          <Form dataSet={detailDS} columns={4}>
            <Lov
              name="sopOuObj"
              noCache
              disabled={!createFlag || allDisabled}
              onChange={handleSopChange}
            />
            <Lov
              name="soTypeObj"
              noCache
              disabled={!createFlag || allDisabled}
              onChange={handleSoTypeChange}
            />
            <Lov
              name="customerObj"
              noCache
              disabled={!createFlag || allDisabled}
              onChange={handleCustomerChange}
            />
            {/* <Lov name="customerSiteObj" noCache disabled={!createFlag || allDisabled} onChange={handleCustomerSiteChange} /> */}
            {/* <Lov name="soNumObj" noCache disabled={!createFlag || allDisabled} /> */}
            <Lov
              name="customerSiteObj"
              disabled={!createFlag}
              onChange={handleCustomerSiteChange}
            />
            <TextField name="soNum" disabled={numDisabled || !createFlag} />
            <Lov name="salesmanObj" noCache disabled={allDisabled} />
            <TextField name="customerName" disabled />
            <Select name="soStatus" disabled />
            <TextField name="customerContact" disabled={allDisabled} />
            <TextField name="contactPhone" disabled={allDisabled} />
            <TextField name="remark" colSpan={2} disabled={allDisabled} />
          </Form>
          <Divider>
            <div>
              <span onClick={handleToggle} style={{ cursor: 'pointer' }}>
                {!showFlag
                  ? `${intl.get('hzero.common.button.expand').d('展开')}`
                  : `${intl.get(`hzero.common.button.hidden`).d('隐藏')}`}
              </span>
              <Icon type={!showFlag ? 'expand_more' : 'expand_less'} />
            </div>
          </Divider>
          <div style={!showFlag ? { display: 'none' } : { display: 'block' }}>
            <Form dataSet={detailDS} columns={4}>
              <TextField
                name="customerPo"
                disabled={allDisabled}
                onChange={handleCustomerPoChange}
              />
              <TextField name="contactEmail" disabled={allDisabled} />
              <TextField name="receiveAddress" colSpan={2} disabled={allDisabled} />
              <TextField
                name="customerPoLine"
                disabled={allDisabled}
                onChange={handleCustomerPoLineChange}
              />
              <DatePicker name="customerOrderedTime" disabled={allDisabled} />
              <DatePicker name="soConfirmedTime" disabled={allDisabled} />
              <Lov name="currencyObj" noCache disabled={!createFlag || allDisabled} />
              <NumberField name="exchangeRate" disabled={!createFlag || allDisabled} />
              <NumberField name="totalAmount" disabled />
              <Select name="paymentDeadline" disabled={!createFlag || allDisabled} />
              <Select name="paymentMethod" disabled={!createFlag || allDisabled} />
              <NumberField name="taxRate" disabled={!createFlag || allDisabled} />
              <TextField name="soVersion" disabled />
              <NumberField name="externalId" disabled={!createFlag || allDisabled} />
              <TextField name="externalNum" disabled={!createFlag || allDisabled} />
              <Select name="approvalRule" disabled />
            </Form>
            <div
              style={{
                display: 'inline-block',
                width: '25%',
                marginTop: '-50px',
                marginLeft: '75%',
                position: 'absolute',
                lineHeight: '50px',
                paddingLeft: 15,
              }}
            >
              <a disabled>{intl.get(`${preCode}.model.approvalChart`).d('审批流程')}</a>
              <Tooltip placement="top" title={docProcessRule}>
                <a style={{ marginLeft: '15%' }}>
                  {intl.get(`${preCode}.model.docProcessRule`).d('单据处理规则')}
                </a>
              </Tooltip>
            </div>
          </div>
        </Card>
        <Card
          key="sales-order-detail-line"
          bordered={false}
          className={DETAIL_CARD_TABLE_CLASSNAME}
        >
          <LineList
            tableDS={detailDS}
            isCreate={createFlag}
            allDisabled={allDisabled}
            customerPo={customerPo}
            customerPoLine={customerPoLine}
          />
        </Card>
      </Content>
    </React.Fragment>
  );
};
