/**
 * @Description:仓库执行明细管理信息--Index
 * @Author: yiping.liu<yiping.liu@hand-china.com>
 * @Date: 2020-02-05 14:47:41
 * @LastEditors: yiping.liu
 */
import React, { useEffect } from 'react';
import intl from 'utils/intl';
import { ExportButton } from 'hlos-front/lib/components';
import { Header, Content } from 'components/Page';
import { Table, Lov, DataSet } from 'choerodon-ui/pro';
import formatterCollections from 'utils/intl/formatterCollections';
import { userSetting } from 'hlos-front/lib/services/api';
import { WarehouseExecutionDS } from '../store/warehouseExecutionDetailsDS';

const preCode = 'zexe.warsehouseExecution';
const hds = new DataSet(WarehouseExecutionDS());

function WarehouseExecution() {
  useEffect(() => {
    async function queryUserSetting() {
      const res = await userSetting({ defaultFlag: 'Y' });
      if (res && res.content && res.content[0]) {
        const { organizationId, organizationName } = res.content[0];
        if (organizationId) {
          hds.queryDataSet.current.set('organizationObj', {
            organizationId,
            organizationName,
          });
        }
      }
    }
    queryUserSetting();
  }, []);

  function Columns() {
    return [
      { name: 'supplierNumber', width: 150, lock: true },
      { name: 'supplierName', width: 150, lock: true },
      { name: 'organization', editor: false, width: 150, lock: 'left' },
      { name: 'documentTypeObj', editor: false, width: 150, lock: 'left' },
      { name: 'documentObj', editor: false, width: 150, lock: 'left' },
      { name: 'documentLineObj', editor: false, width: 150 },
      { name: 'executeTypeMeaning', editor: false, width: 150 },
      { name: 'executedTime', editor: false, width: 150 },
      { name: 'itemObj', editor: false, width: 150 },
      { name: 'description', editor: false, width: 150 },
      { name: 'uomName', editor: false, width: 150 },
      { name: 'executedQty', editor: false, width: 150 },
      { name: 'lotNumber', editor: false, width: 150 },
      { name: 'tagCode', editor: false, width: 150 },
      { name: 'warehouse', editor: false, width: 150 },
      { name: 'wmArea', editor: false, width: 150 },
      { name: 'workcellName', editor: false, width: 150 },
      { name: 'locationName', editor: false, width: 150 },
      { name: 'toWarehouse', editor: false, width: 150 },
      { name: 'toWmArea', editor: false, width: 150 },
      { name: 'toWorkcellName', editor: false, width: 150 },
      { name: 'toLocationName', editor: false, width: 150 },
      { name: 'ownerType', editor: false, width: 150 },
      { name: 'ownerName', editor: false, width: 150 },
      { name: 'partyName', editor: false, width: 150 },
      { name: 'partySiteName', editor: false, width: 150 },
      { name: 'workerName', editor: false, width: 150 },
      { name: 'resourceName', editor: false, width: 150 },
      { name: 'eventTypeName', editor: false, width: 150 },
      { name: 'eventId', editor: false, width: 150 },
    ];
  }
  /**
   *lov缓存
   *
   * @returns
   */
  function QueryField() {
    return {
      organizationObj: <Lov name="organizationObj" clearButton noCache />,
      documentTypeObj: <Lov name="documentTypeObj" clearButton noCache />,
      documentObj: <Lov name="warehouseObj" clearButton noCache />,
      documentLineObj: <Lov name="wmAreaObj" clearButton noCache />,
      itemObj: <Lov name="documentObj" clearButton noCache />,
    };
  }

  return (
    <React.Fragment>
      <Header title={intl.get(`${preCode}.view.title.warsehouseExecution`).d('仓库执行明细')}>
        <ExportButton
          reportCode={['LWMS.EXECUTE_LINE']}
          exportTitle={
            intl.get(`${preCode}.view.title.warsehouseExecution`).d('仓库执行明细') +
            intl.get('hzero.common.button.export').d('导出')
          }
        />
      </Header>
      <Content className="zexe-warehouse-executions">
        <Table
          autoHeight
          dataSet={hds}
          border={false}
          columnResizable="true"
          editMode="inline"
          columns={Columns()}
          queryFields={QueryField()}
          queryFieldsLimit={4}
        />
      </Content>
    </React.Fragment>
  );
}

export default formatterCollections({
  code: [`${preCode}`],
})(WarehouseExecution);
