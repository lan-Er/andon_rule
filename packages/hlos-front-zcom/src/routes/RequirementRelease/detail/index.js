/**
 * @Description: 需求发布--订单详情
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2020-11-05 16:21:45
 */

import React, { useEffect, Fragment } from 'react';
import { Card } from 'choerodon-ui';
import { DataSet, Form, TextField, Table, Tabs } from 'choerodon-ui/pro';
import { Header, Content } from 'components/Page';
import ExcelExport from 'components/ExcelExport';
import { HLOS_ZCOM } from 'hlos-front/lib/utils/config';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import {
  requirementReleaseDetailDS,
  requirementReleaseLineDS,
} from '../store/RequirementReleaseDS';
import { getSerialNum } from '@/utils/renderer';
import './index.less';

const commonPrefix = 'zcom.common';
const intlPrefix = 'zcom.requirementRelease';
const { TabPane } = Tabs;
const organizationId = getCurrentOrganizationId();
const HeadDS = new DataSet(requirementReleaseDetailDS());
const LineDS = new DataSet(requirementReleaseLineDS());

function ZcomRequirementReleaseDetail(props) {
  const {
    match: {
      params: { poHeaderId },
    },
  } = props;

  useEffect(() => {
    handleSearch(poHeaderId);
  }, [poHeaderId]);

  async function handleSearch() {
    HeadDS.setQueryParameter('poHeaderId', poHeaderId);
    LineDS.setQueryParameter('poHeaderId', poHeaderId);
    await HeadDS.query();
    await LineDS.query();
  }

  // 获取导出字段查询参数
  const getExportQueryParams = () => {
    const queryDataDs = LineDS && LineDS.queryDataSet && LineDS.queryDataSet.current;
    const queryDataDsValue = queryDataDs ? filterNullValueObject(queryDataDs.toData()) : {};
    return {
      poHeaderId,
      tenantId: organizationId,
      ...queryDataDsValue,
    };
  };

  const columns = [
    { header: '行号', width: 60, lock: true, renderer: ({ record }) => getSerialNum(record) },
    { name: 'itemCode', width: 150 },
    { name: 'description' },
    { name: 'unitPrice', width: 150 },
    { name: 'excludingTaxPrice', width: 150 },
    { name: 'demandQty', width: 150 },
    { name: 'promiseQty', width: 150 },
    { name: 'uomName', width: 150 },
    { name: 'lineAmount', width: 150 },
    { name: 'excludingTaxAmount', width: 150 },
    { name: 'taxRate', width: 150 },
    { name: 'demandDate', width: 150 },
    { name: 'promiseDate', width: 150 },
    { name: 'receiveOrg', width: 150 },
  ];

  return (
    <Fragment>
      <Header
        title={intl.get(`${intlPrefix}.view.title.requirementReleaseDetail`).d('需求发布明细')}
        backPath="/zcom/requirement-release/list"
      >
        <ExcelExport
          requestUrl={`${HLOS_ZCOM}/v1/${organizationId}/po-lines/excel`}
          queryParams={getExportQueryParams}
        />
      </Header>
      <Content>
        <Card
          key="zcom-requirement-release-detail-header"
          title={intl.get(`${intlPrefix}.view.title.headInfo`).d('抬头信息')}
          bordered={false}
        >
          <Form dataSet={HeadDS} columns={4} className="form-headInfo">
            <TextField name="poNum" disabled />
            <TextField name="supplierNumber" disabled />
            <TextField name="supplierName" disabled />
            <TextField name="supplierSiteAddress" disabled />
            <TextField name="poTypeCodeMeaning" disabled />
            <TextField name="scmOuName" disabled />
            <TextField name="buyerName" disabled />
            <TextField name="sourceSysName" disabled />
            <TextField name="creationDate" disabled />
            <TextField name="totalAmount" disabled />
            <TextField name="excludingTaxAmount" disabled />
            <TextField name="taxRate" disabled />
            <TextField name="paymentMethod" disabled />
            <TextField name="receiveAddress" disabled />
            <TextField name="remark" disabled />
          </Form>
        </Card>
        <Tabs defaultActiveKey="basic">
          <TabPane tab="基础信息" key="basic">
            <Table dataSet={LineDS} columns={columns} columnResizable="true" queryBar="none" />
          </TabPane>
        </Tabs>
      </Content>
    </Fragment>
  );
}

export default formatterCollections({
  code: [`${intlPrefix}`, `${commonPrefix}`],
})((props) => {
  return <ZcomRequirementReleaseDetail {...props} />;
});
