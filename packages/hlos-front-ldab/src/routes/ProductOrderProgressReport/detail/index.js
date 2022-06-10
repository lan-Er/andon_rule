/*
 * @Description: 生产订单进度报表--detail
 * @Author: 那宇 <yu.na@hand-china.com>
 * @Date: 2020-11-05 11:05:22
 * @LastEditors: 那宇
 */

import React, { Fragment, useEffect, useState } from 'react';
import { Table, DataSet } from 'choerodon-ui/pro';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import formatterCollections from 'utils/intl/formatterCollections';
import { useDataSet } from 'hzero-front/lib/utils/hooks';
import { statusRender } from 'hlos-front/lib/utils/renderer';
import { DetailDS } from '@/stores/productOrderProgressReportDS';

import styles from './index.less';

const preCode = 'ldab.productOrderProgressReport';

const ProductionTaskProgressDetail = (props) => {
  const detailDS = () => new DataSet(DetailDS());
  const ds = useDataSet(detailDS, ProductionTaskProgressDetail);

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
    { name: 'taskNum', width: 128, lock: true },
    { name: 'operationName', width: 128, lock: true },
    { name: 'completedPercent', width: 90, align: 'right' },
    {
      name: 'taskStatusMeaning',
      width: 90,
      renderer: ({ value, record }) => statusRender(record.data.taskStatus, value),
    },
    { name: 'uomName', width: 80 },
    { name: 'taskQty', width: 100, align: 'right' },
    { name: 'processOkQty', width: 82, align: 'right' },
    { name: 'processNgQty', width: 82, align: 'right' },
    { name: 'reworkQty', width: 82, align: 'right' },
    { name: 'scrappedQty', width: 82, align: 'right' },
    { name: 'pendingQty', width: 82, align: 'right' },
    { name: 'planStartTime', width: 144 },
    { name: 'planEndTime', width: 144 },
    { name: 'actualStartTime', width: 144 },
    { name: 'actualEndTime', width: 144 },
    { name: 'supervisorName', width: 128 },
    { name: 'prodLineName', width: 128 },
    { name: 'workcellName', width: 128 },
    { name: 'equipmentName', width: 128 },
    { name: 'locationName', width: 128 },
    { name: 'workerName', width: 128 },
    {
      name: 'pictureIds',
      width: 128,
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
        backPath="/ldab/production-order-progress-report/list"
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
  code: ['ldab.productionTaskProgressReport', 'ldab.common'],
})(ProductionTaskProgressDetail);
