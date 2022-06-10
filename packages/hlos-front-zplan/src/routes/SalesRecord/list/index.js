/*
 * @Descripttion: 销售预测模型 - 时间序列预测模型
 * @version:
 * @Author: yin.lei@hand-china.com
 * @Date: 2021-05-18 14:01:49
 * @LastEditors: yin.lei@hand-china.com
 * @LastEditTime: 2021-05-18 14:15:15
 */

import React, { useEffect, Fragment } from 'react';
import { isUndefined } from 'lodash';
import { DataSet, Table, Button } from 'choerodon-ui/pro';
import { Header, Content } from 'components/Page';
import { HLOS_ZPLAN } from 'hlos-front/lib/utils/config';
import ExcelExport from 'components/ExcelExport';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';

import ItemAttributeSelect from '@/components/ItemAttributeSelect/index';

import { listDS } from '../store/indexDS';
import styles from './index.less';

const intlPrefix = 'zplan.timePredictionModel';
const ListDS = new DataSet(listDS());
const organizationId = getCurrentOrganizationId();

function ZplanTimePredictionModel() {
  useEffect(() => {
    ListDS.query();
  }, []);

  function handleSure(obj) {
    ListDS.current.set('itemAttr', {
      ...ListDS.current.toData(),
      ...obj,
      itemId: ListDS.current.get('customerItemId'),
      itemCode: ListDS.current.get('customerItemCode'),
    });
  }

  const columns = [
    {
      name: 'saleRecordNum',
      width: 170,
      editor: true,
    },
    {
      name: 'salesEntityName',
      width: 150,
      editor: true,
    },
    {
      name: 'itemCode',
      width: 150,
      editor: true,
    },
    {
      name: 'itemDesc',
      width: 150,
      editor: true,
    },
    {
      name: 'itemAttr',
      width: 150,
      renderer: ({ record, value }) => {
        return (
          <ItemAttributeSelect
            data={value}
            handleSure={handleSure}
            ds={ListDS}
            itemId={record.get('itemId')}
            itemDesc={record.get('itemDesc')}
            disabled={!record.editing}
          />
        );
      },
    },
    {
      name: 'saleDate',
      width: 120,
      editor: true,
    },
    {
      name: 'saleCount',
      width: 90,
      editor: true,
    },
    {
      name: 'uomName',
      width: 90,
      editor: true,
    },
    {
      name: 'standardPrice',
      width: 90,
      editor: true,
    },
    {
      name: 'actualPrice',
      width: 90,
      editor: true,
    },
    {
      name: 'currencyCode',
      width: 90,
      editor: true,
    },
    {
      name: 'saleRecordStatusMeaning',
      width: 90,
      editor: true,
    },
    {
      name: 'errorMessage',
      width: 150,
      editor: true,
    },
    {
      name: 'executeTime',
      width: 150,
      editor: true,
    },
    {
      name: 'discountRate',
      width: 90,
      editor: true,
    },
    {
      name: 'saleMonth',
      width: 90,
      editor: true,
    },
    {
      name: 'dayOfWeek',
      width: 90,
      editor: true,
    },
    {
      name: 'festivalCode',
      width: 90,
      editor: true,
    },
    {
      name: 'festivalStartDate',
      width: 120,
      editor: true,
    },
    {
      name: 'festivalEndDate',
      width: 120,
      editor: true,
    },
    {
      name: 'nearFestivalDay',
      width: 120,
      editor: true,
    },
    {
      name: 'activityCode',
      width: 120,
      editor: true,
    },
    {
      name: 'activityStartDate',
      width: 120,
      editor: true,
    },
    {
      name: 'activityEndDate',
      width: 120,
      editor: true,
    },
    {
      name: 'nearActivityDay',
      width: 120,
      editor: true,
    },
  ];

  /**
   * getExportQueryParams - 获取导出字段查询参数
   */
  function getExportQueryParams() {
    const formObj = ListDS.queryDataSet.current;
    const fieldsValue = isUndefined(formObj) ? {} : filterNullValueObject(formObj.toData());
    return {
      ...fieldsValue,
    };
  }

  return (
    <Fragment>
      <Header title={intl.get(`${intlPrefix}.view.title.timePredictionModel`).d('销售记录处理')}>
        <Button color="primary">数据处理</Button>
        <ExcelExport
          requestUrl={`${HLOS_ZPLAN}/v1/${organizationId}/plan-sale-records/export-sale-data-excel`}
          queryParams={getExportQueryParams}
        />
        {/* <HButton icon="upload" onClick={handleBatchExport}>
          {intl.get('zmda.common.button.import').d('导入')}
        </HButton> */}
      </Header>
      <Content className={styles['zplan-sales-record-list']}>
        <Table dataSet={ListDS} columns={columns} editMode="inline" rowHeight="auto" />
      </Content>
    </Fragment>
  );
}

export default formatterCollections({
  code: [`${intlPrefix}`],
})((props) => {
  return <ZplanTimePredictionModel {...props} />;
});
