/*
 * @Descripttion: 入料检验数据分析记录表
 * @version:
 * @Author: yin.lei@hand-china.com
 * @Date: 2021-04-19 17:50:45
 * @LastEditors: yin.lei@hand-china.com
 * @LastEditTime: 2021-04-19 17:55:40
 */

import React, { Fragment } from 'react';
import { Table, DataSet } from 'choerodon-ui/pro';

import ExcelExport from 'components/ExcelExport';
import { Content, Header } from 'components/Page';
import formHeaderDs from '@/stores/IncomingInspectionReportDS';
import { HLOS_LWMSS } from 'hlos-front/lib/utils/config';
import { useDataSet } from 'hzero-front/lib/utils/hooks';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import styles from './index.less';

const organizationId = getCurrentOrganizationId();
export default function IncomingInspectionReport() {
  const headerDs = useDataSet(() => new DataSet(formHeaderDs()), IncomingInspectionReport);
  function myColumns() {
    const column = [
      { name: 'creationDate', width: 150 },
      { name: 'judgedDate', width: 150 },
      { name: 'inspectionWorkerName', width: 150 },
      { name: 'partyName', width: 150 },
      { name: 'categoryName', width: 150 },
      // { name: 'categoryName', width: 150 },
      { name: 'itemCode', width: 150 },
      { name: 'itemDesc', width: 150 },
      { name: 'specification', width: 150 },
      { name: 'batchQty', width: 150 },
      { name: 'sampleQty', width: 150 },
      { name: 'qcNgQty', width: 150 },
      { name: 'qcResultMeaning', width: 150 },
      { name: 'ngDescription', width: 150 },
      { name: 'mrr', width: 150 },
      { name: 'lotProjectNum', width: 150 },
      { name: 'responsibleWorker', width: 150 },
      { name: 'year', width: 150 },
      { name: 'month', width: 150 },
      { name: 'week', width: 150 },
      { name: 'lotNumber', width: 150 },
      { name: 'receiver', width: 150 },
      { name: 'receiveApply', width: 150 },
    ];
    return column;
  }

  /**
   * 导出
   * @returns
   */
  function getExportQueryParams() {
    const queryDataDs = headerDs && headerDs.queryDataSet && headerDs.queryDataSet.current;
    const queryDataDsValue = queryDataDs ? filterNullValueObject(queryDataDs.toJSONData()) : {};
    return { ...queryDataDsValue };
  }

  return (
    <Fragment>
      <Header title="入料检验数据分析记录表">
        <ExcelExport
          requestUrl={`${HLOS_LWMSS}/v1/${organizationId}/raumplus-report/incoming-inspection-excel`}
          queryParams={getExportQueryParams}
          method="GET"
        />
      </Header>
      <Content className={styles['raumplus-income-inspection-report']}>
        <Table dataSet={headerDs} columns={myColumns()} queryFieldsLimit={3} />
      </Content>
    </Fragment>
  );
}
