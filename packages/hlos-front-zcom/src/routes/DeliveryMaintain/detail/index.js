/**
 * @Description: 送货单创建/维护明细
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2020-11-26 17:28:39
 */

import React, { useState, useEffect, Fragment } from 'react';
import { connect } from 'dva';
import moment from 'moment';
import {
  DataSet,
  Button,
  Form,
  TextField,
  Select,
  Lov,
  DatePicker,
  TextArea,
  Tabs,
  Table,
} from 'choerodon-ui/pro';
import { Upload } from 'choerodon-ui';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import notification from 'utils/notification';
import { HZERO_FILE } from 'utils/config';
import formatterCollections from 'utils/intl/formatterCollections';
import { getCurrentOrganizationId, getAccessToken } from 'utils/utils';
import { useDataSet } from 'hzero-front/lib/utils/hooks';
import { downloadFile } from 'services/api';
import { getSerialNum } from '@/utils/renderer';
import {
  deliveryDetailHeadDS,
  deliveryDetailLineDS,
  deliveryDetailLogisticsDS,
} from '../store/DeliveryMaintainDS';
import './index.less';

const { TabPane } = Tabs;
const intlPrefix = 'zcom.deliveryMaintain';
const organizationId = getCurrentOrganizationId();
const DetailHeadDS = () => new DataSet({ ...deliveryDetailHeadDS() });
const DetailLineDS = () => new DataSet({ ...deliveryDetailLineDS() });
const DetailLogisticsDS = () => new DataSet({ ...deliveryDetailLogisticsDS() });

