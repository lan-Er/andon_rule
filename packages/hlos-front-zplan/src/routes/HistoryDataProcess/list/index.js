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
import { DataSet, Table } from 'choerodon-ui/pro';
import { Header, Content } from 'components/Page';
import { HLOS_ZPLAN } from 'hlos-front/lib/utils/config';
import { Button as HButton } from 'hzero-ui';
import ExcelExport from 'components/ExcelExport';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import { openTab } from 'utils/menuTab';
import { getCurrentOrganizationId, filterNullValueObject } from 'utils/utils';
import queryString from 'query-string';
import statusConfig from '@/common/statusConfig';
import ItemAttributeSelect from '@/components/ItemAttributeSelect/index';

import { listDS } from '../store/indexDS';

const intlPrefix = 'zplan.timePredictionModel';
const ListDS = new DataSet(listDS());
const organizationId = getCurrentOrganizationId();
const {
  importTemplateCode: { saleRecord },
} = statusConfig.statusValue.zmda;

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
      width: 120,
      editor: true,
    },
    {
      name: 'uomName',
      width: 90,
      editor: true,
    },
    {
      name: 'standardPrice',
      width: 120,
      editor: true,
    },
    {
      name: 'actualPrice',
      width: 120,
      editor: true,
    },
    {
      name: 'currencyCode',
      width: 90,
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

  function handleBatchExport() {
    try {
      openTab({
        key: `/himp/commentImport/${saleRecord}`,
        title: intl.get(`${intlPrefix}.view.title.supplierImport`).d('历史数据处理导入'),
        search: queryString.stringify({
          action: 'himp.commentImport.view.button.templateImport',
        }),
      });
    } catch (e) {
      // eslint-disable-next-line no-console
      console.error(e.message);
    }
  }

  return (
    <Fragment>
      <Header title={intl.get(`${intlPrefix}.view.title.timePredictionModel`).d('历史销售记录')}>
        <ExcelExport
          requestUrl={`${HLOS_ZPLAN}/v1/${organizationId}/plan-sale-records/export-excel`}
          queryParams={getExportQueryParams}
        />
        <HButton icon="upload" onClick={handleBatchExport}>
          {intl.get('zmda.common.button.import').d('导入')}
        </HButton>
      </Header>
      <Content>
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
