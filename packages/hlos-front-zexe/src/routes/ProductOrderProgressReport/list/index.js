/**
 * @Description: 生产订单进度报表
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2021-01-19 09:53:49
 */

import React, { Fragment } from 'react';
import { Table, DataSet } from 'choerodon-ui/pro';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
// import { getResponse } from 'utils/utils';
import formatterCollections from 'utils/intl/formatterCollections';
import { useDataSet } from 'hzero-front/lib/utils/hooks';
// import { userSetting } from 'hlos-front/lib/services/api';
import { orderStatusRender } from 'hlos-front/lib/utils/renderer';
import { ListDS } from '../store/ProductOrderProgressReportDS';
import styles from './index.less';

const preCode = 'zexe.productOrderProgressReport';

const ProductTaskProgressReport = (props) => {
  const listDS = () =>
    new DataSet({
      ...ListDS(),
    });
  const ds = useDataSet(listDS, ProductTaskProgressReport);

  const linkRender = ({ value, record }) => {
    return <a onClick={() => handleToDetailPage(record.data.moId)}>{value}</a>;
  };

  const delayRender = ({ value }) => {
    return <span style={value > 0 ? { color: 'red' } : {}}>{value}</span>;
  };

  const columns = [
    { name: 'supplierNumber', width: 150, lock: true },
    { name: 'supplierName', width: 150, lock: true },
    { name: 'ownerOrganizationName', width: 150, lock: true },
    { name: 'moNum', width: 150, lock: true, renderer: linkRender },
    { name: 'itemCode', width: 150, lock: true },
    { name: 'description', width: 150 },
    { name: 'customerName', width: 150 },
    { name: 'completedPercent', width: 100, align: 'right' },
    { name: 'demandDate', width: 150 },
    { name: 'delayDays', width: 100, align: 'right', renderer: delayRender },
    { name: 'uomName', width: 100 },
    { name: 'demandQty', width: 100, align: 'right' },
    { name: 'completedQty', width: 100, align: 'right' },
    { name: 'processNgQty', width: 100, align: 'right' },
    { name: 'reworkQty', width: 100, align: 'right' },
    { name: 'scrappedQty', width: 100, align: 'right' },
    { name: 'pendingQty', width: 100, align: 'right' },
    { name: 'inventoryQty', width: 100, align: 'right' },
    { name: 'suppliedQty', width: 100, align: 'right' },
    { name: 'so', width: 150 },
    { name: 'demandNum', width: 150 },
    {
      name: 'moStatusMeaning',
      width: 150,
      renderer: ({ value, record }) => orderStatusRender(record.data.moStatus, value),
    },
    { name: 'moTypeName', width: 150 },
    { name: 'itemCategoryName', width: 150 },
    { name: 'promiseDate', width: 150 },
    { name: 'planStartTime', width: 150 },
    { name: 'planEndTime', width: 150 },
    { name: 'topMoNum', width: 150 },
    { name: 'parentMoNums', width: 150 },
    { name: 'moLevel', width: 100, align: 'right' },
  ];

  // useEffect(() => {
  //   async function queryDefaultOrg() {
  //     const res = await userSetting({
  //       defaultFlag: 'Y',
  //     });
  //     if (getResponse(res) && res && res.content && res.content[0]) {
  //       const { meOuId, meOuName } = res.content[0];
  //       ds.queryDataSet.current.set('organizationObj', {
  //         organizationId: meOuId,
  //         organizationName: meOuName,
  //       });
  //     }
  //   }
  //   queryDefaultOrg();
  // }, []);

  const handleToDetailPage = (val) => {
    props.history.push({
      pathname: `/zexe/product-order-progress-report/detail/${val}`,
      state: ds.current.toJSONData(),
    });
  };

  return (
    <Fragment>
      <Header title={intl.get(`${preCode}.view.title.index`).d('生产订单进度报表')} />
      <Content className={styles['zexe-product-order-progress']}>
        <Table
          autoHeight
          dataSet={ds}
          columns={columns}
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
