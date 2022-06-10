/**
 * @Description: 生产任务进度报表
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2021-01-19 09:47:26
 */

import React, { Fragment, useEffect } from 'react';
import { Table, DataSet } from 'choerodon-ui/pro';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import { useDataSet } from 'hzero-front/lib/utils/hooks';
import { ExportButton } from 'hlos-front/lib/components';
import { ListDS } from '../store/ProductTaskProgressReportDS';

const preCode = 'zexe.productTaskProgressReport';

const ProductTaskProgressReport = () => {
  const listDS = () =>
    new DataSet({
      ...ListDS(),
    });
  const ds = useDataSet(listDS, ProductTaskProgressReport);

  const columns = [
    { name: 'supplierNumber', width: 150, lock: true },
    { name: 'supplierName', width: 150, lock: true },
    { name: 'organizationName', width: 150, lock: true },
    { name: 'taskNum', width: 150, lock: true },
    { name: 'productCode', width: 150, lock: true },
    { name: 'productDescription', width: 150 },
    { name: 'operationName', width: 150 },
    { name: 'taskStatusMeaning', width: 150 },
    { name: 'completedPercent', width: 150 },
    { name: 'uomName', width: 150 },
    { name: 'taskQty', width: 100 },
    { name: 'executableQty', width: 100 },
    { name: 'processOkQty', width: 100 },
    { name: 'processNgQty', width: 100 },
    { name: 'scrappedQty', width: 100 },
    { name: 'reworkQty', width: 100 },
    { name: 'pendingQty', width: 100 },
    { name: 'standardWorkTime', width: 150 },
    { name: 'processedTime', width: 150 },
    { name: 'efficiency', width: 150 },
    { name: 'documentNum', width: 150 },
    { name: 'planStartTime', width: 150 },
    { name: 'planEndTime', width: 150 },
    { name: 'actualStartTime', width: 150 },
    { name: 'actualEndTime', width: 150 },
    { name: 'supervisorName', width: 150 },
    { name: 'prodLineName', width: 150 },
    { name: 'workcellName', width: 150 },
    { name: 'equipmentName', width: 150 },
    { name: 'locationName', width: 150 },
    { name: 'workerName', width: 150 },
  ];

  useEffect(() => {
    // async function queryDefaultOrg() {
    //   const res = await queryLovData({
    //     lovCode: common.organization,
    //     defaultFlag: 'Y',
    //   });
    //   if (getResponse(res) && res && res.content && res.content[0]) {
    //     const { organizationId, organizationName } = res.content[0];
    //     if (organizationId && organizationName) {
    //       ds.queryDataSet.current.set('organizationObj', {
    //         meOuId: organizationId,
    //         meOuName: organizationName,
    //       });
    //       await ds.query();
    //     }
    //   }
    // }
    // queryDefaultOrg();
  }, []);

  return (
    <Fragment>
      <Header title={intl.get(`${preCode}.view.title.index`).d('生产任务进度报表')}>
        <ExportButton
          reportCode={['LMES.TASK_PROGRESS']}
          exportTitle={intl.get(`${preCode}.buton.export`).d('生产任务进度报表导出')}
        />
      </Header>
      <Content>
        <Table
          dataSet={ds}
          columns={columns}
          autoHeight
          columnResizable="true"
          editMode="inline"
          queryFieldsLimit={4}
        />
      </Content>
    </Fragment>
  );
};

export default formatterCollections({
  code: ['zexe.productTaskProgressReport', 'zexe.common'],
})(ProductTaskProgressReport);
