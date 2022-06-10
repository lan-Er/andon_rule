/**
 * @Description: 收到的对账单详情
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2021-05-10 22:29:18
 */

import React, { useState, useEffect, Fragment } from 'react';
import { DataSet, Button, Form, TextField, Tabs, Table } from 'choerodon-ui/pro';
import { Header, Content } from 'components/Page';
import ExcelExport from 'components/ExcelExport';
import intl from 'utils/intl';
import notification from 'utils/notification';
import formatterCollections from 'utils/intl/formatterCollections';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import { useDataSet } from 'hzero-front/lib/utils/hooks';
import { HLOS_ZCOM } from 'hlos-front/lib/utils/config';
import ItemAttributeSelect from '@/components/ItemAttributeSelect/index';
import { StatementHeadDS, StatementSummaryLineDS, StatementDetailLineDS } from '../store/indexDS';
import styles from './index.less';

const { TabPane } = Tabs;
const intlPrefix = 'zcom.statementVerify';
const organizationId = getCurrentOrganizationId();
const statementHeadDS = () => new DataSet(StatementHeadDS());
const statementSummaryLineDS = () => new DataSet(StatementSummaryLineDS());
const statementDetailLineDS = () => new DataSet(StatementDetailLineDS());

function ZcomStatementVerifyDetail({ match, dispatch, history }) {
  const {
    params: { verificationOrderId },
  } = match;

  const HeadDS = useDataSet(statementHeadDS, ZcomStatementVerifyDetail);
  const SummaryLineDS = useDataSet(statementSummaryLineDS);
  const DetailLineDS = useDataSet(statementDetailLineDS);

  const [canEdit, setCanEdit] = useState(false); // 是否可编辑

  useEffect(() => {
    HeadDS.data = [];
    HeadDS.create();
    SummaryLineDS.data = [];
    SummaryLineDS.clearCachedSelected();
    DetailLineDS.data = [];
    HeadDS.setQueryParameter('verificationOrderId', verificationOrderId);
    SummaryLineDS.setQueryParameter('verificationOrderId', verificationOrderId);
    DetailLineDS.setQueryParameter('verificationOrderId', verificationOrderId);
    handleSearch();
  }, [verificationOrderId]);

  async function handleSearch() {
    await HeadDS.query();
    SummaryLineDS.query();
    setCanEdit(['TBCONFIRMED'].includes(HeadDS.current.get('verificationOrderStatus')));
  }

  function lineValidate() {
    const arr = [];
    SummaryLineDS.data.forEach((v) => {
      arr.push(v.validate(true, false));
    });
    return arr;
  }

  async function handleVerify(type) {
    return new Promise(async (resolve) => {
      const validateHead = await HeadDS.current.validate(true, false);
      const validateLineResult = await Promise.all(lineValidate());
      if (!validateHead || validateLineResult.findIndex((v) => !v) !== -1) {
        notification.warning({
          message: '数据校验不通过',
        });
        resolve(false);
        return false;
      }
      const headData = HeadDS.current.toData();
      const verificationSummaryList = SummaryLineDS.data.map((item) => {
        const obj = Object.assign({}, item.toData());
        return obj;
      });
      const payLoadObj = {
        ...headData,
        submitDate: headData.submitDate ? `${headData.submitDate} 00:00:00` : null,
        verificationOrderStatus: type,
        verificationSummaryList,
      };
      dispatch({
        type: 'statementVerify/verifyVerificationOrder',
        payload: [payLoadObj],
      }).then((res) => {
        if (res && !res.failed) {
          notification.success({
            message: '操作成功',
          });
          history.push({
            pathname: '/zcom/statement-verify',
          });
        }
        resolve();
      });
    });
  }

  function handleTabChange(key) {
    if (key === 'summary') {
      SummaryLineDS.query();
    }
    if (key === 'detail') {
      DetailLineDS.query();
    }
  }

  // 获取导出字段查询参数-
  const getExportQueryParams = () => {
    const queryDataDs =
      DetailLineDS && DetailLineDS.queryDataSet && DetailLineDS.queryDataSet.current;
    const queryDataDsValue = queryDataDs ? filterNullValueObject(queryDataDs.toData()) : {};
    return filterNullValueObject({
      tenantId: organizationId,
      ...queryDataDsValue,
      verificationOrderId,
    });
  };

  function handleGoPage(record) {
    const { verificationSourceType, sourceDocId } = record.toData();
    const pathname =
      verificationSourceType === 'RECEIPT'
        ? '/zcom/delivery-receipt-record'
        : `/zcom/withholding-order-create/detail/${sourceDocId}`;
    history.push({ pathname });
  }

  function handleGoWithholding(record) {
    const { withholdingOrderId } = record.toData();
    history.push({
      pathname: `/zcom/withholding-order-create/detail/${withholdingOrderId}`,
    });
  }

  const summaryColumns = [
    { name: 'verificationSummaryNum', width: 100, lock: true },
    { name: 'externalSourceDocNum', width: 150 },
    {
      name: 'customerItemDesc',
      width: 150,
      renderer: ({ record, value }) => {
        return (
          <>
            <div>{record.get('customerItemCode')}</div>
            <div>{value}</div>
          </>
        );
      },
    },
    {
      name: 'supplierItemDesc',
      width: 150,
      renderer: ({ record, value }) => {
        return (
          <>
            <div>{record.get('supplierItemCode')}</div>
            <div>{value}</div>
          </>
        );
      },
    },
    {
      name: 'itemAttr',
      width: 150,
      renderer: ({ record, value }) => {
        return value && value.attributeValue1 ? (
          <ItemAttributeSelect
            data={value}
            itemId={record.get('customerItemId')}
            itemDesc={record.get('customerItemDesc')}
            disabled
          />
        ) : null;
      },
    },
    { name: 'customerVerificationQty', width: 150 },
    { name: 'customerUomName', width: 150 },
    { name: 'beforeAmount', width: 150 },
    {
      name: 'taxRate',
      width: 150,
      renderer: ({ value }) => <span>{`${value * 100}%`}</span>,
    },
    {
      name: 'withholdingOrderNum',
      width: 150,
      renderer: ({ record, value }) => <a onClick={() => handleGoWithholding(record)}>{value}</a>,
    },
    { name: 'withholdingLineNum', width: 150 },
    { name: 'customerFeedback', width: 150 },
    { name: 'supplierFeedback', width: 150, editor: canEdit },
    { name: 'taxAmount', width: 150 },
    { name: 'difference', width: 150 },
    {
      name: 'afterAmount',
      width: 150,
      align: 'left',
      lock: 'right',
    },
  ];

  const detailColumns = [
    { name: 'verificationSourceType', width: 150 },
    {
      name: 'sourceDocNum',
      width: 150,
      renderer: ({ record, value }) => <a onClick={() => handleGoPage(record)}>{value}</a>,
    },
    { name: 'sourceDocLineNum', width: 150 },
    { name: 'externalSourceDocNum', width: 150 },
    { name: 'poNum', width: 150 },
    { name: 'poLineNum', width: 150 },
    { name: 'customerItemCode', width: 150 },
    { name: 'customerItemDesc', width: 150 },
    { name: 'supplierItemCode', width: 150 },
    { name: 'supplierItemDesc', width: 150 },
    {
      name: 'itemAttr',
      width: 150,
      renderer: ({ record, value }) => {
        return value && value.attributeValue1 ? (
          <ItemAttributeSelect
            data={value}
            itemId={record.get('customerItemId')}
            itemDesc={record.get('customerItemDesc')}
            disabled
          />
        ) : null;
      },
    },
    { name: 'customerVerificationQty', width: 150 },
    { name: 'customerUomName', width: 150 },
    { name: 'customerPrice', width: 150 },
    {
      name: 'taxRate',
      width: 150,
      renderer: ({ value }) => <span>{`${value * 100}%`}</span>,
    },
    { name: 'beforeAmount', width: 150 },
    {
      name: 'taxAmount',
      width: 150,
      renderer: ({ record }) => (
        <span>
          {record.get('beforeAmount')
            ? (record.get('beforeAmount') - record.get('beforeExTaxAmount')).toFixed(6)
            : null}
        </span>
      ),
    },
    {
      name: 'creationDate',
      width: 150,
      renderer: ({ value }) => {
        return <span>{value ? value.substring(0, 10) : ''}</span>;
      },
    },
  ];

  return (
    <Fragment>
      <Header
        title={intl.get(`${intlPrefix}.view.title.statementVerifyDetail`).d('收到的对账单详情')}
        backPath="/zcom/statement-verify"
      >
        {canEdit && (
          <>
            <Button color="primary" onClick={() => handleVerify('CONFIRMED')}>
              保存并确认
            </Button>
            <Button onClick={() => handleVerify('REJECTED')}>保存并退回</Button>
          </>
        )}
      </Header>
      <Content className={styles['zcom-statement-verify-detail-content']}>
        <Form dataSet={HeadDS} columns={4}>
          <TextField name="verificationOrderNum" key="verificationOrderNum" disabled />
          <TextField name="verificationOrderStatus" key="verificationOrderStatus" disabled />
          <TextField name="supplierCompanyName" key="supplierCompanyName" disabled />
          <TextField name="submitDate" key="submitDate" disabled />
          <TextField name="supplierName" key="supplierName" disabled />
          <TextField name="totalAmount" key="totalAmount" disabled />
          <TextField name="taxAmount" key="taxAmount" disabled />
          <TextField name="currencyCode" key="currencyCode" disabled />
        </Form>
        <Tabs defaultActiveKey="summary" onChange={handleTabChange}>
          <TabPane tab="汇总信息" key="summary">
            <Table
              dataSet={SummaryLineDS}
              columns={summaryColumns}
              rowHeight="auto"
              columnResizable="true"
            />
          </TabPane>
          <TabPane tab="全部明细" key="detail">
            <div className={styles['statement-export-btn']}>
              <ExcelExport
                requestUrl={`${HLOS_ZCOM}/v1/${organizationId}/verification-lines/supplier-export`}
                queryParams={getExportQueryParams}
              />
            </div>
            <Table
              dataSet={DetailLineDS}
              columns={detailColumns}
              rowHeight="auto"
              columnResizable="true"
            />
          </TabPane>
        </Tabs>
      </Content>
    </Fragment>
  );
}

export default formatterCollections({
  code: [`${intlPrefix}`],
})(ZcomStatementVerifyDetail);
