/**
 * @Description: 送货单冲销详情
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2020-12-09 14:27:07
 */

import React, { useState, useEffect, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import { DataSet, Button, Form, TextField, Table } from 'choerodon-ui/pro';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import { getCurrentUser } from 'utils/utils';
import notification from 'utils/notification';
import formatterCollections from 'utils/intl/formatterCollections';
import { deliveryWriteoffFormDS, deliveryWriteoffLineDS } from '../store/DeliveryWriteoffDS';

const intlPrefix = 'zcom.deliveryWriteoff';
const FormDS = new DataSet(deliveryWriteoffFormDS());
const LineDS = new DataSet(deliveryWriteoffLineDS());

function ZcomDeliveryWriteoffDetail({ ids, dispatch, history }) {
  const [writeoffLoading, setWriteoffLoading] = useState(false);

  useEffect(() => {
    FormDS.data = [];
    LineDS.data = [];
    FormDS.create();
    LineDS.clearCachedSelected();
    defaultSetting();
    LineDS.setQueryParameter('idList', ids);
    LineDS.query();
  }, []);

  function defaultSetting() {
    const { realName } = getCurrentUser();
    FormDS.current.set('executeWorker', realName);
  }

  function handleWriteoff() {
    setWriteoffLoading(true);
    return new Promise(async (resolve) => {
      const validateForm = await FormDS.validate(false, false);
      const validateLine = await LineDS.validate(false, false);
      const hasEmptyExecuteQty = LineDS.data.findIndex((item) => {
        const executeQty = item.get('executeQty');
        return executeQty === undefined || executeQty === null;
      });
      if (!validateForm || !validateLine || hasEmptyExecuteQty !== -1) {
        notification.warning({
          message: '数据校验不通过',
        });
        resolve(setWriteoffLoading(false));
        return false;
      }
      const formData = FormDS.current.data;
      const arr = LineDS.data.map((item) => {
        const obj = Object.assign({}, item.toData(), {
          executeWorker: formData.executeWorker,
          actualExecuteWorker: formData.actualExecuteWorker,
          actualExecuteTime: item.data.actualExecuteTime
            ? moment(item.data.actualExecuteTime).format('YYYY-MM-DD HH:mm:ss')
            : '',
        });
        return obj;
      });
      dispatch({
        type: 'deliveryWriteoff/cancelDeliveryOrder',
        payload: arr,
      }).then((res) => {
        if (res && !res.failed) {
          notification.success({
            message: '操作成功',
          });
          const pathName = `/zcom/delivery-writeoff`;
          history.push(pathName);
        }
        resolve(setWriteoffLoading(false));
      });
    });
  }

  const columns = [
    { name: 'deliveryOrderNum', width: 150 },
    { name: 'customerItemCode', width: 150 },
    { name: 'customerItemDescription', width: 150 },
    { name: 'deliveryQty', width: 150 },
    { name: 'acceptableQty', width: 150 },
    { name: 'cancelableQty', width: 150 },
    { name: 'executeQty', width: 150, align: 'left', editor: true },
    { name: 'actualExecuteTime', width: 150, editor: true },
    { name: 'receiveOrgName', width: 150 },
    { name: 'executeWarehouseObj', width: 150 },
    { name: 'executeWmAreaObj', width: 150 },
    { name: 'sourceDocNum', width: 150 },
    { name: 'sourceDocLineNum', width: 150 },
    { name: 'uomName', width: 150 },
    { name: 'supplierName', width: 150 },
    { name: 'promiseDate', width: 150 },
    { name: 'executeRemark', width: 150, editor: true },
  ];

  return (
    <Fragment>
      <Header
        title={intl.get(`${intlPrefix}.view.title.deliveryWriteoffDetail`).d('冲销送货单详情')}
        backPath="/zcom/delivery-writeoff"
      >
        <Button color="primary" loading={writeoffLoading} onClick={handleWriteoff}>
          冲销
        </Button>
      </Header>
      <Content>
        <div style={{ marginBottom: '10px' }}>
          <Form dataSet={FormDS} columns={4}>
            <TextField name="executeWorker" key="executeWorker" disabled />
            <TextField name="actualExecuteWorker" key="actualExecuteWorker" />
          </Form>
        </div>
        <Table dataSet={LineDS} columns={columns} columnResizable="true" />
      </Content>
    </Fragment>
  );
}

export default connect(({ deliveryWriteoff: { ids } }) => ({ ids }))(
  formatterCollections({
    code: [`${intlPrefix}`],
  })(ZcomDeliveryWriteoffDetail)
);