function ZcomDeliveryDetail({ dispatch, ids, match, history }) {
  const HeadDS = useDataSet(DetailHeadDS, ZcomDeliveryDetail);
  const LineDS = useDataSet(DetailLineDS);
  const LogisticsDS = useDataSet(DetailLogisticsDS);
  const {
    params: { type, deliveryOrderId },
  } = match;

  const [headShow, setHeadShow] = useState(true);
  const [curTab, setCurTab] = useState('material');
  const [saveLoading, setSaveLoading] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const [logisticsLoading, setLogisticsLoading] = useState(false);
  const [canEdit, setCanEdit] = useState(true);
  const [logisticsCanEdit, setLogisticsCanEdit] = useState(true);

  const [headFile, setHeadFile] = useState(null);
  const [opinionShow, setOpinionShow] = useState(false);

  useEffect(() => {
    HeadDS.setQueryParameter('deliveryOrderId', null);
    LineDS.setQueryParameter('deliveryOrderId', null);
    HeadDS.data = [];
    LineDS.data = [];
    HeadDS.create();
    LineDS.clearCachedSelected();
    if (type === 'create') {
      HeadDS.setQueryParameter('idList', ids);
      LineDS.setQueryParameter('idList', ids);
    } else {
      HeadDS.setQueryParameter('deliveryOrderId', deliveryOrderId);
      LineDS.setQueryParameter('deliveryOrderId', deliveryOrderId);
      LogisticsDS.setQueryParameter('deliveryOrderId', deliveryOrderId);
    }
    handleSearch();
  }, [deliveryOrderId]);

  async function handleSearch() {
    await HeadDS.query();
    setHeadFile(HeadDS.current.get('fileUrl'));

    setCanEdit(
      type === 'create' || ['NEW', 'REFUSED'].includes(HeadDS.current.data.deliveryOrderStatus)
    );
    // setLogisticsCanEdit(
    //   type === 'create' ||
    //     !['RECEIVED', 'CANCELLED'].includes(HeadDS.current.data.deliveryOrderStatus)
    // );
    setLogisticsCanEdit(
      ['CONFIRMED', 'DELIVERED'].includes(HeadDS.current.data.deliveryOrderStatus)
    );
    setOpinionShow(['CONFIRMED', 'REFUSED'].includes(HeadDS.current.data.deliveryOrderStatus));
    await LineDS.query();
    if (type === 'detail') {
      await LogisticsDS.query();
    }
  }

  function handleToggle() {
    setHeadShow(!headShow);
  }

  function handleTabChange(key) {
    setCurTab(key);
  }

  function handleSave() {
    setSaveLoading(true);
    return new Promise(async (resolve) => {
      const validateHead = await HeadDS.current.validate(true, false);
      const validateLine = await LineDS.validate(true, false);
      const validateLogistics = await LogisticsDS.validate(false, false);
      if (!validateHead || !validateLine || !validateLogistics) {
        notification.warning({
          message: '数据校验不通过',
        });
        resolve(setSaveLoading(false));
        return false;
      }
      // const headData = HeadDS.toJSONData()[0];
      // const deliveryLogistics = LogisticsDS.toJSONData()[0];
      // const deliveryOrderLineList = LineDS.selected.map((item) => {
      //   const obj = Object.assign({}, item.toData(), {
      //     sourceOrderType: 'PO',
      //   });
      //   return obj;
      // });
      // if (deliveryOrderLineList.length === 0) {
      //   notification.warning({
      //     message: '请至少选择一条行数据',
      //   });
      //   resolve(setSaveLoading(false));
      //   return false;
      // }
      const headData = HeadDS.current.toData();
      const deliveryLogistics = LogisticsDS.current.data;
      const deliveryOrderLineList = LineDS.data.map((item) => {
        const obj = Object.assign({}, item.data, {
          sourceOrderType: 'PO',
          receiveOrgId: headData.receiveOrgId,
          receiveOrgCode: headData.receiveOrgCode,
        });
        return obj;
      });
      dispatch({
        type: 'deliveryMaintain/saveDeliveryOrder',
        payload: {
          ...headData,
          approvalOpinion: '',
          deliveryOrderStatus: 'NEW',
          planDeliveryDate: headData.planDeliveryDate
            ? moment(headData.planDeliveryDate).format('YYYY-MM-DD HH:mm:ss')
            : null,
          expectedArrivalDate: headData.expectedArrivalDate
            ? moment(headData.expectedArrivalDate).format('YYYY-MM-DD HH:mm:ss')
            : null,
          deliveryLogistics: {
            ...deliveryLogistics,
          },
          deliveryOrderLineList,
        },
      }).then((res) => {
        if (res && !res.failed) {
          notification.success({
            message: '操作成功',
          });
          if (deliveryOrderId) {
            handleSearch();
          } else {
            const pathName = `/zcom/delivery-maintain/detail/${res.deliveryOrderId}`;
            history.push(pathName);
          }
        }
        resolve(setSaveLoading(false));
      });
    });
  }

  function handleSubmit() {
    setSubmitLoading(true);
    return new Promise(async (resolve) => {
      const validateHead = await HeadDS.current.validate(true, false);
      const validateLine = await LineDS.validate(true, false);
      const validateLogistics = await LogisticsDS.validate(false, false);
      const hasEmptyDeliveryQty = LineDS.data.findIndex((item) => {
        const deliveryQty = item.get('deliveryQty');
        return deliveryQty === undefined || deliveryQty === null;
      });
      if (!validateHead || !validateLine || !validateLogistics || hasEmptyDeliveryQty !== -1) {
        notification.warning({
          message: '数据校验不通过',
        });
        resolve(setSubmitLoading(false));
        return false;
      }
      const headData = HeadDS.current.toData();
      const deliveryLogistics = LogisticsDS.current.data;
      const deliveryOrderLineList = LineDS.data.map((item) => {
        const obj = Object.assign({}, item.data, {
          sourceOrderType: 'PO',
          receiveOrgId: headData.receiveOrgId,
          receiveOrgCode: headData.receiveOrgCode,
        });
        return obj;
      });
      dispatch({
        type: 'deliveryMaintain/releaseDeliveryOrder',
        payload: {
          ...headData,
          approvalOpinion: '',
          deliveryOrderStatus: 'RELEASED',
          planDeliveryDate: headData.planDeliveryDate
            ? moment(headData.planDeliveryDate).format('YYYY-MM-DD HH:mm:ss')
            : null,
          expectedArrivalDate: headData.expectedArrivalDate
            ? moment(headData.expectedArrivalDate).format('YYYY-MM-DD HH:mm:ss')
            : null,
          deliveryLogistics: {
            ...deliveryLogistics,
          },
          deliveryOrderLineList,
        },
      }).then((res) => {
        if (res && !res.failed) {
          notification.success({
            message: '操作成功',
          });
          dispatch({
            type: 'deliveryMaintain/updateState',
            payload: {
              currentTab: 'maintain',
            },
          });
          const pathName = `/zcom/delivery-maintain`;
          history.push(pathName);
        }
        resolve(setSubmitLoading(false));
      });
    });
  }

  function hanldeUpdateLogistics() {
    setLogisticsLoading(true);
    return new Promise(async (resolve) => {
      dispatch({
        type: 'deliveryMaintain/updateLogisticss',
        // payload: LogisticsDS.current.data,
        payload: {
          ...LogisticsDS.current.data,
          deliveryOrderId: HeadDS.current.get('deliveryOrderId'),
          deliveryOrderNum: HeadDS.current.get('deliveryOrderNum'),
          tenantId: HeadDS.current.get('tenantId'),
        },
      }).then((res) => {
        if (res && !res.failed) {
          notification.success({
            message: '操作成功',
          });
          dispatch({
            type: 'deliveryMaintain/updateState',
            payload: {
              currentTab: 'maintain',
            },
          });
          const pathName = `/zcom/delivery-maintain`;
          history.push(pathName);
        }
        resolve(setLogisticsLoading(false));
      });
    });
  }

  const uploadData = (file) => {
    return {
      fileName: file.name,
      bucketName: 'zcom',
      directory: 'zcom',
    };
  };

  // 上传头附件
  const handleHeadUploadSuccess = (res) => {
    if (res && !res.failed) {
      notification.success({
        message: '上传成功',
      });
      HeadDS.current.set('fileUrl', res);
      setHeadFile(res);
    } else {
      notification.error({
        message: '上传失败',
      });
    }
  };

  // 上传行附件
  const handleLineUploadSuccess = (res) => {
    if (res && !res.failed) {
      notification.success({
        message: '上传成功',
      });
      LineDS.current.set('fileUrl', res);
    } else {
      notification.error({
        message: '上传失败',
      });
    }
  };

  const uploadHeadProps = {
    headers: {
      Authorization: `bearer ${getAccessToken()}`,
    },
    accept: '*',
    action: `${HZERO_FILE}/v1/${organizationId}/files/multipart`,
    data: uploadData,
    onSuccess: handleHeadUploadSuccess,
    showUploadList: false,
  };

  const uploadProps = {
    headers: {
      Authorization: `bearer ${getAccessToken()}`,
    },
    accept: '*',
    action: `${HZERO_FILE}/v1/${organizationId}/files/multipart`,
    data: uploadData,
    onSuccess: handleLineUploadSuccess,
  };

  // 查看行附件
  function downloadLineFile(file) {
    const api = `${HZERO_FILE}/v1/${organizationId}/files/download`;
    downloadFile({
      requestUrl: api,
      queryParams: [
        { name: 'bucketName', value: 'zcom' },
        { name: 'directory', value: 'zcom' },
        { name: 'url', value: file },
      ],
    });
  }

  function deleteLineFile() {
    LineDS.current.set('fileUrl', '');
    notification.success({
      message: '删除成功',
    });
  }

  function deleteHeadFile() {
    HeadDS.current.set('fileUrl', '');
    setHeadFile('');
    notification.success({
      message: '删除成功',
    });
  }

  const lineColumns = [
    {
      header: '序号',
      width: 60,
      lock: true,
      renderer: ({ record }) => getSerialNum(record),
    },
    { name: 'customerItemCode', width: 150 },
    { name: 'customerItemDescription', width: 150 },
    { name: 'itemCode', width: 150 },
    { name: 'supplierItemDescription', width: 150 },
    { name: 'promiseQty', width: 150 },
    { name: 'shippableQty', width: 150 },
    { name: 'deliveryQty', width: 150, editor: canEdit },
    { name: 'uomName', width: 150 },
    { name: 'customerLotNumber', width: 150, editor: canEdit },
    { name: 'serialNumber', width: 150, editor: canEdit },
    { name: 'sourceDocNum', width: 150 },
    { name: 'sourceDocLineNum', width: 150 },
    {
      name: 'demandDate',
      width: 150,
      renderer: ({ value }) => {
        return <span>{value ? value.substring(0, 10) : ''}</span>;
      },
    },
    {
      name: 'promiseDate',
      width: 150,
      renderer: ({ value }) => {
        return <span>{value ? value.substring(0, 10) : ''}</span>;
      },
    },
    { name: 'lineRemark', width: 150, editor: canEdit },
    {
      name: 'fileUrl',
      width: 150,
      // renderer: ({ value }) => {
      //   return canEdit ? (
      //     <Upload {...uploadProps}>
      //       <span style={{ cursor: 'pointer' }}>上传附件</span>
      //     </Upload>
      //   ) : (
      //     <span style={{ cursor: 'pointer' }} onClick={() => downloadLineFile(value)}>
      //       {value ? '查看附件' : ''}
      //     </span>
      //   );
      // },
      command: ({ record }) => {
        const value = record.data.fileUrl;
        if (canEdit) {
          return value
            ? [
              <Upload {...uploadProps}>
                <span style={{ cursor: 'pointer', color: '#29bece' }}>修改附件</span>
              </Upload>,
              <Button
                style={{ marginLeft: '5px', marginTop: '-2px' }}
                onClick={() => downloadLineFile(value)}
              >
                  查看附件
              </Button>,
              <Button style={{ marginLeft: '-5px', marginTop: '-2px' }} onClick={deleteLineFile}>
                  删除附件
              </Button>,
              ]
            : [
              <Upload {...uploadProps}>
                <span style={{ cursor: 'pointer', color: '#29bece' }}>上传附件</span>
              </Upload>,
              ];
        } else {
          return [
            <Button onClick={() => downloadLineFile(value)}>{value ? '查看附件' : ''}</Button>,
          ];
        }
      },
    },
  ];

  return (
    <Fragment>
      <Header
        title={
          type === 'create'
            ? intl.get(`${intlPrefix}.view.title.deliveryCreate`).d('送货单创建')
            : intl.get(`${intlPrefix}.view.title.deliveryMaintain`).d('送货单维护')
        }
        backPath="/zcom/delivery-maintain/list"
      >
        <Button
          onClick={hanldeUpdateLogistics}
          loading={logisticsLoading}
          disabled={!logisticsCanEdit}
        >
          更新物流信息
        </Button>
        <Button color="primary" onClick={handleSave} loading={saveLoading} disabled={!canEdit}>
          保存
        </Button>
        <Button color="primary" onClick={handleSubmit} loading={submitLoading} disabled={!canEdit}>
          保存并提交
        </Button>
        {/* <Upload {...uploadHeadProps} disabled={!canEdit}>
          <Button disabled={!canEdit}>上传附件</Button>
        </Upload> */}
        {canEdit && (
          <Upload {...uploadHeadProps}>
            <Button>{headFile ? '修改附件' : '上传附件'}</Button>
          </Upload>
        )}
        {headFile && (
          <Button
            onClick={() => downloadLineFile(headFile)}
            style={{ marginRight: '10px', marginTop: '3px' }}
          >
            查看附件
          </Button>
        )}
        {headFile && canEdit && (
          <Button style={{ marginLeft: '10px', marginTop: '3px' }} onClick={deleteHeadFile}>
            删除附件
          </Button>
        )}
      </Header>
      <Content>
        <div className="zcom-delivery-headInfo">
          <span>送货单表头</span>
          <span className="headInfo-toggle" onClick={handleToggle}>
            {headShow ? '收起' : '展开'}
          </span>
        </div>
        {headShow ? (
          <Form dataSet={HeadDS} columns={3}>
            <TextField name="deliveryOrderNum" key="deliveryOrderNum" disabled />
            <Select name="deliveryOrderType" key="deliveryOrderType" disabled={!canEdit} />
            <TextField name="customerName" key="customerName" disabled />
            <Lov name="receiveOrgObj" key="receiveOrgObj" disabled />
            <TextField name="receiveAddress" key="receiveAddress" disabled={!canEdit} />
            <TextField name="deliveryShipper" key="deliveryShipper" disabled={!canEdit} />
            <Lov name="warehouseObj" key="warehouseObj" disabled={!canEdit} />
            <DatePicker name="planDeliveryDate" key="planDeliveryDate" disabled={!canEdit} />
            <DatePicker name="expectedArrivalDate" key="expectedArrivalDate" disabled={!canEdit} />
            <TextArea newLine name="remark" key="remark" colSpan={2} disabled={!canEdit} />
            {opinionShow && (
              <TextArea newLine name="approvalOpinion" key="approvalOpinion" colSpan={2} disabled />
            )}
          </Form>
        ) : null}
        <Tabs defaultActiveKey={curTab} onChange={handleTabChange}>
          <TabPane tab="物料信息" key="material">
            <Table dataSet={LineDS} columns={lineColumns} columnResizable="true" />
          </TabPane>
          <TabPane tab="物流信息" key="logistics">
            <div className="base-line">
              <div className="base-line-tag" />
              <div className="base-line-title">基础信息</div>
            </div>
            <Form dataSet={LogisticsDS} columns={3}>
              <TextField name="courierNumber" key="courierNumber" disabled={!logisticsCanEdit} />
              <TextField name="deliveryStaff" key="deliveryStaff" disabled={!logisticsCanEdit} />
              <TextField
                name="addresseeContact"
                key="addresseeContact"
                disabled={!logisticsCanEdit}
              />
              <TextField
                name="logisticsCompany"
                key="logisticsCompany"
                disabled={!logisticsCanEdit}
              />
              <TextField
                name="deliveryContact"
                key="deliveryContact"
                disabled={!logisticsCanEdit}
              />
              <TextField name="freight" key="freight" disabled={!logisticsCanEdit} />
            </Form>
          </TabPane>
        </Tabs>
      </Content>
    </Fragment>
  );
}

export default connect(({ deliveryMaintain: { ids } }) => ({ ids }))(
  formatterCollections({
    code: [`${intlPrefix}`],
  })(ZcomDeliveryDetail)
);
