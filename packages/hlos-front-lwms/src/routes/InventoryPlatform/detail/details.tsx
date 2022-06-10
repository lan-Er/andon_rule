/*
 * @Description: 盘点平台明细界面
 * @Author: 赵敏捷 <minjie.zhao@hand-china.com>
 * @Date: 2020-04-26 15:05:50
 * @LastEditors: Please set LastEditors
 */
import React, { Fragment, useCallback, useEffect, useMemo } from 'react';
import { connect } from 'dva';
import intl from 'utils/intl';
import qs from 'query-string';
import { DataSet, Table, Button } from 'choerodon-ui/pro';
import { ColumnAlign } from 'choerodon-ui/pro/lib/table/enum';
import { ColumnProps } from 'choerodon-ui/pro/lib/table/Column';
import { getCurrentOrganizationId, filterNullValueObject, getResponse } from 'utils/utils';
import formatterCollections from 'utils/intl/formatterCollections';
import { Content, Header } from 'components/Page';
import ExcelExport from 'components/ExcelExport';
import { HLOS_LWMS } from 'hlos-front/lib/utils/config';
import { yesOrNoRender } from 'hlos-front/lib/utils/renderer';
import { inventoryDetailAndAdjustmentDS } from '@src/stores/inventoryPlatformDS';
import { useDataSetEvent } from 'hzero-front/lib/utils/hooks';
import { queryCounts } from '@src/services/inventoryPlatformService';

import styles from '../style/index.module.less';

const intlPrefix = 'lwms.inventoryPlatform';
const commonPrefix = 'lwms.common';
const tenantId = getCurrentOrganizationId();

const getExportQueryParams = (ds, countId) => {
  const { current } = ds.queryDataSet || {};
  return current
    ? filterNullValueObject({
        ...current.toData(),
        countId,
      })
    : { countId };
};

const getColumns: () => ColumnProps[] = () => [
  {
    name: 'itemObj',
    width: 200,
    editor: false,
    lock: true,
    renderer: ({ value = {} }) => {
      const { itemCode, itemName } = value || ({} as any);
      return (
        <span>{itemCode || itemName ? `${itemCode}${itemName ? ` ${itemName}` : ''}` : ''}</span>
      );
    },
  },
  {
    name: 'warehouseObj',
    width: 128,
    editor: false,
    lock: true,
  },
  {
    name: 'wmAreaObj',
    width: 128,
    editor: false,
    lock: true,
  },
  {
    name: 'wmUnitObj',
    width: 128,
    editor: false,
  },
  {
    name: 'uomName',
    width: 80,
    editor: false,
  },
  {
    name: 'tagCode',
    width: 128,
    editor: false,
  },
  {
    name: 'lotNumber',
    width: 128,
    editor: false,
  },
  {
    name: 'ownerType',
    width: 84,
    editor: false,
  },
  {
    name: 'owner',
    width: 200,
    editor: false,
  },
  {
    name: 'featureType',
    width: 84,
    editor: false,
  },
  {
    name: 'featureValue',
    width: 128,
    editor: false,
  },
  {
    name: 'projectNum',
    width: 128,
    editor: false,
  },
  {
    name: 'sourceNum',
    width: 128,
    editor: false,
  },
  {
    name: 'snapshotQty',
    width: 82,
    editor: false,
  },
  {
    name: 'countQty',
    width: 82,
    editor: false,
  },
  {
    name: 'auditQty',
    width: 82,
    editor: false,
  },
  {
    name: 'varianceQty',
    width: 82,
    editor: false,
  },
  {
    name: 'variancePercent',
    width: 82,
    editor: false,
  },
  {
    name: 'adjustQty',
    width: 82,
    editor: false,
  },
  {
    name: 'secondUomName',
    width: 82,
    editor: false,
  },
  {
    name: 'snapshotSecondQty',
    width: 82,
    editor: false,
  },
  {
    name: 'secondCountQty',
    width: 82,
    editor: false,
  },
  {
    name: 'secondAdjustQty',
    width: 82,
    editor: false,
  },
  {
    name: 'adjustAccountObj',
    width: 128,
    editor: false,
  },
  {
    name: 'countDate',
    width: 144,
    editor: false,
    align: ColumnAlign.center,
  },
  {
    name: 'countManName',
    width: 100,
    editor: false,
  },
  {
    name: 'countRemark',
    width: 200,
    editor: false,
  },
  {
    name: 'auditDate',
    width: 144,
    editor: false,
    align: ColumnAlign.center,
  },
  {
    name: 'auditManName',
    width: 100,
    editor: false,
  },
  {
    name: 'auditRemark',
    width: 200,
    editor: false,
  },
  {
    name: 'adjustByObj',
    width: 100,
    editor: false,
  },
  {
    name: 'adjustDate',
    width: 144,
    editor: false,
    align: ColumnAlign.center,
  },
  {
    name: 'adjustReason',
    width: 200,
    editor: false,
  },
  {
    name: 'adjustRemark',
    width: 200,
    editor: false,
  },
  {
    name: 'recordTypeMeaning',
    width: 100,
    editor: false,
  },
  {
    name: 'countFlag',
    width: 70,
    editor: false,
    renderer: yesOrNoRender,
  },
];

