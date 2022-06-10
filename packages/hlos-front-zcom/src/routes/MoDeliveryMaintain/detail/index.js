/**
 * @Description: 送货单创建/维护明细--通过MO创建
 * @Author: wei.zhou05@hand-china.com
 * @Date: 2021-01-22 10:24:33
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
  Modal,
} from 'choerodon-ui/pro';
import { Upload } from 'choerodon-ui';
import { Header, Content } from 'components/Page';
import intl from 'utils/intl';
import notification from 'utils/notification';
import { HZERO_FILE } from 'utils/config';
import formatterCollections from 'utils/intl/formatterCollections';
import { getCurrentOrganizationId, getAccessToken, getCurrentUser } from 'utils/utils';
import { useDataSet } from 'hzero-front/lib/utils/hooks';
import { downloadFile } from 'services/api';

import {
  deliveryDetailHeadDS,
  deliveryDetailLineDS,
  deliveryDetailLogisticsDS,
  deliveryPrintDS,
} from '../store/MoDeliveryMaintainDS';
import './index.less';

const { TabPane } = Tabs;
const printKey = Modal.key();
const intlPrefix = 'zcom.moDeliveryMaintain';
const organizationId = getCurrentOrganizationId();
const DetailHeadDS = () => new DataSet({ ...deliveryDetailHeadDS() });
const DetailLineDS = () => new DataSet({ ...deliveryDetailLineDS() });
const DetailLogisticsDS = () => new DataSet({ ...deliveryDetailLogisticsDS() });
const DeliveryPrintDS = () => new DataSet({ ...deliveryPrintDS() });

let printModal;

function ZcomMoDeliveryDetail({ dispatch, ids, match, history }) {
  const HeadDS = useDataSet(DetailHeadDS, ZcomMoDeliveryDetail);
  const LineDS = useDataSet(DetailLineDS);
  const LogisticsDS = useDataSet(DetailLogisticsDS);
  const PrintDS = useDataSet(DeliveryPrintDS);
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
  const [revocableLoading, setRevocableLoading] = useState(false);

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
    const { tenantName } = getCurrentUser();
    HeadDS.current.set('planDeliveryDate', new Date());
    HeadDS.current.set('deliveryShipper', tenantName);
    setHeadFile(HeadDS.current.get('fileUrl'));
    setCanEdit(
      type === 'create' || ['NEW', 'REFUSED'].includes(HeadDS.current.data.deliveryOrderStatus)
    );
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
      const hasEmptyPromiseDate = LineDS.data.findIndex((item) => {
        const promiseDate = item.get('promiseDate');
        return promiseDate === undefined || promiseDate === null;
      });
      if (!validateHead || !validateLine || hasEmptyPromiseDate !== -1) {
        notification.warning({
          message: '数据校验不通过',
        });
        resolve(setSaveLoading(false));
        return false;
      }
      const headData = HeadDS.current.toData();
      const deliveryOrderLineList = LineDS.data.map((item) => {
        const obj = Object.assign({}, item.data, {
          sourceOrderType: 'MO',
          receiveOrgId: headData.receiveOrgId,
          receiveOrgCode: headData.receiveOrgCode,
          promiseDate: item.data.promiseDate
            ? moment(item.data.promiseDate).format('YYYY-MM-DD HH:mm:ss')
            : null,
        });
        return obj;
      });
      dispatch({
        type: 'moDeliveryMaintain/saveDeliveryOrder',
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
            const pathName = `/zcom/mo-delivery-maintain/detail/${res.deliveryOrderId}`;
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
      const hasEmptyDeliveryQty = LineDS.data.findIndex((item) => {
        const deliveryQty = item.get('deliveryQty');
        return deliveryQty === undefined || deliveryQty === null;
      });
      const hasEmptyPromiseDate = LineDS.data.findIndex((item) => {
        const promiseDate = item.get('promiseDate');
        return promiseDate === undefined || promiseDate === null;
      });
      if (
        !validateHead ||
        !validateLine ||
        hasEmptyDeliveryQty !== -1 ||
        hasEmptyPromiseDate !== -1
      ) {
        notification.warning({
          message: '数据校验不通过',
        });
        resolve(setSubmitLoading(false));
        return false;
      }
      const headData = HeadDS.current.toData();
      const deliveryOrderLineList = LineDS.data.map((item) => {
        const obj = Object.assign({}, item.data, {
          sourceOrderType: 'MO',
          receiveOrgId: headData.receiveOrgId,
          receiveOrgCode: headData.receiveOrgCode,
          promiseDate: item.data.promiseDate
            ? moment(item.data.promiseDate).format('YYYY-MM-DD HH:mm:ss')
            : null,
        });
        return obj;
      });
      dispatch({
        type: 'moDeliveryMaintain/releaseDeliveryOrder',
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
          deliveryOrderLineList,
        },
      }).then((res) => {
        if (res && !res.failed) {
          notification.success({
            message: '操作成功',
          });
          dispatch({
            type: 'moDeliveryMaintain/updateState',
            payload: {
              currentTab: 'maintain',
            },
          });
          const pathName = `/zcom/mo-delivery-maintain`;
          history.push(pathName);
        }
        resolve(setSubmitLoading(false));
      });
    });
  }

  function handlePrint() {
    history.push({
      pathname: `/zcom/mo-delivery-maintain/delivery`,
      search: `tenantId=${getCurrentOrganizationId()}&deliveryOrderId=${deliveryOrderId}`,
    });
  }

  function hanldeUpdateLogistics() {
    setLogisticsLoading(true);
    return new Promise(async (resolve) => {
      dispatch({
        type: 'moDeliveryMaintain/updateLogisticss',
        payload: {
          ...LogisticsDS.current.data,
          sourceOrderId: HeadDS.current.get('deliveryOrderId'),
          sourceOrderNum: HeadDS.current.get('deliveryOrderNum'),
          tenantId: HeadDS.current.get('tenantId'),
          orderLogisticsType: 'DELIVERY',
        },
      }).then((res) => {
        if (res && !res.failed) {
          notification.success({
            message: '操作成功',
          });
          dispatch({
            type: 'moDeliveryMaintain/updateState',
            payload: {
              currentTab: 'maintain',
            },
          });
          const pathName = `/zcom/mo-delivery-maintain`;
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
    showUploadList: false,
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

  function handleDeliveryPrint(record) {
    const { deliveryOrderNum, supplierNumber, supplierName } = HeadDS.current.toData();
    const {
      customerItemCode,
      customerItemDescription,
      deliveryOrderLineNum,
      deliveryQty,
      uomCode,
      uomName,
    } = record.toData();
    PrintDS.current.set('supplierNumber', supplierNumber);
    PrintDS.current.set('supplierName', supplierName);
    PrintDS.current.set('itemCode', customerItemCode);
    PrintDS.current.set('itemDescription', customerItemDescription);
    PrintDS.current.set('deliveryOrderNum', deliveryOrderNum);
    PrintDS.current.set('deliveryOrderLineNum', deliveryOrderLineNum);
    PrintDS.current.set('deliveryQty', deliveryQty);
    PrintDS.current.set('uom', uomCode);
    PrintDS.current.set('uomName', uomName);

    printModal = Modal.open({
      key: printKey,
      title: '送货单物料标签打印',
      children: (
        <div>
          <Form dataSet={PrintDS} columns={4}>
            <TextField name="supplierName" key="supplierName" disabled colSpan={2} />
            <TextField name="itemCode" key="itemCode" disabled colSpan={2} />
            <TextField name="deliveryOrderNum" key="deliveryOrderNum" disabled />
            <TextField name="deliveryOrderLineNum" key="deliveryOrderLineNum" disabled />
            <TextField name="deliveryQty" key="deliveryQty" disabled />
            <TextField name="uomName" key="uomName" disabled />
            <DatePicker name="productionDate" key="productionDate" colSpan={2} />
            <Select name="humidityLevelObj" key="humidityLevelObj" colSpan={2} />
            <DatePicker name="maturityDate" key="maturityDate" colSpan={2} />
            <TextField name="lotNo" key="lotNo" colSpan={2} />
            <TextField name="DateCode" key="DateCode" rowSpan={5} />
            <TextField name="version" key="version" />
            <TextField name="supplierItemCode" key="supplierItemCode" colSpan={2} />
            <TextField name="boxQtyOne" key="boxQtyOne" />
            <TextField name="perBoxAmountOne" key="perBoxAmountOne" />
            <TextField name="boxQtyTwo" key="boxQtyTwo" newLine />
            <TextField name="perBoxAmountTwo" key="perBoxAmountTwo" />
            <TextField name="boxQtyThree" key="boxQtyThree" newLine />
            <TextField name="perBoxAmountThree" key="perBoxAmountThree" />
            <TextField name="boxQtyFour" key="boxQtyFour" newLine />
            <TextField name="perBoxAmountFour" key="perBoxAmountFour" />
          </Form>
        </div>
      ),
      closable: true,
      className: 'zcom-delivery-print-page',
      footer: () => (
        <div>
          <Button color="primary" onClick={handleGoPrint}>
            打印
          </Button>
        </div>
      ),
    });
  }

  async function handleGoPrint() {
    const validatePrintForm = await PrintDS.current.validate(true, false);
    if (!validatePrintForm) {
      notification.warning({
        message: '数据校验不通过',
      });
      return;
    }
    const {
      deliveryQty,
      productionDate,
      maturityDate,
      boxQtyOne,
      boxQtyTwo,
      boxQtyThree,
      boxQtyFour,
      perBoxAmountOne,
      perBoxAmountTwo,
      perBoxAmountThree,
      perBoxAmountFour,
    } = PrintDS.current.toData();
    // 校验箱数*每箱数量是否等于本次发货数量，等于才允许打印
    const total =
      (boxQtyOne || 0) * (perBoxAmountOne || 0) +
      (boxQtyTwo || 0) * (perBoxAmountTwo || 0) +
      (boxQtyThree || 0) * (perBoxAmountThree || 0) +
      (boxQtyFour || 0) * (perBoxAmountFour || 0);
    if (total !== deliveryQty * 1) {
      notification.warning({
        message: '箱数*每箱数量不等于本次发货数量',
      });
      return;
    }
    const printData = [];
    const validPeriodDay =
      (new Date(maturityDate).getTime() - new Date(productionDate).getTime()) /
      (1000 * 60 * 60 * 24); // 有效期（天）
    const validPeriod =
      Math.floor(validPeriodDay / 30) > 0
        ? `${Math.floor(validPeriodDay / 30)}个月`
        : `${validPeriodDay}天`;
    const boxQty = (boxQtyOne || 0) + (boxQtyTwo || 0) + (boxQtyThree || 0) + (boxQtyFour || 0); // 总箱数
    for (let i = 0; i < boxQty; i++) {
      let perBoxAmount; // 每箱数量
      if (boxQtyOne && i + 1 <= boxQtyOne) {
        perBoxAmount = perBoxAmountOne;
      } else if (boxQtyTwo && i + 1 <= boxQtyTwo + (boxQtyOne || 0)) {
        perBoxAmount = perBoxAmountTwo;
      } else if (boxQtyThree && i + 1 <= boxQtyThree + (boxQtyTwo || 0) + (boxQtyOne || 0)) {
        perBoxAmount = perBoxAmountThree;
      } else if (boxQtyFour && i + 1 <= boxQty) {
        perBoxAmount = perBoxAmountFour;
      }
      const obj = {
        ...PrintDS.current.toData(),
        validPeriod,
        boxQty,
        perBoxAmount,
      };
      printData.push(obj);
    }
    history.push({
      pathname: `/zcom/mo-delivery-maintain/item-print`,
      search: `tenantId=${getCurrentOrganizationId()}&deliveryOrderId=${deliveryOrderId}`,
      state: printData,
    });
    printModal.close();
  }

  // 撤回
  function handleRevocable() {
    setRevocableLoading(true);
    return new Promise(async (resolve) => {
      dispatch({
        type: 'moDeliveryMaintain/revocable',
        payload: {
          ...HeadDS.current.data,
        },
      })
        .then((res) => {
          if (res && !res.failed) {
            notification.success({
              message: '操作成功',
            });
            const pathName = `/zcom/mo-delivery-maintain`;
            history.push(pathName);
          }
          resolve(setRevocableLoading(false));
        })
        .catch(() => {
          resolve(setRevocableLoading(false));
        });
    });
  }

  const lineColumns = [
    { name: 'deliveryOrderLineNum', lock: true, width: 60 },
    { name: 'customerItemCode', width: 150 },
    { name: 'customerItemDescription', width: 150 },
    { name: 'promiseQty', width: 150 },
    { name: 'shippableQty', width: 150 },
    { name: 'totalReceivedQty', width: 150 },
    { name: 'deliveryQty', width: 150, editor: canEdit },
    { name: 'uomName', width: 150 },
    { name: 'customerLotNumber', width: 150, editor: canEdit },
    { name: 'serialNumber', width: 150, editor: canEdit },
    { name: 'sourceDocNum', width: 150 },
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
      editor: canEdit,
    },
    { name: 'lineRemark', width: 150, editor: canEdit },
    {
      name: 'fileUrl',
      width: 250,
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
    {
      header: '标签打印',
      width: 150,
      command: ({ record }) => {
        return [
          <Button
            key="print"
            color="primary"
            funcType="flat"
            disabled={type === 'create'}
            onClick={() => handleDeliveryPrint(record)}
          >
            标签打印
          </Button>,
        ];
      },
      lock: 'right',
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
        backPath="/zcom/mo-delivery-maintain/list"
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
        <Button color="primary" onClick={handlePrint} disabled={!logisticsCanEdit}>
          送货单打印
        </Button>
        {type !== 'create' && (
          <Button
            onClick={handleRevocable}
            loading={revocableLoading}
            disabled={
              HeadDS.current.data.deliveryOrderStatus === 'CONFIRMEND' ||
              HeadDS.current.data.deliveryOrderStatus === 'REFUSED' ||
              HeadDS.current.data.deliveryOrderStatus === 'RELEASED'
                ? null
                : true
            }
          >
            撤回
          </Button>
        )}
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
        <div className="zcom-mo-delivery-headInfo">
          <span>送货单表头</span>
          <span className="headInfo-toggle" onClick={handleToggle}>
            {headShow ? '收起' : '展开'}
          </span>
        </div>
        {headShow ? (
          <Form dataSet={HeadDS} columns={3}>
            <TextField name="deliveryOrderNum" key="deliveryOrderNum" disabled />
            <Select name="deliveryOrderType" key="deliveryOrderType" disabled={!canEdit} />
            {/* <TextField name="supplierName" key="supplierName" disabled /> */}
            <TextField name="customerName" key="customerName" disabled />
            <Lov name="customerWarehouseObj" key="customerWarehouseObj" disabled={!canEdit} />
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

export default connect(({ moDeliveryMaintain: { ids } }) => ({ ids }))(
  formatterCollections({
    code: [`${intlPrefix}`],
  })(ZcomMoDeliveryDetail)
);
