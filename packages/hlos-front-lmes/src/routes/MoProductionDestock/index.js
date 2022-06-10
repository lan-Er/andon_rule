/**
 * @Description: MO生产退库--Index
 * @Author: tw
 * @Date: 2021-03-25 16:26:00
 * @LastEditors: tw
 */

import React, { Fragment, useEffect, useMemo } from 'react';
import { DataSet, Table, Lov, Form, Button, TextField, NumberField } from 'choerodon-ui/pro';
import { useDataSetEvent } from 'hzero-front/lib/utils/hooks';
import { queryLovData } from 'hlos-front/lib/services/api';
import notification from 'utils/notification';
// import { isEmpty } from 'lodash';
import intl from 'utils/intl';
import { getResponse } from 'utils/utils';
import { Header, Content } from 'components/Page';

// import { yesOrNoRender } from 'hlos-front/lib/utils/renderer';
import { MoProductionDestockListDS } from '@/stores/MoProductionDestockDS.js';
import { moInventoryReturn } from '@/services/moProductionDestockService';
import codeConfig from '@/common/codeConfig';
import styles from './index.less';

const { common } = codeConfig.code;

const preCode = 'lmes.moProductionDestock';

const MoProductionDestock = () => {
  const listDS = useMemo(() => new DataSet(MoProductionDestockListDS()), []);

  /**
   *设置默认查询条件
   */
  useEffect(() => {
    async function defaultLovSetting() {
      const res = await queryLovData({ lovCode: common.organization, defaultFlag: 'Y' });
      if (getResponse(res)) {
        if (res && res.content && res.content[0]) {
          listDS.queryDataSet.current.set('organizationObj', {
            meOuId: res.content[0].organizationId,
            meOuName: res.content[0].organizationName,
          });
        }
      }

      const workerRes = await queryLovData({ lovCode: common.worker, defaultFlag: 'Y' });
      if (getResponse(workerRes)) {
        if (workerRes && workerRes.content && workerRes.content[0]) {
          listDS.queryDataSet.current.set('workerObj', {
            workerId: workerRes.content[0].workerId,
            workerCode: workerRes.content[0].workerCode,
            workerName: workerRes.content[0].workerName,
          });
        }
      }
    }
    defaultLovSetting();
  }, [listDS]);

  useDataSetEvent(listDS, 'update', ({ name, record }) => {
    if (name === 'returnQty') {
      if (record.get('returnQty') > 0) {
        listDS.select(record);
      } else {
        listDS.unSelect(record);
      }
    }
  });

  function handleWarehouseChange() {
    listDS.queryDataSet.current.set('wmAreaObj', null);
    listDS.records.forEach((record) => {
      if (listDS.queryDataSet.current.get('warehouseObj')) {
        record.set('warehouseObj', {
          warehouseId: listDS.queryDataSet.current.get('warehouseObj')?.warehouseId,
          warehouseCode: listDS.queryDataSet.current.get('warehouseObj')?.warehouseCode,
          warehouseName: listDS.queryDataSet.current.get('warehouseObj')?.warehouseName,
        });
      }
    });
  }

  function handleWmAreaChange() {
    listDS.records.forEach((record) => {
      if (listDS.queryDataSet.current.get('wmAreaObj')) {
        record.set('wmAreaObj', {
          wmAreaId: listDS.queryDataSet.current.get('wmAreaObj')?.wmAreaId,
          wmAreaCode: listDS.queryDataSet.current.get('wmAreaObj')?.wmAreaCode,
          wmAreaName: listDS.queryDataSet.current.get('wmAreaObj')?.wmAreaName,
        });
      }
    });
  }

  // function lineWarehouseChange(record) {
  //   debugger;
  //   if(record.get('warehouseObj')){
  //     setWmAreaObjDisabled(false);
  //   }else {
  //     setWmAreaObjDisabled(true);
  //   // }
  // }

  function handleReturnQtyChange(record) {
    if (record <= 0) {
      return notification.warning({
        message: '退库数量需大于0',
      });
    }
  }

  /**
   *table列
   * @returns
   */
  function columns() {
    return [
      {
        name: 'organization',
        width: 128,
        key: 'organization',
        lock: true,
        renderer: ({ record }) => (
          <span>
            {record.get('organizationCode')} {record.get('organizationName')}
          </span>
        ),
      },
      { name: 'documentNum', width: 128, key: 'documentNum', lock: true },
      {
        name: 'itemCode',
        width: 200,
        key: 'itemCode',
        lock: true,
        renderer: ({ record }) => (
          <span>
            {record.get('itemCode')} {record.get('description')}
          </span>
        ),
      },
      {
        name: 'uomName',
        width: 70,
        key: 'uomName',
      },
      {
        name: 'returnQty',
        width: 90,
        key: 'returnQty',
        editor: <NumberField onChange={(record) => handleReturnQtyChange(record)} />,
      },
      {
        name: 'executedQty',
        width: 82,
        key: 'executedQty',
      },
      {
        name: 'secondUomName',
        width: 70,
        key: 'secondUomName',
      },
      {
        name: 'secondReturnQty',
        width: 90,
        key: 'secondReturnQty',
        editor: true,
      },
      {
        name: 'secondInventoryQty',
        width: 82,
        key: 'secondInventoryQty',
      },
      {
        name: 'warehouseObj',
        width: 128,
        key: 'warehouseObj',
        editor: <Lov />,
      },
      {
        name: 'wmAreaObj',
        width: 128,
        key: 'wmAreaObj',
        editor: <Lov />,
      },
      { name: 'tagCode', width: 128, key: 'tagCode' },
      { name: 'lotNumber', width: 128, key: 'lotNumber' },
    ];
  }

  /**
   *tab查询条件
   * @returns
   */
  function queryFields() {
    return [
      <Lov name="organizationObj" noCache key="organizationObj" />,
      <Lov name="moNumObj" noCache key="moNumObj" />,
      <TextField name="tagCode" key="tagCode" />,
      <TextField name="lotNumber" key="lotNumber" />,
      <Lov name="warehouseObj" noCache key="warehouseObj" onChange={handleWarehouseChange} />,
      <Lov name="wmAreaObj" noCache key="wmAreaObj" onChange={handleWmAreaChange} />,
      <Lov name="workerObj" noCache key="workerObj" />,
      <TextField name="returnReason" key="returnReason" />,
      <TextField name="remark" colSpan={2} key="remark" />,
    ];
  }

  /**
   * 查询
   */
  async function handleSearch() {
    const validateValue = await listDS.validate(false, false);
    if (!validateValue) {
      return;
    }
    await listDS.query();
    listDS.records.forEach((record) => {
      if (listDS.queryDataSet.current.get('warehouseObj')) {
        record.set('warehouseObj', {
          warehouseId: listDS.queryDataSet.current.get('warehouseObj')?.warehouseId,
          warehouseCode: listDS.queryDataSet.current.get('warehouseObj')?.warehouseCode,
          warehouseName: listDS.queryDataSet.current.get('warehouseObj')?.warehouseName,
        });
      }

      if (listDS.queryDataSet.current.get('wmAreaObj')) {
        record.set('wmAreaObj', {
          wmAreaId: listDS.queryDataSet.current.get('wmAreaObj')?.wmAreaId,
          wmAreaCode: listDS.queryDataSet.current.get('wmAreaObj')?.wmAreaCode,
          wmAreaName: listDS.queryDataSet.current.get('wmAreaObj')?.wmAreaName,
        });
      }
    });
  }

  /**
   * 重置
   */
  function handleReset() {
    listDS.queryDataSet.current.reset();
  }

  /**
   * 提交
   */
  async function handleSubmit() {
    const { selected } = listDS;
    if (selected.length < 1) {
      notification.warning({
        message: intl.get(`hzero.common.message.validation.atLeast`).d('请至少选择一条数据'),
      });
      return false;
    }
    const data = selected.map((item) => ({
      moId: item.get('documentId'),
      itemId: item.get('itemId'),
      itemCode: item.get('itemCode'),
      uomId: item.get('uomId'),
      uom: item.get('uom'),
      returnedTime: new Date().toJSON(),
      warehouseId: item.get('warehouseId'),
      warehouseCode: item.get('warehouseCode'),
      wmAreaId: item.get('wmAreaId'),
      wmAreaCode: item.get('wmAreaCode'),
      workerId: listDS.queryDataSet.current.get('workerId'),
      worker: listDS.queryDataSet.current.get('worker'),
      returnReason: listDS.queryDataSet.current.get('returnReason'),
      remark: listDS.queryDataSet.current.get('remark'),
      // ...item.toData(),
      tagId: item.get('tagId'),
      tagCode: item.get('tagCode'),
      lotId: item.get('lotId'),
      lotNumber: item.get('lotNumber'),
      returnedQty: item.get('returnQty'),
      moInventoryReturnLineDTOList: [
        {
          tagId: item.get('tagId'),
          tagCode: item.get('tagCode'),
          lotId: item.get('lotId'),
          lotNumber: item.get('lotNumber'),
          returnedQty: item.get('returnQty'),
        },
      ],
    }));
    const res = await moInventoryReturn(data);
    if (res.failed) {
      notification.error({
        message: res.message,
      });
      return;
    }
    // if (res && !res.failed) {
    notification.success({
      message: '操作成功',
    });
    handleSearch();
    // }
  }

  /**
   *渲染表格查询条件
   * @returns
   */
  function renderBar(queryDataSet) {
    return (
      <div style={{ display: 'flex', marginBottom: '10px', alignItems: 'flex-start' }}>
        <Form dataSet={queryDataSet} columns={4} style={{ flex: 'auto' }}>
          {queryFields()}
        </Form>
        <div
          style={{
            marginLeft: 10,
            marginTop: 10,
            flexShrink: 0,
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <Button onClick={handleReset}>{intl.get('hzero.common.button.reset').d('重置')}</Button>
          <Button color="primary" onClick={() => handleSearch()}>
            {intl.get('hzero.common.button.search').d('查询')}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <Fragment>
      <Header title={intl.get(`${preCode}.view.title.moProductionDestock`).d('MO生产退库')}>
        <Button onClick={() => handleSubmit()}>
          {intl.get('hzero.common.button.submit').d('提交')}
        </Button>
      </Header>
      <Content className={styles['lmes-mo-production-destock-content']}>
        <Table
          dataSet={listDS}
          columns={columns()}
          border={false}
          columnResizable="true"
          queryBar={({ queryDataSet }) => renderBar(queryDataSet)}
        />
      </Content>
    </Fragment>
  );
};

export default MoProductionDestock;
