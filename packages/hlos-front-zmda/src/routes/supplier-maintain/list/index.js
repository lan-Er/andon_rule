/*
 * @Descripttion: 供应商-列表页
 * @version:
 * @Author: yin.lei@hand-china.com
 * @Date: 2021-04-09 14:58:35
 * @LastEditors: yin.lei@hand-china.com
 * @LastEditTime: 2021-04-12 16:35:06
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

const intlPrefix = 'zmda.supplierMaintain';
const ListDS = new DataSet(listDS());
const organizationId = getCurrentOrganizationId();

function ZmdaSupplierMaintain({ history }) {
  useEffect(() => {
    ListDS.query();
  }, []);

  function handleToDetail(record) {
    // 需要根据状态进行跳转页面的判断
    const { supplierId, supplierNumber } = record.toData();
    const pathName = `/zmda/supplier-maintain/detail/${supplierId}`;
    history.push({
      pathname: pathName,
      state: { supplierNumber },
    });
  }

  function handleCreate() {
    const pathName = `/zmda/supplier-maintain/create`;
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
      name: 'supplierNumber',
      width: 150,
      align: 'center',
      renderer: ({ record, value }) => {
        return <a onClick={() => handleToDetail(record)}>{value || ''}</a>;
      },
    },
    { name: 'supplierName', align: 'center' },
    { name: 'supplierShortName', width: 150, align: 'center' },
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
      <Header title={intl.get(`${intlPrefix}.view.title.vmiMaterialsApply`).d('供应商')}>
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
  return <ZmdaSupplierMaintain {...props} />;
});
