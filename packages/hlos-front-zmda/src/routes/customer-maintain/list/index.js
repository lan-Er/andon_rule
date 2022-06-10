/*
 * @Descripttion: 客户-列表页
 * @version:
 * @Author: yin.lei@hand-china.com
 * @Date: 2021-04-12 16:15:43
 * @LastEditors: yin.lei@hand-china.com
 * @LastEditTime: 2021-04-12 16:35:49
 */

import React, { useEffect, Fragment } from 'react';
import { DataSet, Button, Table } from 'choerodon-ui/pro';
import { Header, Content } from 'components/Page';
import ExcelExport from 'components/ExcelExport';
import { HLOS_ZCOM } from 'hlos-front/lib/utils/config';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import { yesOrNoRender } from 'hlos-front/lib/utils/renderer';
import { listDS } from '../store/indexDS';

const intlPrefix = 'zmda.customerMaintain';
const ListDS = new DataSet(listDS());
const organizationId = getCurrentOrganizationId();

function ZmdaCustomerMaintain({ history }) {
  useEffect(() => {
    ListDS.query();
  }, []);

  function handleToDetail(record) {
    // 需要根据状态进行跳转页面的判断
    const { customerId, customerNumber } = record.toData();
    const pathName = `/zmda/customer-maintain/detail/${customerId}`;
    history.push({
      pathname: pathName,
      state: { customerNumber },
    });
  }

  function handleCreate() {
    const pathName = `/zmda/customer-maintain/create`;
    history.push(pathName);
  }

  // 获取导出字段查询参数
  const getExportQueryParams = () => {
    const queryDataDs = ListDS && ListDS.queryDataSet && ListDS.queryDataSet.current;
    let queryDataDsValue = {};
    if (queryDataDs) {
      const {
        creationDateStart,
        creationDateEnd,
        approvalDateStart,
        approvalDateEnd,
        submitDateStart,
        submitDateEnd,
      } = queryDataDs.toData();
      queryDataDsValue = filterNullValueObject({
        ...queryDataDs.toData(),
        creationDateStart: creationDateStart ? creationDateStart.concat(' 00:00:00') : null,
        creationDateEnd: creationDateEnd ? creationDateEnd.concat(' 23:59:59') : null,
        approvalDateStart: approvalDateStart ? approvalDateStart.concat(' 00:00:00') : null,
        approvalDateEnd: approvalDateEnd ? approvalDateEnd.concat(' 23:59:59') : null,
        submitDateStart: submitDateStart ? submitDateStart.concat(' 00:00:00') : null,
        submitDateEnd: submitDateEnd ? submitDateEnd.concat(' 23:59:59') : null,
      });
    }
    return {
      tenantId: organizationId,
      ...queryDataDsValue,
    };
  };

  const columns = [
    {
      name: 'customerNumber',
      width: 150,
      align: 'center',
      renderer: ({ record, value }) => {
        return <a onClick={() => handleToDetail(record)}>{value || ''}</a>;
      },
    },
    { name: 'customerName', align: 'center' },
    { name: 'customerShortName', width: 150, align: 'center' },
    { name: 'unifiedSocialNum', width: 150, align: 'center' },
    { name: 'defaultTaxRate', width: 150, align: 'center' },
    {
      name: 'cooperationFlag',
      width: 150,
      align: 'center',
      renderer: yesOrNoRender,
    },
  ];

  return (
    <Fragment>
      <Header title={intl.get(`${intlPrefix}.view.title.vmiMaterialsApply`).d('客户')}>
        <Button color="primary" onClick={handleCreate}>
          新建
        </Button>
        <ExcelExport
          requestUrl={`${HLOS_ZCOM}/v1/${organizationId}/item-refunds/export`}
          queryParams={getExportQueryParams}
        />
      </Header>
      <Content>
        <Table dataSet={ListDS} columns={columns} />
      </Content>
    </Fragment>
  );
}

export default formatterCollections({
  code: [`${intlPrefix}`],
})((props) => {
  return <ZmdaCustomerMaintain {...props} />;
});