function InventoryPlatformDetail(props) {
  const { businessKey } = qs.parse(window.location.search) || {};
  let id = businessKey;
  if (businessKey === undefined || businessKey === null) {
    const { match } = props;
    const { countId } = match.params;
    id = countId;
  }
  const ds = useMemo(() => new DataSet(inventoryDetailAndAdjustmentDS()), []);
  const { history, queryPara, dispatch } = props;
  const { organizationId, organizationName, countNum, countType, countStatus, countStatusMeaning } =
    queryPara || {};
  useEffect(() => {
    async function queryData() {
      const result = await queryCounts({ countId: id });
      if (getResponse(result) && result.content && result.content[0]) {
        const data = result.content[0];
        dispatch({
          type: 'inventoryPlatform/updateState',
          payload: {
            queryPara: data,
          },
        });
      }
    }
    queryData();
    ds.setQueryParameter('countId', id);
    ds.query();
    (ds as any).queryDataSet.getField('warehouseObj').setLovPara('organizationId', organizationId);
  }, [ds, id]);

  const handleGoToProductionAdjustment = useCallback(() => {
    dispatch({
      type: 'inventoryPlatform/updateQueryPara',
      payload: {
        ...queryPara,
        queryParams: {
          ...ds.queryDataSet?.current?.toData(),
          countId: id,
        },
      },
    });
    history.push(`/lwms/inventory-platform/adjustment/${id}`);
  }, []);

  const generateTitle = () => {
    const title = intl.get(`${intlPrefix}.view.title.inventoryDetail`).d('盘点明细');
    return (
      <Fragment>
        {title}
        <span className={styles.headInfo}>
          <span>{organizationName && `${'  '}${organizationName}`}</span>
          <span>{countNum && `${'  '}${countNum}`}</span>
          <span>{countType && `${'  '}${countType}`}</span>
          <span>{countStatusMeaning && `${'  '}${countStatusMeaning}`}</span>
        </span>
      </Fragment>
    );
  };

  useDataSetEvent(ds.queryDataSet as DataSet, 'update', ({ name, record }) => {
    if (name === 'warehouseObj') {
      record.set('wmAreaObj', null);
    }
  });

  return (
    <Fragment>
      {businessKey === undefined ? (
        <Header title={generateTitle()} backPath="/lwms/inventory-platform/list">
          <ExcelExport
            requestUrl={`${HLOS_LWMS}/v1/${tenantId}/count-records/excel`}
            queryParams={() => getExportQueryParams(ds, id)}
          />
        </Header>
      ) : (
        <Header title={generateTitle()}>
          <ExcelExport
            requestUrl={`${HLOS_LWMS}/v1/${tenantId}/count-records/excel`}
            queryParams={() => getExportQueryParams(ds, id)}
          />
        </Header>
      )}
      <Content>
        <Table
          buttons={[
            <Button
              onClick={handleGoToProductionAdjustment}
              key="productionAdjustmentPreview"
              disabled={countStatus !== 'COMPLETED'}
            >
              {intl.get(`${intlPrefix}.productionAdjustmentPreview`).d('生成调整预览')}
            </Button>,
          ]}
          dataSet={ds}
          columns={getColumns()}
          queryFieldsLimit={4}
        />
      </Content>
    </Fragment>
  );
}

export default connect(({ inventoryPlatform }) => ({
  queryPara: inventoryPlatform?.queryPara,
}))(formatterCollections({ code: [`${intlPrefix}`, `${commonPrefix}`] })(InventoryPlatformDetail));
