import React, { Fragment, useState, useEffect } from 'react';
import { Header, Content } from 'components/Page';
import { DataSet, Button, Form, TextField, Lov, Table, Modal } from 'choerodon-ui/pro';
import notification from 'utils/notification';
import { addHeadDS, addLineDS } from '../../../stores/badPartsReturnPlatformDS';
import { changeButton, deleteLineButton } from '../../../services/badPartsReturnPlatformService';
import styles from './index.less';

const headDS = new DataSet(addHeadDS());
const lineDS = new DataSet(addLineDS());

const BadPartsReturnPlatform = ({ location }) => {
  const [backPath, setBackPath] = useState(null);
  const [totalElements, setTotalElements] = useState(0);

  useEffect(() => {
    const stateParams = location?.state || {};
    setBackPath(stateParams.backPath);

    headDS.reset();
    headDS.getField('areaObj').setLovPara('meOuId', stateParams.meOuId);
    headDS.getField('toWarehouseObj').setLovPara('organizationId', stateParams.organizationId);
    headDS.getField('warehouseObj').setLovPara('organizationId', stateParams.organizationId);

    lineDS.reset();
    lineDS.getField('moObj').setLovPara('organizationId', stateParams.organizationId);

    function getUpdateQuery() {
      const { headData } = stateParams;

      headDS.current.set('requestId', headData.requestId);
      headDS.current.set('requestNum', headData.requestNum);
      headDS.current.set('meAreaId', headData.requestDepartmentId);
      headDS.current.set('meAreaCode', headData.requestDepartment);
      headDS.current.set('meAreaName', headData.requestDepartmentName);
      headDS.current.set('toWarehouseId', headData.toWarehouseId);
      headDS.current.set('toWarehouseCode', headData.toWarehouseCode);
      headDS.current.set('toWarehouseName', headData.toWarehouseName);
      headDS.current.set('toWmAreaId', headData.toWmAreaId);
      headDS.current.set('toWmAreaCode', headData.toWmAreaCode);
      headDS.current.set('toWmAreaName', headData.toWmAreaName);
      headDS.current.set('warehouseId', headData.warehouseId);
      headDS.current.set('warehouseCode', headData.warehouseCode);
      headDS.current.set('warehouseName', headData.warehouseName);
      headDS.current.set('wmAreaId', headData.wmAreaId);
      headDS.current.set('wmAreaCode', headData.wmAreaCode);
      headDS.current.set('wmAreaName', headData.wmAreaName);

      lineDS.queryParameter = { requestId: headData.requestId };
      lineQuery();
    }
    getUpdateQuery();
  }, []);

  function lineQuery() {
    lineDS.query().then((res) => {
      if (res && res.content) {
        setTotalElements(res.totalElements || 0);
      } else {
        setTotalElements(0);
      }
    });
  }

  async function saveData() {
    // ?????????????????????
    const validateHeadRes = await Promise.all([headDS.current.validate()]);
    const notPassHeadRecordsFlag = validateHeadRes.some((item) => !item);
    if (notPassHeadRecordsFlag) {
      notification.warning({
        message: '??????????????????',
      });
      return;
    }

    // ????????????????????????????????? ??????
    if (lineDS.data.length === 0) {
      notification.warning({
        message: '??????????????????????????????',
      });
      return;
    }
    // ?????????????????????
    const validateLineRes = await Promise.all(
      lineDS.data.map((record) => record.validate(true, false))
    );
    const notPassLineRecordsFlag = validateLineRes.some((item) => !item);
    if (notPassLineRecordsFlag) {
      notification.warning({
        message: '??????????????????',
      });
      return;
    }

    // ??????
    const { meAreaId = '', meAreaCode = '' } = headDS.getField('areaObj').getValue() || {};
    // ????????????
    const { warehouseId: toWarehouseId = '', warehouseCode: toWarehouseCode = '' } =
      headDS.getField('toWarehouseObj').getValue() || {};
    // ????????????
    const { wmAreaId: toWmAreaId = '', wmAreaCode: toWmAreaCode = '' } =
      headDS.getField('toWmAreaObj').getValue() || {};
    // ????????????
    const { warehouseId = '', warehouseCode = '' } =
      headDS.getField('warehouseObj').getValue() || {};
    // ????????????
    const { wmAreaId = '', wmAreaCode = '' } = headDS.getField('wmAreaObj').getValue() || {};

    // ????????????????????????
    lineDS.data.forEach((record) => {
      record.save();
      record.setState('editing', false);
    });

    // ?????????????????? -- ???????????????????????????
    const lineDTOList = lineDS.updated.map((item) => {
      const {
        applyQty,
        componentDescription,
        componentItemCode,
        componentItemId,
        description,
        itemCode,
        itemId,
        lotNumber,
        moId,
        moNum,
        remark,
        requestLineId,
        requestLineNum,
        tagCode,
      } = item.toData();
      return {
        changeStatus: requestLineId ? 'UPDATE' : 'CREAT',
        applyQty,
        componentDescription,
        componentItemCode,
        componentItemId,
        description,
        itemCode,
        itemId,
        lotNumber,
        moId,
        moNum,
        remark,
        requestLineId,
        requestLineNum,
        tagCode,
      };
    });
    const params = {
      changeStatus: headDS.getField('requestId').getValue() ? 'UPDATE' : 'CREAT',
      requestDepartment: meAreaCode,
      requestDepartmentId: meAreaId,
      requestId: headDS.getField('requestId').getValue(),
      requestNum: headDS.getField('requestNum').getValue(),
      toWarehouseCode,
      toWarehouseId,
      toWmAreaCode,
      toWmAreaId,
      warehouseCode,
      warehouseId,
      wmAreaCode,
      wmAreaId,
      lineDTOList,
    };
    const res = await changeButton(params);
    if (res && Object.keys(res).indexOf('failed') !== -1 && res.failed) {
      notification.error({
        message: res.message,
        duration: 5,
      });
    } else if (res) {
      notification.success({
        message: '????????????',
      });
      lineQuery();
    }
  }

  function handleBatchDelete() {
    const checkedList = lineDS.selected;
    if (!checkedList.length) {
      notification.warning({
        message: '?????????????????????????????????',
      });
      return;
    }
    if (checkedList.length === totalElements) {
      notification.warning({
        message: '??????????????????????????????',
      });
      return;
    }
    handleDelete(checkedList, true);
  }

  function handleDelete(record, isBatch = false) {
    if (totalElements === 1 || (isBatch && record.length === totalElements)) {
      notification.warning({
        message: '??????????????????????????????',
      });
      return;
    }
    Modal.confirm({
      title: '??????',
      children: <div>??????????????????????????????</div>,
    }).then(async (button) => {
      if (button === 'ok') {
        if (!isBatch && record.getState('status')) {
          lineDS.remove(record);
        } else {
          let params = [];
          if (isBatch) {
            params = record.map((item) => {
              return item.get('requestLineId');
            });
          } else {
            params = [record.get('requestLineId')];
          }
          const res = await deleteLineButton(params);
          if (res && Object.keys(res).indexOf('failed') !== -1 && res.failed) {
            notification.error({
              message: res.message,
              duration: 5,
            });
          } else if (res) {
            notification.success({
              message: '????????????',
            });
            lineQuery();
          }
        }
      }
    });
  }

  function handleEdit(record) {
    record.setState('status', 'edit');
    record.setState('editing', true);
  }

  function handleCancel(record) {
    if (record.getState('status') === 'add') {
      lineDS.remove(record);
    } else {
      record.restore();
      record.setState('editing', false);
    }
  }

  async function handleConfirm(record) {
    const flag = await record.validate(true, false);
    if (!flag) {
      return;
    }
    record.save();
    record.setState('editing', false);
  }

  const LineColumns = [
    { name: 'requestLineNum' },
    { name: 'moObj', width: 200 },
    { name: 'itemCode', width: 150 },
    { name: 'description' },
    { name: 'componentObj', width: 200 },
    { name: 'componentDescription' },
    { name: 'tagCode', editor: (record) => record.getState('editing') },
    { name: 'lotNumber', editor: (record) => record.getState('editing') },
    { name: 'applyQty', editor: (record) => record.getState('editing') },
    { name: 'remark', editor: (record) => record.getState('editing') },
    {
      header: '??????',
      width: 200,
      align: 'center',
      lock: 'right',
      renderer: ({ record }) => {
        if (record.getState('editing')) {
          return [
            <Button
              key="confirm"
              icon="finished"
              style={{ color: '#29bece', border: 0 }}
              onClick={() => handleConfirm(record)}
            />,
            <Button
              key="cancle"
              icon="cancle_a"
              style={{ color: '#29bece', border: 0 }}
              onClick={() => handleCancel(record)}
            />,
          ];
        } else {
          return [
            <a key="edit" onClick={() => handleEdit(record)} style={{ marginRight: '0.1rem' }}>
              ??????
            </a>,
            <a key="cancle" onClick={() => handleDelete(record)}>
              ??????
            </a>,
          ];
        }
      },
    },
  ];

  const buttons = [
    <Button onClick={handleBatchDelete} key="batchDelete">
      ??????
    </Button>,
  ];

  return (
    <Fragment>
      <Header title="??????" backPath={backPath}>
        <Button color="primary" onClick={saveData}>
          ??????
        </Button>
      </Header>
      <Content className={styles['bad-parts-return-platform-add']}>
        <div className={styles['head-title']}>?????????????????????</div>
        <Form columns={4} dataSet={headDS}>
          <TextField name="requestNum" />
          <Lov name="areaObj" noCache disabled="true" />
          <Lov name="toWarehouseObj" noCache />
          <Lov name="toWmAreaObj" noCache />
          <Lov name="warehouseObj" noCache />
          <Lov name="wmAreaObj" noCache />
        </Form>
        <Table selectionMode="rowbox" buttons={buttons} dataSet={lineDS} columns={LineColumns} />
      </Content>
    </Fragment>
  );
};

export default BadPartsReturnPlatform;
