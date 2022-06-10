/**
 * @Description: 对账单创建/维护明细
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2020-12-15 14:15:19
 */

import React, { useState, useEffect, Fragment } from 'react';
import { connect } from 'dva';
import { DataSet, Button, Form, TextField, Select, TextArea, Tabs, Table } from 'choerodon-ui/pro';
import { Upload } from 'choerodon-ui';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import { HZERO_FILE } from 'utils/config';
import notification from 'utils/notification';
import formatterCollections from 'utils/intl/formatterCollections';
import { getCurrentOrganizationId, getAccessToken } from 'utils/utils';
import { useDataSet } from 'hzero-front/lib/utils/hooks';
import { downloadFile } from 'services/api';
import { getSerialNum, findStrIndex } from '@/utils/renderer';
import {
  statementDetailHeadDS,
  statementDetailAmountDS,
  statementDetailLineDS,
} from '../store/StatementMaintainDS';
import './index.less';

const { TabPane } = Tabs;
const intlPrefix = 'zcom.statementMaintain';
const organizationId = getCurrentOrganizationId();
const DetailHeadDS = (roleType) => new DataSet({ ...statementDetailHeadDS(roleType) });
const DetailAmountDS = (roleType) => new DataSet({ ...statementDetailAmountDS(roleType) });
const DetailLineDS = (roleType) => new DataSet({ ...statementDetailLineDS(roleType) });

