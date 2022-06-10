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

  useEffect(() => {
    const stateParams = location?.state || {};
    setBackPath(stateParams.backPath);

    headDS.reset();
    headDS.getField('areaObj').setLovPara('meOuId', stateParams.meOuId);
    headDS.getField('toWarehouseObj').setLovPara('organizationId', stateParams.organizationId);
    headDS.getField('warehouseObj').setLovPara('organizationId', stateParams.organizationId);

    lineDS.reset();
    lineDS.getField('moObj').setLovPara('organizationId', stateParams.organizationId);
    lineDS.paging = false;
    lineDS.query();
  }, []);

  async function saveData() {
    // 校验头表必输项
    const validateHeadRes = await Promise.all([headDS.current.validate()]);
    const notPassHeadRecordsFlag = validateHeadRes.some((item) => !item);
    if (notPassHeadRecordsFlag) {
      notification.warning({
        message: '请完善头数据',
      });
      return;
    }

    // 行表必须有至少一条数据 校验
    if (lineDS.data.length === 0) {
      notification.warning({
        message: '请至少添加一条行数据',
      });
      return;
    }
    // 校验行表必输项
    const validateLineRes = await Promise.all(
      lineDS.data.map((record) => record.validate(true, false))
    );
    const notPassLineRecordsFlag = validateLineRes.some((item) => !item);
    if (notPassLineRecordsFlag) {
      notification.warning({
        message: '请完善行数据',
      });
      return;
    }

    // 部门
    const { meAreaId = '', meAreaCode = '' } = headDS.getField('areaObj').getValue() || {};
    // 退回仓库
    const { warehouseId: toWarehouseId = '', warehouseCode: toWarehouseCode = '' } =
      headDS.getField('toWarehouseObj').getValue() || {};
    // 退回货位
    const { wmAreaId: toWmAreaId = '', wmAreaCode: toWmAreaCode = '' } =
      headDS.getField('toWmAreaObj').getValue() || {};
    // 补领仓库
    const { warehouseId = '', warehouseCode = '' } =
      headDS.getField('warehouseObj').getValue() || {};
    // 补领货位
    const { wmAreaId = '', wmAreaCode = '' } = headDS.getField('wmAreaObj').getValue() || {};

    // 行表编辑状态更新
    lineDS.data.forEach((record) => {
      record.save();
      record.setState('editing', false);
    });

    // 行表保存入参
    const lineDTOList = lineDS.data.map((item, index) => {
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
        requestLineNum: index + 1,
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
        message: '保存成功',
      });
      headDS.current.set('requestId', res.requestId || '');
      headDS.current.set('requestNum', res.requestNum || '');
      lineDS.queryParameter = { requestId: res.requestId, page: 0, size: lineDS.data.length };
      lineDS.query();
    }
  }

  function handleAdd() {
    const record = lineDS.create({ requestLineNum: lineDS.data.length + 1 }, 0);
    record.setState('status', 'add');
    record.setState('editing', true);
  }

  function handleDelete(record) {
    Modal.confirm({
      title: '删除',
      children: <div>确认删除选中行数据？</div>,
    }).then(async (button) => {
      if (button === 'ok') {
        if (record.getState('status')) {
          lineDS.remove(record);
        } else {
          const params = [record.get('requestLineId')];
          const res = await deleteLineButton(params);
          if (res && Object.keys(res).indexOf('failed') !== -1 && res.failed) {
            notification.error({
              message: res.message,
              duration: 5,
            });
          } else if (res) {
            notification.success({
              message: '删除成功',
            });
            lineDS.query();
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
    { name: 'moObj', width: 200, editor: (record) => record.getState('editing') },
    { name: 'itemCode', width: 150 },
    { name: 'description' },
    { name: 'componentObj', width: 200, editor: (record) => record.getState('editing') },
    { name: 'componentDescription' },
    { name: 'tagCode', editor: (record) => record.getState('editing') },
    { name: 'lotNumber', editor: (record) => record.getState('editing') },
    { name: 'applyQty', editor: (record) => record.getState('editing') },
    { name: 'remark', editor: (record) => record.getState('editing') },
    {
      header: '操作',
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
              编辑
            </a>,
            <a key="cancle" onClick={() => handleDelete(record)}>
              删除
            </a>,
          ];
        }
      },
    },
  ];

  const buttons = [
    <Button icon="playlist_add" onClick={handleAdd} key="add">
      新增
    </Button>,
  ];

  return (
    <Fragment>
      <Header title="新建" backPath={backPath}>
        <Button color="primary" onClick={saveData}>
          保存
        </Button>
      </Header>
      <Content className={styles['bad-parts-return-platform-add']}>
        <div className={styles['head-title']}>坏件退换头信息</div>
        <Form columns={4} dataSet={headDS}>
          <TextField name="requestNum" />
          <Lov name="areaObj" noCache />
          <Lov name="toWarehouseObj" noCache />
          <Lov name="toWmAreaObj" noCache />
          <Lov name="warehouseObj" noCache />
          <Lov name="wmAreaObj" noCache />
        </Form>
        <Table selectionMode="none" buttons={buttons} dataSet={lineDS} columns={LineColumns} />
      </Content>
    </Fragment>
  );
};

export default BadPartsReturnPlatform;
