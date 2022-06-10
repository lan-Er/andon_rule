/**
 * @Description: 对账单发起--选择业务单据
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2021-05-07 10:47:11
 */

import React, { useEffect, Fragment } from 'react';
import { DataSet, Button, Table } from 'choerodon-ui/pro';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import { closeTab } from 'utils/menuTab';
import notification from 'utils/notification';
import { getCurrentOrganizationId } from 'utils/utils';
import formatterCollections from 'utils/intl/formatterCollections';
import { useDataSet } from 'hzero-front/lib/utils/hooks';
import ItemAttributeSelect from '@/components/ItemAttributeSelect/index';
import { DocumentLineDS } from '../store/indexDS';
import styles from './index.less';

const intlPrefix = 'zcom.statementInitiate';
const documentLineDS = () => new DataSet(DocumentLineDS());

function ZcomStatementSelectDocument({ history, dispatch }) {
  const ListDS = useDataSet(documentLineDS, ZcomStatementSelectDocument);

  useEffect(() => {
    ListDS.query();
  }, []);

  function handleInitiateStatement() {
    return new Promise((resolve) => {
      if (!ListDS.selected.length) {
        notification.warning({
          message: intl.get(`zcom.common.message.validation.select`).d('至少选择一条数据'),
        });
        resolve(false);
        return false;
      }
      const queryObj = {
        ...ListDS.queryDataSet.current.toData(),
      };
      const selectAll =
        ListDS.selected.length === ListDS.pageSize || ListDS.selected.length === ListDS.totalCount
          ? 1
          : 0;
      const arr = ListDS.selected.map((v) => {
        if (selectAll === 1) {
          return {
            selectAll,
            ...queryObj,
            tenantId: getCurrentOrganizationId(),
            creationDateStart: queryObj.creationDateStart
              ? `${queryObj.creationDateStart} 00:00:00`
              : null,
            creationDateEnd: queryObj.creationDateEnd
              ? `${queryObj.creationDateEnd} 23:59:59`
              : null,
          };
        }
        return {
          ...v.toData(),
          selectAll,
        };
      });
      dispatch({
        type: 'statementInitiate/createVerificationOrder',
        payload: arr,
      }).then((res) => {
        if (res && !res.failed) {
          if (res.length === 1) {
            history.push({
              pathname: `/zcom/statement-initiate/detail/${res[0].verificationOrderId}`,
            });
            closeTab('/zcom/statement-select-document');
          }
          if (res.length > 1) {
            history.push({
              pathname: `/zcom/statement-initiate`,
            });
            closeTab('/zcom/statement-select-document');
          }
        }
        resolve();
      });
    });
  }

  function handleGoPage(record) {
    const { verificationSourceType, sourceDocId } = record.toData();
    const pathname =
      verificationSourceType === 'RECEIPT'
        ? '/zcom/delivery-receipt-record'
        : `/zcom/withholding-order-create/detail/${sourceDocId}`;
    history.push({ pathname });
  }

  const columns = [
    { name: 'verificationSourceType', width: 100, lock: true },
    {
      name: 'sourceDocNum',
      width: 150,
      lock: true,
      renderer: ({ record, value }) => <a onClick={() => handleGoPage(record)}>{value}</a>,
    },
    { name: 'sourceDocLineNum', width: 80 },
    { name: 'customerCompanyName', width: 150 },
    { name: 'supplierName', width: 150 },
    { name: 'externalSourceDocNum', width: 150 },
    { name: 'poNum', width: 150 },
    { name: 'poLineNum', width: 100 },
    { name: 'customerItemCode', width: 150 },
    { name: 'customerItemDesc', width: 150 },
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
    { name: 'customerVerificationQty', width: 100 },
    { name: 'customerUomName', width: 80 },
    { name: 'customerPrice', width: 100 },
    {
      name: 'taxRate',
      width: 80,
      renderer: ({ value }) => {
        return <span>{value ? `${value * 100}%` : ''}</span>;
      },
    },
    { name: 'beforeAmount', width: 100 },
    { name: 'taxAmount', width: 100 },
    {
      name: 'creationDate',
      width: 100,
      renderer: ({ value }) => {
        return <span>{value ? value.substring(0, 10) : ''}</span>;
      },
    },
  ];

  return (
    <Fragment>
      <Header title={intl.get(`${intlPrefix}.view.title.selectDocument`).d('选择业务单据')}>
        <Button color="primary" onClick={handleInitiateStatement}>
          生成对账单
        </Button>
      </Header>
      <Content className={styles['zcom-statement-select-list-content']}>
        <Table
          dataSet={ListDS}
          columns={columns}
          queryFieldsLimit={3}
          columnResizable="true"
          rowHeight="auto"
        />
      </Content>
    </Fragment>
  );
}

export default formatterCollections({
  code: [`${intlPrefix}`],
})(ZcomStatementSelectDocument);
