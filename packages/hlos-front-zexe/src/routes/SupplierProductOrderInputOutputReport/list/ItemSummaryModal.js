import React, { Fragment, useEffect } from 'react';
import { DataSet, Table, Form, Lov, NumberField, Button } from 'choerodon-ui/pro';

import ExcelExport from 'components/ExcelExport';
import { isUndefined } from 'lodash';
import { filterNullValueObject, getCurrentOrganizationId } from 'utils/utils';
import { HLOS_ZEXE } from 'hlos-front/lib/utils/config';
import { useDataSet } from 'hzero-front/lib/utils/hooks';
import { Content } from 'components/Page';

import { SummaryDS } from '../store/SupplierProductOrderInputOutputReportDS';
import styles from './style.less';

const organizationId = getCurrentOrganizationId();
const url = `${HLOS_ZEXE}/v1/${organizationId}/report/mo-inputration-supplier`;

export default function ItemDimension(props) {
  const summaryDS = () =>
    new DataSet({
      ...SummaryDS(),
    });

  const ds = useDataSet(summaryDS);

  async function handleSearch() {
    await ds.query();
  }

  function getExportQueryParams() {
    const formObj = ds && ds.queryDataSet && ds.queryDataSet.current;
    const fieldsValue = isUndefined(formObj) ? {} : filterNullValueObject(formObj.toData());
    const { moStatus: moStatusList } = fieldsValue;
    return {
      ...fieldsValue,
      moStatusList,
      moStatus: undefined,
    };
  }

  useEffect(() => {
    const params = props.ds.queryDataSet.current.toJSONData();
    ds.queryDataSet.create({
      ...params,
      minInputRatio: '',
      maxInputRatio: '',
      itemObj: {
        itemCode: '',
      },
    });
    ds.query();
  }, []);

  const columns = [
    {
      name: 'totalInputRatio',
      renderer: ({ text }) => (text ? <Fragment>{`${text}%`}</Fragment> : <Fragment>0%</Fragment>),
    },
    { name: 'componentItemCode' },
    { name: 'componentItemDescription' },
    { name: 'totalDemandQty' },
    { name: 'totalIssuedQty' },
    { name: 'uom' },
  ];

  return (
    <Fragment>
      <Content className={styles['zexe-supplier-product-order-input-output-item-dimension']}>
        <div className={styles['header-row']}>
          <Form dataSet={ds.queryDataSet} columns={5}>
            <Lov colSpan={2} name="itemObj" />
            <NumberField colSpan={1} name="minInputRatio" />
            <NumberField colSpan={1} name="maxInputRatio" />
          </Form>
          <div className={styles['header-btn']}>
            <Button onClick={handleSearch}>查询</Button>
            <ExcelExport
              buttonText="导出"
              requestUrl={`${url}/item/excel`}
              queryParams={getExportQueryParams}
              method="GET"
            />
          </div>
        </div>
        <Table
          dataSet={ds}
          columns={columns}
          columnResizable="true"
          header="物料维度"
          queryBar="none"
          pagination={{ showPager: true, showSizeChanger: true, showTotal: true }}
        />
      </Content>
    </Fragment>
  );
}
