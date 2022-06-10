/**
 * @Description: 在库检报检
 * @Author: yu.na<yu.na@hand-china.com>
 * @Date: 2021-03-17 10:29:14
 */

import React, { Fragment, useMemo, useEffect } from 'react';
import { Button, Table, DataSet } from 'choerodon-ui/pro';
import { useDataSetEvent } from 'hzero-front/lib/utils/hooks';
import { userSetting } from 'hlos-front/lib/services/api';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import { getResponse } from 'utils/utils';
import notification from 'utils/notification';
import { createWqcDoc } from '@/services/inspectionInWarehouseService';
import { ListDS } from '@/stores/inspectionInWarehouseDS';
import styles from './index.less';

const preCode = 'lmes.inspectionInWarehouse.model';

const InspectionInWarehouse = () => {
  const listDS = useMemo(() => new DataSet(ListDS()), []);

  useEffect(() => {
    async function queryDefaultData() {
      const res = await userSetting({ defaultFlag: 'Y' });
      if (res && res.content && res.content[0]) {
        const {
          organizationId,
          organizationCode,
          organizationName,
          workerId,
          workerCode,
          workerName,
          warehouseId,
          warehouseCode,
          warehouseName,
        } = res.content[0];
        if (organizationId) {
          listDS.queryDataSet.current.set('organizationObj', {
            organizationId,
            organizationCode,
            organizationName,
          });
        }
        if (workerId) {
          listDS.queryDataSet.current.set('workerObj', {
            workerId,
            workerCode,
            workerName,
          });
        }
        if (warehouseId) {
          listDS.queryDataSet.current.set('warehouseObj', [
            {
              warehouseId,
              warehouseCode,
              warehouseName,
            },
          ]);
        }
      }
    }
    queryDefaultData();
  }, []);

  useDataSetEvent(listDS.queryDataSet, 'update', ({ name, record }) => {
    if (name === 'organizationObj') {
      record.set('warehouseObj', null);
      record.set('itemObj', null);
      record.set('tagObj', null);
      record.set('lotObj', null);
    }
    if (name === 'warehouseObj') {
      record.set('wmAreaObj', null);
    }
  });

  const columns = useMemo(() => {
    return [
      { name: 'organization', width: 128, lock: true },
      { name: 'warehouse', width: 200, lock: true },
      { name: 'wmArea', width: 200 },
      { name: 'wmUnitCode', width: 200 },
      { name: 'itemCode', width: 128 },
      { name: 'itemDescription', width: 200 },
      { name: 'documentNum', width: 144 },
      { name: 'documentLineNum', width: 82 },
      { name: 'tagCode', width: 128 },
      { name: 'lotNumber', width: 128 },
      { name: 'quantity', width: 82 },
      { name: 'uomName', width: 70 },
      { name: 'batchQty', width: 82, editor: true },
      { name: 'samplingType', width: 84 },
      { name: 'inspectionTemplateType', width: 125 },
      { name: 'receivedDate', width: 100 },
      { name: 'madeDate', width: 100 },
      { name: 'expireDate', width: 100 },
      { name: 'lotStatus', width: 84 },
      { name: 'supplierName', width: 144 },
      { name: 'supplierLotNumber', width: 128 },
      { name: 'materialSupplier', width: 144 },
      { name: 'manufacturer', width: 144 },
    ];
  }, []);

  async function handleInspection() {
    if (!listDS.selected.length) {
      notification.error({
        message: intl.get(`hzero.common.message.validation.atLeast`).d('请至少选择一条数据'),
      });
      return;
    }
    const validateValue = await listDS.validate(true, false);
    if (!validateValue) {
      notification.warning({
        message: intl.get(`${preCode}.message.validation.required`).d('有必输项未输入'),
      });
      return;
    }

    const selectedList = listDS.selected.map((i) => ({
      ...i.toJSONData(),
      sourceDocId: i.toJSONData().documentId,
      sourceDocNum: i.toJSONData().documentNum,
      sourceDocTypeId: i.toJSONData().documentTypeId,
      sourceDocTypeCode: i.toJSONData().documentTypeCode,
      sourceDocLineId: i.toJSONData().documentLineId,
      sourceDocLineNum: i.toJSONData().documentLineNum,
      sampleQty: 1,
      itemControlType: null,
      inspectionTemplateType: null,
    }));
    const {
      organizationId,
      organizationCode,
      declarerId,
      declarer,
    } = listDS.queryDataSet.current.toJSONData();
    const params = {
      organizationId,
      organizationCode,
      declarerId,
      declarer,
      lines: selectedList,
    };
    const res = await createWqcDoc([params]);
    if (getResponse(res)) {
      notification.success();
      listDS.query();
    }
  }

  return (
    <Fragment>
      <Header title={intl.get(`${preCode}.view.title.index`).d('在库检报检')}>
        <Button color="primary" onClick={handleInspection}>
          {intl.get(`${preCode}.model.inpection`).d('报检')}
        </Button>
      </Header>
      <Content className={styles['lmes-inspectionInWarehouse-content']}>
        <Table dataSet={listDS} columns={columns} columnResizable="true" queryFieldsLimit={4} />
      </Content>
    </Fragment>
  );
};

export default InspectionInWarehouse;