function ZcomStatementDetail({ dispatch, match, history, ids }) {
  const roleType = getRoleType(); // 当前角色类型 供应商supplier或者核企coreCompany
  const HeadDS = useDataSet(() => DetailHeadDS(roleType), ZcomStatementDetail);
  const AmountDS = useDataSet(() => DetailAmountDS(roleType));
  const LineDS = useDataSet(() => DetailLineDS(roleType));
  const {
    params: { type, verificationOrderId },
  } = match;
  const [headShow, setHeadShow] = useState(true);
  const [curTab, setCurTab] = useState('amount');
  const [canEdit, setCanEdit] = useState(true);
  const [saveLoading, setSaveLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [orderPriceFlag, setOrderPriceFlag] = useState(false); // 是否允许整单调价
  const [linePirceFlag, setLinePirceFlag] = useState(false); // 是否允许单行调价

  // 通过截取路由地址的内容获取当前角色类型
  function getRoleType() {
    const { pathname } = location;
    const pIndex = findStrIndex(pathname, '/', 2);
    const nIndex = findStrIndex(pathname, '/', 3);
    return pathname.substring(pIndex + 1, nIndex);
  }

  useEffect(() => {
    HeadDS.setQueryParameter('verificationOrderId', null);
    AmountDS.setQueryParameter('verificationOrderId', null);
    LineDS.setQueryParameter('verificationOrderId', null);
    HeadDS.data = [];
    AmountDS.data = [];
    LineDS.data = [];
    HeadDS.create();
    AmountDS.clearCachedSelected();
    LineDS.clearCachedSelected();
    if (type === 'create') {
      HeadDS.setQueryParameter('idList', ids);
      AmountDS.setQueryParameter('idList', ids);
      LineDS.setQueryParameter('idList', ids);
    } else {
      HeadDS.setQueryParameter('verificationOrderId', verificationOrderId);
      AmountDS.setQueryParameter('verificationOrderId', verificationOrderId);
      LineDS.setQueryParameter('verificationOrderId', verificationOrderId);
    }
    handleSearch();
  }, [verificationOrderId]);

  // 获取调价规则
  function getPriceFlag() {
    dispatch({
      type: 'statementMaintain/getSettingDetail',
      payload: {
        supplierId: HeadDS.current.get('supplierId'),
        orderConfigType: 'ADJUST_PRICE',
        customerTenantId: HeadDS.current.get('customerTenantId'),
        poTypeCode: HeadDS.current.get('poTypeCode'),
      },
    }).then((res) => {
      if (res && !res.failed && res[0]) {
        setOrderPriceFlag(!!res[0].orderPriceFlag);
        setLinePirceFlag(!!res[0].linePirceFlag);
      }
    });
  }

  async function handleSearch() {
    await HeadDS.query();
    setCanEdit(
      type === 'create' || ['NEW', 'REFUSED'].includes(HeadDS.current.data.verificationOrderStatus)
    );
    getPriceFlag();
    AmountDS.query();
    LineDS.query();
  }

  function handleToggle() {
    setHeadShow(!headShow);
  }

  function handleTabChange(key) {
    setCurTab(key);
  }

  function handleSave() {
    setSaveLoading(true);
    return new Promise(async (resolve) => {
      const validateHead = await HeadDS.current.validate(true, false);
      if (!validateHead) {
        notification.warning({
          message: '数据校验不通过',
        });
        resolve(setSaveLoading(false));
        return false;
      }
      const headData = HeadDS.current.data;
      const amountData = AmountDS.data[0].toData();
      const verificationOrderLineList = LineDS.data.map((item) => {
        const obj = Object.assign({}, item.toData(), {
          amountFlag: !amountData.afterAmount && amountData.afterAmount !== 0 ? 0 : 1,
        });
        return obj;
      });
      dispatch({
        type: 'statementMaintain/saveVerificationOrder',
        payload: {
          ...amountData,
          ...headData,
          amountFlag: !amountData.afterAmount && amountData.afterAmount !== 0 ? 0 : 1,
          verificationOrderStatus: 'NEW',
          verificationOrderLineList,
        },
      }).then((res) => {
        if (res && !res.failed) {
          notification.success({
            message: '操作成功',
          });
          if (verificationOrderId) {
            handleSearch();
          } else {
            const pathName = `/zcom/statement-maintain/${roleType}/detail/${res.verificationOrderId}`;
            history.push(pathName);
          }
        }
        resolve(setSaveLoading(false));
      });
    });
  }

  function handleSubmit() {
    setSubmitLoading(true);
    return new Promise(async (resolve) => {
      const validateHead = await HeadDS.current.validate(true, false);
      const validateAmount = await AmountDS.validate(true, false);
      const validateLine = await LineDS.validate(true, false);
      const hasEmptyVerificationQty = LineDS.data.findIndex((item) => {
        const verificationQty = item.get('verificationQty');
        return verificationQty === undefined || verificationQty === null;
      });
      if (!validateHead || !validateAmount || !validateLine || hasEmptyVerificationQty !== -1) {
        notification.warning({
          message: '数据校验不通过',
        });
        resolve(setSubmitLoading(false));
        return false;
      }
      const headData = HeadDS.current.data;
      const amountData = AmountDS.data[0].toData();
      const verificationOrderLineList = LineDS.data.map((item) => {
        const obj = Object.assign({}, item.toData(), {
          amountFlag: !amountData.afterAmount && amountData.afterAmount !== 0 ? 0 : 1,
        });
        return obj;
      });
      dispatch({
        type: 'statementMaintain/saveVerificationOrder',
        payload: {
          ...amountData,
          ...headData,
          amountFlag: !amountData.afterAmount && amountData.afterAmount !== 0 ? 0 : 1,
          verificationOrderStatus: 'RELEASED',
          verificationOrderLineList,
        },
      }).then((res) => {
        if (res && !res.failed) {
          notification.success({
            message: '操作成功',
          });
          dispatch({
            type: 'statementMaintain/updateState',
            payload: {
              currentTab: 'maintain',
            },
          });
          const pathName = `/zcom/statement-maintain/${roleType}`;
          history.push(pathName);
        }
        resolve(setSubmitLoading(false));
      });
    });
  }

  const uploadData = (file) => {
    return {
      fileName: file.name,
      bucketName: 'zcom',
      directory: 'zcom',
    };
  };

  // 上传头附件
  const handleHeadUploadSuccess = (res) => {
    if (res && !res.failed) {
      notification.success({
        message: '上传成功',
      });
      HeadDS.current.set('fileUrl', res);
    } else {
      notification.error({
        message: '上传失败',
      });
    }
  };

  // 上传行附件
  const handleLineUploadSuccess = (res) => {
    if (res && !res.failed) {
      notification.success({
        message: '上传成功',
      });
      LineDS.current.set('fileUrl', res);
    } else {
      notification.error({
        message: '上传失败',
      });
    }
  };

  const uploadHeadProps = {
    headers: {
      Authorization: `bearer ${getAccessToken()}`,
    },
    accept: '*',
    action: `${HZERO_FILE}/v1/${organizationId}/files/multipart`,
    data: uploadData,
    onSuccess: handleHeadUploadSuccess,
    showUploadList: false,
  };

  const uploadProps = {
    headers: {
      Authorization: `bearer ${getAccessToken()}`,
    },
    accept: '*',
    action: `${HZERO_FILE}/v1/${organizationId}/files/multipart`,
    data: uploadData,
    onSuccess: handleLineUploadSuccess,
  };

  // 查看行附件
  function downloadLineFile(file) {
    const api = `${HZERO_FILE}/v1/${organizationId}/files/download`;
    downloadFile({
      requestUrl: api,
      queryParams: [
        { name: 'bucketName', value: 'zcom' },
        { name: 'directory', value: 'zcom' },
        { name: 'url', value: file },
      ],
    });
  }

  const amountColumns = [
    { name: 'excludingTaxAmount', width: 150 },
    { name: 'amount', width: 150 },
    { name: 'taxAmount', width: 150 },
    { name: 'currencyObj', width: 150, editor: canEdit },
    { name: 'afterAmount', width: 150, editor: canEdit && orderPriceFlag },
    { name: 'allocationRuleObj', width: 150, editor: canEdit },
  ];

  const lineColumns = [
    {
      header: '序号',
      width: 60,
      lock: true,
      renderer: ({ record }) => getSerialNum(record),
    },
    { name: 'customerItemCode', width: 150 },
    { name: 'customerItemDescription', width: 150 },
    { name: 'supplierItemCode', width: 150 },
    { name: 'supplierItemDescription', width: 150 },
    { name: 'deliveryQty', width: 150 },
    { name: 'receivedQty', width: 150 },
    { name: 'totalVerificationQty', width: 150 },
    { name: 'reconcilableQty', width: 150 },
    { name: 'verificationQty', width: 150, editor: canEdit },
    { name: 'uomName', width: 150 },
    { name: 'beforeExcludingTaxPrice', width: 150 },
    { name: 'beforeExcludingTaxAmount', width: 150 },
    { name: 'beforePrice', width: 150 },
    { name: 'beforeAmount', width: 150 },
    { name: 'afterAmount', width: 150, editor: canEdit && linePirceFlag },
    { name: 'currencyCode', width: 150 },
    { name: 'taxRate', width: 150 },
    { name: 'lineRemark', width: 150, editor: canEdit },
    {
      name: 'fileUrl',
      width: 150,
      renderer: ({ value }) => {
        return canEdit ? (
          <Upload {...uploadProps}>
            <span style={{ cursor: 'pointer' }}>上传附件</span>
          </Upload>
        ) : (
          <span style={{ cursor: 'pointer' }} onClick={() => downloadLineFile(value)}>
            {value ? '查看附件' : ''}
          </span>
        );
      },
    },
  ];

  return (
    <Fragment>
      <Header
        title={
          type === 'create'
            ? intl.get(`${intlPrefix}.view.title.statementCreate`).d('对账单创建')
            : intl.get(`${intlPrefix}.view.title.statementMaintain`).d('对账单维护')
        }
        backPath={`/zcom/statement-maintain/${roleType}/list`}
      >
        <Button color="primary" onClick={handleSave} loading={saveLoading} disabled={!canEdit}>
          保存
        </Button>
        <Button color="primary" onClick={handleSubmit} loading={submitLoading} disabled={!canEdit}>
          保存并提交
        </Button>
        <Upload {...uploadHeadProps} disabled={!canEdit}>
          <Button disabled={!canEdit}>上传附件</Button>
        </Upload>
      </Header>
      <Content>
        <div className="zcom-statement-headInfo">
          <span>对账单表头</span>
          <span className="headInfo-toggle" onClick={handleToggle}>
            {headShow ? '收起' : '展开'}
          </span>
        </div>
        {headShow ? (
          <Form dataSet={HeadDS} columns={3}>
            <TextField name="verificationOrderNum" key="verificationOrderNum" disabled />
            <Select name="verificationOrderType" key="verificationOrderType" disabled={!canEdit} />
            {roleType === 'coreCompany' && (
              <TextField name="supplierName" key="supplierName" disabled />
            )}
            {roleType === 'supplier' && (
              <TextField name="customerName" key="customerName" disabled />
            )}
            <TextField name="amount" key="amount" disabled />
            <TextField name="submitDate" key="submitDate" disabled />
            <TextField name="createUserName" key="createUserName" disabled />
            <TextArea newLine name="remark" key="remark" colSpan={2} disabled={!canEdit} />
          </Form>
        ) : null}
        <Tabs defaultActiveKey={curTab} onChange={handleTabChange}>
          <TabPane tab="对账总额" key="amount">
            <Table dataSet={AmountDS} columns={amountColumns} columnResizable="true" />
          </TabPane>
          <TabPane tab="对账明细" key="detail">
            <Table dataSet={LineDS} columns={lineColumns} columnResizable="true" />
          </TabPane>
        </Tabs>
      </Content>
    </Fragment>
  );
}

export default connect(({ statementMaintain: { ids } }) => ({ ids }))(
  formatterCollections({
    code: [`${intlPrefix}`],
  })(ZcomStatementDetail)
);
