/*
 * @Description: 汇总页面
 * @Author: mengting.zhang <mengting.zhang@hand-china.com>
 * @LastEditTime: 2020-11-23 19:43:00
 */

import React, { Fragment } from 'react';
import { Table, DataSet } from 'choerodon-ui/pro';
import ExcelExport from 'components/ExcelExport';
import formatterCollections from 'utils/intl/formatterCollections';
import { getCurrentOrganizationId } from 'utils/utils';
// import notification from 'utils/notification';
import { Header, Content } from 'components/Page';
import { summaryDetailDS } from '@/stores/issueRequestDS';
import { HLOS_LMDS } from 'hlos-front/lib/utils/config';

const intlPrefix = 'lwms.issueRequestPlatform';
const commonPrefix = 'lwms.common';

const detailDS = new DataSet(summaryDetailDS());

function IssueRequestDetail() {
  // render buttons
  const renderFunctionButtons = () => (
    <Fragment>
      <ExcelExport requestUrl={`${HLOS_LMDS}/v1/${getCurrentOrganizationId()}/documents/excel`} />
    </Fragment>
  );

  const handleBack = () => {
    detailDS.remove(detailDS.current);
  };

  const getColumns = () => {
    return [
      {
        name: 'itemCode',
        width: 120,
        tooltip: 'overflow',
      },
      {
        name: 'itemDescription',
        width: 120,
        tooltip: 'overflow',
      },
      {
        name: 'uomName',
        width: 120,
        tooltip: 'overflow',
      },
      {
        name: 'secondUomName',
        width: 120,
        tooltip: 'overflow',
      },
      {
        name: 'lotNumber',
        width: 120,
        tooltip: 'overflow',
      },
      {
        name: 'applyQty',
        width: 120,
        tooltip: 'overflow',
      },
      {
        name: 'executedQty',
        width: 120,
        tooltip: 'overflow',
      },
      {
        name: 'toLocationName',
        width: 120,
        tooltip: 'overflow',
      },
    ];
  };

  return (
    <Fragment>
      <Header title="汇总明细" backPath="/lwms/issue-request-platform/list" onBack={handleBack}>
        {renderFunctionButtons()}
      </Header>
      <Content className="lwms-issue-request-content">
        <Table
          dataSet={detailDS}
          columns={getColumns()}
          columnResizable="true"
          editMode="inline"
          queryFieldsLimit={3}
        />
      </Content>
    </Fragment>
  );
}

export default formatterCollections({
  code: [`${intlPrefix}`, `${commonPrefix}`],
})(IssueRequestDetail);
