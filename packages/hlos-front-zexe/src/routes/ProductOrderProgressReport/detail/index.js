/**
 * @Description: 生产订单进度报表--detail
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2021-01-19 10:10:20
 */

import React, { Fragment, useEffect, useState } from 'react';
import { Table, DataSet } from 'choerodon-ui/pro';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import { useDataSet } from 'hzero-front/lib/utils/hooks';
import { orderStatusRender } from 'hlos-front/lib/utils/renderer';
import { DetailDS } from '../store/ProductOrderProgressReportDS';
import styles from './index.less';

const preCode = 'zexe.productOrderProgressReport';

const ProductTaskProgressDetail = (props) => {
  const detailDS = () => new DataSet(DetailDS());
  const ds = useDataSet(detailDS, ProductTaskProgressDetail);

  const [moInfo, setMoInfo] = useState({});

  useEffect(() => {
    async function queryDetail() {
      const {
        match: {
          params: { moId },
        },
        location: { state },
      } = props;
      ds.queryParameter = {
        moId,
      };
      if (state) {
        setMoInfo(state);
      }
      await ds.query();
    }
    queryDetail();
  }, [ds, props]);

  const columns = [
    { name: 'taskNum', width: 150, lock: true },
    { name: 'operationName', width: 150, lock: true },
    { name: 'completedPercent', width: 150, align: 'right' },
    {
      name: 'taskStatusMeaning',
      width: 150,
      renderer: ({ value, record }) => orderStatusRender(record.data.taskStatus, value),
    },
    { name: 'uomName', width: 150 },
    { name: 'taskQty', width: 100, align: 'right' },
    { name: 'processOkQty', width: 100, align: 'right' },
    { name: 'processNgQty', width: 100, align: 'right' },
    { name: 'reworkQty', width: 100, align: 'right' },
    { name: 'scrappedQty', width: 100, align: 'right' },
    { name: 'pendingQty', width: 100, align: 'right' },
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
    {
      name: 'pictureIds',
      renderer: ({ value }) => {
        return (
          <a href={value} target="_blank" rel="noopener noreferrer" style={{ margin: '3px 10px' }}>
            {value}
          </a>
        );
      },
    },
  ];

  return (
    <Fragment>
      <Header
        title={intl.get(`${preCode}.view.title.detail`).d('生产订单进度详情')}
        backPath="/zexe/product-order-progress-report/list"
      />
      <Content>
        <div className={styles['lmes-product-order-progress-mo']}>
          <p>MO号：{moInfo.moNum}</p>
          <p>物料：{moInfo.itemCode}</p>
          <p>描述：{moInfo.description}</p>
          <p>客户：{moInfo.customerName}</p>
        </div>
        <div className={styles['lmes-product-order-progress-mo']}>
          <p>工厂：{moInfo.ownerOrganizationName}</p>
          <p>需求时间：{moInfo.demandDate}</p>
          <p>延期天数：{moInfo.delayDays}天</p>
        </div>
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
})(ProductTaskProgressDetail);
