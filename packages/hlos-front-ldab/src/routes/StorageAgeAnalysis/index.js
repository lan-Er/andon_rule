/*
 * @Description: 库龄分析报表--Index
 * @Author: 那宇 <yu.na@hand-china.com>
 * @Date: 2020-11-05 10:05:22
 * @LastEditors: Please set LastEditors
 */

import React, { useCallback, useState, useEffect } from 'react';
import { Select, Button, Form, Lov, DataSet, Table } from 'choerodon-ui/pro';
import intl from 'utils/intl';
import { getResponse } from 'utils/utils';
import { useDataSet } from 'hzero-front/lib/utils/hooks';
import { ListDS, DetailDS } from '@/stores/storageAgeAnalysisDS';
import { userSetting } from 'hlos-front/lib/services/api';

import styles from './index.less';

const dsFactory = () => new DataSet(ListDS());
const detailFactory = () => new DataSet(DetailDS());

const StorageAgeAnalysis = () => {
  const ds = useDataSet(dsFactory, StorageAgeAnalysis);
  const detailDS = useDataSet(detailFactory);
  const [moreColumns, setMoreColumns] = useState([]);
  const [queryType, setQueryType] = useState(null);
  const [selectValue, setSelectValue] = useState('WAREHOUSE');
  useEffect(() => {
    async function getUserInfo() {
      const res = await userSetting({ defaultFlag: 'Y' });
      if (res && res.content && res.content.length) {
        ds.queryDataSet.current.set('organizationObj', {
          meOuId: res.content[0].meOuId,
          meOuName: res.content[0].organizationName,
        });
      }
    }
    getUserInfo();
  }, []);
  useEffect(() => {
    ds.queryDataSet.addEventListener('update', async ({ name }) => {
      if (name === 'organizationObj') {
        ds.queryDataSet.current.set('warehouseObj', null);
      }
    });
    return () => {
      ds.queryDataSet.removeEventListener('update');
    };
  }, []);
  const handleReset = () => {
    ds.queryDataSet.current.reset();
  };

  const handleSearch = async (type, flag) => {
    const validateValue = await ds.queryDataSet.validate(false, false);
    if (!validateValue) return;
    const _queryType = flag ? type : queryType;
    ds.queryParameter = {
      queryType: _queryType,
    };
    const res = await ds.query();
    if (getResponse(res) && res.content && res.content[0]) {
      const { itemId, warehouseId, organizationId } = res.content[0];
      let params = {
        itemId,
        organizationId,
      };
      if (!_queryType) {
        params = {
          ...params,
          warehouseId,
        };
      }
      detailDS.queryParameter = params;
      await detailDS.query();
      const columns = [];
      Object.keys(res.content[0]).forEach((i) => {
        if (i.indexOf('section') !== -1) {
          const arr = res.content[0][i].split(',');
          let header = '';
          if (arr[0] < 0) {
            header = `${arr[1]}天内`;
          } else if (arr[0] > 0 && arr[1] - arr[0] > 100000) {
            header = `${arr[0]}日以上`;
          } else {
            header = `${arr[0]}日~${arr[1]}日`;
          }
          columns.push({
            header,
            name: i.substr(7).toLowerCase(),
            width: 90,
          });
        }
      });
      setMoreColumns(columns);
    }
  };

  const columns = useCallback(() => {
    return [
      { name: 'itemCode', width: 128, lock: 'left' },
      { name: 'description', width: 128, lock: 'left' },
      { name: 'itemTypeMeaning', width: 84 },
      { name: 'warehouseName', width: 128, hidden: queryType },
      { name: 'uomName', width: 70 },
      ...moreColumns,
      { name: 'sumQty', width: 100 },
    ];
  }, [moreColumns, queryType]);

  const detailColumns = useCallback(() => {
    return [
      { name: 'itemCode', width: 128, lock: 'left' },
      { name: 'descriptions', width: 200, lock: 'left' },
      { name: 'warehouseName', width: 128 },
      { name: 'wmAreaName', width: 128 },
      { name: 'wmUnitCode', width: 128 },
      { name: 'lotNumber', width: 128 },
      { name: 'lotStatusMeaning', width: 84 },
      { name: 'uomName', width: 70 },
      { name: 'quantity', width: 82 },
      { name: 'inventoryAging', width: 82 },
      { name: 'receivedDate', width: 100 },
      { name: 'madeDate', width: 100 },
      { name: 'expireDate', width: 100 },
      { name: 'supplierName', width: 200 },
      { name: 'supplierLotNumber', width: 128 },
      { name: 'materialLotNumber', width: 128 },
      { name: 'materialSupplier', width: 200 },
      { name: 'manufacturer', width: 200 },
    ];
  }, []);

  const handleSelectChange = (val) => {
    setSelectValue(val);
    setQueryType(val === 'ITEM' ? val : null);
    handleSearch(val === 'ITEM' ? val : null, true);
  };

  /**
   *通过点击来查行,并且在此设置行颜色。
   * @param {*} { record }
   * @returns
   */
  const handleRowClick = ({ record }) => {
    const { itemId, warehouseId, organizationId } = record.data;
    let params = {
      itemId,
      organizationId,
    };
    if (!queryType) {
      params = {
        ...params,
        warehouseId,
      };
    }
    return {
      onClick: async () => {
        detailDS.queryParameter = params;
        await detailDS.query();
      },
    };
  };

  return (
    <div className={styles['storage-age-analysis']}>
      <div className={styles.header}>
        <div className={styles['header-left']}>
          <Select value={selectValue} onChange={handleSelectChange}>
            <Select.Option value="WAREHOUSE" key="WAREHOUSE">
              物料+仓库
            </Select.Option>
            <Select.Option value="ITEM" key="ITEM">
              物料
            </Select.Option>
          </Select>
          <span>选择想要统计的维度</span>
        </div>
      </div>
      <div className={styles.query} style={{ display: 'flex', marginBottom: '10px' }}>
        <Form
          dataSet={ds.queryDataSet}
          columns={4}
          style={{ flex: 'auto' }}
          labelLayout="placeholder"
        >
          <Lov name="organizationObj" noCache />
          <Lov name="itemObj" noCache />
          <Lov name="warehouseObj" noCache />
          <Select name="itemType" allowClear={false} />
        </Form>
        <div style={{ marginLeft: 8, display: 'flex', alignItems: 'center' }}>
          <Button onClick={handleReset}>{intl.get('hzero.common.button.reset').d('重置')}</Button>
          <Button color="primary" onClick={handleSearch}>
            {intl.get('hzero.common.button.search').d('查询')}
          </Button>
        </div>
      </div>
      <div className={styles.list}>
        <Lov dataSet={ds.queryDataSet} name="categoryObj" placeholder="物料类别" noCache />
        <Table
          dataSet={ds}
          columns={columns()}
          columnResizable="true"
          queryBar="none"
          onRow={handleRowClick}
        />
      </div>
      <div className={styles['detail-list']}>
        <div>明细</div>
        <Table
          dataSet={detailDS}
          columns={detailColumns()}
          columnResizable="true"
          queryBar="none"
        />
      </div>
    </div>
  );
};

export default StorageAgeAnalysis;
